import { Notify } from "notiflix/build/notiflix-notify-aio";

const firstDelay = document.querySelector('input[name="delay"]');
const delayStep = document.querySelector('input[ name="step"]');
const amount = document.querySelector('input[name="amount"]');

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    if (shouldResolve) {
      setTimeout(() => resolve({ position, delay }));
    } else {
      setTimeout(() => reject({ position, delay }));
    }
  });
}

const form = document.querySelector(".form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  for (let i = 1; i < amount.value; i++) {
    setTimeout(() => {
      let time = parseInt(delayStep.value) * i;
      createPromise(i, time + parseInt(firstDelay.value))
        .then(({ position, delay }) => {
          Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        })
        .catch(({ position, delay }) => {
          Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
        });
    }, parseInt(delayStep.value) * i);
  }
});
