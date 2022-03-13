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

async function ex_query(name_collection,query){
    const db = await Connect_db()
    const collection = db.collection(name_collection);

    collection.find(query).toArray(function(err,result){
	if(err) throw err;
     console.log(result)
    });
}

async function find_product_by_brand(brand){
    const query ={"brand":brand}
    ex_query("products",query)
}

async function find_product_lte(price){
    const query = {"price": {"$lte":price}}
    ex_query("products",query)
}

async function find_product_sorted_by_price(){
    const db = await Connect_db()
    const collection = db.collection("products");

    collection.aggregate([{"$sort":{"price":1}}]).toArray(function(err,result){
	if(err) throw err;
     console.log(result)
    });
}

async function find_product_sorted_by_date(){
    const db = await Connect_db()
    const collection = db.collection("products");

    collection.aggregate([{"$sort":{"date":-1}}]).toArray(function(err,result){
	if(err) throw err;
     console.log(result)
    });
}

async function find_product_lt_2_weeks(){
    const query={ date: { $gt: new Date(Date.now()-12096e5).toISOString()}}
    ex_query("products",query)
}



//insert_in_db("products",products)
//find_product_by_brand("dedicated")
//find_product_lte(50)
//find_product_sorted_by_price()
//find_product_sorted_by_date()
//find_product_lt_2_weeks()
