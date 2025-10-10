from datetime import datetime


def parse_date(date_str: str):
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00")) if date_str else datetime.min
    except ValueError:
        return datetime.min