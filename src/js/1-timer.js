import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import icon from '../img/icon.svg';
const refs = {
  startBTN: document.querySelector('button'),
  input: document.getElementById('datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

// adding styles
refs.startBTN.classList.add('btn-start');

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

const today = new Date();

const timer = {
  options: {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      userSelectedDate = selectedDates[0];

      console.log(userSelectedDate);

      if (userSelectedDate < today) {
        iziToast.error({
          close: false,
          icon: false,
          // iconUrl: icon,
          messageColor: '#fff',
          backgroundColor: '#ef4040',
          position: 'topRight',
          message: ' Please choose a date in the future',
        });
        refs.startBTN.disabled = true;
      } else {
        refs.startBTN.disabled = false;
      }
    },
  },
  // setTimer function
  timerStart() {
    if (!userSelectedDate) return;

    this.intervalId = setInterval(() => {
      const diff = userSelectedDate - Date.now();

      if (diff <= 0) {
        this.stop();

        return;
      }

      let { days, hours, minutes, seconds } = convertMs(diff);

      refs.days.textContent = this.padStart(days);
      refs.hours.textContent = this.padStart(hours);
      refs.minutes.textContent = this.padStart(minutes);
      refs.seconds.textContent = this.padStart(seconds);
    }, 1000);
  },
  // stop the timer
  stop() {
    clearInterval(this.intervalId);
  },
  // correcting the length of the values
  padStart(value) {
    return String(value).padStart(2, '0');
  },
};

// event listeners
const fp = flatpickr(refs.input, timer.options);
refs.startBTN.addEventListener('click', timer.timerStart.bind(timer));
