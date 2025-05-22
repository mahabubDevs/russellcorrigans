import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

// import { ProductValidation } from "./Product.validation";
import ProductvalidateRequest from "../../middlewares/productValidation";
import { fileUploader } from "../../../helpars/fileUploader";
import { ProductValidation } from "./Product.validation";
import { ProductController } from "./Product.controller";

const router = express.Router();

// Price Calculation Route
router.post(
  "/:propertyId",
  auth(UserRole.Customer),
  fileUploader.uploadMultipleImage,
  ProductvalidateRequest(ProductValidation.productValidationSchema),
  ProductController.createProduct
);





router.post(
  "/accept-product/:id",
  auth(UserRole.Provider),
  ProductController.acceptProduct
);
router.post(
  "/reject-product/:id",
  auth(UserRole.Provider),
  ProductController.rejectProduct
);
router.post(
  "/complete-product/:id",
  auth(UserRole.Provider),
  ProductController.completeProduct
);


router.get(
  "/my-products",
  auth(UserRole.Customer),
  ProductController.getMyProducts
);
router.get("/", auth(UserRole.Provider), ProductController.getNearbyProducts);
router.get("/accept-product/", auth(UserRole.Provider), ProductController.getAcceptProduct);
router.get("/", auth(UserRole.Provider), ProductController.getAcceptProductDetaisl);
router.get("/:id", auth(UserRole.Customer), ProductController.getProductWithProperty);


router.put ("/upload-image/:id", auth(UserRole.Provider),fileUploader.uploadMultipleImage, ProductController.updateProjectImage  )
router.delete("/:id", auth(UserRole.Customer), ProductController.deleteProduct);




export const ProductRoutes = router;







