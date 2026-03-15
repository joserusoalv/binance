# Zod Schema Blueprint

Schemas live in `data-access/schemas/`. They are the **single source of truth** for both runtime validation and TypeScript types.

## File: `domains/<domain>/data-access/schemas/<entity>.schema.ts`

```typescript
import { z } from 'zod';

// ── Enums ───────────────────────────────────────────────────────────────────
export const OrderSideSchema = z.enum(['BUY', 'SELL']);
export type OrderSide = z.infer<typeof OrderSideSchema>;

// ── Nested Schema ───────────────────────────────────────────────────────────
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string().length(2), // ISO 3166-1 alpha-2
});

// ── Main Entity Schema ──────────────────────────────────────────────────────
export const <Entity>Schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  side: OrderSideSchema,
  price: z.number().positive(),
  address: AddressSchema,
  createdAt: z.coerce.date(), // Coerces ISO string → Date object
});

// ── Derived Types (NEVER define separately) ─────────────────────────────────
export type <Entity> = z.infer<typeof <Entity>Schema>;
export type Address = z.infer<typeof AddressSchema>;

// ── API Response Wrappers ───────────────────────────────────────────────────
// Use when the API wraps results in a standard envelope
export const <Entity>ListResponseSchema = z.object({
  data: <Entity>Schema.array(),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
});
export type <Entity>ListResponse = z.infer<typeof <Entity>ListResponseSchema>;

// ── Transformation (API shape → Domain shape) ───────────────────────────────
// Use `.transform()` when the API naming convention differs from your domain
export const ApiOrderSchema = z
  .object({
    order_id: z.string(),       // snake_case from API
    order_price: z.string(),    // API sends price as string
  })
  .transform((raw) => ({
    id: raw.order_id,           // camelCase in domain
    price: parseFloat(raw.order_price),
  }));

export type ApiOrder = z.infer<typeof ApiOrderSchema>;
```

## Key Rules

| Rule | Rationale |
|------|-----------|
| Types via `z.infer` only | Schema is the single source of truth |
| `z.coerce.date()` for timestamps | Safely converts ISO strings to `Date` |
| `.transform()` for API → Domain mapping | Isolates API contracts from domain models |
| Schemas in `data-access/schemas/` | Clear location, easy to find and update |
| Only schema + type exported from barrel | Implementation details stay internal |
