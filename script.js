lucide.createIcons();

const header = document.querySelector("header");
const main = document.querySelector("main");
const btnChangeLanguage = document.getElementById("btnLanguage");
const dropdowns = document.querySelectorAll(".dropdown");
const btnChangeCurrency = document.getElementById("arrow-converse");
const api_key = "2138c66c539a1869cab68019";
const btnConversion = document.getElementById("btn-conversion");
const btnCopy = document.querySelectorAll(".icon-copy");

function resetInputs() {
  const inputs = document.querySelectorAll("input");
  inputs[1].disabled = false;
  inputs[1].value = "";
  inputs[0].value = "";
  inputs[1].disabled = true;
}

resetInputs();

btnChangeLanguage.addEventListener("click", () => {
  const titlePage = document.querySelector("h1");
  const iconFlag = document.getElementById("flags");
  const footer = document.getElementById("made-with");
  const mainExchange = document.querySelector("h2");
  const currencyH3 = document.querySelectorAll(".currency h3");
  const optionsToTranslate = document.querySelectorAll(".options li");
  const spanToTranslate = document.querySelectorAll(".selected-currency");

  if (header.dataset.language === "pt" && main.dataset.language === "pt") {
    iconFlag.setAttribute("src", "./assets/icons8-brasil-50.png");

    titlePage.innerText = "Currency converter";
    mainExchange.innerText = "Main exchange rates";
    footer.innerText = "Made with 💜 by";

    currencyH3[1].innerText = "Dollar ($)";
    currencyH3[2].innerText = "Pound (£)";
    currencyH3[3].innerText = "Yen (¥)";

    spanToTranslate[0].innerText = "USD - Dollar";
    optionsToTranslate[1].innerText = "USD - Dollar";
    optionsToTranslate[3].innerText = "GBP - Pound";
    optionsToTranslate[4].innerText = "JPY - Yen";

    header.dataset.language = "eua";
    main.dataset.language = "eua";
  } else {
    iconFlag.setAttribute("src", "./assets/icons8-eua-50.png");

    titlePage.innerText = "Conversor de moedas";
    mainExchange.innerText = "Principais câmbios";
    footer.innerText = "Feito com 💜 por";

    currencyH3[1].innerText = "Dolár ($)";
    currencyH3[2].innerText = "Libra (£)";
    currencyH3[3].innerText = "Iene (¥)";

    spanToTranslate[0].innerText = "USD - Dólar";
    optionsToTranslate[1].innerText = "USD - Dolár";
    optionsToTranslate[3].innerText = "GBP - Libra";
    optionsToTranslate[4].innerText = "JPY - Iene";

    header.dataset.language = "pt";
    main.dataset.language = "pt";
  }
});

dropdowns.forEach((dropdown) => {
  const select = dropdown.querySelector(".select");
  const currencySpans = dropdown.querySelectorAll("span");
  const chevron = dropdown.querySelector("#chevron");
  const menuOptions = dropdown.querySelector(".options");
  const menuItems = dropdown.querySelectorAll("li");
  const selectedCurrency = dropdown.querySelector(".selected-currency");

  select.addEventListener("click", () => {
    dropdowns.forEach((otherDropdown) => {
      if (otherDropdown !== dropdown) {
        otherDropdown.querySelector(".options").classList.remove("menu-open");
        otherDropdown
          .querySelector("#chevron")
          .classList.remove("chevron-rotate");
        otherDropdown
          .querySelector(".select")
          .classList.remove("select-clicked");
      }
    });

    chevron.classList.toggle("chevron-rotate");
    menuOptions.classList.toggle("menu-open");
    select.classList.toggle("select-clicked");

    menuItems.forEach((option) => {
      option.addEventListener("click", () => {
        selectedCurrency.innerText = option.innerText;
        currencySpans[1].dataset.currency = option.dataset.currency;
        select.classList.remove("select-clicked");
        menuOptions.classList.remove("menu-open");
        chevron.classList.remove("chevron-rotate");
        resetInputs();

        menuItems.forEach((option) => {
          option.classList.remove("active");
        });

        option.classList.add("active");
      });
    });
  });
});

btnChangeCurrency.addEventListener("click", () => {
  const fromCurrencyInput = document.getElementById("from-currency");
  const toCurrencyInput = document.getElementById("to-currency");

  const firstInputValue = fromCurrencyInput.innerText;

  fromCurrencyInput.innerText = toCurrencyInput.innerText;
  toCurrencyInput.innerText = firstInputValue;

  const firstInputDataset = fromCurrencyInput.dataset.currency;
  console.log(firstInputDataset);

  fromCurrencyInput.dataset.currency = toCurrencyInput.dataset.currency;
  toCurrencyInput.dataset.currency = firstInputDataset;

  resetInputs();
});

btnConversion.addEventListener("click", () => {
  const select = document.querySelectorAll("span");
  const inputConversion = document.getElementById("input-conversion").value;
  const convertedInput = document.getElementById("converted-input");

  let fromCurrency = select[1].dataset.currency;
  let toCurrency = select[3].dataset.currency;

  const api = `https://v6.exchangerate-api.com/v6/${api_key}/latest/${fromCurrency}`;

  if (inputConversion.length != 0) {
    fetch(api)
      .then((resp) => resp.json())
      .then((data) => {
        let fromExchangeRate = data.conversion_rates[fromCurrency];
        let toExchangeRate = data.conversion_rates[toCurrency];

        const convertedResult =
          (inputConversion / fromExchangeRate) * toExchangeRate;
        console.log(convertedResult);
        const currencyFormated = convertedResult.toLocaleString("pt-BR", {
          style: "currency",
          currency: toCurrency,
        });

        convertedInput.disabled = false;
        convertedInput.value = `${currencyFormated}`;
        convertedInput.disabled = true;

        fromCurrency = "";
        toExchangeRate = "";
      });
  } else {
    btnConversion.innerText = "Digite um valor!";
    btnConversion.classList.add("shake");

    setTimeout(() => {
      btnConversion.innerText = "Converter";
      btnConversion.classList.remove("shake");
    }, 1300);
  }
});

btnCopy[1].addEventListener("click", () => {
  const convertedInputValue = document.getElementById("converted-input").value;

  navigator.clipboard.writeText(convertedInputValue);

  btnCopy[1].classList.add("icon-copy-disabled");
  btnCopy[0].classList.remove("icon-copy-disabled");
  btnCopy[0].classList.add("pulse");

  setTimeout(() => {
    btnCopy[0].classList.add("icon-copy-disabled");
    btnCopy[1].classList.remove("icon-copy-disabled");
    btnCopy[0].classList.remove("pulse");
  }, 2500);
});
