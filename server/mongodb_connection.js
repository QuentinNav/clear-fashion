const { MongoClient } = require("mongodb");
const fs=require('fs');
let products = JSON.parse(fs.readFileSync("scraped_products.json"));


const MONGODB_URI = "mongodb+srv://QuentinNav:m8e60LvytPwDXzCG@clearfashion.8qhfl.mongodb.net/clearfashion?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

async function Connect_db() {
  try {
    const client =  await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    console.log("connection validated");
    return db;
} catch (e) {
  console.error(e);
};
}

async function insert_in_db(name,object){
    const db = await Connect_db()
    const collection = db.collection(name);
    const result = collection.insertMany(object);
    console.log(result)
}


insert_in_db("products",products)
