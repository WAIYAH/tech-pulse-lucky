"""
Tech Pulse Insider / Get Techy With Lucky — document identity constants.

Single source of truth for the look of every generated learning document.
Colours mirror the LMS brand tokens in src/index.css:
    --primary       hsl(216 100% 31%)  ->  #003F9E
    --primary-glow  hsl(216 100% 45%)  ->  #005CE6
    --accent        hsl(48 100% 50%)   ->  #FFCC00
"""

from docx.shared import Pt, RGBColor

# --------------------------------------------------------------------------
# Identity
# --------------------------------------------------------------------------
ORGANISATION = "GET TECHY WITH LUCKY"
PUBLICATION = "TECH PULSE INSIDER"
PROGRAM_NAME = "WEB DEVELOPMENT MASTERCLASS"
TAGLINE = "Learn  •  Build  •  Connect  •  Grow"
FOOTER_IDENTITY = "Tech Pulse Insider  |  Get Techy With Lucky"
INSTRUCTOR = "Lucky Nakola"
WATERMARK_TEXT = "TECH PULSE INSIDER"

# --------------------------------------------------------------------------
# Colour palette
# --------------------------------------------------------------------------
PRIMARY = RGBColor(0x00, 0x3F, 0x9E)       # deep brand blue
PRIMARY_GLOW = RGBColor(0x00, 0x5C, 0xE6)  # lighter brand blue
ACCENT = RGBColor(0xB8, 0x8A, 0x00)        # readable print gold (accent at text weight)
INK = RGBColor(0x1A, 0x1F, 0x2B)           # body text
MUTED = RGBColor(0x5B, 0x64, 0x74)         # captions / secondary text
RULE = RGBColor(0xD6, 0xDC, 0xE5)          # hairline rules

# Hex strings for raw OOXML (shading, borders — these take hex without "#")
HEX_PRIMARY = "003F9E"
HEX_ACCENT = "FFCC00"
HEX_CODE_BG = "F4F6FA"
HEX_CODE_BORDER = "C9D3E6"
HEX_TABLE_HEAD = "003F9E"
HEX_TABLE_ZEBRA = "F5F7FB"
HEX_RULE = "D6DCE5"
HEX_WATERMARK = "F1F4FA"     # very light - must never fight the body text
HEX_NOTE_BG = "EEF4FF"
HEX_WARN_BG = "FFF7E6"
HEX_TIP_BG = "EFFAF3"
HEX_WHY_BG = "F6F1FF"

# --------------------------------------------------------------------------
# Typography scale (section 10 of the content standard)
# --------------------------------------------------------------------------
FONT_BODY = "Arial"
FONT_CODE = "Consolas"

SIZE_COVER_TITLE = Pt(30)
SIZE_TITLE = Pt(26)        # main title      24-28pt
SIZE_H1 = Pt(19)           # chapter heading 18-20pt
SIZE_H2 = Pt(15)           # section heading 14-16pt
SIZE_H3 = Pt(12.5)
SIZE_BODY = Pt(11)         # body text       10.5-12pt
SIZE_CAPTION = Pt(9.5)     # captions/notes  9-10pt
SIZE_CODE = Pt(9.5)
SIZE_TABLE = Pt(10)
SIZE_HEADER = Pt(8.5)
SIZE_FOOTER = Pt(8.5)
