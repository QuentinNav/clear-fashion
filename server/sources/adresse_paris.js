const fetch = require('node-fetch');
const cheerio = require('cheerio');
const url_home="https://adresse.paris/630-toute-la-collection";
const {'v5': uuidv5} = require('uuid');


/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product_list.grid .ajax_block_product')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name')
        .text()
        .trim()
        .replace(/\s/g, ' ').split("    ")[0];
      const price = parseInt(
        $(element)
          .find('.product-price')
          .text()
      );
      const photo=$(element)
        .find('.product_img_link img')
        .attr('data-original');
      const link=url_home+ $(element)
        .find('.produc-name').attr('href');


      return {'brand':'adresse',name, price, link,photo, '_id': uuidv5(link, uuidv5.URL)};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
 module.exports.scrape = async url => {
     try {

       const response = await fetch(url_home);

       if (response.ok) {

         const body = await response.text();

         return parse(body);
       }

       console.error(response);

       return null;
     } catch (error) {
       console.error(error);
       return null;
     }
   };
