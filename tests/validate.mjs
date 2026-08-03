import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const files=readdirSync(root).filter(name=>name.endsWith('.html'));
for(const file of files){
  const html=readFileSync(new URL(file,root),'utf8');
  if(file==='googlef5a12d8d56cf3d00.html')continue;
  assert.match(html,/<!doctype html>/i,`${file}: doctype`);
  assert.match(html,/<html[^>]+lang="en"/i,`${file}: language`);
  assert.equal((html.match(/<h1(?:\s|>)/gi)||[]).length,1,`${file}: exactly one H1`);
  if(file!=='404.html'){
    assert.equal((html.match(/rel="canonical"/gi)||[]).length,1,`${file}: one canonical`);
    assert.match(html,/<meta name="description"/i,`${file}: description`);
    assert.match(html,/<meta name="viewport"/i,`${file}: viewport`);
  }
  for(const match of html.matchAll(/href="(\/[^"?#]+)(?:[?#][^"]*)?"/g)){
    let path=match[1];
    if(path==='/'||path.endsWith('.ico'))continue;
    const local=path.startsWith('/assets/')?path.slice(1):path.slice(1);
    assert.ok(existsSync(new URL(local,root)),`${file}: broken link ${path}`);
  }
}

const sitemap=readFileSync(new URL('sitemap.xml',root),'utf8');
for(const loc of sitemap.matchAll(/<loc>https:\/\/colorpickerhexcode\.com(\/[^<]*)<\/loc>/g)){
  const path=loc[1]==='/'?'index.html':loc[1].slice(1);
  assert.ok(existsSync(new URL(path,root)),`sitemap: missing ${path}`);
}
for(const required of ['rgb-to-hex.html','hex-to-rgb.html','hsl-color-picker.html','image-color-picker.html'])assert.ok(sitemap.includes(required),`sitemap: ${required}`);

const context={window:{}};
vm.runInNewContext(readFileSync(new URL('assets/common.js',root),'utf8'),context);
const c=context.window.ColorTools;
assert.equal(c.rgbToHex(0,0,0),'#000000');
assert.equal(c.rgbToHex(255,255,255),'#FFFFFF');
assert.equal(c.rgbToHex(255,87,51),'#FF5733');
assert.deepEqual({...c.hexToRgb('#F53')},{r:255,g:85,b:51,hex:'#FF5533'});
assert.deepEqual({...c.hexToRgb('000000')},{r:0,g:0,b:0,hex:'#000000'});
assert.equal(c.hexToRgb('#GGGGGG'),null);
assert.deepEqual({...c.hslToRgb(0,100,50)},{r:255,g:0,b:0});
assert.deepEqual({...c.hslToRgb(120,100,25)},{r:0,g:128,b:0});
assert.deepEqual({...c.hslToRgb(240,100,50)},{r:0,g:0,b:255});
console.log(`Validated ${files.length} HTML files, internal links, sitemap, and color conversions.`);
