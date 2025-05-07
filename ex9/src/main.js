import './style.css'

const url = "https://dummyjson.com/quotes";
const randomQuoteButton = document.querySelector("#random-button");
const perPage = document.querySelector("#per-page");
const buttons = document.querySelectorAll(".btn-pp");
let currentPage = 1;

function fetchQuotes() {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const quotes = data.quotes;
      return quotes;
    })
    .catch((error) => {
      console.error("Error fetching quotes:", error);
    });
}

function randomQuote() {
  fetch(url + "/random")
  .then(res => res.json())
  .then(
    (data) => {
      const randomQuote = data;
      const headerContainer = document.querySelector("header .content");
      const quoteCard = displayQuoteContent(randomQuote);
      headerContainer.innerHTML = ""; 
      headerContainer.appendChild(quoteCard); 
    }
  );
}

function perPageQuotes(perPage) {
  fetch(url + `?limit=${perPage}`)
  .then(res => res.json())
  .then(
    (data) => {
      const quotes = data.quotes;
      const mainContainer = document.querySelector("main .content");
      mainContainer.innerHTML = "";
      for (let i = 0; i < quotes.length; i++) {
        const quoteCard = displayQuoteContent(quotes[i]);
        
        mainContainer.appendChild(quoteCard);
      }
    }
  );
}

function skipToQuote(quote) {
  fetch(url + `?limit=${perPage.value}&skip=${quote}`)
  .then(res => res.json())
  .then((data) => {
    skipToQuoteUpdate(data);
    console.log("Total Quotes:", data.total);
  })
}
function skipToQuoteUpdate(data) {
  const quotes = data.quotes;
  const mainContainer = document.querySelector("main .content");
  mainContainer.innerHTML = "";
  for (let i = 0; i < quotes.length; i++) {
    const quoteCard = displayQuoteContent(quotes[i]);
    mainContainer.appendChild(quoteCard);
  }

  buttons.forEach((button, index) => {
    let total = data.total-(parseInt(perPage.value)-2);

    if (index === buttons.length - 1) {
      button.textContent = total;
      button.style.display = "block";
    }
    else if (index === 0) {
      if (currentPage === 1) {
        button.textContent = 1;
      }
      else if(currentPage === total) {
        button.textContent = currentPage - 3;
      } else {
        button.textContent = currentPage - 1;
      }
    }
    else if (index === 1) {
      if (currentPage === 1) {
        button.textContent = currentPage + 1;
      }
      else if(currentPage === total) {
        button.textContent = currentPage - 2;
      } else {
        button.textContent = currentPage;
      }
    }
    else if (index === 2) {
      if (currentPage === 1) {
        button.textContent = currentPage + 2;
      }
      else if(currentPage === total) {
        button.textContent = currentPage - 1;
      } else {
        button.textContent = currentPage + 1;
      }
    }
  });
}



function displayQuoteContent(quote) {
  const card = document.createElement("div");
  card.className = "card border border-gray-800 rounded-3xl p-4 shadow-md";

  const quoteText = document.createElement("p");
  quoteText.className = "text-lg";
  quoteText.innerText = quote.quote;

  const authorText = document.createElement("h3");
  authorText.className = "font-semibold";
  authorText.innerText = `By ${quote.author}`;

  card.appendChild(quoteText);
  card.appendChild(authorText);

  return card;
}


randomQuoteButton.addEventListener("click", () => {
  document.body.style.cursor = "loading";
  randomQuote();
  document.body.style.cursor = "default";
}
);

perPage.addEventListener("change", () => {
  perPageQuotes(perPage.value);
  skipToQuote(0);
});

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const buttonValue = event.target.textContent; 
    console.log("Button clicked: " + buttonValue);
    currentPage = parseInt(buttonValue);
    skipToQuote(buttonValue-1);
  });
});

function init() {
  randomQuote();
  perPageQuotes(perPage.value);
  skipToQuote(currentPage-1);
}

init();