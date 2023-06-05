import * as z from "zod";

const dateTimeSchema = z
  .string()
  .refine((val) => {
    // HACK: passthrough empty string
    if (val === "") return true;
    const result = z.coerce.date().safeParse(val);
    return result.success;
  })
  .transform((val) => (val === "" ? undefined : val));

const customerSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  birthday: dateTimeSchema,
  gender: z.number(),
  prefecture: z.string(),
  register_date: dateTimeSchema,
  is_premium: z.coerce.boolean(),
});

export const customersSchema = z.array(customerSchema);

const productSchema = z.object({
  product_id: z.number(),
  product_name: z.string(),
  product_category: z.string(),
  cost: z.number(),
});

export const productsSchema = z.array(productSchema);

const saleSchema = z.object({
  order_id: z.number(),
  user_id: customerSchema.shape.user_id,
  product_id: productSchema.shape.product_id,
  date_time: dateTimeSchema,
  quantity: z.number(),
  revenue: z.number(),
  is_proper: z.coerce.boolean(),
});

export const salesSchema = z.array(saleSchema);

const _webLogSchema = z.object({
  cid: z.coerce.string(),
  user_id: z
    .union([customerSchema.shape.user_id, z.string().length(0)])
    // for coming blank string
    .transform((id) => (id === "" ? undefined : id)),
  device: z.string(),
  session_count: z.number(),
  media: z.string(),
  date_time: dateTimeSchema,
  page: z.string(),
});

export const webLogSchema = z.array(_webLogSchema);
