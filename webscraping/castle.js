const puppeteer = require('puppeteer');
const Timeout = require('await-timeout');

let browser = [];
let page = [];
/* Constants */
const BASE_URL = 'https://www.relaischateaux.com/us/destinations/europe/france';

const castle ={

    initialize: async () => {
        console.log('Starting the scraper...');

        browser = await puppeteer.launch({
            headless: false,
        })

        page = await browser.newPage();

        // await page.goto(BASE_URL);

        console.log('Initialization completed...');        
    },

    getProductDetails: async (link) => {

        console.log(`Going to the Product Page... { ${link}}`);
        browser = await puppeteer.launch({
            headless: false,
        })

        page = await browser.newPage();

        
        await page.setRequestInterception(true);

        page.on('request', (request) => {
          if(['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort();
          } else {
            request.continue();
          }
        })
        
        await page.goto(link);
        await page.waitFor('h3.mainTitle3 a');
        let details = await page.evaluate(() => {
            let whole = [];
            let relaisArray = document.querySelectorAll('h3.mainTitle3 a');
            for(let relaisElement of relaisArray){
                let hotel = relaisElement.innerText;
                let href = relaisElement.getAttribute('href');

                whole.push({
                    hotel,
                    href
                })
            }
            return whole;
        

        });
        await page.close();

        for( let detail of details){
		let pageResto= await browser.newPage();
        await pageResto.setRequestInterception(true);
        
        pageResto.on('request', (request) => {
          if(['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort();
          } else {
            request.continue();
          }
        })
        
        await pageResto.goto(detail.href);
        // await pageResto.waitFor('div.jsSecondNav');
        let timer = new Timeout();
        timer.set(5000).then(async() =>{
            console.log('*******Reloading******')
            await pageResto.goto(detail.href);
            await pageResto.waitFor(5000);
            
        }).continue;
        await pageResto.waitFor(2000);
        await pageResto.click('body > div.jsSecondNav.will-stick > ul > li:nth-child(2) > a');
        await pageResto.waitFor(2000);
        let resto = await pageResto.evaluate(() => {
            let restos = [];
            let resto1 = document.querySelectorAll('ul.jsSecondNavSub li');
            if(resto1.length != 0){
                for(let restoElement of resto1){
                    let ele2 = restoElement.innerText.trim();
                    restos.push(ele2);
                };
            } else {
                let ele1 = document.querySelectorAll('div.tabRestaurant > div.grid h3.mainTitle2');
                if(ele1.length != 0){
                    let ele3 = ele1[0].innerText;
                    restos.push(ele3);
                } else {
                    let eleR = document.querySelector('div.headings > h1.mainTitle2').innerText;
                    restos.push(eleR);
                }
            }
            return restos;
        })
        detail.resto = resto;
        console.log(detail.resto);
        timer.clear();
		await pageResto.close();
    };
    console.log(details);
    return details;
    },

    end: async() => {
        console.log('Stopping the scraper...');

        await browser.close();
    }

}

module.exports = castle;