# Manual Image Selection Directories for Guess Who?

Place your curated image files directly into the respective category folders below:

- `hollywood_celebrities/` : Images of Hollywood actors & directors (JPG, PNG, WebP)
- `bollywood_celebrities/` : Images of Bollywood stars (JPG, PNG, WebP)
- `scientists/`            : Images of famous scientists & inventors (JPG, PNG, WebP)
- `objects/`               : Images of recognizable everyday & historic objects (JPG, PNG, WebP)
- `flags/`                 : World national flags (SVG, PNG, WebP)
- `bollywood_dialogues/`   : Bollywood dialogues cards or movie stills (optional image)
- `logos_symbols/`         : Logos & symbols with brand text omitted (SVG, PNG)
- `miscellaneous/`         : Landmarks, wonders of the world, animals, space, etc.

## How Images Map to the Game

When you run `node scripts/map_manual_images.cjs`, all images placed in these folders will be scanned and transformed into new question records:
- **Image URL in App**: `/assets/guess-who/manual_uploads/<category>/<filename>`
- **Unique ID**: Clean sequential ID based on category code (e.g. `hw-1`, `bw-1`, `sci-1`, etc.)
- **Question Metadata**: Title, prompt, correct answer, clue, and reveal parameters can be added.
- **Zero Old Data**: No old URLs, old questions, or old metadata are automatically retained.
