# First_tutorial_puppeteer

Scrapper simples, realizado a partir do acompanhamento da leitura do tutorial que pode ser obtido no link:
http://www2.decom.ufop.br/terralab/tutorial-como-realizar-um-scraping-de-dados-em-um-website/

# Objetivo

O scrapper em questão é dividido de maneira simples em três processos:

**Primeiro:**
Vasculha todas páginas disponíveis do blog do Terra Lab, realizando uma verificação a partir de Do While clicando na próxima página a partir da confirmação do booleano de **true** para 'isThereNextPage'.

**Segundo:**
Após agregar todos os links disponíveis em cada página relativos a postagens, o scrapper percorre cada link pegando o conteúdo, imagem referente à postagem e o título da postagem e os agrega em um array de objetos referente à constituição a postagem.

**Terceiro:**
Promisse cumprida, o processo final é transferir os valores e compôr o '.csv' referente às postagens obtidas no **Segundo processo**.

## Aspectos Gerais de Realização

Este projeto tem como objetivo iniciar a compreensão de construção de Scrappers a partir da construção deste;

Em vista disso, o código obtido em **index.js** conta com comentários referentes a cada parte dele, refeitos junto ao Tutorial com a documentação da biblioteca **Puppeteer**.
