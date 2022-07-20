const puppeteer = require("puppeteer");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

/* ^ Importação das bibliotecas Puppeteer e CSV-Writer. ^ */

let scrape = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    /* ^ Criação do Browser como Variável p/ Facilitar Chamamentos posteriores. ^ */

    const page = await browser.newPage();
    await page.goto("http://www2.decom.ufop.br/terralab/posts/?category=all");

    /* ^ Criação de nova aba na página iniciada em 'browser', direcionamento da página à página de relação de postagens do blog da Terra Lab. Tudo que formos fazer de interação COM ESTA PÁGINA referenciará a mesma variável adiante. ^ */

    // ESTE BLOCO É REFERENTE À NAVEGAÇÃO DAS PÁGINAS:

    let isThereNextPage = false;
    let links = [];

    /* ^ Utilizaremos a variável 'isThereNextPage' para verificarmos se a página em questão possui uma próxima para onde deveremos ir ao vasculharmos por links de postagens. ^ */

    do {
        isThereNextPage = false;
        const urls = await page.$$eval("article > div > a", (el) => {
            return el.map((a) => a.getAttribute('href'));
        });

        /* ^ $$eval recebe todos os elementos encontrados na relação do string indicado, buscando o seletor que bate com o que foi expresso. A função seguinte puxa todos os links de postagens obtidos. ^ */

        links = links.concat(urls); // concatenando os resultados.

        const button_next_page = await page.$("ul.page-numbers > li > a.next.page-numbers"); 

        if (button_next_page) {
            await Promise.all([
                page.waitForNavigation(),
                page.$eval("ul.page-numbers > li > a.next.page-numbers", e => e.click())
            ]);

            isThereNextPage = true;
        }
    } while (isThereNextPage); // o processo acima precisa, necessariamente, ser realizado pelo menos uma vez, em vista dele ser executado independente de haver, ou não, uma página seguinte ao processo de coleta. Por isso, verificamos a existência (no if) do elemento de página chamado 'button next page', ou 'botão de próxima página'.

    // FIM DO BLOCO DE NAVEGAÇÃO.

    const posts = []; // criamos esse array porque o processo seguinte o alimentará.

    for (const url of links) {
        await page.goto(url);
        await page.waitForSelector("div.entry-content > div"); // 'espere que o elemento selecionado apareça'.

        const title = await page.$eval("div.header-callout > section > div > div > div > h3", (title) => title.innerText); // título da postagem.
        const image = await page.$eval("header > a > img", (image) => image.getAttribute("src")); // imagem da postagem.
        const content = await page.$eval("div.entry-content > div", el => el.innerText); // conteúdo da postagem.

        const post = {
            title: title,
            url: url,
            image: image,
            content: content
        }; // cria objeto c/ as informações obtidas acima.

        posts.push(post); // 'empurra' o objeto acima p/ o vetor.
    }

    browser.close(); // Encerramos o browser, porque o processo de raspagem acabou.
    return posts; // retorna as hrefs obtidas.
};


// Aqui executamos a função, utilizamos o then para que a função possa ser realizada e o catch para caso algum erro ocorra.

scrape()
    .then((value) => {
        const csvWriter = createCsvWriter({
            path: 'relation.csv', // caminho de criação do csv de resultado. Neste caso ele será criado no mesmo local do arquivo executado.
            header: [ // 'cabeçalhos'
                { id: "title", title: "Titulo" },
                { id: "url", title: "Endereco"},
                { id: "image", title: "Imagem" },
                { id: "content", title: "Conteudo" },
            ],
        });

        csvWriter.writeRecords(value) // escreve os registros.
            .then(() => {
                console.log('...Done.');
            });
    })
    .catch((error) => console.log(error));