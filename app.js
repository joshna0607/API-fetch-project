const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;
    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;
    select.append(option);
  }
  select.addEventListener("change", e => updateFlag(e.target));
}

// update flag icon
const updateFlag = element => {
  const countryCode = countryList[element.value];
  element.parentElement.querySelector("img").src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

const updateExchangeRate = async () => {
  const input = document.querySelector(".amount input");
  let amt = parseFloat(input.value);
  if (isNaN(amt) || amt <= 0) {
    amt = 1;
    input.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  const url = `${BASE_URL}/${from}.json`;
  console.log("Fetching:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data[from] || data[from][to] === undefined) {
      throw new Error("Rate not found");
    }

    const rate = data[from][to];
    const final = (amt * rate).toFixed(2);
    msg.innerText = `${amt} ${fromCurr.value} = ${final} ${toCurr.value}`;
  } catch (e) {
    console.error("Fetch error:", e);
    msg.innerText = "⚠️ Couldn’t fetch rate. Try again.";
  }
};

btn.addEventListener("click", e => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
  updateFlag(fromCurr);
  updateFlag(toCurr);
});
