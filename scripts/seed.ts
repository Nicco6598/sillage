
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/db-schema';
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';

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

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const client = postgres(process.env.DATABASE_URL, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
    console.log('🌱 Starting seed...');

    // 1. Clean existing data (optional, be careful in prod)
    // await db.delete(schema.fragranceNotes);
    // await db.delete(schema.fragranceAccords);
    // await db.delete(schema.reviews);
    // await db.delete(schema.fragrances);
    // await db.delete(schema.brands);
    // await db.delete(schema.notes);
    console.log('🧹 Clearing tables...');
    try {
        await db.delete(schema.fragranceNotes);
        await db.delete(schema.fragranceAccords);
        await db.delete(schema.reviews);
        await db.delete(schema.fragrances);
        await db.delete(schema.brands);
        await db.delete(schema.notes);
    } catch (error) {
        console.log('Error clearing tables (might be empty/foreign keys), proceeding...', error);
    }

    // 2. Insert Brands
    console.log('Inserting Brands...');
    const brandsData = [
        { name: 'Dior', slug: 'dior', country: 'France', website: 'https://dior.com' },
        { name: 'Tom Ford', slug: 'tom-ford', country: 'USA', website: 'https://tomford.com' },
        { name: 'Creed', slug: 'creed', country: 'France', website: 'https://creedfragrances.com' },
        { name: 'Chanel', slug: 'chanel', country: 'France', website: 'https://chanel.com' },
        { name: 'Giorgio Armani', slug: 'giorgio-armani', country: 'Italy', website: 'https://armani.com' },
    ];

    const insertedBrands = await db.insert(schema.brands).values(brandsData).returning();
    const brandMap = new Map(insertedBrands.map(b => [b.slug, b.id]));

    // 3. Insert Notes
    console.log('Inserting Notes...');
    const notesData = [
        { name: 'Bergamot', slug: 'bergamot' },
        { name: 'Grapefruit', slug: 'grapefruit' }, // Top
        { name: 'Lemon', slug: 'lemon' }, // Top
        { name: 'Lavender', slug: 'lavender' }, // Heart
        { name: 'Rose', slug: 'rose' }, // Heart
        { name: 'Jasmine', slug: 'jasmine' }, // Heart
        { name: 'Sichuan Pepper', slug: 'sichuan-pepper' }, // Heart
        { name: 'Ambroxan', slug: 'ambroxan' }, // Base
        { name: 'Oud', slug: 'oud' }, // Base
        { name: 'Vanilla', slug: 'vanilla' }, // Base
        { name: 'Vetiver', slug: 'vetiver' }, // Base
        { name: 'Sandalwood', slug: 'sandalwood' }, // Base
        { name: 'Amberwood', slug: 'amberwood' }, // Base
        { name: 'Patchouli', slug: 'patchouli' }, // Base
        { name: 'Cedar', slug: 'cedar' }, // Base
        { name: 'Musk', slug: 'musk' }, // Base
        { name: 'Birch', slug: 'birch' }, // Base
    ];

    const insertedNotes = await db.insert(schema.notes).values(notesData).returning();
    const noteMap = new Map(insertedNotes.map(n => [n.slug, n.id]));

    // 4. Insert Fragrances
    console.log('Inserting Fragrances...');
    const fragrancesData = [
        {
            name: 'Sauvage',
            slug: 'sauvage-dior',
            brandId: brandMap.get('dior'),
            gender: 'masculine' as const,
            concentration: 'EDT',
            releaseYear: 2015,
            rating: '4.2',
            reviewCount: 1542,
            sillageRating: '4.5',
            longevityRating: '4.7',
            priceValueRating: '3.8',
            imageUrl: 'https://fimgs.fragrantica.com/perfume/375x500/31861.jpg', // Placeholder or external
        },
        {
            name: 'Oud Wood',
            slug: 'oud-wood-tom-ford',
            brandId: brandMap.get('tom-ford'),
            gender: 'unisex' as const,
            concentration: 'EDP',
            releaseYear: 2007,
            rating: '4.5',
            reviewCount: 890,
            sillageRating: '3.5',
            longevityRating: '3.8',
            priceValueRating: '2.5',
            imageUrl: 'https://fimgs.fragrantica.com/perfume/375x500/1826.jpg',
        },
        {
            name: 'Aventus',
            slug: 'aventus-creed',
            brandId: brandMap.get('creed'),
            gender: 'masculine' as const,
            concentration: 'EDP',
            releaseYear: 2010,
            rating: '4.6',
            reviewCount: 2300,
            sillageRating: '4.2',
            longevityRating: '4.1',
            priceValueRating: '2.0',
            imageUrl: 'https://fimgs.fragrantica.com/perfume/375x500/9828.jpg',
        },
        {
            name: 'Bleu de Chanel',
            slug: 'bleu-de-chanel',
            brandId: brandMap.get('chanel'),
            gender: 'masculine' as const,
            concentration: 'EDP',
            releaseYear: 2014,
            rating: '4.4',
            reviewCount: 1200,
            sillageRating: '4.0',
            longevityRating: '4.2',
            priceValueRating: '3.5',
            imageUrl: 'https://fimgs.fragrantica.com/perfume/375x500/25967.jpg',
        },
        {
            name: 'Acqua di Gio Profumo',
            slug: 'acqua-di-gio-profumo',
            brandId: brandMap.get('giorgio-armani'),
            gender: 'masculine' as const,
            concentration: 'Parfum',
            releaseYear: 2015,
            rating: '4.5',
            reviewCount: 1100,
            sillageRating: '4.1',
            longevityRating: '4.3',
            priceValueRating: '4.0',
            imageUrl: 'https://fimgs.fragrantica.com/perfume/375x500/29727.jpg',
        }
    ];

    const insertedFragrances = await db.insert(schema.fragrances).values(fragrancesData).returning();
    const fragMap = new Map(insertedFragrances.map(f => [f.slug, f.id]));

    // 5. Insert Fragrance Notes
    console.log('Linking Notes...');
    const fragNotesData = [
        // Sauvage
        { fragranceId: fragMap.get('sauvage-dior')!, noteId: noteMap.get('bergamot')!, type: 'top' as const },
        { fragranceId: fragMap.get('sauvage-dior')!, noteId: noteMap.get('sichuan-pepper')!, type: 'heart' as const },
        { fragranceId: fragMap.get('sauvage-dior')!, noteId: noteMap.get('ambroxan')!, type: 'base' as const },

        // Oud Wood
        { fragranceId: fragMap.get('oud-wood-tom-ford')!, noteId: noteMap.get('rose')!, type: 'heart' as const },
        { fragranceId: fragMap.get('oud-wood-tom-ford')!, noteId: noteMap.get('oud')!, type: 'base' as const },
        { fragranceId: fragMap.get('oud-wood-tom-ford')!, noteId: noteMap.get('sandalwood')!, type: 'base' as const },
        { fragranceId: fragMap.get('oud-wood-tom-ford')!, noteId: noteMap.get('amberwood')!, type: 'base' as const },

        // Aventus
        { fragranceId: fragMap.get('aventus-creed')!, noteId: noteMap.get('bergamot')!, type: 'top' as const },
        { fragranceId: fragMap.get('aventus-creed')!, noteId: noteMap.get('birch')!, type: 'heart' as const },
        { fragranceId: fragMap.get('aventus-creed')!, noteId: noteMap.get('musk')!, type: 'base' as const },

        // Bleu de Chanel
        { fragranceId: fragMap.get('bleu-de-chanel')!, noteId: noteMap.get('grapefruit')!, type: 'top' as const },
        { fragranceId: fragMap.get('bleu-de-chanel')!, noteId: noteMap.get('lemon')!, type: 'top' as const },
        { fragranceId: fragMap.get('bleu-de-chanel')!, noteId: noteMap.get('jasmine')!, type: 'heart' as const },
        { fragranceId: fragMap.get('bleu-de-chanel')!, noteId: noteMap.get('cedar')!, type: 'base' as const },

        // Acqua di Gio Profumo
        { fragranceId: fragMap.get('acqua-di-gio-profumo')!, noteId: noteMap.get('bergamot')!, type: 'top' as const },
        { fragranceId: fragMap.get('acqua-di-gio-profumo')!, noteId: noteMap.get('patchouli')!, type: 'base' as const },
    ];

    await db.insert(schema.fragranceNotes).values(fragNotesData);

    // 6. Insert Accords
    console.log('Inserting Accords...');
    const accordsData = [
        // Sauvage
        { fragranceId: fragMap.get('sauvage-dior')!, name: 'Fresh Spicy', percentage: 40, color: '#aaddff' },
        { fragranceId: fragMap.get('sauvage-dior')!, name: 'Amber', percentage: 30, color: '#ffcc00' },
        { fragranceId: fragMap.get('sauvage-dior')!, name: 'Citrus', percentage: 20, color: '#ffff00' },

        // Oud Wood
        { fragranceId: fragMap.get('oud-wood-tom-ford')!, name: 'Woody', percentage: 50, color: '#885522' },
        { fragranceId: fragMap.get('oud-wood-tom-ford')!, name: 'Oud', percentage: 30, color: '#442200' },
        { fragranceId: fragMap.get('oud-wood-tom-ford')!, name: 'Warm Spicy', percentage: 20, color: '#aa4400' },

        // Aventus
        { fragranceId: fragMap.get('aventus-creed')!, name: 'Fruity', percentage: 35, color: '#ffaa88' },
        { fragranceId: fragMap.get('aventus-creed')!, name: 'Sweet', percentage: 25, color: '#ffaaaa' },
        { fragranceId: fragMap.get('aventus-creed')!, name: 'Leather', percentage: 20, color: '#553311' },
    ];

    await db.insert(schema.fragranceAccords).values(accordsData);

    console.log('✅ Seed completed successfully!');
    await client.end();
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
