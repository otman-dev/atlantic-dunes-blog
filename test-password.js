const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'admin123';
  const hash = '$2b$10$bfVH/uqWSbNm3qZjV9A7MecSgo4DZsa50lPzAdXf8anoIdINfQ.fq';
  
  console.log('Testing password:', password);
  console.log('Against hash:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password valid:', isValid);
  
  // Generate a new hash for testing
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash:', newHash);
  
  const isNewValid = await bcrypt.compare(password, newHash);
  console.log('New hash valid:', isNewValid);
}

testPassword().catch(console.error);
