/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimart');
const adressebrand=require('./sources/adresse_paris');
const { v4: uuidv4 } = require('uuid');




 function saveToFile(products){
    const fs=require('fs');
    const jsonContent=JSON.stringify(products);
    console.log(jsonContent);

    fs.writeFileSync("./scraped_products.json",jsonContent,function(err, result) {
     if(err) console.log('error', err);
   });
}

function add_uuid(products){
    for(let i=0;i<products.length;i++){
        try{
            products[i]["uuid"]=uuidv4();
        }catch (e) {
          console.error(e);
        }

    }
    return products
}


async function sandbox () {
  var products=[];
  try {
    products = products.concat(await dedicatedbrand.scrape("https://www.dedicatedbrand.com"));
    products = products.concat(await montlimartbrand.scrape("https://www.montlimart.com"));
    products = products.concat(await adressebrand.scrape("https://adresse.paris"));


    saveToFile(add_uuid(products));
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox();
