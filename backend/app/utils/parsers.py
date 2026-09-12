import fitz  # PyMuPDF
import pdfplumber
import logging
import zipfile
import xml.etree.ElementTree as ET
import io

logger = logging.getLogger("parsers")

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    try:
        # 1. Attempt PyMuPDF extraction
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        logger.error(f"PyMuPDF extraction failed: {e}")

    if not text.strip():
        try:
            # 2. Attempt pdfplumber extraction
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text
        except Exception as e:
            logger.error(f"pdfplumber extraction failed: {e}")

    if not text.strip():
        logger.warning("No text extracted from PDF.")
        return ""

    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    text = ""
    try:
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespace map for WordprocessingML elements
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Find all text nodes (<w:t>)
            for t_element in root.findall('.//w:t', ns):
                if t_element.text:
                    text += t_element.text + " "
    except Exception as e:
        logger.error(f"DOCX extraction failed: {e}")
        return ""
        
    return text.strip()

def extract_text_from_zip(file_bytes: bytes) -> str:
    combined_text = ""
    try:
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
            namelist = z.namelist()
            # Enforce limits: cap max files in ZIP to 50
            if len(namelist) > 50:
                logger.warning("ZIP archive contains more than 50 files; processing first 50 files.")
                namelist = namelist[:50]

            total_uncompressed_bytes = 0
            for filename in namelist:
                # Skip directories, system/metadata files, and macOS-specific archives or nested zip files
                if filename.endswith('/') or '__MACOSX' in filename or filename.startswith('.') or filename.lower().endswith('.zip'):
                    continue

                info = z.getinfo(filename)
                total_uncompressed_bytes += info.file_size
                if total_uncompressed_bytes > 50 * 1024 * 1024:  # 50 MB limit
                    logger.warning("ZIP uncompressed size exceeds 50 MB limit; stopping extraction.")
                    break
                
                logger.info(f"Extracting and parsing file from ZIP: {filename}")
                try:
                    with z.open(filename) as f:
                        content_bytes = f.read()
                        file_text = extract_text_from_file(filename, content_bytes)
                        if file_text.strip():
                            combined_text += f"\n--- FILE: {filename} ---\n{file_text}\n"
                except Exception as fe:
                    logger.error(f"Failed to read zipped file {filename}: {fe}")
    except Exception as e:
        logger.error(f"Failed to parse ZIP archive: {e}")
        return ""
        
    return combined_text.strip()

def extract_text_from_file(file_name: str, file_bytes: bytes) -> str:
    name_lower = file_name.lower()
    if name_lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif name_lower.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    elif name_lower.endswith(".zip"):
        return extract_text_from_zip(file_bytes)
    else:
        try:
            return file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            return ""
