const fs = require('fs');

// 1. UPDATE CSS
let css = fs.readFileSync('src/style.css', 'utf8');

const cssToRemoveRegex = /\.hf-body\s*\{[\s\S]*?\.hf-btn:active\s*\{[^}]*\}/;

const newCss = `.hf-body { padding: 18px; display: flex; flex-direction: column; flex: 1; }
.hf-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
.hf-title { font-size: 19px; font-weight: 800; color: var(--nv); line-height: 1.3; font-family: Inter, sans-serif; flex: 1; }
.hf-price-float { position: absolute; bottom: 12px; right: 12px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); color: #059669; font-size: 12px; font-weight: 800; padding: 6px 12px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.hf-meta-row { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--sl); margin-bottom: 14px; font-weight: 500; }
.hf-meta-row svg { width: 14px; height: 14px; }
.hf-rating { background: rgba(230, 74, 25, 0.12); color: #E64A19; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 10px; margin-left: -8px; }
.hf-rating img { height: 16px; object-fit: contain; }
.hf-cat { display: flex; align-items: center; gap: 6px; }
.hf-rm-row { display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 12px; flex-wrap: nowrap; }
.hf-rm-item { display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; color: #475569; background: #f1f5f9; padding: 4px 6px; border-radius: 8px; white-space: nowrap; flex: 1; justify-content: center; }
.hf-rm-item svg { width: 13px; height: 13px; color: var(--nv); flex-shrink: 0; }
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
