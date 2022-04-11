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

let test=[]


module.exports.find_product_id = async(id)=>{
    const db=await Connect_db()
    const products=db.collection("products")
    const query ={"_id":id}
    const result= await products.find(query).toArray()

    console.log(result)
    return result
}

module.exports.Search = async(request)=>{
    const db=await Connect_db()
    let products=db.collection("products")
    let page=request.query.page
    var brand= await products.distinct('brand')
    let limit=12
    let price=9999999

    if("limit" in request.query)
    {
        limit =parseInt(request.query.limit)
    }
    if ("price" in request.query){

        price=parseInt(request.query.price)
    }

    if ("brand" in request.query){
        brand = [request.query.brand]

    }
    console.log("price",price)
    let products_selected =await products.find({
        $and:[{price:{$lt:price}},{brand : {$in:brand}}]
    }).sort({price:1}).limit(limit).toArray();

    return products_selected
}


function dict_by_brand(products,brand_name){
    return products.filter(product =>(product.brand===brand_name));
}
//console.log(find_product_by_id("927f0704-41ab-5348-9076-94b118153baf"))
//insert_in_db("products",products)
//find_product_by_brand("dedicated")
//find_product_lte(50)
//find_product_sorted_by_price()
//find_product_sorted_by_date()
//find_product_lt_2_weeks()
