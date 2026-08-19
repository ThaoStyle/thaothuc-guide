const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

const newCSS = `
/* MAP SEARCH DROPDOWN NEW UI */
.sd-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: 0.2s; }
.sd-item:active { background: #f8fafc; }
.sd-item:last-child { border-bottom: none; }
.sd-icon { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: var(--sl); flex-shrink:0; }
.sd-icon.history { color: #d97706; background: #fef3c7; }
.sd-icon svg { width: 16px; height: 16px; stroke-width: 2.5; }
.sd-text { font-size: 14px; font-weight: 600; color: var(--nv); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sd-sub { font-size: 11px; font-weight: 500; color: var(--sl); margin-top:2px; }

/* SHEET FILTERS (MAP) */
.sheet-filters { display: flex; gap: 8px; padding: 0 20px 16px 20px; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 10px; }
.s-filter-btn { padding: 8px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #f1f5f9; color: var(--sl); border: 1px solid transparent; display: flex; align-items: center; gap: 6px; white-space: nowrap; cursor: pointer; transition: 0.2s; }
.s-filter-btn svg { width: 14px; height: 14px; stroke-width: 2.5; }
.s-filter-btn.active { background: linear-gradient(135deg,#FF7043,#E64A19); color: white; box-shadow: 0 4px 12px rgba(255,112,67,0.3); }

/* HEART BUTTON (FAVORITE) */
.heart-btn { position: absolute; right: 12px; top: 12px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; color: #94a3b8; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 10; }
.heart-btn:active { transform: scale(0.85); }
.heart-btn svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.5; transition: 0.2s; }
.heart-btn.liked { color: #ef4444; }
.heart-btn.liked svg { fill: currentColor; }
`;

if (!css.includes('.sd-item')) {
  fs.writeFileSync('src/style.css', css + newCSS, 'utf8');
  console.log('CSS updated');
} else {
  console.log('CSS already updated');
}
