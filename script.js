const text = document.querySelector('.text');

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
