// App/remove.js
const { withProducts } = require('./app');


(async () => {
await withProducts(async (products) => {
// Example: delete the product with id=3
const result = await products.deleteOne({ id: 3 });
console.log(`Deleted: ${result.deletedCount}`);
});
})();
