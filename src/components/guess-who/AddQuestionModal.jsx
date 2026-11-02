import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { APPROVED_CATEGORIES } from '../../data/guessWhoSeedDecks';
import { saveCustomQuestion, uploadQuestionImageFile } from '../../services/guessWhoService';
import { playArcadeSound } from '../../utilities/sound';

export default function AddQuestionModal({ isOpen, onClose, onQuestionAdded }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('hollywood_celebrities');
  const [prompt, setPrompt] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [clue, setClue] = useState('');
  const [dialogueText, setDialogueText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 5MB limit.');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImagePreview(uploadEvent.target.result);
        playArcadeSound('blip');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a question title.');
      return;
    }
    if (!correctAnswer.trim()) {
      setErrorMsg('Please enter the correct answer.');
      return;
    }
    if (category !== 'bollywood_dialogues' && !imagePreview) {
      setErrorMsg('Please upload an image from your device gallery.');
      return;
    }
    if (category === 'bollywood_dialogues' && !dialogueText.trim()) {
      setErrorMsg('Please provide the Bollywood dialogue text.');
      return;
    }

    try {
      const created = saveCustomQuestion({
        title: title.trim(),
        category,
        prompt: prompt.trim() || title.trim(),
        correct_answer: correctAnswer.trim(),
        clue: clue.trim(),
        image_url: imagePreview || null,
        dialogue_text: dialogueText.trim() || null,
      });

      playArcadeSound('coin');
      setSuccessMsg(`✓ Saved "${created.title}" to master question library!`);
      if (onQuestionAdded) onQuestionAdded(created);

      setTimeout(() => {
        // Reset form
        setTitle('');
        setPrompt('');
        setCorrectAnswer('');
        setClue('');
        setDialogueText('');
        setImagePreview(null);
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed saving question.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ADD NEW PUZZLE TO LIBRARY" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
        <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
          <span className="text-slate-300">
            Puzzles added here are stored in the library for future slab generation and manual slot replacement.
          </span>
          <Badge variant="pink" size="sm">GALLERY UPLOAD</Badge>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Dropdown (Strictly 8 Approved Categories) */}
          <div>
            <label className="block text-slate-400 mb-1">Approved Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-white focus:outline-none focus:border-cyan-400"
            >
              {APPROVED_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question / Puzzle Title */}
          <div>
            <label className="block text-slate-400 mb-1">Puzzle Title / Subject:</label>
            <input
              type="text"
              placeholder="e.g. Legendary Sci-Fi Director"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Prompt description */}
        <div>
          <label className="block text-slate-400 mb-1">Prompt / Question (Spoken to players):</label>
          <input
            type="text"
            placeholder="e.g. Can you identify this director who directed Inception and Oppenheimer?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Correct Answer (Secret) */}
        <div className="p-3 rounded-lg bg-yellow-950/30 border border-yellow-500/40">
          <label className="block text-yellow-300 font-retro text-[10px] mb-1">
            SECRET CORRECT ANSWER (VISIBLE TO ADMIN ONLY):
          </label>
          <input
            type="text"
            placeholder="e.g. Christopher Nolan"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-cosmic-950 border border-yellow-500/50 text-yellow-300 font-bold focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Bollywood Dialogue Field (if category is bollywood_dialogues) */}
        {category === 'bollywood_dialogues' ? (
          <div>
            <label className="block text-pink-400 mb-1">Famous Bollywood Dialogue (Hindi / English):</label>
            <textarea
              rows={2}
              placeholder="e.g. Don ko pakadna mushkil hi nahi, naamumkin hai!"
              value={dialogueText}
              onChange={(e) => setDialogueText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cosmic-950 border border-pink-500/40 text-white focus:outline-none focus:border-pink-400"
            />
          </div>
        ) : (
          /* Image Upload from Device Gallery */
          <div>
            <label className="block text-slate-400 mb-1">Upload Puzzle Image from Device Gallery:</label>
            <div className="border-2 border-dashed border-purple-500/40 rounded-xl p-4 text-center hover:border-cyan-400 transition-colors bg-purple-950/20">
              {imagePreview ? (
                <div className="space-y-2">
                  <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-cyan-400 bg-cosmic-950 flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="text-[10px] text-pink-400 hover:text-pink-300"
                  >
                    Change / Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-slate-300 text-xs">Click to browse device gallery (PNG, JPG, WEBP, SVG)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="image-file-input"
                  />
                  <label
                    htmlFor="image-file-input"
                    className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-cyan-300 text-xs cursor-pointer border border-purple-500/40"
                  >
                    Select Image File
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Optional Clue */}
        <div>
          <label className="block text-slate-400 mb-1">Optional Coordinator Clue / Trivia:</label>
          <input
            type="text"
            placeholder="e.g. Known for non-linear storytelling and practical effects."
            value={clue}
            onChange={(e) => setClue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-3 border-t border-purple-500/20">
          <Button variant="ghost" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="pink" size="md" type="submit">
            <Check className="w-4 h-4 mr-1" /> Save to Question Library
          </Button>
        </div>
      </form>
    </Modal>
  );
}
