'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Copy, Flame, RotateCcw, Share2, Trophy, X } from 'lucide-react';
import { advance, answer, cleanHistory, colourHex, dailyStreak, dateKey, Game, loadProgress, resetHighScore, runLength, saveProgress, scorePath, shareIntentUrl, shareText, start, Difficulty } from '../lib/game';

const control = 'min-h-11 rounded-xl border border-gray-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50 disabled:cursor-not-allowed aria-pressed:bg-violet-100 dark:aria-pressed:bg-violet-950 aria-pressed:border-violet-500';

export default function ColourGame() {
  const [game, setGame] = useState<Game | null>(null);
  const current = useRef<Game | null>(null);
  const [input, setInput] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [storageNotice, setStorageNotice] = useState('');
  const [copyNotice, setCopyNotice] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const resetButton = useRef<HTMLButtonElement>(null);
  const cancelReset = useRef<HTMLButtonElement>(null);
  const scoreNotice = useRef<HTMLParagraphElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const retryButton = useRef<HTMLButtonElement>(null);
  const answerArea = useRef<HTMLDivElement>(null);
  const update = (next: Game) => { current.current = next; setGame(next); setInput(''); setCopyNotice(''); };

  useEffect(() => {
    update(start());
    try {
      const progress = loadProgress(window.localStorage);
      setHighScore(progress.highScore); setHistory(progress.history);
      if (!progress.available) setStorageNotice('Scores are available for this visit only. Browser storage is unavailable.');
    } catch { setStorageNotice('Scores are available for this visit only. Browser storage is unavailable.'); }
  }, []);

  useEffect(() => { if (confirmReset) cancelReset.current?.focus(); }, [confirmReset]);

  useEffect(() => {
    if (game?.phase === 'feedback') nextButton.current?.focus();
    if (game?.phase === 'over') retryButton.current?.focus();
  }, [game?.phase]);

  function guess(raw: string) {
    const active = current.current;
    if (!active) return;
    const next = answer(active, raw);
    if (next === active) return;
    update(next); // Synchronous ref locks the round before a second event can score it.
    const plausible = (window as unknown as { plausible?: (event: string, options: { props: Record<string, unknown> }) => void }).plausible;
    if (typeof plausible === 'function') {
      try { plausible('Colour Game Guess', { props: { difficulty: active.difficulty, mode: active.mode, correct: next.correct, score: next.score } }); }
      catch { /* Optional analytics must never interrupt a round. */ }
    }
    const nextHigh = next.mode === 'normal' ? Math.max(highScore, next.score) : highScore;
    const nextHistory = cleanHistory([...history, dateKey(new Date())]);
    setHighScore(nextHigh); setHistory(nextHistory);
    try {
      if (!saveProgress(window.localStorage, nextHigh, nextHistory)) setStorageNotice('Scores are available for this visit only. Browser storage could not be updated.');
    } catch { setStorageNotice('Scores are available for this visit only. Browser storage is unavailable.'); }
  }
  function track(event: string, props: Record<string, unknown>) {
    const plausible = (window as unknown as { plausible?: (event: string, options: { props: Record<string, unknown> }) => void }).plausible;
    if (typeof plausible === 'function') { try { plausible(event, { props }); } catch { /* Optional analytics never block sharing. */ } }
  }
  async function shareBest() {
    const score = highScore;
    if (!score) return;
    const url = window.location.origin + scorePath(score);
    setConfirmReset(false); setCopyNotice('');
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'The Colour Game', text: shareText(score), url });
        track('High Score Share', { score, method: 'web-share' });
        return;
      } catch (error) {
        if ((error as { name?: string })?.name === 'AbortError') return; // The visitor closed the share sheet.
      }
    }
    window.open(shareIntentUrl(score, window.location.origin), '_blank', 'noopener,noreferrer');
    track('High Score Share', { score, method: 'x-intent' });
  }
  async function copyBest() {
    setConfirmReset(false);
    try { await navigator.clipboard.writeText(`${shareText(highScore)} ${window.location.origin}${scorePath(highScore)}`); setCopyNotice('Score copied.'); }
    catch { setCopyNotice(`Could not copy. Your practice best is ${highScore}.`); }
  }
  function confirmResetBest() {
    setConfirmReset(false); setHighScore(0);
    let saved = false;
    try { saved = resetHighScore(window.localStorage); } catch { saved = false; }
    setCopyNotice(saved ? 'Practice best reset to 0.' : 'Practice best reset for this visit. Browser storage could not be updated.');
    requestAnimationFrame(() => scoreNotice.current?.focus());
  }
  function keepBest() {
    setConfirmReset(false);
    requestAnimationFrame(() => resetButton.current?.focus());
  }
  function continueGame() {
    if (!current.current) return;
    update(advance(current.current));
    requestAnimationFrame(() => answerArea.current?.querySelector<HTMLElement>('input,button')?.focus());
  }
  const days = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 29 + i); return dateKey(d); });
  const streak = dailyStreak(history);
  const over = game?.phase === 'over';
  const feedback = game?.phase === 'feedback';
  return (
    <section className="text-left text-gray-900 dark:text-white" aria-labelledby="game-title">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-violet-700 dark:text-violet-200 mb-2">A little colour intuition</p>
        <h3 id="game-title" className="text-2xl font-semibold mb-2">Name that CSS colour</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Practise with random colours. Your scores and play history are saved in this browser.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4" aria-label="Game mode">
        <button className={control} aria-pressed={game?.mode === 'normal'} onClick={() => update(start('normal', 'easy', game?.target))}>Practice</button>
        <button className={control} aria-pressed={game?.mode === 'gauntlet'} onClick={() => update(start('gauntlet', 'easy', game?.target))}><Trophy size={16} aria-hidden="true" className="inline mr-2" />Gauntlet</button>
      </div>
      {game?.mode === 'normal' ? <fieldset className="mb-5"><legend className="text-sm mb-2">Practice difficulty</legend><div className="flex flex-wrap gap-2">{(['easy','medium','hard'] as Difficulty[]).map(d => <button key={d} className={control} aria-pressed={game.difficulty === d} onClick={() => update(start('normal', d, game.target))}>{d[0].toUpperCase() + d.slice(1)}</button>)}</div><p className="text-xs text-gray-600 dark:text-gray-300 mt-2">Changing difficulty starts a new practice run.</p></fieldset> : <p className="text-sm mb-5">Three correct answers advance each stage. Easy earns 10 points, Medium 20, Hard 30. One miss ends the run.</p>}
      {!game ? <p role="status">Preparing your first colour...</p> : <>
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          <div className="rounded-xl bg-gray-100 dark:bg-neutral-800 p-3"><p className="text-xs text-gray-600 dark:text-gray-300">{game.mode === 'gauntlet' ? 'Gauntlet score' : 'Practice score'}</p><p className="text-2xl tabular-nums">{game.score}</p></div>
          <div className="rounded-xl bg-gray-100 dark:bg-neutral-800 p-3"><p className="text-xs text-gray-600 dark:text-gray-300">{game.mode === 'gauntlet' ? 'Stage' : 'Correct in a row'}</p><p className="text-lg capitalize">{game.mode === 'gauntlet' ? game.difficulty : game.streak}</p></div>
          <div className="rounded-xl bg-gray-100 dark:bg-neutral-800 p-3"><p className="text-xs text-gray-600 dark:text-gray-300">Practice best</p><p className="text-2xl tabular-nums">{highScore}</p></div>
        </div>
        {over ? <div className="rounded-2xl border border-violet-300 p-6 mb-5"><h4 className="text-xl font-semibold mb-2">Gauntlet complete</h4><p className="text-sm mb-4">{game.stats.easy} Easy, {game.stats.medium} Medium and {game.stats.hard} Hard correct. Final score: {game.score}.</p><button ref={retryButton} className={control} onClick={() => update(start('gauntlet', 'easy', game.target))}><RotateCcw size={16} className="inline mr-2" aria-hidden="true" />Try again</button></div> : <>
          <div className="rounded-2xl border border-gray-300 dark:border-neutral-600 h-40 sm:h-48 mb-5" style={{ backgroundColor: game.target }} role="img" aria-label="Colour to identify visually" />
          <div ref={answerArea}>
            {game.difficulty === 'hard' ? <form onSubmit={e => { e.preventDefault(); guess(input); }} className="mb-5"><label htmlFor="colour-guess" className="block text-sm mb-2">CSS colour name</label><div className="flex flex-wrap gap-2"><input id="colour-guess" value={input} disabled={feedback} autoComplete="off" autoCapitalize="none" spellCheck={false} onChange={e => setInput(e.target.value)} className={`${control} min-w-0 flex-1 bg-transparent`} placeholder="For example, coral" /><button className={control} disabled={feedback || !input.trim()} type="submit">Check answer</button></div><p className="text-xs text-gray-600 dark:text-gray-300 mt-2">CSS aliases such as grey and gray both count.</p></form> : <div className="grid grid-cols-2 gap-2 mb-5">{game.options.map(name => <button key={name} className={`${control} break-words`} disabled={feedback} onClick={() => guess(name)}>{name}</button>)}</div>}
          </div>
          {feedback && <div className="rounded-xl border border-gray-300 dark:border-neutral-600 p-4 mb-5"><p role="status" className="font-medium flex items-center gap-2 mb-2">{game.correct ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}{game.correct ? 'Correct' : 'Not quite'}. The colour is {game.target}.</p>{!game.correct && <p className="text-sm mb-3 flex flex-wrap items-center gap-2">Your answer: {game.guessed}. {colourHex(game.guessed) ? <span className="inline-block w-6 h-6 rounded border border-gray-400" style={{ backgroundColor: colourHex(game.guessed) }} role="img" aria-label={`Your guessed colour, ${game.guessed}`} /> : 'That is not a recognised CSS colour name.'}</p>}<button ref={nextButton} className={control} onClick={continueGame}>{game.mode === 'gauntlet' && !game.correct ? 'See results' : 'Next colour'}<ArrowRight size={16} aria-hidden="true" className="inline ml-2" /></button></div>}
          {game.mode === 'gauntlet' && <p className="text-xs text-gray-600 dark:text-gray-300 mb-5">{game.difficulty === 'hard' ? `${game.stats.hard} Hard answers correct. Keep going for 30 points each.` : `${game.stageCorrect}/3 correct at ${game.difficulty}.`}</p>}
        </>}
      </>}
      <div className="border-t border-gray-200 dark:border-neutral-700 pt-5 mt-5">
        <p className="text-sm font-medium flex items-center gap-2 mb-2"><Flame size={17} aria-hidden="true" />{streak} day{streak === 1 ? '' : 's'} played in a row</p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{history.includes(dateKey(new Date())) ? 'You played today.' : 'Make a guess to mark today.'}</p>
        <div className="flex flex-wrap gap-1 mb-2" role="img" aria-label={`${days.filter(d => history.includes(d)).length} of the last 30 days played`} aria-hidden="false">{days.map(day => <span key={day} title={`${day}: ${history.includes(day) ? 'played' : 'not played'}`} aria-hidden="true" className={`w-3 h-3 rounded-sm ${history.includes(day) ? 'bg-violet-500' : 'bg-gray-200 dark:bg-neutral-700'}`} />)}</div>
        {storageNotice && <p role="status" className="text-xs mt-3">{storageNotice}</p>}
        {highScore > 0 && <div className="mt-4">
          <p className="text-sm mb-3">Your practice best is {highScore}, {runLength(highScore)} correct in a row.</p>
          <div className="flex flex-wrap gap-2">
            <button className={control} onClick={shareBest}><Share2 size={16} aria-hidden="true" className="inline mr-2" />Share practice best</button>
            <button className={control} onClick={copyBest}><Copy size={16} aria-hidden="true" className="inline mr-2" />Copy practice best</button>
            {!confirmReset && <button ref={resetButton} className={control} onClick={() => { setCopyNotice(''); setConfirmReset(true); }}><RotateCcw size={16} aria-hidden="true" className="inline mr-2" />Reset practice best</button>}
          </div>
          {confirmReset && <div role="group" aria-labelledby="reset-question" className="rounded-xl border border-gray-300 dark:border-neutral-600 p-4 mt-3" onKeyDown={e => { if (e.key === 'Escape') keepBest(); }}>
            <p id="reset-question" className="text-sm font-medium mb-3">Are you sure? This sets your practice best of {highScore} back to 0. Your days played stay.</p>
            <div className="flex flex-wrap gap-2">
              <button className={`${control.replace('border-gray-300 dark:border-neutral-600', 'border-red-600 dark:border-red-400')} text-red-700 dark:text-red-300`} onClick={confirmResetBest}>Yes, reset</button>
              <button ref={cancelReset} className={control} onClick={keepBest}>Cancel</button>
            </div>
          </div>}
        </div>}
        {copyNotice && <p ref={scoreNotice} tabIndex={-1} role="status" className="text-sm mt-2 focus:outline-none">{copyNotice}</p>}
      </div>
    </section>
  );
}
