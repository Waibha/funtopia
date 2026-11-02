import React, { useState } from 'react';
import { 
  Trash2, 
  RefreshCw, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { APPROVED_CATEGORIES } from '../../data/guessWhoSeedDecks';
import { playArcadeSound } from '../../utilities/sound';

export default function SlabManagerModal({
  isOpen,
  onClose,
  slab,
  onRemoveSlots,
  onRequestReplaceSlot,
}) {
  const [selectedSlotNumbers, setSelectedSlotNumbers] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!slab) return null;

  const unplayedSlots = slab.slots.filter(
    (s) => s.question && s.status !== 'completed' && s.status !== 'skipped'
  );
  const emptySlotsCount = slab.slots.filter((s) => !s.question || s.status === 'empty').length;
  const isComplete = emptySlotsCount === 0;

  const toggleSelectSlot = (slotNumber) => {
    playArcadeSound('blip');
    setSelectedSlotNumbers((prev) =>
      prev.includes(slotNumber)
        ? prev.filter((num) => num !== slotNumber)
        : [...prev, slotNumber]
    );
  };

  const handleSelectAllUnplayed = () => {
    playArcadeSound('blip');
    const allUnplayedNumbers = unplayedSlots.map((s) => s.slotNumber);
    if (selectedSlotNumbers.length === allUnplayedNumbers.length) {
      setSelectedSlotNumbers([]);
    } else {
      setSelectedSlotNumbers(allUnplayedNumbers);
    }
  };

  const handleConfirmRemoval = () => {
    playArcadeSound('coin');
    onRemoveSlots(selectedSlotNumbers);
    setSelectedSlotNumbers([]);
    setShowConfirmDelete(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`SLAB PUZZLE MANAGER — ${slab.playerName.toUpperCase()}`}
      size="lg"
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Status & Completeness Alert Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-retro text-xs text-white">SLAB COMPOSITION:</span>
              <Badge variant={isComplete ? 'green' : 'red'} size="sm">
                {isComplete ? '12 OF 12 SLOTS FULL' : `${12 - emptySlotsCount} OF 12 SLOTS FILLED`}
              </Badge>
            </div>
            {!isComplete ? (
              <p className="text-[11px] text-amber-300 font-sans mt-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Incomplete slab: {emptySlotsCount} slot(s) require replacement before continuing run.
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Removing an item removes it from this player's run only. It remains in the question library.
              </p>
            )}
          </div>

          {/* Selection Controls */}
          {unplayedSlots.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllUnplayed}
                className="px-2.5 py-1 rounded bg-purple-900/40 text-cyan-300 hover:bg-purple-900/60 border border-purple-500/30 text-[10px]"
              >
                {selectedSlotNumbers.length === unplayedSlots.length ? 'Deselect All' : 'Select All Unplayed'}
              </button>

              {selectedSlotNumbers.length > 0 && (
                <Button
                  variant="pink"
                  size="sm"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remove Selected ({selectedSlotNumbers.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Deletion Confirmation Dialog */}
        {showConfirmDelete && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/70 text-white space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-red-300 font-retro text-xs">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              CONFIRM REMOVAL FROM CURRENT SLAB
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Are you sure you want to remove <strong>{selectedSlotNumbers.length} puzzle(s)</strong> (Slots: {selectedSlotNumbers.join(', ')}) from this player's active run?
              <br />
              <span className="text-emerald-400">
                Notice: The original questions and images will NOT be deleted from the master library or storage.
              </span>
            </p>
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                variant="pink"
                size="sm"
                onClick={handleConfirmRemoval}
              >
                Confirm & Remove
              </Button>
            </div>
          </div>
        )}

        {/* 12 Slots Grid */}
        <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1">
          {slab.slots.map((slot) => {
            const isSelected = selectedSlotNumbers.includes(slot.slotNumber);
            const isPlayed = slot.status === 'completed' || slot.status === 'skipped';
            const isEmpty = !slot.question || slot.status === 'empty';
            const catObj = slot.question
              ? APPROVED_CATEGORIES.find((c) => c.id === slot.question.category)
              : null;

            return (
              <div
                key={slot.slotNumber}
                className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  isEmpty
                    ? 'bg-amber-950/30 border-amber-500/50'
                    : isPlayed
                    ? 'bg-cosmic-950/40 border-purple-500/20 opacity-75'
                    : isSelected
                    ? 'bg-pink-950/40 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                    : 'bg-cosmic-950/80 border-purple-500/30 hover:border-purple-400/50'
                }`}
              >
                {/* Left: Slot number, Checkbox, Info */}
                <div className="flex items-center gap-3">
                  {/* Selection checkbox for unplayed items */}
                  {!isPlayed && !isEmpty ? (
                    <button
                      type="button"
                      onClick={() => toggleSelectSlot(slot.slotNumber)}
                      className="p-1 rounded text-cyan-400 hover:text-white"
                      title="Select for removal"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-pink-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  ) : (
                    <span className="w-6 text-center text-slate-600 font-mono text-[10px]">
                      {slot.slotNumber}
                    </span>
                  )}

                  {/* Thumbnail / Status Icon */}
                  <div className="w-10 h-10 rounded bg-cosmic-900 border border-purple-500/30 overflow-hidden shrink-0 flex items-center justify-center text-base">
                    {isEmpty ? (
                      <span className="text-amber-400">⚠️</span>
                    ) : slot.question && slot.question.image_url ? (
                      <img src={slot.question.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>🎭</span>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-retro text-[10px] text-yellow-300">
                        SLOT #{slot.slotNumber}
                      </span>
                      {isEmpty ? (
                        <Badge variant="gold" size="sm">EMPTY SLOT</Badge>
                      ) : (
                        <Badge variant="purple" size="sm">
                          {catObj ? catObj.label : slot.question.category}
                        </Badge>
                      )}
                    </div>

                    {isEmpty ? (
                      <p className="text-[11px] text-amber-300 font-sans">
                        Requires replacement from library to complete 12 puzzles.
                      </p>
                    ) : (
                      <p className="text-[11px] text-white font-sans truncate max-w-xs sm:max-w-md">
                        {slot.question.title} — <span className="text-yellow-300 font-mono">Answer: {slot.question.correct_answer}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions / Results */}
                <div className="shrink-0 flex items-center gap-2">
                  {isPlayed ? (
                    <div className="flex items-center gap-1.5 font-retro text-[9px]">
                      {slot.result === 'correct' && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CORRECT (+1)
                        </span>
                      )}
                      {slot.result === 'wrong' && (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> WRONG (0)
                        </span>
                      )}
                      {slot.result === 'skip' && (
                        <span className="text-amber-400 flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" /> SKIPPED (0)
                        </span>
                      )}
                    </div>
                  ) : isEmpty ? (
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => onRequestReplaceSlot(slot.slotNumber)}
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" /> Assign Question
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRequestReplaceSlot(slot.slotNumber)}
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Replace
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
          <span className="text-[10px] text-slate-400">
            {isComplete ? '✓ Slab is valid for tournament play.' : '⚠️ Please fill all empty slots.'}
          </span>
          <Button variant="cyan" size="md" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
