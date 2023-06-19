const marqueeContainer = document.getElementById('marquee-container');

class marquee {
    constructor (url) {
        this.url = url;
    }


 async fetch() {
    const url = this.url;
    try {

        const marqueeDiv = document.createElement('div');
        
        marqueeDiv.classList.add('marquee');

        const response = await fetch(url);
        const data = await response.json();            
        let filteredArray = data.map(({symbol, price}) => `${symbol}:<span class="changes-positive">${price}</span>`).join(' ');
        marqueeDiv.innerHTML = filteredArray;
    
        marqueeContainer.appendChild(marqueeDiv);
    
        return;

    } catch (error) {
        console.log(error);
    };
}
}


window.addEventListener('load', async () => {
    const marqueeToday = new marquee(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse`);
    marqueeToday.fetch();
})