from app.db import connect
from app.models import Gig, GigPage

DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 50


def gig_categories() -> list[str]:
    """Every category present in the catalogue, alphabetically."""
    with connect() as db:
        rows = db.execute("SELECT DISTINCT category FROM gigs ORDER BY category").fetchall()
    return [row["category"] for row in rows]


def is_gig_category(value: str) -> bool:
    return value in gig_categories()


def query_gigs(*, category: str | None, remote_only: bool, page: int, page_size: int) -> GigPage:
    """Filters the catalogue, then returns the requested page of the result."""
    clauses: list[str] = []
    params: list[object] = []
    if category:
        clauses.append("category = ?")
        params.append(category)
    if remote_only:
        clauses.append("remote = 1")
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    with connect() as db:
        total = db.execute(f"SELECT COUNT(*) FROM gigs {where}", params).fetchone()[0]
        rows = db.execute(
            f"SELECT * FROM gigs {where} ORDER BY rowid LIMIT ? OFFSET ?",
            [*params, page_size, (page - 1) * page_size],
        ).fetchall()

    return GigPage(
        gigs=[
            Gig(
                id=row["id"],
                title=row["title"],
                category=row["category"],
                pay_rate=row["pay_rate"],
                location=row["location"],
                remote=bool(row["remote"]),
                posted_at=row["posted_at"],
                description=row["description"],
            )
            for row in rows
        ],
        page=page,
        page_size=page_size,
        total=total,
        categories=gig_categories(),
    )
