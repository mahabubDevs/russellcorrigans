import { z } from "zod";

const productValidationSchema = z.object({
  serviceType: z.enum(["snow", "lawn"], {
    required_error: "Service type is required",
  }),
  
  driveways: z.array(z.enum(["1-car", "2-car", "3-car"])).optional(),
  isCornerLot: z.boolean().optional(),
  extraFeet: z.number().optional(),
  isSteep: z.boolean().optional(),
  isPriority: z.boolean().optional(),
});

export const ProductValidation = {
  productValidationSchema
};













