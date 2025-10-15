// Script to convert products.js to products.json
const fs = require('fs');
const path = require('path');
const products = require('../backend/data/products');

const jsonData = JSON.stringify(products, null, 2);
const outputPath = path.join(__dirname, 'data', 'products.json');

// Create data directory if it doesn't exist
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(outputPath, jsonData);
console.log(`✅ Converted ${products.length} products to ${outputPath}`);
