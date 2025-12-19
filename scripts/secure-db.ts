
import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

// Load Env
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) return;
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
        });
    } catch (e) { console.warn("Could not load .env.local", e); }
}
loadEnv();

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

async function secure() {
    console.log('🔒 Applying Security Policies (RLS)...');

    const tables = ['brands', 'fragrances', 'notes', 'fragrance_notes', 'fragrance_accords', 'reviews'];

    // 1. Enable RLS
    for (const t of tables) {
        await sql`ALTER TABLE ${sql(t)} ENABLE ROW LEVEL SECURITY`;
        console.log(`✅ RLS Enabled for ${t}`);
    }

    // 2. Public Read Policies
    for (const t of tables) {
        const policyName = `Public Read ${t}`;
        try {
            await sql`DROP POLICY IF EXISTS ${sql(policyName)} ON ${sql(t)}`;
            await sql`CREATE POLICY ${sql(policyName)} ON ${sql(t)} FOR SELECT USING (true)`;
            console.log(`✅ Read Policy set for ${t}`);
        } catch (e) {
            console.error(`Error listing policy for ${t}`, e);
        }
    }

    // 3. Reviews Write Policy
    try {
        await sql`DROP POLICY IF EXISTS "Public Insert Reviews" ON reviews`;
        await sql`CREATE POLICY "Public Insert Reviews" ON reviews FOR INSERT WITH CHECK (true)`;
        console.log(`✅ Write Policy set for reviews (Insert Only)`);

        // Optional: Prevent update/delete by Public (default is denied if no policy exists)
        // We explicitly leave NO policy for UPDATE/DELETE, so it defaults to Deny for public/anon.
    } catch (e) {
        console.error(e);
    }

    console.log('🛡️ Database Secured!');
    await sql.end();
}

secure().catch(e => {
    console.error(e);
    process.exit(1);
});
