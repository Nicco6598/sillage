
import { pgTable, uuid, text, integer, numeric, timestamp, check, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- BRANDS ---
export const brands = pgTable('brands', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    country: text('country'),
    website: text('website'),
    logoUrl: text('logo_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const brandsRelations = relations(brands, ({ many }) => ({
    fragrances: many(fragrances),
}));

// --- FRAGRANCES ---
export const fragrances = pgTable('fragrances', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'cascade' }),
    gender: text('gender', { enum: ['masculine', 'feminine', 'unisex'] }),
    concentration: text('concentration').default('EDP'),
    releaseYear: integer('release_year'),
    rating: numeric('rating', { precision: 3, scale: 2 }), // Max 5.00
    reviewCount: integer('review_count').default(0),
    imageUrl: text('image_url'),
    sillageRating: numeric('sillage_rating', { precision: 2, scale: 1 }).default('3.0'),
    longevityRating: numeric('longevity_rating', { precision: 2, scale: 1 }).default('3.0'),
    priceValueRating: numeric('price_value_rating', { precision: 2, scale: 1 }).default('3.0'),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    slugIdx: index('idx_fragrances_slug').on(table.slug),
    brandIdx: index('idx_fragrances_brand_id').on(table.brandId),
}));

export const fragrancesRelations = relations(fragrances, ({ one, many }) => ({
    brand: one(brands, {
        fields: [fragrances.brandId],
        references: [brands.id],
    }),
    notes: many(fragranceNotes),
    accords: many(fragranceAccords),
    reviews: many(reviews),
}));

// --- NOTES ---
export const notes = pgTable('notes', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
});

export const notesRelations = relations(notes, ({ many }) => ({
    fragrances: many(fragranceNotes),
}));

// --- FRAGRANCE NOTES (Junction) ---
export const fragranceNotes = pgTable('fragrance_notes', {
    id: uuid('id').defaultRandom().primaryKey(),
    fragranceId: uuid('fragrance_id').references(() => fragrances.id, { onDelete: 'cascade' }),
    noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }),
    type: text('type', { enum: ['top', 'heart', 'base'] }),
}, (table) => ({
    uniqueNote: unique().on(table.fragranceId, table.noteId, table.type),
    fragIdx: index('idx_fragrance_notes_fragrance_id').on(table.fragranceId),
    noteIdx: index('idx_fragrance_notes_note_id').on(table.noteId),
}));

export const fragranceNotesRelations = relations(fragranceNotes, ({ one }) => ({
    fragrance: one(fragrances, {
        fields: [fragranceNotes.fragranceId],
        references: [fragrances.id],
    }),
    note: one(notes, {
        fields: [fragranceNotes.noteId],
        references: [notes.id],
    }),
}));

// --- FRAGRANCE ACCORDS ---
export const fragranceAccords = pgTable('fragrance_accords', {
    id: uuid('id').defaultRandom().primaryKey(),
    fragranceId: uuid('fragrance_id').references(() => fragrances.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    percentage: integer('percentage'),
    color: text('color'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const fragranceAccordsRelations = relations(fragranceAccords, ({ one }) => ({
    fragrance: one(fragrances, {
        fields: [fragranceAccords.fragranceId],
        references: [fragrances.id],
    }),
}));

// --- REVIEWS ---
export const reviews = pgTable('reviews', {
    id: uuid('id').defaultRandom().primaryKey(),
    fragranceId: uuid('fragrance_id').references(() => fragrances.id, { onDelete: 'cascade' }),
    userName: text('user_name').notNull(),
    rating: integer('rating'), // 1-5
    comment: text('comment'),
    longevity: integer('longevity'), // 1-5
    sillage: integer('sillage'), // 1-5
    genderVote: text('gender_vote'),
    seasonVote: text('season_vote'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
    fragrance: one(fragrances, {
        fields: [reviews.fragranceId],
        references: [fragrances.id],
    }),
}));
