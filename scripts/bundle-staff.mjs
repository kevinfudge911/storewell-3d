import fs from 'node:fs';
import { build } from 'esbuild';
const root=new URL('../',import.meta.url);
const index=new URL('public/index.html',root);
let html=fs.readFileSync(index,'utf8');
const inline=html.match(/<script type="module">([\s\S]*?)<\/script>/);
if(inline){
  const source=inline[1].replaceAll('https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js','firebase/app').replaceAll('https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js','firebase/database').replaceAll('https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js','firebase/auth');
  fs.mkdirSync(new URL('src/',root),{recursive:true});
  fs.writeFileSync(new URL('src/staff.js',root),source);
  fs.writeFileSync(index,html.replace(inline[0],'<script src="/staff.bundle.js" defer></script>'));
}
await build({entryPoints:[new URL('src/staff.js',root).pathname],bundle:true,format:'iife',target:'es2020',minify:true,legalComments:'eof',outfile:new URL('public/staff.bundle.js',root).pathname});
console.log('Staff login, reports and Firebase bundled locally.');
