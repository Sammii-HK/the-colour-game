import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import ColourGame from '../src/components/ColourGame';
import ThemeProvider from '../src/components/ThemeProvider';
import { advance, answer, start, question, matches, cleanHistory, dailyStreak, loadProgress, saveProgress, dateKey, COLOR_GROUPS, colourHex, resetHighScore, cleanScore, shareText, shareIntentUrl, scoreImagePath } from '../src/lib/game';

afterEach(() => { cleanup(); localStorage.clear(); jest.restoreAllMocks(); });
test('Gauntlet promotes after three correct per stage and earns 10/20/30', () => {
  let game = start('gauntlet');
  for(let i=0;i<3;i++) game = advance(answer(game, game.target));
  expect(game.difficulty).toBe('medium'); expect(game.score).toBe(30); expect(game.options).toHaveLength(4);
  for(let i=0;i<3;i++) game = advance(answer(game, game.target));
  expect(game.difficulty).toBe('hard'); expect(game.score).toBe(90); expect(game.options).toHaveLength(0);
  game=answer(game,game.target); expect(game.score).toBe(120);
  expect(answer(game,game.target)).toBe(game);
  game=advance(game); game=answer(game,'notacolour');
  expect(game.score).toBe(120); expect(advance(game).phase).toBe('over');
});
test('every game name has a concrete CSS colour value', () => {
  Object.values(COLOR_GROUPS).flat().forEach(name => expect(colourHex(name)).toMatch(/^#[0-9a-f]{6}$/));
});
test('question alternatives never share rendered colour and avoid previous targets', () => {
  for(const difficulty of ['easy','medium'] as const) for(let i=0;i<150;i++) {
    const q=question(difficulty,'cyan'); expect(matches(q.target,'cyan')).toBe(false);
    expect(q.options).toHaveLength(4);
    q.options.forEach((a,j)=>q.options.slice(j+1).forEach(b=>expect(matches(a,b)).toBe(false)));
  }
  expect(question('medium','cyan',()=>0).options).toHaveLength(4);
});
test('normalises CSS aliases, spacing and case; blank answers do not consume rounds', () => {
  const game={...start(),target:'cyan'};
  expect(answer(game,' Aqua ').correct).toBe(true);
  expect(matches(' DARKGREY ','darkgray')).toBe(true);
  expect(answer(game,'  ')).toBe(game);
});
test('validates local progress and tolerates denied storage', () => {
  expect(cleanHistory(['2026-02-31','2026-11-20','2026-11-20',1,null])).toEqual(['2026-11-20']);
  expect(dailyStreak(['2026-11-18','2026-11-19'],new Date('2026-11-20T12:00:00'))).toBe(2);
  expect(dailyStreak(['2026-11-18'],new Date('2026-11-20T12:00:00'))).toBe(0);
  expect(loadProgress({getItem:()=>{throw Error('denied');}})).toEqual({highScore:0,history:[],available:false});
  expect(loadProgress({getItem:()=>'{broken'})).toEqual({highScore:0,history:[],available:true});
  expect(saveProgress({setItem:()=>{throw Error('full');}},10,[])).toBe(false);
});
test('actual game locks duplicate answers, keeps feedback until Next and resets cleanly', () => {
  jest.spyOn(Math,'random').mockReturnValue(0);
  render(<ColourGame />);
  const target=screen.getByRole('button',{name:'indianred'});
  fireEvent.click(target); fireEvent.click(target);
  expect(localStorage.getItem('dailycsscolor-highscore')).toBe('10');
  expect(screen.getByRole('button',{name:'Next colour'})).toBe(document.activeElement);
  expect(target).toHaveProperty('disabled',true);
  fireEvent.click(screen.getByRole('button',{name:'Medium'}));
  expect(screen.queryByRole('button',{name:'Next colour'})).toBeNull();
  expect(screen.getAllByRole('button').filter(b=>(b as HTMLButtonElement).disabled)).toHaveLength(0);
  expect(localStorage.getItem('dailycsscolor-play-history')).toBe(JSON.stringify([dateKey(new Date())]));
});
test('hard mode uses a labelled form and ignores blank submissions', () => {
  render(<ColourGame />); fireEvent.click(screen.getByRole('button',{name:'Hard'}));
  const input=screen.getByLabelText('CSS colour name');
  fireEvent.submit(input.closest('form')!); expect(screen.queryByRole('button',{name:'Next colour'})).toBeNull();
  fireEvent.change(input,{target:{value:'notacolour'}}); fireEvent.submit(input.closest('form')!);
  expect(screen.getByRole('status').textContent).toContain('Not quite');
});
test('actual play survives blocked persistence', () => {
  jest.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw Error('denied');});
  jest.spyOn(Math,'random').mockReturnValue(0);
  render(<ColourGame />); fireEvent.click(screen.getByRole('button',{name:'indianred'}));
  expect(screen.getByText(/Scores are available for this visit only/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'Next colour'}));
  expect(screen.queryByRole('button',{name:'Next colour'})).toBeNull();
});
test('Gauntlet results focus the retry control and keep practice best separate', () => {
  jest.spyOn(Math,'random').mockReturnValue(0);
  render(<ColourGame />);
  fireEvent.click(screen.getByRole('button',{name:'Gauntlet'}));
  fireEvent.click(screen.getByRole('button',{name:'salmon'}));
  fireEvent.click(screen.getByRole('button',{name:'See results'}));
  expect(screen.getByRole('button',{name:'Try again'})).toBe(document.activeElement);
  expect(screen.getByText('0 Easy, 0 Medium and 0 Hard correct. Final score: 0.')).toBeTruthy();
});

