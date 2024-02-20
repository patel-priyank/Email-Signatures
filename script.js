const text = document.querySelector('.text');
const name = document.querySelector('.name');
const editName = document.querySelector('.edit-name');

editName.addEventListener('click', () => {
  let newName = prompt('Enter new name', name.innerHTML);
  if (newName === '') {
    newName = 'Elon Musk';
  }
  name.innerHTML = newName;
  localStorage.setItem('name', newName);
});

(async () => {
  let setName = localStorage.getItem('name');
  if (setName) {
    name.innerHTML = setName;
  }
})();

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
