// Test Database Connection Script
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...\n');
  
  if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
  }

  console.log(`📍 Attempting to connect to: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
  console.log('⏳ Connecting...\n');

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });

    console.log('✅ SUCCESS: Connected to MongoDB successfully!');
    console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
    console.log(`🗄️  Database name: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port || 'default'}`);
    
    // List collections (if any)
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📚 Collections found: ${collections.length}`);
    if (collections.length > 0) {
      collections.forEach(col => console.log(`   - ${col.name}`));
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed successfully');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ FAILED: Could not connect to MongoDB');
    console.error('Error details:', error.message);
    
    if (error.name === 'MongoServerError') {
      console.error('\n💡 Possible causes:');
      console.error('   - Incorrect username or password');
      console.error('   - Database user doesn\'t have proper permissions');
      console.error('   - IP address not whitelisted in MongoDB Atlas');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('\n💡 Possible causes:');
      console.error('   - Network connectivity issues');
      console.error('   - Incorrect connection string');
      console.error('   - MongoDB server is down');
      console.error('   - Firewall blocking connection');
    }
    
    process.exit(1);
  }
}

testConnection();