import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import icon from '../img/icon.svg';
const refs = {
  startBTN: document.querySelector('button[data-start]'),
  input: document.getElementById('datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

// adding styles
refs.startBTN.classList.add('btn-start');
refs.startBTN.disabled = true;

// function converter of milisesonds
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

///setting the calendar on the input
let userSelectedDate;

const timer = {
  options: {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const today = new Date();
      userSelectedDate = selectedDates[0];

      console.log(userSelectedDate);

      if (userSelectedDate < today) {
        iziToast.error({
          close: true,
          iconUrl: icon,
          messageColor: '#fff',
          backgroundColor: '#ef4040',
          position: 'topRight',
          message: ' Please choose a date in the future',
          timeout: 10000,
        });
        refs.startBTN.disabled = true;
        refs.input.disabled = false;
      } else {
        refs.startBTN.disabled = false;
      }
    },
  },
  // setTimer function
  timerStart() {
    if (!userSelectedDate) return;

    refs.startBTN.disabled = true;
    refs.input.disabled = true;

    this.intervalId = setInterval(() => {
      const diff = userSelectedDate - Date.now();

      if (diff <= 0) {
        this.stop();

        return;
      }

      let { days, hours, minutes, seconds } = convertMs(diff);

      refs.days.textContent = this.pad(days);
      refs.hours.textContent = this.pad(hours);
      refs.minutes.textContent = this.pad(minutes);
      refs.seconds.textContent = this.pad(seconds);
    }, 1000);
  },
  // stop the timer
  stop() {
    clearInterval(this.intervalId);
    refs.startBTN.disabled = true;
    refs.input.disabled = false;
    refs.input.value = '';
    refs.days.textContent = '00';
    refs.hours.textContent = '00';
    refs.minutes.textContent = '00';
    refs.seconds.textContent = '00';
  },
  // correcting the length of the values
  pad(value) {
    return String(value).padStart(2, '0');
  },
};

// event listeners
const fp = flatpickr(refs.input, timer.options);
refs.startBTN.addEventListener('click', timer.timerStart.bind(timer));
