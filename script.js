lucide.createIcons();

const apiUrl = (apiKey, fromCurrency) => {
  return `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
};

const header = document.querySelector("header");
const main = document.querySelector("main");
const btnChangeLanguage = document.getElementById("btnLanguage");
const dropdowns = document.querySelectorAll(".dropdown");
const btnChangeCurrency = document.getElementById("arrow-converse");
const btnConversion = document.getElementById("btn-conversion");
const btnCopy = document.querySelectorAll(".icon-copy");

function initializeDocument() {
  const inputs = document.querySelectorAll("input");
  const currencyValue = document.querySelectorAll(".currency p");

  inputs[1].disabled = false;
  inputs[1].value = "";
  inputs[0].value = "";
  inputs[1].disabled = true;

  fetch("api.json")
    .then((response) => response.json())
    .then((data) => {
      function apiFetch(fromCurrency, positionElement) {
        const apiCurrency = apiUrl(data.apiKey, fromCurrency);

        fetch(apiCurrency)
          .then((response) => response.json())
          .then((data) => {
            const currencyConverted = data.conversion_rates["BRL"];
            const formattedValue = currencyConverted.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });

            currencyValue[positionElement].innerText = formattedValue;
          });
      }

      apiFetch("EUR", 0);
      apiFetch("USD", 1);
      apiFetch("GBP", 2);
      apiFetch("JPY", 3);
    });
}

initializeDocument();

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
        initializeDocument();

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

  initializeDocument();
});

btnConversion.addEventListener("click", () => {
  const select = document.querySelectorAll("span");
  const inputConversion = document.getElementById("input-conversion").value;
  const convertedInput = document.getElementById("converted-input");

  let fromCurrency = select[1].dataset.currency;
  let toCurrency = select[3].dataset.currency;

  fetch("api.json")
    .then((response) => response.json())
    .then((data) => {
      const apiKey = data.apiKey;
      const api = apiUrl(apiKey, fromCurrency);

      if (inputConversion.length != 0) {
        fetch(api)
          .then((resp) => resp.json())
          .then((data) => {
            let fromExchangeRate = data.conversion_rates[fromCurrency];
            let toExchangeRate = data.conversion_rates[toCurrency];

            const convertedResult =
              (inputConversion / fromExchangeRate) * toExchangeRate;

            const currencyFormatted = convertedResult.toLocaleString("pt-BR", {
              style: "currency",
              currency: toCurrency,
            });

            convertedInput.disabled = false;
            convertedInput.value = `${currencyFormatted}`;
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
    })
    .catch((error) => console.error("Erro ao carregar configuracao", error));
});

btnCopy[1].addEventListener("click", () => {
  const convertedInputValue = document.getElementById("converted-input").value;
  const toastNotification = document.getElementById("toastNotification");

  console.log(convertedInputValue);

  if(convertedInputValue.length !== 0){
    navigator.clipboard.writeText(convertedInputValue);

    btnCopy[1].classList.add("icon-copy-disabled");
    btnCopy[0].classList.remove("icon-copy-disabled");
    btnCopy[0].classList.add("pulse");

    toastNotification.classList.toggle("slideInRight");
    toastNotification.classList.add("toastNotification-enable");

    setTimeout(() => {
      btnCopy[0].classList.add("icon-copy-disabled");
      btnCopy[1].classList.remove("icon-copy-disabled");
      btnCopy[0].classList.remove("pulse");

      toastNotification.classList.remove("slideInRight");
      toastNotification.classList.remove("toastNotification-enable");
    }, 2500);
  } else {
    const spanToastNotification = toastNotification.querySelector("span");
    const iconToastNotification = toastNotification.querySelectorAll(".copy-notification");

    spanToastNotification.innerText = "Nenhum valor convertido!"

    iconToastNotification[0].classList.add("icon-copy-disabled")
    iconToastNotification[1].classList.remove("icon-copy-disabled")
    toastNotification.classList.toggle("slideInRight");
    toastNotification.classList.add("toastNotification-enable");

    setTimeout(() => {
      toastNotification.classList.remove("slideInRight");
      toastNotification.classList.remove("toastNotification-enable");
      
      iconToastNotification[0].classList.remove("icon-copy-disabled")
      iconToastNotification[1].classList.add("icon-copy-disabled");

      spanToastNotification.innerText = "Copiado para a área de transferência!"
    }, 2500);
  }

  
});