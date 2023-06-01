
const input=document.getElementById("search");
const res=document.getElementById("fetchedres");
const go=document.getElementById("butt");
const loadingElement=document.getElementById('loading')


async function fetchInput() {

  let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&limit=10&exchange=NASDAQ`
  

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } 
  catch (error) {
      console.log(error);
  };
  
};


async function action (){
  res.innerHTML = '';
  
  const result = await fetchInput();
  

  result.forEach((object) => {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `<a href="./company.html?symbol=${object.symbol}" target="_blank">${object.name} (${object.symbol})</a>`;
    res.appendChild(newDiv);
});


}

go.addEventListener('click',action())
input.addEventListener('keydown', (e) => e.key === 'Enter' && action());
  