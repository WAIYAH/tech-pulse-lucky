"""
Generate the Tech Pulse Insider weekly learning documents.

Usage
-----
    python -m tools.docgen.generate                 # generate every document
    python -m tools.docgen.generate --only week02   # generate one
    python -m tools.docgen.generate --pdf           # also export PDFs (needs Word on Windows)

Every document is written straight into the resources/ tree at the path the LMS
seed migration expects, so generating and re-uploading stays a one-command job.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .content import (
    week02_css,
    week03_tailwind,
    week04_git_github,
    week07_deployment,
    week08_capstone,
)

REPO_ROOT = Path(__file__).resolve().parents[2]
RESOURCES = REPO_ROOT / "resources"

# key -> (module, destination relative to resources/)
DOCUMENTS = {
    "week02": (week02_css, "week-02/notes/week-02-css-foundations-responsive-design-notes.docx"),
    "week03": (week03_tailwind, "week-03/notes/week-03-tailwind-css-modern-frontend-notes.docx"),
    "week04": (week04_git_github, "week-04/notes/week-04-git-and-github-workflow-notes.docx"),
    "week07": (week07_deployment, "week-07/notes/week-07-deployment-docker-devops-notes.docx"),
    "week08": (week08_capstone, "week-08/notes/week-08-capstone-project-guide.docx"),
}


def generate(key: str, *, to_pdf: bool = False) -> Path:
    module, relative = DOCUMENTS[key]
    destination = RESOURCES / relative
    destination.parent.mkdir(parents=True, exist_ok=True)

    document = module.build()
    document.save(str(destination))
    print(f"  wrote  {destination.relative_to(REPO_ROOT)}")

    if to_pdf:
        try:
            from docx2pdf import convert
        except ImportError:
            print("  skip   PDF export - docx2pdf is not installed", file=sys.stderr)
            return destination
        pdf_path = destination.with_suffix(".pdf")
        convert(str(destination), str(pdf_path))
        print(f"  wrote  {pdf_path.relative_to(REPO_ROOT)}")

    return destination


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Tech Pulse Insider learning documents.")
    parser.add_argument("--only", choices=sorted(DOCUMENTS), help="generate a single document")
    parser.add_argument("--pdf", action="store_true", help="also export a PDF next to each .docx")
    args = parser.parse_args()

    keys = [args.only] if args.only else sorted(DOCUMENTS)
    print(f"Generating {len(keys)} document(s) into {RESOURCES.relative_to(REPO_ROOT)}/\n")
    for key in keys:
        generate(key, to_pdf=args.pdf)
    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
