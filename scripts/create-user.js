const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

async function createUser() {
  const username = 'admin';
  const password = 'admin123'; // Simple password for testing
  
  // Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  const user = {
    id: "1",
    username: username,
    passwordHash: passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
    lastLogin: null
  };
  
  const users = [user];
  
  // Save to users.json
  const usersPath = path.join(__dirname, '..', 'src', 'data', 'users.json');
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
  
  console.log('User created successfully!');
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('Hash:', passwordHash);
}

createUser().catch(console.error);
