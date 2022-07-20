const puppeteer = require("puppeteer"); // importe o pacote puppeteer

let scrape = async () => { // crie uma função assíncrona que irá realizar o scraping
    const browser = await puppeteer.launch({
        headless: false,
    }); // cria um browser. A propriedade headless define se o browser irá abrir com interface gráfica ou se apenas irá executar em segundo plano, sem GUI. false = irá abrir interface gráfica; true = não irá abrir interface gráfica

    const page = await browser.newPage(); // cria uma nova aba no navegador acima

    await page.goto("http://www2.decom.ufop.br/terralab/posts/?category=all"); // define a página que queremos acessar e a função goto navega até essa página.

    let nextPage = false;
    let links = [];

    do {
        nextPage = false;
        const urls = await page.$$eval("article > div > a" /* seletor desejado */, (el) => {
            return el.map((a) => a.getAttribute('href')); // função de retorno dos links.
        }); // verifica e captura os links normalmente.

        links = links.concat(urls); // concatenando os resultados.

        const button_next_page = await page.$("ul.page-numbers > li > a.next.page-numbers"); 

        if (button_next_page) {
            await Promise.all([
                page.waitForNavigation(), // espera que cheguemos na página.
                page.$eval("ul.page-numbers > li > a.next.page-numbers", e => e.click()) // clica no elemento.
            ]);

            nextPage = true;
        }
    } while (nextPage);

    const posts = []; // array que conterá nossas postagens obtidas.

    for (const url of links) {
        await page.goto(url);
        await page.waitForSelector("div.entry-content > div");

        const title = await page.$eval("div.header-callout > section > div > div > div > h3", (title) => title.innerText);

        const post = {
            title,
            url
        }; // cria objeto c/ as informações obtidas.

        posts.push(post); // empurra o objeto acima p/ o vetor.
    }

    browser.close(); // fecha o browser, indicando que finalizamos o scraping.
    return posts; // retorna as hrefs obtidas.
};


//chamada da função scrape. O then/catch é para esperar que a função assíncrona termine e para que possamos tratar eventuais erros. 
scrape()
    .then((value) => {
        console.log(value);
    })
    .catch((error) => console.log(error));