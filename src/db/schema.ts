import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", [
  "pending",
  "payment_pending",
  "paid",
  "expired",
  "cancelled",
]);

export const reservationStatus = pgEnum("reservation_status", [
  "active",
  "completed",
  "expired",
  "cancelled",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "processing",
  "succeeded",
  "failed",
  "refunded",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const territories = pgTable(
  "territories",
  {
    id: text("id").primaryKey(),

    ownerId: text("owner_id").references(() => users.id),

    owner: text("owner").notNull(),
    website: text("website"),
    description: text("description"),

    x: integer("x").notNull(),
    y: integer("y").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),

    purchasedAt: timestamp("purchased_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("territory_owner_idx").on(table.ownerId),
    index("territory_position_idx").on(table.x, table.y),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),

    userId: text("user_id").references(() => users.id),

    status: orderStatus("status").default("pending").notNull(),

    amount: integer("amount").notNull(),
    currency: text("currency").default("USD").notNull(),

    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    paidAt: timestamp("paid_at"),
  },
  (table) => [
    index("order_user_idx").on(table.userId),
    index("order_status_idx").on(table.status),
  ],
);

export const reservations = pgTable(
  "reservations",
  {
    id: text("id").primaryKey(),

    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),

    userId: text("user_id").references(() => users.id),

    x: integer("x").notNull(),
    y: integer("y").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),

    amount: integer("amount").notNull(),
    owner: text("owner"),
    website: text("website"),
    description: text("description"),

    status: reservationStatus("status").default("active").notNull(),

    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("reservation_order_idx").on(table.orderId),
    index("reservation_status_idx").on(table.status),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),

    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),

    provider: text("provider").default("dodo").notNull(),
    providerPaymentId: text("provider_payment_id"),

    status: paymentStatus("status").default("pending").notNull(),

    amount: integer("amount").notNull(),
    currency: text("currency").default("USD").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("payment_order_idx").on(table.orderId),
    index("payment_provider_idx").on(table.provider, table.providerPaymentId),
    uniqueIndex("payment_provider_payment_id_uq").on(
      table.provider,
      table.providerPaymentId,
    ),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("session_user_idx").on(table.userId)],
);
