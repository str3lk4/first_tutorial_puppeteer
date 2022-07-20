const puppeteer = require("puppeteer"); // importe o pacote puppeteer

let scrape = async () => { // crie uma função assíncrona que irá realizar o scraping
    const browser = await puppeteer.launch({
        headless: false,
    }); // cria um browser. A propriedade headless define se o browser irá abrir com interface gráfica ou se apenas irá executar em segundo plano, sem GUI. false = irá abrir interface gráfica; true = não irá abrir interface gráfica

    const page = await browser.newPage(); // cria uma nova aba no navegador acima

    await page.goto("http://www2.decom.ufop.br/terralab/posts/?category=all"); // define a página que queremos acessar e a função goto navega até essa página.

    const urls = await page.$$eval("article > div > a" /* seletor desejado */, (el) => {
        return el.map((a) => a.getAttribute('href')); // função de retorno dos links.
    });

    browser.close(); // fecha o browser, indicando que finalizamos o scraping.
    return urls; // retorna as hrefs obtidas.
};


//chamada da função scrape. O then/catch é para esperar que a função assíncrona termine e para que possamos tratar eventuais erros. 
scrape()
    .then((value) => {
        console.log(value);
    })
    .catch((error) => console.log(error));

// código p/ obter todos os links da página em questão.