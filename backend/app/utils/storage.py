import os
import uuid
import logging
import urllib.request
import urllib.error
import json
from app.config import settings

logger = logging.getLogger("storage")

# Determine paths
UTILS_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(UTILS_DIR)
BACKEND_DIR = os.path.dirname(APP_DIR)
WORKSPACE_DIR = os.path.dirname(BACKEND_DIR)
LOCAL_UPLOAD_DIR = os.path.join(WORKSPACE_DIR, "public", "uploads")

def get_content_type(file_name: str) -> str:
    ext = os.path.splitext(file_name)[1].lower()
    if ext == ".pdf":
        return "application/pdf"
    elif ext == ".docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif ext == ".doc":
        return "application/msword"
    elif ext in [".txt", ".text"]:
        return "text/plain"
    return "application/octet-stream"

def save_resume(file_name: str, file_bytes: bytes) -> str:
    """
    Saves a resume file. First attempts to upload to Supabase private storage bucket 'candidate-resumes'.
    If Supabase credentials are not available or upload fails, falls back to local file storage under public/uploads/.
    Returns the file URL or path.
    """
    ext = os.path.splitext(file_name)[1]
    unique_filename = f"{uuid.uuid4()}{ext}"
    content_type = get_content_type(file_name)

    # 1. Attempt Supabase upload if configured
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
        try:
            # Clean URL and key
            supabase_url = settings.SUPABASE_URL.rstrip('/')
            bucket_name = "candidate-resumes"
            upload_url = f"{supabase_url}/storage/v1/object/{bucket_name}/{unique_filename}"
            
            req = urllib.request.Request(
                upload_url,
                data=file_bytes,
                headers={
                    "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                    "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                    "Content-Type": content_type
                },
                method="POST"
            )
            
            with urllib.request.urlopen(req) as response:
                if response.status in [200, 201]:
                    logger.info(f"Successfully uploaded {file_name} to Supabase storage as {unique_filename}")
                    # Return the path to be used for retrieval/signing
                    return f"supabase://{bucket_name}/{unique_filename}"
        except Exception as e:
            logger.error(f"Supabase upload failed: {e}. Falling back to local storage.")

    # 2. Local Fallback Storage
    try:
        os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)
        local_path = os.path.join(LOCAL_UPLOAD_DIR, unique_filename)
        with open(local_path, "wb") as f:
            f.write(file_bytes)
        logger.info(f"Successfully saved {file_name} to local fallback storage at {local_path}")
        return f"/uploads/{unique_filename}"
    except Exception as e:
        logger.error(f"Local storage fallback failed: {e}")
        raise RuntimeError("Failed to store uploaded file.")

def get_resume_url(stored_path: str) -> str:
    """
    Generates a readable URL for a candidate's resume.
    If stored locally (starts with /uploads/), returns the relative Next.js public URL.
    If stored on Supabase (starts with supabase://), generates a signed URL.
    """
    if stored_path.startswith("/uploads/"):
        return stored_path

    if stored_path.startswith("supabase://") and settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
        try:
            parts = stored_path.replace("supabase://", "").split("/", 1)
            if len(parts) == 2:
                bucket_name, filename = parts
                supabase_url = settings.SUPABASE_URL.rstrip('/')
                sign_url = f"{supabase_url}/storage/v1/object/sign/{bucket_name}/{filename}"
                
                # Request a signed URL valid for 1 hour (3600 seconds)
                payload = json.dumps({"expiresIn": 3600}).encode("utf-8")
                req = urllib.request.Request(
                    sign_url,
                    data=payload,
                    headers={
                        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                        "Content-Type": "application/json"
                    },
                    method="POST"
                )
                
                with urllib.request.urlopen(req) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    signed_path = res_data.get("signedURL")
                    if signed_path:
                        # Sometimes signedURL is relative or absolute, construct properly
                        if signed_path.startswith("http"):
                            return signed_path
                        return f"{supabase_url}/storage/v1{signed_path}"
        except Exception as e:
            logger.error(f"Failed to generate signed URL for {stored_path}: {e}")

    # Fallback return of raw path or public download URL
    return stored_path
