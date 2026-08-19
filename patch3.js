const fs = require('fs');

let css = fs.readFileSync('frontend/src/style.css', 'utf8');

const newCss = `
/* --- RECIPE DYNAMIC SCALING CSS --- */
.rcp-stepper {
  display: flex; align-items: center; background: #fff;
  border: 1.5px solid rgba(15,23,42,0.1); border-radius: 999px;
  padding: 3px; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}
.rcp-stepper button {
  width: 26px; height: 26px; border-radius: 50%; border: none;
  background: var(--or-light); color: var(--or); font-size: 16px; font-weight: 900;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: transform 0.1s, background 0.1s;
}
.rcp-stepper button:active { transform: scale(0.9); background: var(--or); color: #fff; }
.rcp-stepper span { font-size: 13px; font-weight: 800; color: var(--nv); min-width: 58px; text-align: center; }

.rcp-ingred-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--nv); font-weight: 600; margin-bottom: 12px; cursor: pointer;}
.rcp-ingred-item input { margin-top: 2px; accent-color: var(--or); width: 16px; height: 16px; flex-shrink: 0; }
.rcp-ingred-name { flex: 1; line-height: 1.4; }
.ing-qty { font-weight: 800; color: var(--or); transition: color 0.3s ease; }
.changed { animation: flashOrange 0.6s ease-out; }
@keyframes flashOrange { 0% { color: var(--nv); transform: scale(1.1); } 100% { color: var(--or); transform: scale(1); } }
/* ---------------------------------- */
`;

if (!css.includes('.rcp-stepper')) {
    css += newCss;
    fs.writeFileSync('frontend/src/style.css', css, 'utf8');
    console.log('Patched frontend/src/style.css');
}
