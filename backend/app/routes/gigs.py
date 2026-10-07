from fastapi import APIRouter, Query

from app.errors import ApiError
from app.gigs import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, is_gig_category, query_gigs
from app.models import GigPage

router = APIRouter()

MAX_SAFE_INTEGER = 2**53 - 1


def parse_count(value: str | None, fallback: int, maximum: int) -> int:
    """A positive whole number, capped at `maximum`; anything else is `fallback`."""
    try:
        parsed = float(value) if value is not None else float("nan")
    except ValueError:
        return fallback
    if not parsed.is_integer() or parsed < 1:
        return fallback
    return min(int(parsed), maximum)


@router.get("", response_model=GigPage)
def list_gigs(
    category: str | None = Query(default=None),
    remote_only: str | None = Query(default=None, alias="remoteOnly"),
    page: str | None = Query(default=None),
    page_size: str | None = Query(default=None, alias="pageSize"),
) -> GigPage:
    # An unknown category is rejected rather than ignored, so a bad value shows up
    # as an error instead of silently returning the unfiltered listing.
    if category and not is_gig_category(category):
        raise ApiError(400, f'Unknown category "{category}".')

    return query_gigs(
        category=category or None,
        remote_only=remote_only == "true",
        page=parse_count(page, 1, MAX_SAFE_INTEGER),
        page_size=parse_count(page_size, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    )
