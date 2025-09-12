// App/update.js
const { withProducts } = require('./app');


(async () => {
await withProducts(async (products) => {
// Example: update the units for id=2
const result = await products.updateOne({ id: 2 }, { $set: { units: 50 } });
console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
});
})();