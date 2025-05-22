import { Request, Response } from "express";
import {  PropertyService} from "./Property.service";
import { fileUploader } from "../../../helpars/fileUploader";
import  {haversine}  from "../../../shared/haversine";
import prisma from "../../../shared/prisma";
import { ProductStatus } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import catchAsync from "../../../shared/catchAsync";
import { userService } from "../User/user.services";
import { ProductService } from "../product/Product.service";


const createProperty = async (req: Request, res: Response) => {
 
  try {
   

    const result = await PropertyService.createProperty(req.body);
    console.log("calculatePrice result", result);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
};


const getAllProperty = async (req: Request, res: Response) => {
  console.log("req.params.id", req.params.id);
  try {
    const result = await PropertyService.getAllProperty(req.params.id);
    console.log("calculatePrice result", result);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
}






const deleteProperty = async (req: Request, res: Response) => {
  try {
    const result = await PropertyService.deleteProperty(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  } 
}


const updateProperty = async (req:Request, res:Response) => {
  try{
      const body = (req.body);
      const result = await PropertyService.updateProperty(body, req.params.id);
      res.status(200).json(result);
  }catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
}


export const PropertyController = {
  createProperty,
  getAllProperty,
  deleteProperty,
  updateProperty,


};




























