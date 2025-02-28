require('dotenv').config();

const postgres = require('postgres');

async function verifyConnection() {
  console.log('Attempting to connect to database...');
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL.slice(0, 25)}...`);

  try {
    const sql = postgres(process.env.DATABASE_URL);
    const result = await sql`SELECT NOW()`;
    console.log('Database connection successful!');
    console.log('Current time from database:', result[0].now);
    await sql.end();
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    return false;
  }
}

verifyConnection().then(success => {
  if (!success) {
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your DATABASE_URL is correct in the .env file');
    console.log('2. Verify that your database server is running');
    console.log('3. Check that network access to your database is allowed');
  }
  process.exit(success ? 0 : 1);
});