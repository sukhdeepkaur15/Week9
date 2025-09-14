const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // could also use app.use(express.json());

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'mydb';
let db, products;

async function start() {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  products = db.collection('products');
  console.log('Mongo connected.');
}
 
// Friendly root page (optional)
app.get('/', (req, res) => {
  res.send('API is running🎉. Try GET /products');
  // or: res.redirect('/products');
});
 
// (1) GET all products
app.get('/products', async (req, res) => {
  try {
    const list = await products.find({}).toArray();
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// (2) POST add product (prevent duplicate numeric "id")
app.post('/products', async (req, res) => {
  try {
    const { id, name, description, price, units } = req.body;
    if (typeof id !== 'number' || !name || !description || typeof price !== 'number' || !Number.isInteger(units)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const dup = await products.findOne({ id });
    if (dup) return res.status(409).json({ error: 'Duplicate id' });

    const doc = { id, name, description, price: Number(price.toFixed(2)), units };
    const result = await products.insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// (3) DELETE by Mongo ObjectId
app.delete('/products/:oid', async (req, res) => {
  try {
    const { oid } = req.params;
    const result = await products.deleteOne({ _id: new ObjectId(oid) });
    if (!result.deletedCount) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Invalid ObjectId' });
  }
});

// (4) PUT update by Mongo ObjectId
app.put('/products/:oid', async (req, res) => {
  try {
    const { oid } = req.params;
    const payload = req.body || {};
    const allowed = ['id', 'name', 'description', 'price', 'units'];
    const update = {};
    for (const k of allowed) if (k in payload) update[k] = payload[k];
    if ('price' in update) update.price = Number(Number(update.price).toFixed(2));

    const result = await products.findOneAndUpdate(
      { _id: new ObjectId(oid) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'Not found' });
    res.json(result.value);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Invalid data or ObjectId' });
  }
});

const PORT = process.env.PORT || 3000;
start().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
