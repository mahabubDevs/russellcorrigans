import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

// import { ProductValidation } from "./Product.validation";

import { fileUploader } from "../../../helpars/fileUploader";
import { PropertyValidation } from "./Property.validation";
import {  PropertyController } from "./Property.controller";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// Price Calculation Route
router.post(
  "/",
  auth(UserRole.Customer),
  fileUploader.uploadMultipleImage,
  validateRequest(PropertyValidation.PropertyValidationSchema),
  PropertyController.createProperty
);

router.get(
  "/", auth(UserRole.Customer),
  PropertyController.getAllProperty
);

router.put("/:id", auth(UserRole.Customer), PropertyController.updateProperty)
router.delete("/:id", auth(UserRole.Customer), PropertyController.deleteProperty)


export const PropertyRoutes = router;







