import React, { useState } from 'react';
import { Search, Filter, Check, AlertCircle, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { APPROVED_CATEGORIES } from '../../data/guessWhoSeedDecks';
import { getQuestionLibrary } from '../../services/guessWhoService';
import { playArcadeSound } from '../../utilities/sound';

export default function QuestionBrowserModal({
  isOpen,
  onClose,
  targetSlotNumber,
  currentSlabQuestionIds = new Set(),
  onSelectQuestion,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const library = getQuestionLibrary();

  const filtered = library.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.correct_answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.prompt && q.prompt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.clue && q.clue.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.english_clue && q.english_clue.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.movie && q.movie.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.field && q.field.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.location && q.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.dialogue_text && q.dialogue_text.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || q.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSelect = (question) => {
    if (currentSlabQuestionIds.has(question.id)) return;
    playArcadeSound('coin');
    onSelectQuestion(question);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`SELECT REPLACEMENT FOR SLOT #${targetSlotNumber || '?'}`}
      size="lg"
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Search and Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library by title, subject, or answer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All 8 Categories</option>
            {APPROVED_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No matching puzzles found in library.
            </div>
          ) : (
            filtered.map((item) => {
              const isAlreadyInSlab = currentSlabQuestionIds.has(item.id);
              const catObj = APPROVED_CATEGORIES.find((c) => c.id === item.category);

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAlreadyInSlab
                      ? 'bg-cosmic-950/40 border-purple-500/20 opacity-60'
                      : 'bg-cosmic-950/80 border-purple-500/40 hover:border-cyan-400 hover:bg-purple-950/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail or Icon */}
                    <div className="w-12 h-12 rounded-lg bg-cosmic-900 border border-purple-500/30 overflow-hidden shrink-0 flex items-center justify-center text-lg">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      ) : item.subtype === 'bollywood_song_guess' ? (
                        <span className="text-xl">🎵</span>
                      ) : (
                        <span>🎭</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-retro text-[10px] text-white">{item.title}</span>
                        <Badge variant="purple" size="sm">
                          {catObj ? catObj.label : item.category}
                        </Badge>
                        {item.subtype === 'bollywood_song_guess' && (
                          <Badge variant="cyan" size="sm">
                            🎵 Song Clue
                          </Badge>
                        )}
                        {(item.subtype === 'scientist' || item.category === 'scientists') && (
                          <Badge variant="emerald" size="sm">
                            🔬 Scientist
                          </Badge>
                        )}
                        {item.subtype === 'statue' && (
                          <Badge variant="gold" size="sm">
                            🗿 Statue
                          </Badge>
                        )}
                      </div>

                      {item.subtype === 'bollywood_song_guess' ? (
                        <p className="text-[11px] text-cyan-200 font-sans italic line-clamp-1">
                          "{item.english_clue || item.clue}"
                        </p>
                      ) : item.dialogue_text ? (
                        <p className="text-[11px] text-pink-300 font-sans italic line-clamp-1">
                          {item.dialogue_text}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-300 font-sans line-clamp-1">
                          {item.prompt}
                        </p>
                      )}

                      <div className="text-[10px] text-yellow-300 mt-1 flex flex-wrap items-center gap-2">
                        <span>Answer: <strong>{item.correct_answer}</strong></span>
                        {item.movie && <span className="text-cyan-300 font-mono">({item.movie})</span>}
                        {item.field && <span className="text-emerald-300 font-mono">[{item.field}]</span>}
                        {item.location && <span className="text-amber-300 font-mono">📍 {item.location}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="shrink-0">
                    {isAlreadyInSlab ? (
                      <span className="text-[10px] font-mono text-slate-500">
                        Already in slab
                      </span>
                    ) : (
                      <Button
                        variant="cyan"
                        size="sm"
                        onClick={() => handleSelect(item)}
                      >
                        Select Slot #{targetSlotNumber} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
