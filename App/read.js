// App/read.js
const { withProducts } = require('./app');


(async () => {
await withProducts(async (products) => {
const items = await products.find({}).toArray();
console.log(items);
});
})();