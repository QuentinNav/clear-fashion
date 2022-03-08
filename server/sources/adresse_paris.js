const fetch = require('node-fetch');
const cheerio = require('cheerio');
const url_home="https://adresse.paris";

const categories =["/630-toute-la-collection"]

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product_list grid row')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.product-price')
          .text()
      );

      const link=url_home+ $(element)
        .find('.produc-name').attr('href');

      console.log({'brand':'adresse',name, price, link});
      return {'brand':'adresse',name, price, link};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
 module.exports.scrape = async url => {
   var products = [];
   try{
       for(let i =0; i<categories.length; i++){

             const response = await fetch(url+categories[i]);

             if (response.ok) {
               const body = await response.text();
               products = products.concat(parse(body));
             }

     }
     if (products.length>0)
     {return products;}

     console.error(response);
         return null;

     } catch (error) {
         console.error(error);
         return null;
       }
 };
