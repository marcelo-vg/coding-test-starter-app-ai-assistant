import uvicorn

from app.config import BACKEND_DIR, load_settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        port=load_settings().port,
        reload=True,
        reload_dirs=[str(BACKEND_DIR / "app")],
    )
