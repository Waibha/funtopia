# Guess Who? Master Dataset Status: Cleared for Manual Ingestion

The **FUNTOPIA Guess Who?** master dataset (`src/data/guessWhoMasterDataset.json`) has been completely cleared (0 records) to allow manual selection, folder curation, and upload of custom puzzle images.

---

## 1. Safety & Historical Backups

The historical dataset records have been preserved outside active application data flow and will NOT be overwritten or deleted:

| Backup File | Records | Content |
|---|---|---|
| `backups/guessWhoMasterDataset.backup.json` | 190 | Complete verified dataset including 20 car logos & 3 local repairs |
| `docs/backups/guessWhoMasterDataset.backup.json` | 190 | Secondary documentation backup |
| `backups/guessWhoMasterDataset.170.backup.json` | 170 | Original 170-puzzle dataset |

---

## 2. Directory Contents

- `src/data/guessWhoMasterDataset.json`: Active JSON dataset (currently `[]`, 0 records).
- `src/data/guessWhoSeedDecks.js`: Module re-exporting `INITIAL_QUESTION_LIBRARY` (`[]`) and `APPROVED_CATEGORIES`.
- `src/data/questionSchemaTemplate.json`: Reference JSON schema for manual question records.
- `docs/guessWhoVerificationReport.md`: Verification report for dataset states.

---

## 3. Manual Image Ingestion Workflow

To populate new puzzle questions around your manually selected images:

1. **Place images** into the designated category directories in `public/assets/guess-who/manual_uploads/`:
   - `hollywood_celebrities/`
   - `bollywood_celebrities/`
   - `scientists/`
   - `objects/`
   - `flags/`
   - `bollywood_dialogues/`
   - `logos_symbols/`
   - `miscellaneous/`

2. **Preview Ingestion**:
   ```bash
   node scripts/map_manual_images.cjs
   ```

3. **Write to Master Dataset**:
   ```bash
   node scripts/map_manual_images.cjs --write
   ```

4. Images will be mapped to web paths under `/assets/guess-who/manual_uploads/<category>/<filename>`. Zero old records or old paths are reused.
