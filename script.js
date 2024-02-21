const text = document.querySelector('.text');
const regenerate = document.querySelector('.regenerate');
const copy = document.querySelector('.copy');
const copyText = document.querySelector('.copy-text');

regenerate.addEventListener('click', () => (location = location));

copy.addEventListener('click', () => {
  copyText.value = text.innerHTML;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  const copyIcon = '<i class="bi bi-clipboard"></i>';
  const copyIconCheck = '<i class="bi bi-clipboard-check"></i>';

  copy.innerHTML = `${copyIconCheck} copied`;
  copy.classList.add('no-click');

  setTimeout(() => {
    copyText.value = '';

    copy.innerHTML = `${copyIcon} copy`;
    copy.classList.remove('no-click');
  }, 1000);
});

(async () => {
  const signatures = await (await fetch('./signatures.txt')).text();
  const signatureArr = signatures.split('\n').map((signature) => signature.replace('\r', ''));
  let index = 0;

  while (true) {
    index = Math.floor(Math.random() * signatureArr.length);
    if (index != localStorage.getItem('index') && signatureArr[index] !== '') break;
  }

  localStorage.setItem('index', index);
  text.innerHTML = signatureArr[index];
})();
