const text = document.querySelector('.text');
const theme = document.querySelector('.theme');

theme.addEventListener('click', () => {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('data-theme', 'dark');
  }
});

if (localStorage.getItem('data-theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

(async () => {
  const signature = await (await fetch('./signatures.txt')).text();
  const signatures = signature.split('\n');
  let index = 0;
  while (true) {
    index = Math.floor(Math.random() * signatures.length);
    if (index != localStorage.getItem('index')) break;
  }
  localStorage.setItem('index', index);
  text.innerHTML = signatures[index];
})();
