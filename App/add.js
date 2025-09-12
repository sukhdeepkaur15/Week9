// App/add.js
const { withProducts } = require('./app');


(async () => {
await withProducts(async (products) => {
const docs = [
{ id: 1, name: 'Keyboard', description: 'Wired USB keyboard', price: 29.99, units: 20 },
{ id: 2, name: 'Mouse', description: 'Wireless optical mouse', price: 24.50, units: 35 },
{ id: 3, name: 'Monitor 24"', description: '1080p IPS panel', price: 159.00, units: 10 }
];
const result = await products.insertMany(docs);
console.log(`Inserted ${result.insertedCount || result.insertedIds?.length} products.`);
});
})();