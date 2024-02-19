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
  const random = Math.floor(Math.random() * signatures.length);
  text.innerHTML = signatures[random];
})();
