// Notification.service: Module file for the Notification.service functionality.

import httpStatus from 'http-status';
import AppError from '../../../errors/ApiErrors';
import admin from '../../../shared/firebase';
import prisma from '../../../shared/prisma';

const sendNotification = async (
  deviceToken: string,
  title: string,
  body: string,
  userId: string,
) => {
  // Ensure that deviceToken is a single string and not an array.
  if (!deviceToken || typeof deviceToken !== 'string') {
    throw new Error('Invalid device token');
  }

  // Create the message object.
  const message = {
    notification: { title, body },
    token: deviceToken,
  };

  try {
    console.log('Sending notification to token:', deviceToken);

    // Send notification using Firebase Admin SDK
    const response = await admin.messaging().send(message);

    console.log('Notification response:', response);

    // If there was no response, throw an error
    if (!response) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Error sending notification');
    }

    // Save the notification to the database
    await prisma.notification.create({
      data: {
        title,
        body,
        userId,
      },
    });

    console.log('Notification sent successfully');
  } catch (error) {
    // Log the error and throw it
    console.error('Error sending notification:', error);
    throw error;
  }
};


const getAllNotifications = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        title: true,
        body: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

const getNotificationByUserId = async (userId: string) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        title: true,
        body: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications by user ID:', error);
    throw error;
  }
};

const readNotificationByUserId = async (userId: string) => {
  try {
    const notifications = await prisma.notification.updateMany({
      where: { userId: userId, read: false },
      data: { read: true },
    });
    return notifications;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

const deleteNotificationById = async (
  userId: string,
  notificationId: string,
) => {
  try {
    const notification = await prisma.notification.delete({
      where: { id: notificationId, userId: userId },
    });
    return notification;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
export const notificationService = {
  sendNotification,
  getAllNotifications,
  getNotificationByUserId,
  readNotificationByUserId,
  deleteNotificationById,
};
