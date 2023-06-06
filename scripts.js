
const input=document.getElementById("search");
const res=document.getElementById("fetchedres");
const go=document.getElementById("butt");
const loadingElement=document.getElementById('loading')
const symbolString = new URLSearchParams(window.location.search).get('symbol');
const queryString = new URLSearchParams(window.location.search).get('query');
const logoImg = document.getElementById('logoImg');
const comnam = document.getElementById('companyname');
const desc = document.getElementById('desc');
const comweb = document.getElementById('companyweb');
const comchart = document.getElementById('companychart');
const stockrec = document.getElementById('stockrecent');
const stockup = document.getElementById('stockupdate');

class company {
  symbol;
  companyName;
  url;
  imageURL;
  description;
}

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
  };
}

async function fetchHistory() {
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbolString}?serietype=line`;

  loadingHistory(stockrec, stockup, comchart);

  try {
      const response = await fetch(url);
      const data = await response.json();
      return data.historical;
  } catch (error) {
      console.log(error);
  };
}

const compLogoImg = (data) => `<img src="${data.image}" class="logo-image" />`;

const compNameIndustry = (data) => (data.industry == null) ? data.comnam : `${data.comnam}: ${data.industry}`

const calcStockChanges = (data) => {
  let difference = data[0].close - data[1].close;

  switch (true) {
      case (difference > 0):
        stockup.classList.add('changes-positive');
          difference = `+${difference}`;
          break;
      case (difference < 0):
        stockup.classList.add('changes-negative');
          break;
      default:
          break;
  }

  return difference;
}

const segmentArray = (originalArray) => {
  const perSegment = Math.floor(originalArray.length / 20);
  const newArray = Array.from({ length: 20 }, () => originalArray.splice(0, perSegment));
  return newArray;
};

function createChart(array) {
  const labels = array.slice(0, 20).map(item => item[0].date).reverse();
  const data = array.slice(0, 20).map(item => item[0].close).reverse();

  new Chart(comchart, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              fill: true,
              label: 'Stock Price History',
              data: data,
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
  elements.forEach(element => {
      element.classList.add('loading');
  });
}

function hidesValue(...elements) {
  elements.forEach (element => {
    element.classList.remove('loading')
  });
}

function showValue(data) {
  logoImg.innerHTML = `
      <img src="${data.image}" class="logo-image" />
  `;

  comnam.innerHTML = `
      ${compNameIndustry(data)}
  `;

  desc.innerText = data.description;

  comweb.innerHTML = `
      <a href="${data.website}">${data.website}</a>
  `;
}

function loadshistory(...elements) {
  elements.forEach(element => {
      element.classList.add('loading');
  });
}

function hidehistory(...elements) {
  elements.forEach(element => {
      element.classList.add('loading');
  });
}

const showHistory = (data) => {
  stockrec.innerText = `Stock price: $${data[0].close}`;
  stockup.innerText = `(${calcStockChanges(data)}%)`;
};


const createListVal = async (searchCompArray) => {
  const newCompArray = await Promise.all(searchCompArray.map(object => fetchValue(object.symbol)));
  return newCompArray;
};

async function mainValue() {
  loadsValue(logoImg, comnam, desc, comweb);

  const resultValuePromise = fetchValue(symbolString);
  const resultHistoryPromise = fetchHistory();

  const [resultValue, resultHistory] = await Promise.allSettled([resultValuePromise, resultHistoryPromise])
      .then(results => results.map(result => result.value));

  hideValueLoader(logoImg, comnam, desc, comweb);
  showValue(resultValue.Value);

  hideHistoryLoader(stockrec, stockup, comchart);
  showHistory(resultHistory);

  const filteredArray = splitHistory(resultHistory);
  createChart(filteredArray);
}


async function Search() {
  window.history.pushState({}, "", `./index.html?query=${input.value}`);
  searchResult.innerHTML = '';
  loadingElement.style.display = 'inherit';

  const resultFetchSearch = await fetchSearch();
  const compProfileArray = await createListVal(resultFetchSearch);

  console.log(compProfileArray)

  loadingElement.style.display = 'none';
  await Promise.all(compProfileArray.map(async (compProfile, i) => {
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `<a href="./company.html?symbol=${compProfile.symbol}" target="_blank" class="results-item">${compProfile.profile.companyName}</a> ${compProfile.symbol} ${compProfile.profile.changesPercentage}`;
      searchResult.appendChild(newDiv);

      if (resultFetchSearch.length > i + 1) {
          const newLineDiv = document.createElement('div');
          newLineDiv.classList.add('resultsline');
          searchResult.appendChild(newLineDiv);
      }
  }));
}

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
  mainSearch();
});

if (go && input) {
  go.addEventListener('click', function() {
    mainSearch();
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      mainSearch();
    }
  });

  input.addEventListener('keydown', debounce(mainSearch, 500));
}




// async function fetchInput() {
  

  
//   let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&limit=10&exchange=NASDAQ`
  
  
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } 
//   catch (error) {
//       console.log(error);
//   };
  
// };


// async function action (){
//   loadingElement.style.display = 'inherit';
  
//   res.innerHTML = '';
  
//   const result = await fetchInput();

    
//   loadingElement.style.display = 'none';
//   result.forEach((object) => {
//     const newDiv = document.createElement('div');
//     newDiv.innerHTML = `<a href="./company.html?symbol=${object.symbol}" target="_blank">${object.name} (${object.symbol})</a>`;
//     res.appendChild(newDiv);
// });


// }

// go.addEventListener('click',action)
// input.addEventListener('keydown', (e) => e.key === 'Enter' && action());
  