from typing import Any


def pretty_dict(d: dict[str, Any]):
    print("{")
    for k, v in d.items():
        print(f"\t{k}: {v}")
    print("}")
