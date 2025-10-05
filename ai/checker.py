import os, csv, sys, time
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter, defaultdict
from typing import List, Tuple, Dict

from PIL import Image, ImageFile, UnidentifiedImageError
ImageFile.LOAD_TRUNCATED_IMAGES = False  # raise on truncated files

# ==== CONFIG ====
INDEX_PATH   = "dataset.csv" 
ROOT_DIR     = "map-proj-v3/" 
EXPECTED_W   = 227
EXPECTED_H   = 227
MAX_WORKERS  = max(2, os.cpu_count() or 2)
LIST_EXAMPLES = 20

# ==== Helpers ====

def parse_index(index_path: str) -> List[Tuple[str, str]]:
    """
    Returns list of (path, label_str).
    Supports:
      * CSV with header path,label
      * TXT lines: "path label" or "path,label"; path may contain spaces
    """
    items = []
    with open(index_path, newline="") as f:
        reader = csv.DictReader(f)
        assert "path" in reader.fieldnames, "CSV must have 'path' column"
        for row in reader:
            p = row["path"].strip()
            lab = (row.get("label") or row.get("labels") or "").strip()
            items.append((p, lab))
    if ROOT_DIR:
        items = [(os.path.join(ROOT_DIR, p), lab) for p, lab in items]
    return items

def check_one(path: str) -> Dict:
    """
    Try opening the image safely. Return a dict with status and details.
    """
    info = {
        "path": path,
        "exists": os.path.exists(path),
        "ok": False,
        "err": None,
        "err_type": None,
        "size": None,
        "mode": None,
        "size_ok": None,
    }
    if not info["exists"]:
        info["err"] = "File not found"
        info["err_type"] = "NotFound"
        return info
    try:
        # First pass: verify header without decoding full image
        with Image.open(path) as im:
            im.verify()
        # Second pass: actually load to catch truncated data
        with Image.open(path) as im:
            im.load()
            w, h = im.size
            info["size"] = (w, h)
            info["mode"] = im.mode
            info["size_ok"] = (w == EXPECTED_W and h == EXPECTED_H)
        info["ok"] = True
        return info
    except UnidentifiedImageError as e:
        info["err"] = str(e)
        info["err_type"] = "UnidentifiedImageError"
    except OSError as e:
        info["err"] = str(e)
        info["err_type"] = "OSError"
    except Exception as e:
        info["err"] = str(e)
        info["err_type"] = e.__class__.__name__
    return info

# ==== Run ====
items = parse_index(INDEX_PATH)
paths = [p for p, _ in items]
print(f"Indexed items: {len(items)}")

for group_label in set([lab for _, lab in items]):
    print(f"Group {group_label}: {len([p for p, lab in items if lab == group_label])}")

t0 = time.time()
results = []
with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
    futs = [ex.submit(check_one, p) for p in paths]
    for fut in as_completed(futs):
        results.append(fut.result())
dt = time.time() - t0
print(f"Checked {len(results)} files in {dt:.1f}s with {MAX_WORKERS} workers")

# ==== Summary ====
missing   = [r for r in results if not r["exists"]]
bad_read  = [r for r in results if r["exists"] and not r["ok"]]
wrong_sz  = [r for r in results if r["ok"] and r["size_ok"] is False]
ok_files  = [r for r in results if r["ok"] and r["size_ok"] is True]

modes = Counter([r["mode"] for r in results if r["mode"]])
err_types = Counter([r["err_type"] for r in bad_read])

print("\n=== SUMMARY ===")
print(f"OK (readable & {EXPECTED_W}x{EXPECTED_H}): {len(ok_files)}")
print(f"MISSING: {len(missing)}")
print(f"READ ERRORS: {len(bad_read)}  (by type: {dict(err_types)})")
print(f"WRONG SIZE: {len(wrong_sz)}")
print(f"Image modes (for OK/loaded files): {dict(modes)}")

if missing:
    print(f"\nMissing files (first {LIST_EXAMPLES}):")
    for r in missing[:LIST_EXAMPLES]:
        print("  ", r["path"])

if bad_read:
    print(f"\nUnreadable / corrupted (first {LIST_EXAMPLES}):")
    for r in bad_read[:LIST_EXAMPLES]:
        print(f"  {r['path']}  →  {r['err_type']}: {r['err']}")

if wrong_sz:
    print(f"\nWrong size (first {LIST_EXAMPLES}):")
    for r in wrong_sz[:LIST_EXAMPLES]:
        print(f"  {r['path']}  →  got {r['size']}, expected ({EXPECTED_W}, {EXPECTED_H})")
