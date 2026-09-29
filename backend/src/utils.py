from typing import Any

from config import config


def print_debug(s: str):
    if config.debug:
        print(s)


def pretty_dict(d: dict[str, Any]):
    print("{")
    for k, v in d.items():
        print(f"\t{k}: {v}")
    print("}")
