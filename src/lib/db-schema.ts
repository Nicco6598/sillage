
import { pgTable, uuid, text, integer, numeric, timestamp, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- BRANDS ---
export const brands = pgTable('brands', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    country: text('country'),
    description: text('description'),
    history: text('history'),
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
    description: text('description'),
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
    similarTo: many(fragranceSimilarities, { relationName: 'fragrance_similarities_source' }),
    remindedBy: many(fragranceSimilarities, { relationName: 'fragrance_similarities_target' }),
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
    userId: uuid('user_id'), // References auth.users
    userName: text('user_name').notNull(),
    rating: numeric('rating', { precision: 4, scale: 2 }), // 1-5
    comment: text('comment'),
    longevity: numeric('longevity', { precision: 3, scale: 1 }), // 1-5
    sillage: numeric('sillage', { precision: 3, scale: 1 }), // 1-5
    genderVote: text('gender_vote'),
    seasonVote: text('season_vote'),
    batchCode: text('batch_code'),
    productionDate: text('production_date'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at'),
});


export const reviewsRelations = relations(reviews, ({ one }) => ({
    fragrance: one(fragrances, {
        fields: [reviews.fragranceId],
        references: [fragrances.id],
    }),
}));

// --- PROFILES ---
export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),
    username: text('username').unique(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    website: text('website'),
    email: text('email'), // Added for easier lookup
    updatedAt: timestamp('updated_at').defaultNow(),
});

// --- USER COLLECTION (Armadio) ---
export const userCollection = pgTable('user_collection', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(), // References auth.users
    fragranceId: uuid('fragrance_id').notNull().references(() => fragrances.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').default(1),
    size: text('size'), // e.g., "50ml", "100ml"
    purchaseDate: timestamp('purchase_date'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const userCollectionRelations = relations(userCollection, ({ one }) => ({
    fragrance: one(fragrances, {
        fields: [userCollection.fragranceId],
        references: [fragrances.id],
    }),
}));

// --- USER FAVORITES ---
export const userFavorites = pgTable('user_favorites', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(), // References auth.users
    fragranceId: uuid('fragrance_id').notNull().references(() => fragrances.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
    fragrance: one(fragrances, {
        fields: [userFavorites.fragranceId],
        references: [fragrances.id],
    }),
}));

// We need to reference `auth.users` but Drizzle doesn't support cross-schema references easily in the same schema file without defining auth schema. 
// For now, we assume `id` comes from auth.
// To make it clean in Drizzle we'd need to define the `auth` schema, but let's just use `uuid('id').primaryKey()` and handle the foreign key in SQL if needed, 
// though the trigger handles the insertion so we just need the table to exist.
// Ideally:
// const authUsers = pgTable('users', { id: uuid('id').primaryKey() }, { schema: 'auth' });
// But let's keep it simple for now as we don't query auth.users from here usually.
const authUsers = pgTable('users', { id: uuid('id').primaryKey() });

// --- FRAGRANCE SIMILARITIES ---
export const fragranceSimilarities = pgTable('fragrance_similarities', {
    id: uuid('id').defaultRandom().primaryKey(),
    fragranceId: uuid('fragrance_id').references(() => fragrances.id, { onDelete: 'cascade' }),
    similarId: uuid('similar_id').references(() => fragrances.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    uniqueSimilarity: unique().on(table.fragranceId, table.similarId),
    fragIdx: index('idx_fragrance_similarities_fragrance_id').on(table.fragranceId),
}));

export const fragranceSimilaritiesRelations = relations(fragranceSimilarities, ({ one, many }) => ({
    fragrance: one(fragrances, {
        fields: [fragranceSimilarities.fragranceId],
        references: [fragrances.id],
        relationName: 'fragrance_similarities_source',
    }),
    similarFragrance: one(fragrances, {
        fields: [fragranceSimilarities.similarId],
        references: [fragrances.id],
        relationName: 'fragrance_similarities_target',
    }),
    votes: many(fragranceSimilarityVotes),
}));

export const fragranceSimilarityVotes = pgTable('fragrance_similarity_votes', {
    id: uuid('id').defaultRandom().primaryKey(),
    similarityId: uuid('similarity_id').references(() => fragranceSimilarities.id, { onDelete: 'cascade' }),
    userId: uuid('user_id'), // References auth.users
    vote: integer('vote').notNull(), // 1 for upvote, -1 for downvote
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    uniqueUserVote: unique().on(table.similarityId, table.userId),
    simIdx: index('idx_fragrance_similarity_votes_similarity_id').on(table.similarityId),
}));

export const fragranceSimilarityVotesRelations = relations(fragranceSimilarityVotes, ({ one }) => ({
    similarity: one(fragranceSimilarities, {
        fields: [fragranceSimilarityVotes.similarityId],
        references: [fragranceSimilarities.id],
    }),
}));



