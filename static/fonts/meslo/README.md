# MesloLGS Nerd Font

Source: [Powerlevel10k media](https://github.com/romkatv/powerlevel10k-media/tree/145eb9fbc2f42ee408dacd9b22d8e6e0e553f83d).

These are the Regular, Bold, Italic, and Bold Italic MesloLGS NF faces from that commit. They were converted from TTF to WOFF2 with fonttools 4.64.0 and Brotli. No glyphs were removed. The font names and outlines are unchanged.

The font is third-party material under Apache-2.0. See LICENSE.txt for the upstream notice and Apache-2.0.txt for the license text.

To reproduce each file with fonttools and Brotli installed:

```python
from fontTools.ttLib import TTFont

font = TTFont("MesloLGS NF Regular.ttf")
font.flavor = "woff2"
font.save("regular.woff2")
```
