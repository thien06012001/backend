import { CustomError } from 'utils/error.custom';
import { eventRepo } from './event.repo';
import { IEventRequest } from 'interfaces/event.interface';

export const getEventById = async (eventId: string) => {
  const event = await eventRepo.getById(eventId);

  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  return event;
};

export const getAllEvents = async () => {
  return await eventRepo.getAll();
};

export const createEvent = async (event: IEventRequest) => {
  return await eventRepo.create(event);
};

export const updateEvent = async (eventId: string, event: IEventRequest) => {
  const [updated] = await eventRepo.update(eventId, event);

  if (!updated) {
    throw new CustomError('Event not found', 404);
  }

  return event;
};

export const deleteEvent = async (eventId: string) => {
  const deleted = await eventRepo.delete(eventId);

  if (!deleted) {
    throw new CustomError('Event not found', 404);
  }

  return deleted;
};