test('site theme follows system when storage is denied and respects saved light preference', () => {
  const media = {matches:true,addEventListener:jest.fn(),removeEventListener:jest.fn()};
  Object.defineProperty(window,'matchMedia',{configurable:true,value:jest.fn(()=>media)});
  const get=jest.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw Error('denied');});
  const view=render(<ThemeProvider/>);
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(document.documentElement.style.colorScheme).toBe('dark');
  view.unmount(); expect(media.removeEventListener).toHaveBeenCalled();
  get.mockReturnValue('light'); render(<ThemeProvider/>);
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  expect(document.documentElement.style.colorScheme).toBe('light');
});

test('share helpers carry the real score, never a placeholder', () => {
  expect(shareText(120)).toBe('My practice best in The Colour Game is 120, naming 12 CSS colours in a row. Can you beat it? #dailycsscolor');
  expect(shareText(10)).toContain('naming 1 CSS colour in a row');
  const intent = new URL(shareIntentUrl(120, 'https://thecolorgame.uk'));
  expect(intent.origin + intent.pathname).toBe('https://x.com/intent/tweet');
  expect(intent.searchParams.get('text')).toContain('120');
  expect(intent.searchParams.get('text')).not.toContain('[SCORE]');
  expect(intent.searchParams.get('url')).toBe('https://thecolorgame.uk/score/120');
  expect(scoreImagePath(120)).toBe('/api/og/highscore?score=120&streak=12');
  expect(cleanScore('120')).toBe(120); expect(cleanScore('-1')).toBeNull(); expect(cleanScore('1e3')).toBeNull(); expect(cleanScore('9999999')).toBeNull();
  expect(resetHighScore({setItem:()=>{throw Error('denied');}})).toBe(false);
});
test('share uses the Web Share API with the score page, falling back to an X intent', async () => {
  jest.spyOn(Math,'random').mockReturnValue(0);
  const share = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator,'share',{configurable:true,value:share});
  const open = jest.spyOn(window,'open').mockImplementation(()=>null);
  render(<ColourGame />); fireEvent.click(screen.getByRole('button',{name:'indianred'}));
  await act(async () => { fireEvent.click(screen.getByRole('button',{name:'Share practice best'})); });
  expect(share).toHaveBeenCalledWith({title:'The Colour Game',text:shareText(10),url:`${window.location.origin}/score/10`});
  expect(open).not.toHaveBeenCalled();
  share.mockRejectedValueOnce(Object.assign(new Error('cancelled'),{name:'AbortError'}));
  await act(async () => { fireEvent.click(screen.getByRole('button',{name:'Share practice best'})); });
  expect(open).not.toHaveBeenCalled();
  Object.defineProperty(navigator,'share',{configurable:true,value:undefined});
  await act(async () => { fireEvent.click(screen.getByRole('button',{name:'Share practice best'})); });
  expect(open).toHaveBeenCalledWith(shareIntentUrl(10, window.location.origin),'_blank','noopener,noreferrer');
});
test('reset asks inline before clearing the practice best and keeps play history', () => {
  jest.spyOn(Math,'random').mockReturnValue(0);
  render(<ColourGame />); fireEvent.click(screen.getByRole('button',{name:'indianred'}));
  fireEvent.click(screen.getByRole('button',{name:'Reset practice best'}));
  expect(screen.getByText(/Are you sure\?/)).toBeTruthy();
  expect(screen.getByRole('button',{name:'Cancel'})).toBe(document.activeElement);
  fireEvent.click(screen.getByRole('button',{name:'Cancel'}));
  expect(localStorage.getItem('dailycsscolor-highscore')).toBe('10');
  fireEvent.click(screen.getByRole('button',{name:'Reset practice best'}));
  fireEvent.click(screen.getByRole('button',{name:'Yes, reset'}));
  expect(localStorage.getItem('dailycsscolor-highscore')).toBe('0');
  expect(localStorage.getItem('dailycsscolor-play-history')).toBe(JSON.stringify([dateKey(new Date())]));
  expect(screen.queryByRole('button',{name:'Share practice best'})).toBeNull();
  expect(screen.getByText('Practice best reset to 0.')).toBeTruthy();
});
