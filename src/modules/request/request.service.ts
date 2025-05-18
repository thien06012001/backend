import { IRequest, Request } from 'interfaces/request.interface';
import { requestRepo } from './request.repo';
import { eventRepo } from 'modules/event/event.repo';
import { faker } from '@faker-js/faker/.';
import { DB } from 'databases/mysql';

export const createRequest = async (post: IRequest): Promise<Request> => {
  return await requestRepo.create(post);
};

export const cancelRequest = async (eventId: string, userId: string) => {
  return await requestRepo.cancel(userId, eventId);
};

export const getRequestById = async (requestId: string): Promise<Request> => {
  const request = await requestRepo.getById(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  return request;
};

export const approveRequest = async (requestId: string) => {
  const request = await requestRepo.getById(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  const { userId, eventId } = request;

  await eventRepo.addParticipant(eventId, userId);
  await requestRepo.cancel(userId, eventId);

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

export const rejectRequest = async (requestId: string) => {
  const request = await requestRepo.getById(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  const { userId, eventId } = request;

  await requestRepo.cancel(userId, eventId);

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
