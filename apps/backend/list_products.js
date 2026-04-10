const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/medusa_db?sslmode=disable'
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT id, title, metadata FROM product LIMIT 5');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

run().catch(console.error);
