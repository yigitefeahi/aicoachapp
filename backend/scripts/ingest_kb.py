import re
from pathlib import Path
from app.rag import LEGACY_COLLECTION, collection_for_layer, get_collection, layer_for_metadata

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
KB_DIR = DATA_DIR / "kb"
RAG_DIR = DATA_DIR / "rag"


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", (value or "").lower()).strip("_")


def parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    meta: dict[str, str] = {}
    for line in parts[1].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip().strip('"').strip("'")
    return meta, parts[2].strip()


def chunk_text(text: str, chunk_size: int = 700, overlap: int = 120):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def infer_metadata(md_file: Path, raw_meta: dict[str, str]) -> dict[str, str]:
    rel = md_file.relative_to(DATA_DIR)
    parent = md_file.parent.name
    doc_type = raw_meta.get("doc_type") or ("role" if parent == "kb" else parent.rstrip("s"))
    profession = raw_meta.get("profession") or (md_file.stem if parent == "kb" else "")
    company = raw_meta.get("company", "")
    focus_area = raw_meta.get("focus_area", "")
    difficulty = raw_meta.get("difficulty", "")
    sector = raw_meta.get("sector", "")
    meta = {
        "source": str(rel),
        "doc_type": slug(doc_type) or "knowledge",
        "profession": slug(profession),
        "company": slug(company),
        "focus_area": slug(focus_area),
        "difficulty": slug(difficulty),
        "sector": slug(sector),
    }
    meta["layer"] = raw_meta.get("layer") or layer_for_metadata(meta)
    return meta


def discover_markdown_files() -> list[Path]:
    files = list(KB_DIR.glob("*.md"))
    if RAG_DIR.exists():
        files.extend(RAG_DIR.rglob("*.md"))
    return sorted(files)


def main():
    ids = []
    docs = []
    metadatas = []

    for md_file in discover_markdown_files():
        raw = md_file.read_text(encoding="utf-8")
        raw_meta, text = parse_frontmatter(raw)
        base_meta = infer_metadata(md_file, raw_meta)
        chunks = chunk_text(text)

        for i, chunk in enumerate(chunks):
            ids.append(f"{slug(str(md_file.relative_to(DATA_DIR)))}_{i}")
            docs.append(chunk)
            metadatas.append({**base_meta, "chunk_index": i})

    if not docs:
        print("No KB files found.")
        return

    collections: dict[str, tuple[list[str], list[str], list[dict]]] = {}
    collections[LEGACY_COLLECTION] = (ids, docs, metadatas)
    for item_id, doc, meta in zip(ids, docs, metadatas):
        collection_name = collection_for_layer(meta["layer"])
        group_ids, group_docs, group_metas = collections.setdefault(collection_name, ([], [], []))
        group_ids.append(item_id)
        group_docs.append(doc)
        group_metas.append(meta)

    for collection_name, (group_ids, group_docs, group_metas) in collections.items():
        collection = get_collection(collection_name)
        try:
            collection.delete(ids=group_ids)
        except Exception:
            pass
        collection.add(ids=group_ids, documents=group_docs, metadatas=group_metas)
        print(f"Ingested {len(group_docs)} chunks into {collection_name} collection.")

    doc_types = sorted({meta["doc_type"] for meta in metadatas})
    layers = sorted({meta["layer"] for meta in metadatas})
    print(f"Doc types: {', '.join(doc_types)}")
    print(f"Layers: {', '.join(layers)}")


if __name__ == "__main__":
    main()