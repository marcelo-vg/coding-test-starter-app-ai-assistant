def test_first_page_defaults(client):
    body = client.get("/api/gigs").json()

    assert body["page"] == 1
    assert body["pageSize"] == 10
    assert body["total"] == 30
    assert len(body["gigs"]) == 10
    assert body["gigs"][0]["id"] == "gig-001"
    assert set(body["gigs"][0]) == {
        "id", "title", "category", "payRate", "location", "remote", "postedAt", "description",
    }


def test_pagination_walks_the_catalogue(client):
    ids = []
    for page in (1, 2, 3):
        ids += [g["id"] for g in client.get(f"/api/gigs?page={page}").json()["gigs"]]

    assert len(ids) == len(set(ids)) == 30


def test_page_past_the_end_is_empty_but_reports_total(client):
    body = client.get("/api/gigs?page=99").json()

    assert body["gigs"] == []
    assert body["total"] == 30


def test_category_filter_and_total(client):
    body = client.get("/api/gigs?category=Warehouse").json()

    assert body["total"] == len(body["gigs"]) > 0
    assert {g["category"] for g in body["gigs"]} == {"Warehouse"}


def test_categories_ignore_the_current_filters(client):
    everything = client.get("/api/gigs").json()["categories"]
    filtered = client.get("/api/gigs?category=Admin").json()["categories"]

    assert filtered == everything == sorted(everything)


def test_remote_only(client):
    body = client.get("/api/gigs?remoteOnly=true&pageSize=50").json()

    assert body["total"] > 0
    assert all(g["remote"] for g in body["gigs"])


def test_unknown_category_is_rejected(client):
    response = client.get("/api/gigs?category=Bogus")

    assert response.status_code == 400
    assert response.json() == {"error": 'Unknown category "Bogus".'}


def test_page_size_is_capped(client):
    assert client.get("/api/gigs?pageSize=999").json()["pageSize"] == 50


def test_bad_counts_fall_back_to_defaults(client):
    body = client.get("/api/gigs?pageSize=0&page=abc").json()

    assert (body["page"], body["pageSize"]) == (1, 10)
