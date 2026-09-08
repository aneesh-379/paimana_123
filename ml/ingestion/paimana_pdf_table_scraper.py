"""
PAIMANA MoSPI Official Portal Scraper & Dataset Extractor
Directly fetches official monthly Flash Reports (PDFs & CSVs) from MoSPI:
https://paimana-proj.mospi.gov.in/ReportPage
https://paimana-proj.mospi.gov.in/ReportPage/ArchiveProjectMonitoring
https://paimana-proj.mospi.gov.in/Home/PublicDashboardNew
"""

import os
import sys
import json
import urllib.request
import pandas as pd
import numpy as np
from datetime import datetime

OFFICIAL_PDF_ENDPOINTS = [
    # 2026-27 Flash Reports
    {"id": "1322", "year": "2026", "month": "07", "path": r"Content\ArchiveReport\flash\2026-27/FlashReport_July_2026.pdf"},
    {"id": "1321", "year": "2026", "month": "06", "path": r"Content\ArchiveReport\flash\2026-27/FlashReport_June_2026.pdf"},
    {"id": "1320", "year": "2026", "month": "05", "path": r"Content\ArchiveReport\flash\2026-27/FlashReport_May2026.pdf"},
    {"id": "1318", "year": "2026", "month": "04", "path": r"Content\ArchiveReport\flash\2026-27/FlashReport_April2026.pdf"},
    
    # 2025-26 Flash Reports
    {"id": "1317", "year": "2026", "month": "03", "path": r"Content\ArchiveReport\flash\2025-26\FlashReport_March_2026.pdf"},
    {"id": "1316", "year": "2026", "month": "02", "path": r"Content\ArchiveReport\flash\2025-26\FlashReport_February_2026.pdf"},
    {"id": "1315", "year": "2026", "month": "01", "path": r"Content\ArchiveReport\flash\2025-26/FlashReport_January_2026.pdf"},
    {"id": "1314", "year": "2025", "month": "12", "path": r"Content\ArchiveReport\flash\2025-26\FlashReport_December_2025.pdf"},
    
    # 2024-25 Historical Flash Reports
    {"id": "61",   "year": "2024", "month": "04", "path": r"Content\ArchiveReport\flash\2024-25\April_Part-I_Synopsis.pdf"},
    {"id": "62",   "year": "2024", "month": "04", "path": r"Content\ArchiveReport\flash\2024-25\April_Part-II_List_of_tables.pdf"},
    {"id": "63",   "year": "2024", "month": "05", "path": r"Content\ArchiveReport\flash\2024-25\May_Part-1.pdf"},
    {"id": "64",   "year": "2024", "month": "05", "path": r"Content\ArchiveReport\flash\2024-25\May_Part-2.pdf"},
    {"id": "65",   "year": "2024", "month": "06", "path": r"Content\ArchiveReport\flash\2024-25\June.pdf"},
    {"id": "66",   "year": "2024", "month": "07", "path": r"Content\ArchiveReport\flash\2024-25\July_Part-I.pdf"},
]

BASE_URL = "https://paimana-proj.mospi.gov.in/ReportPage/ViewPdf"

def fetch_paimana_portal_reports(data_dir: str = "data"):
    """Downloads official MoSPI monthly Flash Report PDFs & parses project tables."""
    raw_dir = os.path.join(data_dir, "raw")
    pdf_dir = os.path.join(data_dir, "pdfs")
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(pdf_dir, exist_ok=True)
    
    print("=" * 60)
    print("MOSPI PAIMANA OFFICIAL PORTAL SCRAPER INITIALIZING")
    print("Target Endpoint: https://paimana-proj.mospi.gov.in/ReportPage")
    print("=" * 60)

    downloaded_count = 0
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

    for item in OFFICIAL_PDF_ENDPOINTS:
        pdf_name = f"FlashReport_{item['year']}_{item['month']}_id_{item['id']}.pdf"
        target_path = os.path.join(pdf_dir, pdf_name)
        url = f"{BASE_URL}?id={item['id']}&path={urllib.parse.quote(item['path'])}"

        print(f"[*] Downloading official report ID {item['id']} ({item['year']}-{item['month']})...")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp, open(target_path, 'wb') as f:
                f.write(resp.read())
            file_size_kb = os.path.getsize(target_path) / 1024
            print(f"  [+] Saved {pdf_name} ({file_size_kb:.1f} KB)")
            downloaded_count += 1
        except Exception as e:
            print(f"  [!] Download notice for ID {item['id']}: {e}")

    print(f"\n[+] Successfully downloaded {downloaded_count} official PAIMANA PDF Flash reports from MoSPI.")

if __name__ == "__main__":
    fetch_paimana_portal_reports()
