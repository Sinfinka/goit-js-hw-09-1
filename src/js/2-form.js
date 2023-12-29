'use strict';

const debounce = (func, wait, immediate) => {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

const FEEDBACK_STORAGE_KEY = 'feedback';
const form = document.querySelector('.feedback-form');

//отрим. об'єкту даних форми.
const getFormData = () => {
  const formData = new FormData(form);
  const formObject = {};

  formData.forEach((value, key) => {
    formObject[key] = value.trim(); //обрізка
  });

  return formObject;
};

try {
  const initialFormData =
    JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY)) || {};

  Array.from(form.elements).forEach(element => {
    const storageValue = initialFormData[element.name];

    if (storageValue !== undefined && storageValue !== null) {
      element.value = storageValue;
    }
  });
} catch (error) {
  console.log('ERROR');
}

const saveToLocalStorageDebounced = debounce(() => {
  const formObject = getFormData();
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(formObject));
}, 250);

form.addEventListener('input', () => {
  saveToLocalStorageDebounced();
});

form.addEventListener('submit', event => {
  event.preventDefault();

  const formObject = getFormData();
  const isFormValid = Object.values(formObject).every(value => value !== '');

  if (isFormValid) {
    console.log(formObject);
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
    form.reset();
  } else {
    alert('Заповніть всі поля форми');
  }
});
