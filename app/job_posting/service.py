from typing import List, Any


def unique_values(items: List[Any], attr: str) -> list[str]:
    if not items:
        return []

    values = {getattr(item, attr) for item in items if getattr(item, attr, None)}
    return sorted(values)
