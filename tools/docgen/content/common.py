"""Shared front-matter and closing sections used by every weekly learning guide."""

from __future__ import annotations

PROGRAM_TITLE = "Web Development Masterclass"


def course_information(week_number: int, week_title: str, study_time: str, prerequisite_week: str) -> list[list[str]]:
    return [
        ["Program", PROGRAM_TITLE],
        ["Provider", "Get Techy With Lucky  /  Tech Pulse Insider"],
        ["Instructor", "Lucky Nakola"],
        ["Week", "Week {:02d} of 08".format(week_number)],
        ["Module", week_title],
        ["Estimated study time", study_time],
        ["Builds on", prerequisite_week],
        ["Format", "Read  ->  Practise  ->  Quiz  ->  Build  ->  Submit"],
        ["Assessment", "Weekly quiz (auto-scored) and a practical assignment submitted via GitHub"],
    ]


HOW_TO_USE = (
    "Read this guide with an editor open beside it. Type every example yourself rather than "
    "copying and pasting. Typing is slower, and that is the point: it is what turns a concept "
    "you have read into a skill you own. When something does not work, resist the urge to look "
    "at the answer straight away. Read the error, form a guess about the cause, then test that "
    "guess. Debugging is the skill that separates people who can build from people who can only follow."
)


def closing_note() -> str:
    return (
        "You are not expected to remember everything in this guide. Professional developers look "
        "things up constantly. What you are expected to build is a mental model: knowing that a "
        "thing exists, roughly how it behaves, and where to look it up when you need the detail."
    )
