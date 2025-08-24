const fs = require('fs');

// Read the menu data
const menuData = JSON.parse(fs.readFileSync('./data/menu.json', 'utf8'));

// Add IDs to menu items
const menuWithIds = menuData.map((item, index) => ({
  id: `item_${index + 1}`,
  ...item
}));

// Write back to file
fs.writeFileSync('./data/menu.json', JSON.stringify(menuWithIds, null, 2));

console.log('✅ Added IDs to menu items successfully!');
