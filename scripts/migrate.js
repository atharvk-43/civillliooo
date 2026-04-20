import pkg from 'pg';
const { Client } = pkg;
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Missing POSTGRES_URL environment variable');
  process.exit(1);
}

async function runMigrations() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');
    
    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'scripts', '02-create-grievances-v2.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Execute the migration
    await client.query(sql);
    console.log('✓ Grievances table created successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
