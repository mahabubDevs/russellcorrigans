import { Request, Response } from "express";
import { ProductService} from "./Product.service";
import { fileUploader } from "../../../helpars/fileUploader";
import  {haversine}  from "../../../shared/haversine";
import prisma from "../../../shared/prisma";
import { ProductStatus } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import catchAsync from "../../../shared/catchAsync";
import { userService } from "../User/user.services";

// PriceCalculation করতে গেলে UserId সহ ডেটা নিতে হবে
const createProduct = async (req: Request, res: Response) => {
  console.log("calculatePrice", req.body);


  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
     // Parse the JSON string from "data"
  
    let imageUrls: string[] = [];
  
    if (files?.images && files.images.length > 0) {
      const uploads = await Promise.all(
        files.images.map(async (file) => {
          // Upload to Cloudinary (or switch to uploadToDigitalOcean if needed)
          const uploaded = await fileUploader.uploadToCloudinary(file);
          return uploaded.Location;
        })
      );
      imageUrls = uploads;
    }
  
    // Combine user data with image URLs
 
  try {
    // এখানে আমরা req.body তে userId পাঠানোর কথা বলছি
    // আগে থেকেই userId req.body তে পাস করা হলে, তা priceCalculation এ সঠিকভাবে অন্তর্ভুক্ত হবে

    console.log("calculatePrice try", req.body);
    const property = await prisma.property.findUnique({
      where: {id: req.params.propertyId},
    })

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // PriceCalculation করার সময় req.body তে userId থাকতে হবে
    const result = await ProductService.createProduct(req.body,imageUrls,property);
    console.log("calculatePrice result", result);
    res.status(200).json({
      message: "Service create successfully",
      result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
};


// const getAllPrices = async (req: Request, res: Response) => {
//   try {
//     const result = await ProductService.getAll(req.params.id);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       message: error.message || "Something went wrong",
//     });
//   }
// }


const getProductWithProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
console.log("productId", id)
    // CreateProduct এবং সম্পর্কিত Property ডেটা নিয়ে আসা
    const product = await prisma.createProduct.findUnique({
      where: { id: id },
      include: {
        propertyDetails: true, // Property সম্পর্কিত ডেটা অন্তর্ভুক্ত করুন
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // প্রাপ্ত ডেটা রেসপন্সে পাঠানো
    res.json({ message: 'Product fetched successfully', result: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  } 
}

// const updateProduct = async (req: Request, res: Response) => {
//   try {
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     console.log("updateProduct", req.body);
//     const body = JSON.parse(req.body.data); // Parse the JSON string from "data"
//     // const body = req.body; // Assuming the data is already in JSON format
//     console.log("updateProduct body", body);
  
//     let imageUrls: string[] = [];
  
//     if (files?.images && files.images.length > 0) {
//       const uploads = await Promise.all(
//         files.images.map(async (file) => {
//           // Upload to Cloudinary (or switch to uploadToDigitalOcean if needed)
//           const uploaded = await fileUploader.uploadToCloudinary(file);
//           return uploaded.Location;
//         })
//       );
//       imageUrls = uploads;
//     }
  
//     // Combine user data with image URLs
//     const userPayload = {
//       ...body,
//       images: imageUrls,
//     };
  
//     const result = await ProductService.updateProduct(userPayload, req.params.id);
  
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       message: error.message || "Something went wrong",
//     });
//   }
// }

// Provider: Get nearby products
// const getNearbyProducts = async (req: Request, res: Response) => {
//   const { lat, lng } = req.query;
//   console.log("getNearbyProducts", req.query);

//   // Ensure lat and lng are provided in the query
//   if (!lat || !lng) {
//     return res.status(400).json({ message: 'Latitude and longitude are required' });
//   }

//   try {
//     // Fetch products with their related Property data
//     const products = await prisma.createProduct.findMany({
//       where: {
//         status: ProductStatus.PENDING,
//       },
//       include: {
//         propertyDetails: true, // Include the related Property data
//       },
//     });

//     // Ensure the latitude and longitude are numbers
//     const userLocation = { lat: Number(lat), lng: Number(lng) };

//     // Filter products based on their proximity to the user
//     const productsWithDistance = products.map((product) => {
//       if (!product.propertyDetails) return null;

//       const { lat: propertyLat, lng: propertyLng } = product.propertyDetails;

//       // Ensure lat and lng are valid numbers
//       if (typeof propertyLat !== 'number' || typeof propertyLng !== 'number') return null;

//       // Calculate the distance from the user's location to the product's property
//       const distance = haversine(userLocation, { lat: propertyLat, lng: propertyLng });

//       // Return the product with the calculated distance
//       return {
//         ...product,
//         distance,
//       };
//     }).filter(Boolean); // Remove any null values

//     // Sort products by distance (ascending order)
//     const sortedProducts = productsWithDistance.sort((a:any, b:any) => a.distance - b.distance);

//     res.json(sortedProducts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };





const getNearbyProducts = async (req: Request, res: Response) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    const providerLocation = { lat: Number(lat), lng: Number(lng) };

    const products = await prisma.createProduct.findMany({
      where: {
        status: ProductStatus.PENDING,
      },
      include: {
        propertyDetails: true,
      },
    });

    // Map products with distance
    const productsWithDistance = products.map((product) => {
      const property = product.propertyDetails;

      if (!property || typeof property.lat !== 'number' || typeof property.lng !== 'number') return null;

      const productLocation = { lat: property.lat, lng: property.lng };
      const distance = haversine(providerLocation, productLocation);

      return {
        ...product,
        distance,
      };
    }).filter(Boolean); // remove nulls

    // Sort all by distance (low to high)
    const sortedProducts = productsWithDistance.sort((a:any, b:any) => a.distance - b.distance);

    res.json(sortedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Provider: Accept product
 const acceptProduct = async (req: Request, res: Response) => {
  const providerId = req.user.id;
  const productId = req.params.id;

  const product = await prisma.createProduct.update({
    where: { id: productId },
    data: {
      providerId,
      status: ProductStatus.ACCEPTED,
    },
  });

  res.json({ product });
};

// Provider: Complete product
 const completeProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const { completedImages } = req.body;

  const updated = await prisma.createProduct.update({
    where: { id: productId },
    data: {
      status: ProductStatus.COMPLETED,
      completedImages,
    },
  });

  res.json({ message: 'Project marked as completed', updated });
};

// image upload
const updateProjectImage = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const providerId = req.user.id
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // if not found any image
  if (!files?.images || files.images.length === 0) {
    throw new ApiError(400, "No images found"); 
  }

  // Every image upload to cloudinary
  const imageUrls = await Promise.all(
    files.images.map(async (file) => {
      const uploaded = await fileUploader.uploadToCloudinary(file);
      return uploaded.Location;
    })
  );

  // service call to update user document
  const user = await ProductService.updateProjectImage (providerId, imageUrls, productId);

  res.status(200).json({
    success: true,
    message: "successfully updated user document!",
    data: user,
  });
});




// Customer: Get my created products
 const getMyProducts = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const myProducts = await prisma.createProduct.findMany({
    where: { userId },
  });

  res.json(myProducts);
};


const rejectProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const providerId = req.user.id; // ✅ নিশ্চিত করুন middleware দিয়ে req.user আছে

  try {
    const product = await prisma.createProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.status !== 'PENDING') {
      return res.status(400).json({ error: 'Product is not pending' });
    }

    // ✅ একই provider আগে reject করেছে কিনা, চেক করুন
    const alreadyRejected = await prisma.rejectedProduct.findFirst({
      where: {
        productId,
        providerId,
      },
    });

    if (alreadyRejected) {
      return res.status(400).json({ error: 'You have already rejected this product' });
    }

    // ✅ RejectedProduct টেবিলে এন্ট্রি তৈরি করুন
    await prisma.rejectedProduct.create({
      data: {
        productId,
        providerId,
      },
    });

    return res.json({ message: 'Product rejected successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const getPendingProducts = async (req: Request, res: Response) => {
  const providerId = req.user.id;

  try {
    const products = await prisma.createProduct.findMany({
      where: {
        status: 'PENDING',
        NOT: {
          rejectedBy: {
            some: {
              providerId: providerId,
            },
          },
        },
      },
    });

    return res.json(products);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const getAcceptProduct = async (req: Request, res: Response) => {
  const providerId = req.user.id;

  try {
    

    const products = await prisma.createProduct.findMany({
      where: {
        status: 'ACCEPTED',
        providerId: providerId,
      },
    });

    return res.json(products);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const getAcceptProductDetaisl = async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    
    const product = await prisma.createProduct.findUnique({
      where: {
        id: productId,
      },

    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const provider = await prisma.user.findUnique({
      where: {
        id: product?.providerId!,
      },  
    })

    const customer = await prisma.user.findUnique({
      where: {
        id: product?.userId,
      },  
    })
    res.json({product, provider, customer});


    return res.json(product);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}


export const ProductController = {
  createProduct,
  // getAllPrices,
  getProductWithProperty,
  deleteProduct,
  // updateProduct,
  getNearbyProducts,
  acceptProduct,
  rejectProduct,
  completeProduct,
  getMyProducts,
  getPendingProducts,
  updateProjectImage,
  getAcceptProduct,
  getAcceptProductDetaisl

};


// const createProduct = catchAsync (async (req:Request, res:Response) => {
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   const body = JSON.parse(req.body.data);
//   console.log("createProduct body", body);
//   let imageUrls: string[] = [];

//   if(files?.images && files.images.length > 0 ) {
//     const uploads = await Promise.all(
//       files.images.map(async (file) =>{
//         const uploaded = await fileUploader.uploadToCloudinary(file);
//         return uploaded.Location;
//       })
//     );
//     imageUrls = uploads;
//   }



// const userPayload = {
//   ...body,
//   images: imageUrls, // Attach uploaded image URLs
// };


// const product = await ProductService.createProduct(userPayload);
// res.status(201).json({
//   success: true,
//   message: "Product created successfully!",
//   data: product,
// });
// });

































