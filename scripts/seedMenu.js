const fs = require('fs');
const { MongoClient } = require('mongodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function seedMenu() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    console.error('   Please copy .env.example to .env.local and set your MongoDB connection string');
    process.exit(1);
  }

  let client;
  
  try {
    // Read menu data
    const menuData = JSON.parse(fs.readFileSync('./data/menu.json', 'utf8'));
    console.log(`📖 Loaded ${menuData.length} menu items from data/menu.json`);

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('bong-flavours');
    const collection = db.collection('menuitems');

    // Clear existing menu items
    console.log('🗑️  Clearing existing menu items...');
    await collection.deleteMany({});

    // Transform data for MongoDB
    const menuItems = menuData.map(item => ({
      ...item,
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert menu items
    console.log('📝 Inserting menu items...');
    const result = await collection.insertMany(menuItems);
    
    console.log(`✅ Successfully seeded ${result.insertedCount} menu items`);
    
    // Create indexes for better performance
    console.log('🔍 Creating database indexes...');
    await collection.createIndex({ category: 1, available: 1 });
    await collection.createIndex({ veg: 1, available: 1 });
    await collection.createIndex({ name: 'text' });
    
    // Display statistics
    const vegCount = await collection.countDocuments({ veg: true });
    const nonVegCount = await collection.countDocuments({ veg: false });
    const categories = await collection.distinct('category');
    
    console.log('\n📊 Seeding Statistics:');
    console.log(`   Total items: ${result.insertedCount}`);
    console.log(`   Vegetarian: ${vegCount}`);
    console.log(`   Non-vegetarian: ${nonVegCount}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Categories: ${categories.join(', ')}`);
    
    console.log('\n🎉 Menu seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding menu:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

// Check if this is being run directly
if (require.main === module) {
  seedMenu();
}

module.exports = seedMenu;
