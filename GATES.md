# Gates: Morphic Buttons Website Improvement

OWNS: index.html, blog.html, post.html, contact.html, resume.html, style.css

Scope: Add morphicons web component to improve website buttons with morphing icon animations on hover and interaction states.

- [x] G1: Morphicons library is available in node_modules
  CHECK: node -e "require('fs').accessSync('node_modules/morphicons/dist/element.js'); console.log('morphicons element module found')"
  EXPECT: morphicons element module found
  EVIDENCE: PASS - morphicons element module found

- [x] G2: All HTML pages import morphicons/element module
  CHECK: node -e "const fs=require('fs'); const files=['index.html','blog.html','post.html','contact.html','resume.html']; let pass=true; for(const f of files){const c=fs.readFileSync(f,'utf8'); if(!c.includes('morphicons/element')){console.error(f+' missing import'); pass=false;}} if(pass) console.log('all pages import morphicons/element');"
  EXPECT: all pages import morphicons/element
  EVIDENCE: PASS - all pages import morphicons/element

- [x] G3: defineMorphIcon is called in each HTML page
  CHECK: node -e "const fs=require('fs'); const files=['index.html','blog.html','post.html','contact.html','resume.html']; let pass=true; for(const f of files){const c=fs.readFileSync(f,'utf8'); if(!c.includes('defineMorphIcon')){console.error(f+' missing defineMorphIcon call'); pass=false;}} if(pass) console.log('all pages call defineMorphIcon');"
  EXPECT: all pages call defineMorphIcon
  EVIDENCE: PASS - all pages call defineMorphIcon

- [x] G4: At least one morph-icon element exists in index.html
  CHECK: node -e "const fs=require('fs'); const c=fs.readFileSync('index.html','utf8'); if(c.includes('<morph-icon')) console.log('morph-icon elements found in index.html'); else throw new Error('no morph-icon in index.html');"
  EXPECT: morph-icon elements found in index.html
  EVIDENCE: PASS - morph-icon elements found in index.html

- [x] G5: CSS styles exist for morphic buttons
  CHECK: node -e "const fs=require('fs'); const c=fs.readFileSync('style.css','utf8'); if(c.includes('morph-icon') || c.includes('.morphic-btn')) console.log('morphic button styles found'); else throw new Error('no morphic button styles');"
  EXPECT: morphic button styles found
  EVIDENCE: PASS - morphic button styles found

- [x] G6: Nav toggle morphing logic added to script.js
  CHECK: node -e "const fs=require('fs'); const c=fs.readFileSync('script.js','utf8'); if(c.includes('HAMBURGER_PATH') && c.includes('CLOSE_PATH') && c.includes('morphTo')) console.log('morph toggle logic in script.js'); else throw new Error('no morph toggle logic');"
  EXPECT: morph toggle logic in script.js
  EVIDENCE: PASS - morph toggle logic in script.js

- [ ] G7: Manual verification - morph animations work correctly in browser
  EVIDENCE: pending - requires manual browser testing
