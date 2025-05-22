import { Request, Response } from "express";
import { ProductService} from "./Product.service";
import { fileUploader } from "../../../helpars/fileUploader";
import  {haversine}  from "../../../shared/haversine";
import prisma from "../../../shared/prisma";
import { ProductStatus } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import catchAsync from "../../../shared/catchAsync";
import { userService } from "../User/user.services";

// PriceCalculation for a property
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
    

    console.log("calculatePrice try", req.body);
    const property = await prisma.property.findUnique({
      where: {id: req.params.propertyId},
    })

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

  
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




const getProductWithProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
console.log("productId", id)
    
    const product = await prisma.createProduct.findUnique({
      where: { id: id },
      include: {
        propertyDetails: true, 
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

  
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
      scheduleDate: new Date(),
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
  console.log("userId", userId);

  const myProducts = await prisma.createProduct.findMany({
    where: { userId },
    include: {
      propertyDetails: true,
    },
  });
  


  res.json(myProducts);
};


const rejectProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const providerId = req.user.id; 

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

   
    const alreadyRejected = await prisma.rejectedProduct.findFirst({
      where: {
        productId,
        providerId,
      },
    });

    if (alreadyRejected) {
      return res.status(400).json({ error: 'You have already rejected this product' });
    }

   
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
      include: {
      propertyDetails: true,
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

























