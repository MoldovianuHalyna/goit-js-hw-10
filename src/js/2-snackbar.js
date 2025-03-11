import iziToast from 'izitoast';
import icon from '../img/icon.svg';
import iconSuccess from '../img/icon-succes.svg';

const refs = {
  form: document.querySelector('.form'),
  delayInput: document.querySelector('.user-input'),
  stateRadioBtns: document.querySelectorAll('input[name="state"]'),
};

const handleFormSubmit = function (e) {
  e.preventDefault();
  const delay = parseInt(refs.delayInput.value);

  let selectedState = '';
  refs.stateRadioBtns.forEach(btn => {
    if (btn.checked) {
      selectedState = btn.value;
    }
  });
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedState === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
  promise
    .then(resolvedDelay => {
      iziToast.success({
        close: false,
        iconUrl: iconSuccess,
        messageColor: '#fff',
        backgroundColor: '#59a10d',
        position: 'topRight',
        message: `Fulfilled promise in ${delay}ms`,
        timeout: 10000,
      });
    })
    .catch(rejectedDelay => {
      iziToast.error({
        message: ` Rejected promise in ${delay}ms`,
        close: false,
        iconUrl: icon,
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        timeout: 10000,
      });
    });
  e.target.reset();
};

refs.form.addEventListener('submit', handleFormSubmit);
