#!/usr/bin/env python3
"""
dataset_prep.py
────────────────────────────────────────────────────────────────────────────
Extract text from every PDF inside each category folder and merge it into a
single .txt file per category.  Falls back to OCR (pdf2image + pytesseract)
when pdfplumber finds little or no text.

EXPECTED LAYOUT (relative to this file):
    lhaden_support/
    ├── data/
    │   ├── agriculture_health/
    │   │   ├── ...
    │   └── ...
    └── functions/
        └── dataset_prep.py   <-- you are here

USAGE (run from anywhere):
    python path/to/dataset_prep.py               # uses auto‑detected paths
    # ‑‑or‑‐
    python dataset_prep.py --data_dir "C:\\full\\path\\data" \
                           --output_dir "C:\\full\\path\\combined_text" \
                           --tesseract_cmd "C:\\Program Files\\Tesseract‑OCR\\tesseract.exe"
"""

import argparse
import sys
from pathlib import Path
import tempfile

import pdfplumber
from pdf2image import convert_from_path
import pytesseract
from tqdm import tqdm


# ────────────────────────────── Defaults ────────────────────────────────── #
SCRIPT_DIR = Path(__file__).resolve().parent              # .../functions
PROJECT_ROOT = SCRIPT_DIR.parent                          # .../lhaden_support
DEFAULT_DATA_DIR = PROJECT_ROOT / "data"                 # .../lhaden_support/data
DEFAULT_OUT_DIR = PROJECT_ROOT / "combined_text"         # .../lhaden_support/combined_text


# ──────────────────────────── CLI Arguments ────────────────────────────── #
def get_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract text from PDFs (OCR fallback) and concatenate "
                    "everything in a folder into a single .txt file."
    )
    parser.add_argument(
        "--data_dir",
        type=Path,
        default=DEFAULT_DATA_DIR,
        help=f"Root directory containing category sub‑folders "
             f"(default: {DEFAULT_DATA_DIR})"
    )
    parser.add_argument(
        "--output_dir",
        type=Path,
        default=DEFAULT_OUT_DIR,
        help=f"Where the merged .txt files will be written "
             f"(default: {DEFAULT_OUT_DIR})"
    )
    parser.add_argument(
        "--tesseract_cmd",
        type=str,
        default=None,
        help="Full path to the Tesseract executable if it isn't on PATH."
    )
    parser.add_argument(
        "--min_chars",
        type=int,
        default=100,
        help="If a whole PDF yields fewer than this many characters from "
             "pdfplumber, OCR the pages instead."
    )
    parser.add_argument(
        "--dpi",
        type=int,
        default=300,
        help="Resolution used when rasterising PDFs for OCR (default: 300)."
    )
    return parser.parse_args()


# ───────────────────────────── PDF Helpers ─────────────────────────────── #
def page_images_from_pdf(pdf_path: Path, dpi: int = 300):
    """Yield PIL images for each page (temp files auto‑cleaned)."""
    with tempfile.TemporaryDirectory() as tmpdir:
        imgs = convert_from_path(pdf_path, dpi=dpi, output_folder=tmpdir)
        for img in imgs:
            yield img  # PIL.Image


def extract_with_pdfplumber(pdf_path: Path) -> str:
    """Text extraction for born‑digital PDFs."""
    text_out = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                txt = page.extract_text()
                if txt:
                    text_out.append(txt)
    except Exception as e:
        print(f"⚠️  pdfplumber failed on {pdf_path.name}: {e}", file=sys.stderr)
    return "\n".join(text_out)


def extract_with_ocr(pdf_path: Path, dpi: int) -> str:
    """OCR fallback for scanned / image‑based PDFs."""
    text_out = []
    try:
        for img in page_images_from_pdf(pdf_path, dpi=dpi):
            text_out.append(pytesseract.image_to_string(img))
    except Exception as e:
        print(f"⚠️  OCR failed on {pdf_path.name}: {e}", file=sys.stderr)
    return "\n".join(text_out)


# ──────────────────────────────── Main ─────────────────────────────────── #
def main() -> None:
    args = get_args()

    # Point pytesseract to the binary if user supplied it
    if args.tesseract_cmd:
        pytesseract.pytesseract.tesseract_cmd = args.tesseract_cmd

    # Verify the data directory
    if not args.data_dir.exists():
        print(f"❌  data_dir does not exist: {args.data_dir}", file=sys.stderr)
        sys.exit(1)

    # Prepare output directory
    args.output_dir.mkdir(parents=True, exist_ok=True)

    # One txt file per *direct* sub‑folder (category)
    category_dirs = [d for d in args.data_dir.iterdir() if d.is_dir()]
    if not category_dirs:
        print(f"❌  No sub‑folders found in {args.data_dir}. Check the path.",
              file=sys.stderr)
        sys.exit(1)

    for cat_dir in category_dirs:
        cat_name = cat_dir.name
        out_path = args.output_dir / f"{cat_name}.txt"
        print(f"\n📂  Processing category: {cat_name}")

        pdf_files = sorted(cat_dir.glob("*.pdf"))
        if not pdf_files:
            print("  ↳ (no PDFs found, skipping)")
            continue

        # Stream‑write so memory usage stays low
        with out_path.open("w", encoding="utf-8") as fout:
            for pdf_path in tqdm(pdf_files,
                                 desc=f"{cat_name:>30}",
                                 unit="pdf",
                                 leave=False):
                # 1️⃣  Fast pass
                text = extract_with_pdfplumber(pdf_path)

                # 2️⃣  OCR if text is tiny
                if len(text) < args.min_chars:
                    text = extract_with_ocr(pdf_path, dpi=args.dpi)

                # 3️⃣  Write to output file
                fout.write(f"\n\n========== {pdf_path.name} ==========\n\n")
                fout.write(text)

        print(f"  ✔  Wrote {out_path}")

    print("\n🎉  All done! Combined text lives in:", args.output_dir)


if __name__ == "__main__":
    main()
