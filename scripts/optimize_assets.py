import os
from PIL import Image, ImageDraw, ImageFont

def generate_og_image():
    width, height = 1200, 630
    img = Image.new("RGBA", (width, height), (9, 9, 14, 255))
    draw = ImageDraw.Draw(img)

    # Subtle radial gradient / glow background
    for r in range(400, 0, -4):
        alpha = int(25 * (1 - r / 400))
        draw.ellipse(
            [600 - r, 315 - r, 600 + r, 315 + r],
            fill=(255, 45, 33, alpha)
        )
    for r in range(300, 0, -4):
        alpha = int(20 * (1 - r / 300))
        draw.ellipse(
            [900 - r, 150 - r, 900 + r, 150 + r],
            fill=(124, 58, 237, alpha)
        )

    # Ambient border frame
    draw.rectangle([20, 20, width - 20, height - 20], outline=(255, 255, 255, 18), width=1)
    draw.rectangle([21, 21, width - 21, height - 21], outline=(255, 45, 33, 40), width=1)

    # Try loading system fonts or fall back to default
    def get_font(size, bold=False):
        font_paths = [
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/calibri.ttf",
        ]
        if bold:
            font_paths = [
                "C:/Windows/Fonts/segoeuib.ttf",
                "C:/Windows/Fonts/arialbd.ttf",
                "C:/Windows/Fonts/calibrib.ttf",
            ]
        for path in font_paths:
            if os.path.exists(path):
                try:
                    return ImageFont.truetype(path, size)
                except Exception:
                    continue
        return ImageFont.load_default()

    font_badge = get_font(18, bold=True)
    font_brand = get_font(28, bold=True)
    font_h1 = get_font(56, bold=True)
    font_sub = get_font(24, bold=False)
    font_footer = get_font(18, bold=False)

    # Top Brand Header
    draw.rounded_rectangle([80, 75, 240, 115], radius=20, fill=(255, 45, 33, 30), outline=(255, 45, 33, 80))
    draw.text((105, 85), "INDUSNET AI", fill=(255, 75, 60), font=font_badge)

    # Domain pill
    draw.text((width - 270, 85), "indusnet-ai.com", fill=(160, 160, 180), font=font_badge)

    # Main Headline
    draw.text((80, 180), "Enterprise AI Solutions &", fill=(255, 255, 255), font=font_h1)
    draw.text((80, 250), "Cognitive Systems", fill=(255, 65, 50), font=font_h1)

    # Subheading
    sub_text = "Transforming enterprises with bespoke Generative AI applications,\ncustom RAG knowledge engines, and certified CPMAI training."
    draw.text((80, 360), sub_text, fill=(180, 185, 200), font=font_sub, spacing=10)

    # Capability tags at bottom
    tags = [
        "VPC-Isolated RAG",
        "Autonomous AI Agents",
        "Edge Computer Vision",
        "CPMAI Certified Training"
    ]
    cur_x = 80
    for tag in tags:
        bbox = draw.textbbox((cur_x, 500), tag, font=font_footer)
        tag_w = bbox[2] - bbox[0] + 24
        draw.rounded_rectangle([cur_x, 490, cur_x + tag_w, 530], radius=8, fill=(25, 25, 35, 200), outline=(255, 255, 255, 30))
        draw.text((cur_x + 12, 498), tag, fill=(220, 220, 235), font=font_footer)
        cur_x += tag_w + 14

    # Convert to RGB and save optimized PNG
    rgb_img = img.convert("RGB")
    rgb_img.save("public/og-image.png", format="PNG", optimize=True)
    print("Created public/og-image.png (1200x630)")

def generate_favicons():
    # Load existing logo or create a crisp square brand icon
    # Brand mark: deep background with Kyndryl terracotta red chip and white CPU circuit
    size_180 = 180
    icon_180 = Image.new("RGBA", (size_180, size_180), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon_180)

    # Rounded square background
    draw.rounded_rectangle([0, 0, size_180, size_180], radius=38, fill=(255, 45, 33, 255))

    # CPU chip icon in center
    draw.rounded_rectangle([42, 42, 138, 138], radius=16, fill=(255, 255, 255, 245))
    draw.rounded_rectangle([60, 60, 120, 120], radius=10, fill=(255, 45, 33, 255))

    # Circuit pin lines
    for offset in [58, 90, 122]:
        # Top and bottom pins
        draw.line([offset, 24, offset, 42], fill=(255, 255, 255, 220), width=6)
        draw.line([offset, 138, offset, 156], fill=(255, 255, 255, 220), width=6)
        # Left and right pins
        draw.line([24, offset, 42, offset], fill=(255, 255, 255, 220), width=6)
        draw.line([138, offset, 156, offset], fill=(255, 255, 255, 220), width=6)

    # Save apple-touch-icon.png (180x180)
    icon_180.save("public/apple-touch-icon.png", format="PNG", optimize=True)
    print("Created public/apple-touch-icon.png")

    # Generate 32x32 and 16x16 PNGs
    icon_32 = icon_180.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save("public/favicon-32x32.png", format="PNG", optimize=True)

    icon_16 = icon_180.resize((16, 16), Image.Resampling.LANCZOS)
    icon_16.save("public/favicon-16x16.png", format="PNG", optimize=True)
    print("Created public/favicon-32x32.png and 16x16.png")

    # Multi-resolution ICO (16, 32, 48)
    icon_48 = icon_180.resize((48, 48), Image.Resampling.LANCZOS)
    icon_180.save(
        "public/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    icon_180.save(
        "app/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("Replaced public/favicon.ico and app/favicon.ico with multi-res ICO")

def optimize_logo():
    if os.path.exists("public/logo.png"):
        img = Image.open("public/logo.png")
        img.save("public/logo.webp", format="WEBP", quality=90)
        img.save("public/logo.png", format="PNG", optimize=True)
        print("Created public/logo.webp and re-optimized public/logo.png")

if __name__ == "__main__":
    generate_og_image()
    generate_favicons()
    optimize_logo()
