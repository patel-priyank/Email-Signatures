const text = document.querySelector('.text');
const copy = document.querySelector('.copy');
const copyText = document.querySelector('.copy-text');

copy.addEventListener('click', () => {
  copyText.value = text.innerHTML;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  copy.innerHTML = '[copied]';
  copy.classList.add('no-click');

  setTimeout(() => {
    copyText.value = '';

    copy.innerHTML = '[copy]';
    copy.classList.remove('no-click');
  }, 1000);
});

(async () => {
  const signature = await (await fetch('./signatures.txt')).text();
  const signatures = signature.split('\n').map((signature) => signature.replace('\r', ''));
  let index = 0;
  while (true) {
    index = Math.floor(Math.random() * signatures.length);
    if (index != localStorage.getItem('index') && signatures[index] !== '') break;
  }
  localStorage.setItem('index', index);
  text.innerHTML = signatures[index];
})();
