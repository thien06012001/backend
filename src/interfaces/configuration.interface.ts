export interface IConfiguration {
  id: string;
  maxActiveEvents: number; // Maximum number of events to fetch
  maxEventCapacity: number; // Maximum number of participants in an event
  defaultParticipantReminder: number;
  defaultInvitationReminder: number;
}

export interface Configuration extends IConfiguration {}
