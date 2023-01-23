const jsStart = document.querySelector("[data-start]");
const jsStop = document.querySelector("[data-stop]");
const body = document.querySelector("body");

jsStop.disabled = true;

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

jsStart.addEventListener("click", () => {
  jsStart.disabled = true;
  jsStop.disabled = false;
  timerID = setInterval(() => {
    body.style.backgroundColor = `${getRandomHexColor()}`;
  }, 1000);
});

let timerID;
jsStop.addEventListener("click", () => {
  jsStart.disabled = false;
  jsStop.disabled = true;
  clearInterval(timerID);
});
