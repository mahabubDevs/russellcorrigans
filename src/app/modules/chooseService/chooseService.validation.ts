import { z } from "zod";

const PropertyValidationSchema = z.object({

  area: z.number({
    required_error: "Area is required",
    invalid_type_error: "Area must be a number",
  }),
 
});

export const PropertyValidation = {
  PropertyValidationSchema
};
















