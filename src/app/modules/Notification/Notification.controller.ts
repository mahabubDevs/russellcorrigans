// Notification.controller: Module file for the Notification.controller functionality.
import { notificationService } from './Notification.service';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const sendNotificationToUser = catchAsync(async (req, res) => {
  const { deviceToken, title, body, userId } = req.body;
    console.log("body",req.body)
  if (!deviceToken || !title || !body || !userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Device token, title, and body are required !',
    });
  }

  await notificationService.sendNotification(deviceToken, title, body, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification sent successfully',
    data: null,
  });
});

const getAllNotificationsController = catchAsync(async (req: Request, res: Response) => {

  const user = req.user as any;
  const notifications = await notificationService.getAllNotifications();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications fetched successfully',
    data: notifications,
  });
});

const getNotificationByUserIdController = catchAsync(async (req: Request, res: Response) => {
  const  user  = req.user as any;
  const notifications = await notificationService.getNotificationByUserId(user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications fetched successfully',
    data: notifications,
  });
});

const readNotificationByUserIdController = catchAsync(async (req: Request, res: Response) => {
  const  user  = req.user as any;
  const notifications = await notificationService.readNotificationByUserId(user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications marked as read successfully',
    data: notifications,
  });
});

const deleteNotificationByIdController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const  notificationId  = req.params.id;
  const result = await notificationService.deleteNotificationById(user.id, notificationId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: result,
  });
});

export const NotificationController = {
  sendNotificationToUser,
  getAllNotificationsController,
  getNotificationByUserIdController,
  readNotificationByUserIdController,
  deleteNotificationByIdController,
};
