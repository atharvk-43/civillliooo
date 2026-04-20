import pkg from 'pg';
const { Client } = pkg;
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '/vercel/share/.env.project' });

let connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing POSTGRES_URL or DATABASE_URL environment variable');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('POSTGRES') || k.includes('DATABASE') || k.includes('SUPABASE')));
  process.exit(1);
}

// Remove SSL mode from connection string to use our custom SSL config
const url = new URL(connectionString);
url.searchParams.delete('sslmode');
connectionString = url.toString();

async function runMigrations() {
  const client = new Client({
    connectionString,
    ssl: false,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL');
    
    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'scripts', '02-create-grievances-v2.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    console.log('Executing migration...');
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
