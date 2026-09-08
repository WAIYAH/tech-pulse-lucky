"""
Generate the Tech Pulse Insider weekly learning documents.

Usage
-----
    python -m tools.docgen.generate                 # generate every document
    python -m tools.docgen.generate --only week02   # generate one
    python -m tools.docgen.generate --pdf           # also export PDFs (needs Word on Windows)

Documents are written as .docx into active-word-notes/, which is where every
editable source lives. They reach resources/ - the published tree the LMS syncs
from - only as PDFs, exported by tools/docx-to-pdf.ps1. Students are never given
a Word file, so generating straight into resources/ would put the wrong format
in front of them.

    active-word-notes/week-02/notes/week-02-css-foundations.docx   <- generated here
    resources/week-02/notes/week-02-css-foundations.pdf            <- published from it

--pdf runs the export for you; without it, run the script yourself afterwards.
"""

from __future__ import annotations

import argparse
import subprocess
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
WORD_NOTES = REPO_ROOT / "active-word-notes"
CONVERTER = REPO_ROOT / "tools" / "docx-to-pdf.ps1"

# key -> (module, destination relative to active-word-notes/)
DOCUMENTS = {
    "week02": (week02_css, "week-02/notes/week-02-css-foundations-responsive-design-notes.docx"),
    "week03": (week03_tailwind, "week-03/notes/week-03-tailwind-css-modern-frontend-notes.docx"),
    "week04": (week04_git_github, "week-04/notes/week-04-git-and-github-workflow-notes.docx"),
    "week07": (week07_deployment, "week-07/notes/week-07-deployment-docker-devops-notes.docx"),
    "week08": (week08_capstone, "week-08/notes/week-08-capstone-project-guide.docx"),
}


def generate(key: str) -> Path:
    module, relative = DOCUMENTS[key]
    destination = WORD_NOTES / relative
    destination.parent.mkdir(parents=True, exist_ok=True)

    document = module.build()
    document.save(str(destination))
    print(f"  wrote  {destination.relative_to(REPO_ROOT)}")

    return destination


def export_pdfs(keys: list[str]) -> int:
    """
    Hand the export to tools/docx-to-pdf.ps1 rather than converting here, so
    there is exactly one place that decides how a document becomes a PDF.
    """
    if not CONVERTER.exists():
        print(f"  skip   PDF export - {CONVERTER.name} is missing", file=sys.stderr)
        return 1

    print()
    failures = 0
    for key in keys:
        _, relative = DOCUMENTS[key]
        command = [
            "pwsh",
            "-NoProfile",
            "-File",
            str(CONVERTER),
            "-Only",
            Path(relative).name,
            "-Force",
        ]
        try:
            if subprocess.run(command, check=False).returncode != 0:
                failures += 1
        except FileNotFoundError:
            print(
                "  skip   PDF export - PowerShell (pwsh) is not on PATH.\n"
                f"         Run it yourself: pwsh -File {CONVERTER.relative_to(REPO_ROOT)}",
                file=sys.stderr,
            )
            return 1

    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Tech Pulse Insider learning documents.")
    parser.add_argument("--only", choices=sorted(DOCUMENTS), help="generate a single document")
    parser.add_argument("--pdf", action="store_true", help="also export each PDF into resources/")
    args = parser.parse_args()

    keys = [args.only] if args.only else sorted(DOCUMENTS)
    print(f"Generating {len(keys)} document(s) into {WORD_NOTES.relative_to(REPO_ROOT)}/\n")
    for key in keys:
        generate(key)

    failures = export_pdfs(keys) if args.pdf else 0

    print("\nDone." if not failures else f"\nDone, with {failures} failed PDF export(s).")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
