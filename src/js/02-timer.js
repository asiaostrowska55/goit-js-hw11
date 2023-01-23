import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const jsStart = document.querySelector("[data-start]");
const dataDays = document.querySelector("[data-days]");
const dataHours = document.querySelector("[data-hours]");
const dataMinutes = document.querySelector("[data-minutes]");
const dataSeconds = document.querySelector("[data-seconds]");

jsStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= options.defaultDate.getTime()) {
      Notify.failure("Please choose a date in the future");
    } else {
      jsStart.disabled = false;
      console.log(selectedDates[0]);
    }
  },
};

const flatPkr = flatpickr("#datetime-picker", options);

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  dataDays.innerHTML = addLeadingZero(days);
  dataHours.innerHTML = addLeadingZero(hours);
  dataMinutes.innerHTML = addLeadingZero(minutes);
  dataSeconds.innerHTML = addLeadingZero(seconds);

  return { days, hours, minutes, seconds };
}

let timer = null;

function countTime() {
  timer = setInterval(() => {
    let timeDiff = flatPkr.selectedDates[0].getTime() - new Date().getTime();
    if (timeDiff > 0) {
      convertMs(timeDiff);
      jsStart.disabled = true;
    } else {
      clearInterval(timer);
      jsStart.disabled = false;
    }
  }, 1000);
}
jsStart.addEventListener("click", countTime);
