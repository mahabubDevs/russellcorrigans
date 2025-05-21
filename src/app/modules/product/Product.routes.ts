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


// router.put("/:id", auth(UserRole.Customer), ProductController.updateProduct);


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


router.get("/:id", auth(UserRole.Customer), ProductController.getProductWithProperty);
router.get(
  "/my-products/",
  auth(UserRole.Customer),
  ProductController.getMyProducts
);
router.get("/", auth(UserRole.Provider), ProductController.getNearbyProducts);
router.get("/accept-product/", auth(UserRole.Provider), ProductController.getAcceptProduct);
router.get("/", auth(UserRole.Provider), ProductController.getAcceptProductDetaisl);


router.put ("/upload-image/:id", auth(UserRole.Provider),fileUploader.uploadMultipleImage, ProductController.updateProjectImage  )
router.delete("/:id", auth(UserRole.Customer), ProductController.deleteProduct);


// router.post("/", fileUploader.uploadSingle, handleCreateProduct);
// router.get("/get-product/:id", auth(UserRole.Customer), ProductController.getAllPrices);

export const ProductRoutes = router;







