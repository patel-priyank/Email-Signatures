const body = document.querySelector('.body');
const signature = document.querySelector('.signature');
const nameEl = document.querySelector('.name');
const copy = document.querySelector('.copy');
const regenerate = document.querySelector('.new');
const keys = document.querySelectorAll('.key');

const DEFAULT_NAME = 'Your Name';
const INDEX_KEY = 'email-index';
const NAME_KEY = 'email-name';

let signatures = [];

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
};

const fade = (el, i) => {
  el.classList.remove('fade');
  void el.offsetWidth; // restart animation
  el.style.setProperty('--i', i);
  el.classList.add('fade');
};

const buildLine = (wordCount, width) => {
  const line = document.createElement('div');
  line.style.width = `${width}%`;

  for (let i = 0; i < wordCount; i++) {
    const word = document.createElement('span');
    word.className = 'word';
    word.style.flexGrow = random(2, 9);
    line.append(word);
  }

  return line;
};

// fixed layout so the card height never changes between signatures
const PARAGRAPHS = [3, 2];

let paragraphs = [];

const buildSpacer = () => {
  const spacer = document.createElement('div');
  spacer.className = 'line spacer';
  return spacer;
};

const buildBody = () => {
  const lines = [buildLine(1, 14), buildSpacer()];
  paragraphs = [];

  PARAGRAPHS.forEach((lineCount, p) => {
    const paragraph = [];
    for (let l = 0; l < lineCount; l++) {
      const last = l === lineCount - 1;
      paragraph.push(last ? buildLine(random(2, 4), random(30, 60)) : buildLine(random(6, 8), random(92, 100)));
    }
    paragraph.forEach(line => line.classList.add('line'));

    // the spacer before a paragraph is dropped with it
    if (p > 0) paragraph.unshift(lines.at(-1));
    paragraphs.push(paragraph);

    lines.push(...paragraph.slice(p > 0 ? 1 : 0));
    if (p < PARAGRAPHS.length - 1) lines.push(buildSpacer());
  });

  lines[0].classList.add('line');
  body.replaceChildren(...lines);
  return lines;
};

// when the signature wraps, hide bar lines to give that height back
const fit = () => {
  const lines = [...body.children];
  lines.forEach(line => (line.hidden = false));
  body.style.height = '';

  const row = lines[0].getBoundingClientRect().height;
  const lineHeight = parseFloat(getComputedStyle(signature).lineHeight);
  const extra = (Math.round(signature.getBoundingClientRect().height / lineHeight) - 1) * lineHeight;
  body.style.height = `${lines.length * row - extra}px`;

  let rowsToFree = Math.ceil(extra / row);
  const visible = p => p.filter(line => !line.hidden && !line.classList.contains('spacer'));

  while (rowsToFree > 0) {
    const longest = paragraphs.reduce((a, b) => (visible(b).length > visible(a).length ? b : a));
    const full = visible(longest);

    if (full.length > 1) {
      // drop a full-width line, keeping the short closing line
      full.at(-2).hidden = true;
      rowsToFree -= 1;
    } else {
      const droppable = paragraphs.findLast((p, i) => i > 0 && visible(p).length);
      if (!droppable) break;
      droppable.forEach(line => (line.hidden = true));
      rowsToFree -= droppable.length;
    }
  }
};

const pickSignature = () => {
  const last = Number(storage.get(INDEX_KEY));
  let index;

  do {
    index = random(0, signatures.length - 1);
  } while (signatures.length > 1 && index === last);

  storage.set(INDEX_KEY, index);
  return signatures[index];
};

const render = () => {
  const lines = buildBody();
  signature.textContent = `${pickSignature()},`;
  fit();

  [...lines.filter(line => !line.hidden), signature, nameEl].forEach((el, i) => fade(el, i));
};

const setName = value => {
  const trimmed = value.trim();
  nameEl.textContent = trimmed || DEFAULT_NAME;
  storage.set(NAME_KEY, trimmed);
};

nameEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === 'Escape') {
    e.preventDefault();
    nameEl.blur();
  }
});

// select everything so typing replaces the name; deferred so the click's caret doesn't undo it
nameEl.addEventListener('focus', () => {
  requestAnimationFrame(() => {
    const range = document.createRange();
    range.selectNodeContents(nameEl);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
  });
});

nameEl.addEventListener('blur', () => setName(nameEl.textContent));

copy.addEventListener('click', async () => {
  const text = signature.textContent.replace(/,$/, '');
  if (!text) return;

  await navigator.clipboard.writeText(text);

  const icon = copy.querySelector('i');
  const label = copy.querySelector('.label');

  icon.className = 'ph ph-check';
  label.textContent = 'copied';
  copy.classList.add('busy');

  setTimeout(() => {
    icon.className = 'ph ph-copy';
    label.textContent = 'copy';
    copy.classList.remove('busy');
  }, 1200);
});

regenerate.addEventListener('click', render);

window.addEventListener('resize', () => signatures.length && fit());

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
  if (document.activeElement === nameEl) return;

  const key = [...keys].find(k => k.dataset.shortcut === e.key.toLowerCase());
  if (!key) return;

  e.preventDefault();
  key.classList.add('pressed');
  setTimeout(() => key.classList.remove('pressed'), 140);
  key.click();
});

(async () => {
  nameEl.textContent = storage.get(NAME_KEY) || DEFAULT_NAME;

  try {
    const text = await (await fetch('./signatures.txt')).text();
    signatures = text
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    // wrapping must be measured with the real font
    await document.fonts.ready;
    render();
  } finally {
    // reveal only once everything is in place, so the layout doesn't jump
    document.querySelector('.container').classList.remove('loading');
  }
})();
