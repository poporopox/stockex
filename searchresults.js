const desc = document.getElementById('desc');
const comweb = document.getElementById('companyweb');
const comchart = document.getElementById('companychart');


async function fetchSearch() {
  let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&limit=10&exchange=NASDAQ`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
  } catch (error) {
      console.log(error);
  };

}

async function fetchValue(symbol) {
  let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      

      return data;
  } catch (error) {
      console.log(error);
  }
  
}

async function fetchHistory() {
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbolString}?serietype=line`;

  loadshistory(stockrec, stockup, comchart);

  try {
      const response = await fetch(url);
      const data = await response.json();
      return data.historical;
  } catch (error) {
      console.log(error);
  };
}

const calcStockChanges = () => {
  const formattedValue = parseFloat(value).toFixed(2);
  
  if (value > 0) {
    stockrec.classList.add('changes-positive');
    return `+${formattedValue}`;
  } else if (value < 0) {
    stockup.classList.add('changes-negative');
  }
  
  return formattedValue;
};


function splitHistory(originalArray) {
  const perSegment = Math.floor(originalArray.length / 20);
  let copiedArray = [...originalArray];
  let newArray = [];

  for (let i = 0; i < 20; i++) {
    newArray.push(copiedArray.splice(0, perSegment));
  }

  return newArray;
}

function createChart(array) {
  const labels = [];
  const data = [];

  for (let i = 0; i < 20; i++) {
    labels.push(array[i][0].date);
    data.push(array[i][0].close);
  }

  new Chart(comchart, {
    type: 'line',
    data: {
      labels: labels.reverse(),
      datasets: [{
        fill: true,
        label: 'Stock Price History',
        data: data.reverse(),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


function loadsValue(...elements) {
  
  for (let i = 0; i < elements.length; i++)(element => {
      element.classList.add('loading');
  });
  
}

function hidesValue(...elements) {
  for (let i = 0; i < elements.length; i++) (element => {
    element.classList.remove('loading')
  });
}

function showValue(data) {
  logoImg.innerHTML = getcompLogoImg()
  comnam.innerText = compNameIndustry();
  desc.innerHTML = data.description;
  comweb.innerHTML = `<a href=${data.website}>${data.website}</a>`;
}

function loadshistory(...elements) {
  for (let i = 0; i < elements.length; i++)(element => {
      element.classList.add('loading');
  });
}

function hidehistory(...elements) {
  for (let i = 0; i < elements.length; i++)(element => {
      element.classList.add('loading');
  });
}

async function showHistory (data) {
  stockrec.innerText = `Stock price: $${data[0].close}`;
  stockup.innerText = `(${calcStockChanges(data[0].close - data[1].close)}%)`;
};


async function createListVal(searchCompArray) {
  const newCompArray = [];
  for (let i = 0; i < searchCompArray.length; i++) {
    const object = searchCompArray[i];
    const eachCompValue = await fetchValue(object.symbol);
    newCompArray.push(eachCompValue);
  }

  return newCompArray;
}




async function mainValue() {
  loadsValue(logoImg, comnam, desc, comweb);
  const resultProfile = await fetchValue(symbolString);
  hidesValue(logoImg, comnam, desc, comweb);
  showValue(resultProfile.profile);

  const resultHistory = await fetchHistory();
  hidehistory(stockrec, stockup, comchart);
  showHistory(resultHistory);

  const filteredArray = splitHistory(resultHistory);
  createChart(filteredArray);
}




// async function Search() {
//   window.history.pushState({}, "", `./index.html?query=${input.value}`);
//   res.innerHTML = '';
//   loadingElement.style.display = 'inherit';

//   const resultFetchSearch = await fetchSearch();
//   const compProfileArray = await createListVal(resultFetchSearch);

//   loadingElement.style.display = 'none';

//   for (let i = 0; i < compProfileArray.length; i++) {
//     const compProfile = compProfileArray[i];

//     const newDiv = document.createElement('div');
//     const img = document.createElement('img');
//     img.src = compProfile.profile.image

//     newDiv.innerHTML = `<a href="./company.html?symbol=${compProfile.symbol}" target="_blank" class="results-item">${compProfile.profile.companyName}</a> ${compProfile.symbol} ${compProfile.profile.changesPercentage}`;

//     res.appendChild(newDiv);
//     res.appendChild(img);

//     if (resultFetchSearch.length > i + 1) {
//       const newLineDiv = document.createElement('div');
//       newLineDiv.classList.add('resultsline');
//       res.appendChild(newLineDiv);
//     }
//   }
// }

function debounce(func, timeout) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

window.addEventListener('load', function() {
  if (symbolString != null) {
    mainValue();
    return;
  } else if (queryString == null) {
    return;
  }
  input.value = queryString;
  Search();
});


if (go && input) {
  go.addEventListener('click', function() {
    Search();
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      Search();
    }
  });

  input.addEventListener('keydown', debounce(Search, 500));
}
window.addEventListener('load', async () => {
  
  mainValue();
})