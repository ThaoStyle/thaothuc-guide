const fs = require('fs');

// 1. UPDATE CSS
let css = fs.readFileSync('src/style.css', 'utf8');
const cssToRemoveRegex = /\.hf-body\{[\s\S]*?\.hf-btn:active\{[^}]*\}/;

const newCss = `.hf-body { padding: 18px; display: flex; flex-direction: column; flex: 1; }
.hf-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
.hf-title { font-size: 18px; font-weight: 800; color: var(--nv); line-height: 1.3; font-family: Inter, sans-serif; flex: 1; }
.hf-price-pill { background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 800; padding: 5px 10px; border-radius: 10px; white-space: nowrap; margin-top: 2px; }
.hf-meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; color: var(--sl); margin-bottom: 12px; font-weight: 500; }
.hf-meta-row svg { width: 14px; height: 14px; }
.hf-rating { color: var(--or); font-weight: 700; display: flex; align-items: center; gap: 4px; }
.hf-cat { display: flex; align-items: center; gap: 4px; }
.hf-dot { color: #cbd5e1; font-size: 10px; }
.hf-rm-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.hf-rm-item { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #475569; background: #f1f5f9; padding: 4px 10px; border-radius: 8px; }
.hf-rm-item svg { width: 14px; height: 14px; color: var(--nv); }
.hf-must-try { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; color: var(--nv); font-style: italic; margin-bottom: 16px; flex: 1; line-height: 1.4; }
.hf-must-try svg { color: #ea580c; flex-shrink: 0; width: 16px; height: 16px; margin-top: 1px; }
.hf-must-try span { font-weight: 700; color: #ea580c; font-style: normal; }
.hf-btn { background: linear-gradient(135deg, rgba(255, 112, 67, 0.15), rgba(230, 74, 25, 0.1)); color: #FF7043; border-radius: 14px; padding: 12px; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; border: none; width: 100%; margin-top: auto; transition: all .2s; }
.hf-btn:active { background: #FF7043; color: white; }`;

if (cssToRemoveRegex.test(css)) {
  css = css.replace(cssToRemoveRegex, newCss);
  fs.writeFileSync('src/style.css', css);
  console.log('CSS updated');
} else {
  console.log('CSS block not found');
}
