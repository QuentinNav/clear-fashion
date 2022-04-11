const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const Mongo=require("./mongodb_connection.js")
const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});


app.get('/products/search', async(request, response)=>{
    const products=await Mongo.Search(request)
    response.send(products)
})
app.get('/products/:id', async (request, response) => {
  const product=await Mongo.find_product_id(request)
  response.send(product);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
