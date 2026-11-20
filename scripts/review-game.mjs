// Local client-only review: no Next routes, email, analytics, date-reference or database modules.
import { build } from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
const root = process.cwd();
const out = path.join(root, '.codex-artifacts/game-review');
await fs.mkdir(out, {recursive:true});
await build({stdin:{contents:`import React from 'react'; import {createRoot} from 'react-dom/client'; import Game from './src/components/ColourGame'; import Theme from './src/components/ThemeProvider'; createRoot(document.getElementById('app')).render(<><Theme/><Game/></>);`,resolveDir:root,loader:'tsx'},bundle:true,outfile:path.join(out,'game.js'),minify:true,define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'});
const css=await postcss([tailwind()]).process(await fs.readFile('src/app/globals.css','utf8'),{from:path.join(root,'src/app/globals.css')});
await fs.writeFile(path.join(out,'game.css'),css.css);
await fs.writeFile(path.join(out,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Colour Game local review</title><link rel="stylesheet" href="/game.css"></head><body class="bg-gray-50 dark:bg-neutral-950" style="padding:24px 16px"><main style="max-width:640px;margin:auto"><p style="font-size:12px;margin-bottom:24px">Local client-only review. Actual random game; email, analytics, date reference and server routes are excluded.</p><div id="app" class="bg-white dark:bg-neutral-900" style="padding:24px;border:1px solid #777;border-radius:24px"></div></main><script src="/game.js"></script></body></html>`);
http.createServer(async(req,res)=>{
 const file={'/':'index.html','/game.js':'game.js','/game.css':'game.css'}[req.url?.split('?')[0]];
 if(!file){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; base-uri 'none'; form-action 'none'");
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');
 res.end(await fs.readFile(path.join(out,file)));
}).listen(4830,'127.0.0.1',()=>console.log('Offline Colour Game review http://127.0.0.1:4830'));
