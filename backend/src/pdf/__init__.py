import sys

import pytesseract
from PIL.Image import Image
from pypdf import PdfReader

from pdf.transaction import Transaction

# cineplex only allows buying 18 tickets at once, therefore listings will never overflow the cropped
# image area

# minimum height of a valid transation image that will be cropped from the end
TRANSACTION_RECEIPT_HEIGHT = 1400
# amount to remove from the end of the transaction receipt that does not concern us
TRANSACTION_FOOTER_HEIGHT = 250

SAVE_IR = True


def main():
    args = sys.argv

    if len(args) != 2:
        raise AttributeError("invalid number of arguments supplied")

    reader = PdfReader(args[1])

    OUT_FULL_IMG = f"{args[1].split('.')[0]}-img.jpg"
    OUT_CROPPED_IMG = f"{args[1].split('.')[0]}-cropped-img.jpg"
    OUT_TRANSACTION = f"{args[1].split('.')[0]}-transaction.txt"

    # since all the pages are just one single image lets just get the first image on the first page
    # get PIL image
    full_img = reader.pages[0].images[0].image

    reader.close()

    if full_img is None:
        raise TypeError("failed to get PIL image from pypdf's ImageFile")
    else:
        assert isinstance(full_img, Image)

    if SAVE_IR:
        full_img.save(OUT_FULL_IMG)

    width = full_img.width
    assert full_img.height > TRANSACTION_RECEIPT_HEIGHT
    top = full_img.height - TRANSACTION_RECEIPT_HEIGHT
    bottom = full_img.height - TRANSACTION_FOOTER_HEIGHT

    cropped = full_img.crop((0, top, width, bottom))

    if SAVE_IR:
        cropped.save(OUT_CROPPED_IMG)

    # 6|single_block            Assume a single uniform block of text.
    TRANSACTION = pytesseract.image_to_string(cropped, config="--psm 6").__str__()

    if SAVE_IR:
        with open(OUT_TRANSACTION, "w") as f:
            _ = f.write(TRANSACTION)

    transaction = Transaction(TRANSACTION)

    print(transaction)


if __name__ == "__main__":
    main()
