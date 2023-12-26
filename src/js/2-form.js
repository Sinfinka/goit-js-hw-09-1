'use strict';

//знайшла функцію, що дозволяє записувати дані в localStorage із затримкою
const debounce = function (func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

//створила ключ для збереження в локалстор.
const FEEDBACK_STORAGE_KEY = 'feedback';
const form = document.querySelector('.feedback-form');

//отримала попередні дані з лок.стор. (якщо вони є).
//Огорнула код в трай, щоб уникнути помилок при парсингу.
try {
  const initialFormData = JSON.parse(
    localStorage.getItem(FEEDBACK_STORAGE_KEY)
  );

  //зробила масив з елементів форми (тому що був псевдомасив і не працював форіч)
  //тепер модна встановити данні з лок. сховища, якщо вони є.
  Array.from(form.elements).forEach(element => {
    const storageValue = initialFormData[element.name];
    if (storageValue) {
      element.value = storageValue;
    }
  });
} catch (error) {
  console.log('ERROR');
}

//створила функцію для запису даних з затримкою. Функція приймає 3 аргумента.
//func, wait, immediate(не вказувала, за замовчуванням цей аргумент undefined
//і функція буде виконуаатись з затримкою)
//Далі отримала дані з форми за допомогою FormData і зробила з них об'єкт.
//Цей об'єкт перевела в JSON і додала в локальне сховише.
const saveToLocalStorageDebounced = debounce(() => {
  const formData = new FormData(form);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(formObject));
}, 250);

//додала прслух. подій до інпутів і викликала функцію для затримки збереження.
form.addEventListener('input', () => {
  saveToLocalStorageDebounced();
});

//додала прослуховувач подій на подію сабміт. Відмінила дефолтну поведінку браузера,
//видалила збережені попередньо дані в лок. сховищі за ключем.
//Очистила форму.
form.addEventListener('submit', event => {
  event.preventDefault();
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);

  form.reset();
});
