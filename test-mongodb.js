const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017';
const DB_NAME = 'atlantic_dunes_blog';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✓ Connected to MongoDB successfully');
    
    const db = client.db(DB_NAME);
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Test posts
    const postsCollection = db.collection('posts');
    const postsCount = await postsCollection.countDocuments();
    console.log(`Posts count: ${postsCount}`);
    
    // Test categories
    const categoriesCollection = db.collection('categories');
    const categoriesCount = await categoriesCollection.countDocuments();
    console.log(`Categories count: ${categoriesCount}`);
    
    // Test users
    const usersCollection = db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    console.log(`Users count: ${usersCount}`);
    
    await client.close();
    console.log('✓ Test completed successfully');
  } catch (error) {
    console.error('✗ MongoDB connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
