# Job Scout

Job Scout is an automated **job scraper and sync API** built with **FastAPI**, **SQLModel**, and **aiohttp**.  
It collects job postings from multiple job provider websites and keeps them updated in your database.

---

## 🚀 Features

- 🔄 Background job syncing (runs asynchronously)
- 🕸️ Web scraping using `aiohttp` and `BeautifulSoup`
- 🧱 Database models powered by `SQLModel`
- ⚙️ Relationship management for positions & specifications
- 🧩 Provider-based sync (e.g., *OpenKerja*, *JakartaKerja*)
- 💾 Duplicate-safe job updates
- 🧰 Swagger auto-generated API docs

---

## 🗂️ Tech Stack

- **FastAPI** — backend framework
- **SQLModel** — ORM + Pydantic models
- **PostgreSQL** — primary database
- **aiohttp** — async scraping
- **BeautifulSoup4** — HTML parsing
- **Uvicorn** — ASGI server

