// Get the params
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");
const status = urlParams.get("status");

//alpha
const card = document.querySelector(".card");
const statusIcon = document.querySelector("#statusIcon");
const statusMessage = document.querySelector("#statusMessage");
const btn = document.querySelector("#Btn ");
console.log(status);
if ((status = "success")) {
  statusIcon.innerHTML = "✔️✔️✔️";
  statusMessage.textContent = message;
  card.classList.add("success");
  statusIcon.classList.add("success");
  statusMessage.classList.add("success");
  btn.classList.add("showBtn");
} else if ((status = "error")) {
  statusIcon.innerHTML = "❌❌❌";
  statusMessage.textContent = message;
  card.classList.add("error");
  statusIcon.classList.add("error");
  statusMessage.classList.add("error");
  btn.classList.add("hideBtn");
} else {
  statusIcon.innerHTML = "❓";
  card.classList.add("notFound");
  statusIcon.classList.add("error");
  statusMessage.classList.add("error");
  btn.classList.add("showBtn");
}
