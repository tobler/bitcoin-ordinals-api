import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Collection schema
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  symbol: text("symbol"),
  bitcoinAddress: text("bitcoin_address").notNull(),
  image: text("image"),
  txid: text("txid"),
  inscription: text("inscription"),
  status: text("status").default("pending"),
  blockHeight: integer("block_height"),
  timestamp: timestamp("timestamp").defaultNow(),
  fees: integer("fees"),
});

// Ordinal schema
export const ordinals = pgTable("ordinals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  bitcoinAddress: text("bitcoin_address").notNull(),
  collectionId: integer("collection_id").references(() => collections.id),
  attributes: json("attributes").$type<Array<{ trait_type: string; value: string }>>(),
  image: text("image"),
  txid: text("txid"),
  inscription: text("inscription"),
  status: text("status").default("pending"),
  blockHeight: integer("block_height"),
  timestamp: timestamp("timestamp").defaultNow(),
  fees: integer("fees"),
  size: integer("size"),
});

// Insert schemas
export const insertCollectionSchema = createInsertSchema(collections).pick({
  name: true,
  description: true,
  symbol: true,
  bitcoinAddress: true,
  image: true,
}).extend({
  privateKey: z.string().min(1, "Private key is required"),
  feeRate: z.number().int().min(1, "Fee rate must be at least 1 sat/vB").default(5),
  useTestnet: z.boolean().default(false),
});

export const insertOrdinalSchema = createInsertSchema(ordinals).pick({
  name: true,
  description: true,
  bitcoinAddress: true,
  collectionId: true,
  attributes: true,
  image: true,
}).extend({
  privateKey: z.string().min(1, "Private key is required"),
  feeRate: z.number().int().min(1, "Fee rate must be at least 1 sat/vB").default(10),
  useTestnet: z.boolean().default(false),
});

// Types
export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Ordinal = typeof ordinals.$inferSelect;
export type InsertOrdinal = z.infer<typeof insertOrdinalSchema>;

// Response schemas for better type safety in the frontend
export const collectionResponseSchema = z.object({
  collectionId: z.number(),
  txid: z.string().optional(),
  inscription: z.string().optional(),
  blockHeight: z.number().optional(),
  timestamp: z.string().optional(),
  fees: z.number().optional(),
  size: z.number().optional(),
  status: z.string(),
});

export const ordinalResponseSchema = z.object({
  ordinalId: z.number(),
  txid: z.string().optional(),
  inscription: z.string().optional(),
  blockHeight: z.number().optional(),
  timestamp: z.string().optional(),
  fees: z.number().optional(),
  size: z.number().optional(),
  status: z.string(),
});

export type CollectionResponse = z.infer<typeof collectionResponseSchema>;
export type OrdinalResponse = z.infer<typeof ordinalResponseSchema>;
