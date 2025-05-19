import { IRequest, Request } from 'interfaces/request.interface';
import { requestRepo } from './request.repo';
import { eventRepo } from 'modules/event/event.repo';
import { faker } from '@faker-js/faker/.';
import { DB } from 'databases/mysql';
import { CustomError } from 'utils/error.custom';

// Create a new request to join an event
export const createRequest = async (post: IRequest): Promise<Request> => {
  return await requestRepo.create(post);
};

// Cancel a user's request to join a specific event
export const cancelRequest = async (eventId: string, userId: string) => {
  return await requestRepo.cancel(userId, eventId);
};

// Retrieve a specific request by ID
export const getRequestById = async (requestId: string): Promise<Request> => {
  const request = await requestRepo.getById(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  return request;
};

// Approve a user's request to join an event
export const approveRequest = async (requestId: string) => {
  const request = await requestRepo.getById(requestId);

  if (!request) {
    throw new CustomError('Request not found', 404);
  }

  const { userId, eventId } = request;

  // Add user as a participant to the event
  await eventRepo.addParticipant(eventId, userId);

  // Cancel the request (removes it from pending list)
  await requestRepo.cancel(userId, eventId);

  // Notify the user that their request was approved
  const event = await eventRepo.getById(eventId);
  await DB.Notifications.create({
    userId,
    title: 'Request Approved',
    description: `You have joined the event: ${event?.name}`,
    isRead: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    eventId,
  });

  return request;
};

// Reject a user's request to join an event
export const rejectRequest = async (requestId: string) => {
  const request = await requestRepo.getById(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  const { userId, eventId } = request;

  // Cancel the request
  await requestRepo.cancel(userId, eventId);

  // Notify the user that their request was rejected
  const event = await eventRepo.getById(eventId);
  await DB.Notifications.create({
    userId,
    title: 'Request Rejected',
    description: `Your request to join ${event?.name} was rejected.`,
    isRead: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    eventId,
  });

  return request;
};
