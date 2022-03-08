const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const MONGODB_URI = "mongodb+srv://QuentinNav:<m8e60LvytPwDXzCG>@clearfashion.8qhfl.mongodb.net/clearfashion?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
