
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

import { CreateProductRequest,ProductResponse } from "./Product.interface";
import { ProductStatus, Property } from "@prisma/client";


// const getBasePrice = (area: number): number => {
//   if (area <= 3000) return 45 + 45 * 0.10;       // $45 + 10%
//   if (area <= 5000) return 65 + 65 * 0.10;       // $65 + 10%
//   if (area <= 8000) return 85 + 85 * 0.10;       // $85 + 10%
//   if (area <= 12000) return 100 + 100 * 0.10;    // $100 + 10%

//   // If area is larger, calculate per square foot
//   const base = area * 0.01;                      // Assume $0.01 per sq ft
//   return base + base * 0.10;                     // + 10% extra
// };

const calculateAdditionsPrice = (data: any): number => {
  let additions = 0;

  // Driveways
  if (data.driveways && data.driveways.length > 0) {
    data.driveways.forEach((type:any) => {
      if (type === "1-car") additions += 45;
      if (type === "2-car") additions += 65;
      if (type === "3-car") additions += 85;
    });
  }


  if (data.isCornerLot) additions += 15;


  if (data.extraFeet && data.extraFeet > 0) {
    additions += Math.ceil(data.extraFeet / 20) * 10;
  }


  if (data.isSteep) additions += 15;

  // Priority
  if (data.isPriority) additions += 20;

  return additions;
};


const createProduct = async (data: CreateProductRequest, imageUrls: string[],property:Property ) => {
  console.log("Calculating price for data:", data);

  // Ensure we have userId for tracking purposes
  if (!data.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required.");
  }

  const basePrice = property.basePrice;
  const vat = basePrice * 0.1

  if (basePrice === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Custom quote area. Please contact support.");
  }

  let additionsPrice = 0;

  if (data.serviceType === "snow" || "lawn") {
    additionsPrice = calculateAdditionsPrice(data);
  }

  const totalPrice = basePrice + additionsPrice + vat;

//   // Save to database and associate with the user
 const product =  await prisma.createProduct.create({
  data: {
    serviceType: data.serviceType || "snow",
   
   
    driveways: data.driveways || [],
    isCornerLot: data.isCornerLot || false,
    extraFeet: data.extraFeet || 0,
    isSteep: data.isSteep || false,
    isPriority: data.isPriority || false,

    additionsPrice: additionsPrice || 0,
    totalPrice: totalPrice || 0,
    userId: data.userId,
    images: imageUrls || [], // Save images if provided
    providerId: data.providerId,
    propertyId: property.id,
  },
  include: {
    propertyDetails: true,
  }
});


  return {
    product,
    vat
   
  };
};






const getPriceById = async (id: string) => {
  const price = await prisma.createProduct.findUnique({
    where: { id },
  });
  if (!price) {
    throw new ApiError(httpStatus.NOT_FOUND, "Price calculation not found.");
  }
  return price;
};



const deleteProduct = async (id: string) => {
  const product = await prisma.createProduct.findUnique({
    where: { id },
  });
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found.");
    }
    await prisma.createProduct.delete({
        where: { id },
    });
    return { message: "Product deleted successfully." };
}




const updateProjectImage = async (providerId: string, imageUrls: string[], productId:string) => {
  const user = await prisma.user.findUnique({ where: { id: providerId } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedProduct = await prisma.createProduct.update({
    where: { id: productId},
    data: {
      completedImages: { push: imageUrls }, 
      status: ProductStatus.COMPLETED  // Push new images to the existing array
    },
    
  });

  return updatedProduct;
};


export const ProductService = {
  createProduct,
  getPriceById,

  deleteProduct,

  updateProjectImage,

};


