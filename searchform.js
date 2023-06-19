const input=document.getElementById("search");
const res=document.getElementById("fetchedres");
const go=document.getElementById("butt");
const loadingElement=document.getElementById('loading')
const symbolString = new URLSearchParams(window.location.search).get('symbol');
const queryString = new URLSearchParams(window.location.search).get('query');
const logoImg = document.getElementById('logoImg');
const comnam = document.getElementById('companyname');
const stockrec = document.getElementById('stockrecent');
const stockup = document.getElementById('stockupdate');

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
  
  const getcompLogoImg = () =>  { 
    fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbolString}`)
    .then((response) => {
      return response.json()
    })
    .then((data)=> {
      console.log(data.profile.image)
      
      return logoImg.src=data.profile.image
    }  
)}
  
  const compNameIndustry = () =>  { 
    fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbolString}`)
    .then((response) => {
      return response.json()
    })
    .then((data)=> {
      console.log(data.profile.companyName)
      
      
      return comnam.innerText=data.profile.companyName
  
})}

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

function debounce(func, timeout) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
}

async function Search() {
    window.history.pushState({}, "", `./index.html?query=${input.value}`);
    res.innerHTML = '';
    loadingElement.style.display = 'inherit';
  
    const resultFetchSearch = await fetchSearch();
    const compProfileArray = await createListVal(resultFetchSearch);
  
    loadingElement.style.display = 'none';
  
    for (let i = 0; i < compProfileArray.length; i++) {
      const compProfile = compProfileArray[i];
  
      const newDiv = document.createElement('div');
      const img = document.createElement('img');
      img.src = compProfile.profile.image
  
      newDiv.innerHTML = `<a href="./company.html?symbol=${compProfile.symbol}" target="_blank" class="results-item">${compProfile.profile.companyName}</a> ${compProfile.symbol} ${compProfile.profile.changesPercentage}`;
  
      res.appendChild(newDiv);
      res.appendChild(img);
  
      if (resultFetchSearch.length > i + 1) {
        const newLineDiv = document.createElement('div');
        newLineDiv.classList.add('resultsline');
        res.appendChild(newLineDiv);
      }
    }
}









  