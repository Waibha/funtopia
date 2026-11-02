const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, '../src/data/guessWhoMasterDataset.json');
const languageDataPath = path.join(__dirname, 'language_puzzles_data.json');

const currentDataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const languageData = JSON.parse(fs.readFileSync(languageDataPath, 'utf8'));

console.log(`Current dataset record count: ${currentDataset.length}`);

// Check if any lang-* IDs already exist
const existingIds = new Set(currentDataset.map(q => q.id));
const duplicates = languageData.filter(item => existingIds.has(item.id));

if (duplicates.length > 0) {
  console.error('Found duplicate IDs already in dataset:', duplicates.map(d => d.id));
  process.exit(1);
}

const newRecords = languageData.map(item => ({
  id: item.id,
  category: 'miscellaneous',
  category_label: 'Miscellaneous',
  subtype: 'guess_the_language',
  puzzle_type: 'guess_the_language',
  title: `Greeting: "${item.greeting}" (${item.language})`,
  prompt: "Identify the language in which this greeting meaning 'Hello' is written.",
  correct_answer: item.language,
  greeting: item.greeting,
  script: item.script,
  clue: item.clue,
  difficulty: item.difficulty,
  reveal_type: 'crop',
  reveal_metadata: {
    cropX: 50,
    cropY: 50,
    zoom: 1
  },
  image_url: `/assets/guess-who/manual_uploads/miscellaneous/guess_the_language/${item.filename}`,
  local_asset_path: `/assets/guess-who/manual_uploads/miscellaneous/guess_the_language/${item.filename}`,
  image_source_url: 'Generated via WPF DirectWrite Native Script Typography (Britannica Guess the Language inspired)',
  image_author: 'Antigravity Studio',
  image_license: 'Original / Project-Dedicated Asset',
  verification_status: 'verified_language_puzzle'
}));

const updatedDataset = [...currentDataset, ...newRecords];
fs.writeFileSync(datasetPath, JSON.stringify(updatedDataset, null, 2), 'utf8');

console.log(`Successfully appended ${newRecords.length} language puzzle records.`);
console.log(`New dataset record count: ${updatedDataset.length}`);
