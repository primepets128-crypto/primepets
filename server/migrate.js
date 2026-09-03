require('dotenv').config();
const { createClient } = require('@libsql/client');
const db = createClient({ 
  url: process.env.TURSO_DATABASE_URL, 
  authToken: process.env.TURSO_AUTH_TOKEN 
});
db.execute('ALTER TABLE `Order` ADD COLUMN `customerEmail` TEXT')
  .then(()=>console.log('Success'))
  .catch(e=>console.error(e));
