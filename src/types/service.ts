import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { services, categories } from "@/lib/schema";

export type Service = InferSelectModel<typeof services>;
export type NewService = InferInsertModel<typeof services>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type ServiceFormData = {
  name: string;
  url: string;
  icon: string;
  color: string;
  glassEffect: boolean;
};
