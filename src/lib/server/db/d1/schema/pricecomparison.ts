import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";

/**
 * Shops (Billa, Hofer, Spar, ...)
 */
export const shop = sqliteTable(
  "shop",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),          // "billa", "hofer"
    name: text("name").notNull(),          // "Billa"
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("shops_slug_unq").on(t.slug),
  ]
);

/**
 * Canonical products (shop-agnostic)
 */
export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),

    // optional identifiers
    externalProductId: text("external_product_id"), // wenn verfügbar (nicht shop-spezifisch)
    ean: text("ean"),

    name: text("name").notNull(), // full product name
    description: text("description"),
    nutriScore: text("nutri_score"), // "A".."E" (string; Validation in App)

    imageUrl: text("image_url"),

     createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    index("products_external_product_id_idx").on(t.externalProductId),
    index("products_ean_idx").on(t.ean),
  ]
);
