#!/usr/bin/env python3
"""Builds fonts/hs-mask.woff2, the one-glyph font that draws password dots.

The browsers disagree on how a masked password looks: Chromium draws the text
font's own bullet glyph, which in Geist is a 0.22 em sliver, while Firefox
draws a round disc of about 0.76 em. This font makes every browser draw the
same disc, because both take the glyph from the font that is set on the field.

The glyph is a circle of 0.76 em on an advance of 0.88 em, sitting on the same
optical line as Geist's bullet, so the dots match the disc Firefox draws and
keep its spacing. Every vertical metric is copied from Geist, so at the same
font size the caret and line height are identical to a normal text field, and
the field keeps its normal text size (pw-mask).

Run with the fontTools venv (design/tools/.venv):

    tools/.venv/bin/python scripts/mask-font.py

Writes fonts/hs-mask.woff2 and nothing else. Deterministic: the same input
(the constants below) always builds the same file.
"""

import math
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib.woff2 import compress

# Geist's vertical metrics, units per 1000 em, copied so the caret matches:
# the typo and Windows values and the fsSelection bits, including
# USE_TYPO_METRICS, so a field sized from this font is exactly one sized from
# Geist whichever metrics the platform reads.
ASCENT = 1005
DESCENT = -295
WIN_ASCENT = 1088
WIN_DESCENT = 262
# The disc: diameter and advance in font units (1000 per em).
DIAMETER = 760
ADVANCE = 880
# The disc's centre height above the baseline, Geist's bullet line.
CENTER = 310

# The code points browsers have been seen to use for masked characters.
MASK_CODEPOINTS = (0x2022, 0x25CF, 0x2027, 0x26AB)

REPOSITORY = Path(__file__).resolve().parent.parent
OUTPUT = REPOSITORY / "fonts" / "hs-mask.woff2"
SOURCE_TTF = REPOSITORY / "fonts" / "hs-mask.ttf"


def circle_pen(diameter: int, center_x: int, center_y: int) -> TTGlyphPen:
    """Draws a circle as eight quadratic segments.

    :param diameter: The circle's diameter in font units.
    :param center_x: The centre's x in font units.
    :param center_y: The centre's y in font units.
    :returns: A glyph pen holding the circle.
    """
    pen = TTGlyphPen(None)
    radius = diameter / 2
    # Eight quadratic segments; each control point sits where the two end
    # points' tangents meet: radius / cos(22.5 degrees) out along the middle
    # angle of the segment.
    spoke = radius / math.cos(math.pi / 8)
    pen.moveTo((round(center_x + radius), round(center_y)))
    for step in range(8):
        middle = math.pi / 4 * (step + 0.5)
        end = math.pi / 4 * (step + 1)
        control = (center_x + spoke * math.cos(middle), center_y + spoke * math.sin(middle))
        point = (center_x + radius * math.cos(end), center_y + radius * math.sin(end))
        pen.qCurveTo((round(control[0]), round(control[1])), (round(point[0]), round(point[1])))
    pen.closePath()
    return pen


def build() -> None:
    """Builds the mask font and writes it as woff2."""
    builder = FontBuilder(1000, isTTF=True)
    builder.setupGlyphOrder([".notdef", "bullet", "space"])
    builder.setupCharacterMap({code: "bullet" for code in MASK_CODEPOINTS} | {0x20: "space"})

    empty = TTGlyphPen(None)
    empty.moveTo((0, 0))
    empty.closePath()
    glyphs = {
        ".notdef": empty.glyph(),
        "space": empty.glyph(),
        "bullet": circle_pen(DIAMETER, ADVANCE // 2, CENTER).glyph(),
    }
    builder.setupGlyf(glyphs)
    builder.setupHorizontalMetrics({".notdef": (ADVANCE, 0), "bullet": (ADVANCE, 0), "space": (312, 0)})
    builder.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT)
    builder.setupNameTable(
        {
            "familyName": "Hearthsound Mask",
            "styleName": "Regular",
            "uniqueFontIdentifier": "Hearthsound Mask Regular; hs-mask; 1.0",
            "fullName": "Hearthsound Mask",
            "psName": "HearthsoundMask-Regular",
            "version": "Version 1.0",
        }
    )
    builder.setupOS2(
        sTypoAscender=ASCENT,
        sTypoDescender=DESCENT,
        usWinAscent=WIN_ASCENT,
        usWinDescent=WIN_DESCENT,
        usWeightClass=400,
    )
    # Version 4 carries the fsSelection bits this font sets.
    os2 = builder.font['OS/2']
    os2.version = 4
    os2.fsSelection = 0xC0
    os2.usLowerOpticalPointSize = 0
    os2.usUpperOpticalPointSize = 65535
    builder.setupPost()
    builder.font["head"].xMin = 0
    builder.font["head"].yMin = 0
    builder.font["head"].xMax = ADVANCE
    builder.font["head"].yMax = ASCENT
    builder.font.save(SOURCE_TTF)
    compress(SOURCE_TTF, OUTPUT)
    SOURCE_TTF.unlink()
    print(f"wrote {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    build()
