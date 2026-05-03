import pandas as pd
import os


SHEET_ID = "1hMsYgDQj3ymqwxUXA7R-ITITnw3HzeVZBxaXAjiJwAE"
TARGET_GID = 0

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "artifacts", "spreadsheet_data.json"
)


def _load_sheet():
    csv_url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={TARGET_GID}"
    return pd.read_csv(csv_url)


def _save_to_json(df):
    df.to_json(OUTPUT_PATH, orient="records", indent=2)


def load_new_data():
    print("Loading New Data...")

    df = _load_sheet()
    _save_to_json(df)
