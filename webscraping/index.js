const castle = require('./castle');
const fs = require('fs');

(async () => {
    // await castle.initialize();
    var urls = [
        'https://www.relaischateaux.com/us/destinations/europe/france',
        'https://www.relaischateaux.com/us/destinations/europe/france?page=2/',
        'https://www.relaischateaux.com/us/destinations/europe/france?page=3/',
        'https://www.relaischateaux.com/us/destinations/europe/france?page=4/',
        'https://www.relaischateaux.com/us/destinations/europe/france?page=5/',
        'https://www.relaischateaux.com/us/destinations/europe/france?page=6/',
        'https://www.relaischateaux.com/us/destinations/europe/france?page=7/',
        'https://www.relaischateaux.com/us/destinations/europe/france?page=8/',
        ];
    let pages = [];
    let page = await castle.getProductDetails(urls[7]);
    pages.push(page);
    // debugger;
    await castle.end();
debugger;
    fs.writeFileSync('./data8.json',JSON.stringify(pages), 'utf-8');
    debugger;
    console.log(pages);
})();