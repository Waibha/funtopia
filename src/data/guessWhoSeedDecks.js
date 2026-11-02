/**
 * ============================================================================
 * GUESS WHO? SEED QUESTION DECKS (8 OFFICIAL CATEGORIES)
 * ============================================================================
 * 
 * Master data is loaded directly from guessWhoMasterDataset.json.
 * Currently cleared (0 records) awaiting manual image curation and upload.
 * Historical 190-puzzle dataset is safely preserved in backups/guessWhoMasterDataset.backup.json.
 */

import masterDataset from './guessWhoMasterDataset.json' with { type: 'json' };

export const APPROVED_CATEGORIES = [
  { id: 'hollywood_celebrities', label: 'Hollywood Celebrities', icon: '🎬' },
  { id: 'bollywood_celebrities', label: 'Bollywood Celebrities', icon: '🌟' },
  { id: 'scientists', label: 'Scientists', icon: '🔬' },
  { id: 'objects', label: 'Objects', icon: '📦' },
  { id: 'flags', label: 'Flags', icon: '🚩' },
  { id: 'bollywood_dialogues', label: 'Bollywood Dialogues', icon: '🎭' },
  { id: 'logos_symbols', label: 'Logos & Symbols', icon: '⚡' },
  { id: 'miscellaneous', label: 'Miscellaneous', icon: '🌌' },
];

export const INITIAL_QUESTION_LIBRARY = masterDataset;
