/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sites/dedicatedbrand');
const montlimartbrand = require('./sources/montlimart');
const adressebrand=require('./sources/adresse_paris');
const loombrand=require("./sources/loom");
const { v4: uuidv4 } = require('uuid');




 function saveToFile(products){
    const fs=require('fs');
    const jsonContent=JSON.stringify(products);


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
    products=products.concat(await loombrand.scrape("https://www.loom.fr/collections/tous-les-vetements"));
    products = products.concat(await adressebrand.scrape("https://adresse.paris/630-toute-la-collection"));


    saveToFile(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox();
