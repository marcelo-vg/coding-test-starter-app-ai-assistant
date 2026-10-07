from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse


class ApiError(Exception):
    """An error reported to the client as `{ "error": "…" }` with a status code."""

    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.message = message


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiError)
    async def handle_api_error(_: Request, error: ApiError) -> JSONResponse:
        return JSONResponse({"error": error.message}, status_code=error.status_code)

    @app.exception_handler(HTTPException)
    async def handle_http_exception(_: Request, error: HTTPException) -> JSONResponse:
        return JSONResponse({"error": str(error.detail)}, status_code=error.status_code)
