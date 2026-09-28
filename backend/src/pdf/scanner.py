from pathlib import Path

import pytesseract
from PIL.Image import Image
from pypdf import PdfReader

from config import config

# Minimum starting height of a valid transation image that will be cropped from the end.
TRANSACTION_RECEIPT_HEIGHT = 1400
# Amount to crop from the end of the transaction receipt.
TRANSACTION_FOOTER_HEIGHT = 250

# Cineplex only allows buying 18 tickets at once,
# therefore listings will never overflow the cropped image area


def scan_pdf(path: Path) -> str:
    """Scans a transaction receipt PDF and returns the scanned text using Object Character
    Recognition (OCR).

    All Cineplex ticket PDFs refer to a single image object, which is embedded in all the pages.
    Therefore, we need OCR to retrieve the text.
    Only the area within the last `TRANSACTION_RECEIPT_HEIGHT` pixels is scanned.

    Args:
        path: Path to the PDF to be scanned.

    Returns:
        str: Complete scanned transaction receipt section as a single string.
    """

    OUT_FULL_IMG = f"{path.stem}-img.jpg"
    OUT_CROPPED_IMG = f"{path.stem}-cropped-img.jpg"
    OUT_TRANSACTION = f"{path.stem}-transaction.txt"

    with PdfReader(path) as reader:
        # since all the pages are just one single image lets just get the first image on the first page
        full_img = reader.pages[0].images[0].image  # get PIL image

    if not isinstance(full_img, Image):
        raise TypeError("failed to get PIL image from pypdf's ImageFile")

    if config.save_transaction_ir:
        full_img.save(OUT_FULL_IMG)

    # create cropping bounds
    width = full_img.width
    if full_img.height < TRANSACTION_RECEIPT_HEIGHT:
        raise ValueError("image extracted from the pdf is not of exepected dimensions")
    top = full_img.height - TRANSACTION_RECEIPT_HEIGHT
    bottom = full_img.height - TRANSACTION_FOOTER_HEIGHT

    cropped = full_img.crop((0, top, width, bottom))

    if config.save_transaction_ir:
        cropped.save(OUT_CROPPED_IMG)

    # current page segmentation mode setting for reading complete lines:
    # 6|single_block            Assume a single uniform block of text.
    # current OCR engine mode setting that works great with numbers:
    # 0|tesseract_only          Legacy engine only.
    text = pytesseract.image_to_string(cropped, config="--psm 6 --oem 0").__str__()

    if config.save_transaction_ir:
        with open(OUT_TRANSACTION, "w") as f:
            _ = f.write(text)

    return text
