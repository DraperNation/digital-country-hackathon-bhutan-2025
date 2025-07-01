
from duckduckgo_search import DDGS          # open‑source search engine client
from bs4 import BeautifulSoup               # HTML parsing
import requests, html2text, itertools, re


# ––– tiny helper to scrub raw HTML to readable plain text –––
def _html_to_text(html: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links, h.ignore_images = True, True
    return re.sub(r'\n\s*\n', '\n\n', h.handle(html)).strip()


# ––– main routine –––
def fetch_top5(query: str, *, lang="en-us", timeout=10) -> list[tuple[str, str]]:
    """
    Returns: List of 5 tuples → (url, cleaned_page_text)
    """
    # 1) Search → first 5 organic URLs
    with DDGS() as ddg:
        urls = list(itertools.islice(
            (r["href"] for r in ddg.text(query, region=lang) if r.get("href")),
            5
        ))

    results = []
    headers = {"User-Agent": "Mozilla/5.0 (compatible; MiniScraper/1.0)"}

    for url in urls:
        try:
            # 2) Download page
            resp = requests.get(url, headers=headers, timeout=timeout)
            resp.raise_for_status()

            # 3) Parse & extract visible text
            soup = BeautifulSoup(resp.text, "lxml")
            # Remove script/style/noise
            for tag in soup(["script", "style", "noscript"]):
                tag.decompose()
            text = _html_to_text(str(soup.body))[:20_000]  # clip huge pages

            results.append((url, text))
        except Exception as e:
            results.append((url, f"[ERROR] {e}"))

    return results


def web_search(q):
    ws_list = []
    for idx, (u, t) in enumerate(fetch_top5(q), 1):
        ws_list.append("Result {idx}: {u}\n{textwrap.shorten(t, 400, placeholder=' …')}")
    return ws_list
