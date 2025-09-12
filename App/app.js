// App/app.js
const { MongoClient } = require('mongodb');


const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'mydb';


async function getDb() {
const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
return { client, db };
}


async function withProducts(fn) {
const { client, db } = await getDb();
try {
const products = db.collection('products');
if (process.env.DROP_FIRST === 'true') {
try { await products.drop(); } catch (_) {}
}
return await fn(products);
} finally {
await client.close();
}
}


module.exports = { withProducts };