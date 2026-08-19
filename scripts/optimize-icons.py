from pathlib import Path

from PIL import Image


SOURCE = Path("/home/ubuntu/webdev-static-assets/prompt-bridge-icon.png")
OUTPUTS = {
    "assets/images/icon.png": 512,
    "assets/images/splash-icon.png": 512,
    "assets/images/favicon.png": 128,
    "assets/images/android-icon-foreground.png": 432,
}


def main() -> None:
    with Image.open(SOURCE) as source:
        image = source.convert("RGBA")
        for relative_path, size in OUTPUTS.items():
            destination = Path(relative_path)
            resized = image.resize((size, size), Image.Resampling.LANCZOS)
            resized.save(destination, "PNG", optimize=True, compress_level=9)
            print(f"Wrote {destination} at {size}x{size}")


if __name__ == "__main__":
    main()
