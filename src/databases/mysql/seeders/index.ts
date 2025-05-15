import logger from 'utils/logger';

import { DB } from '..';

import initUserModel from '../models/user.model';
import initEventModel from '../models/event.model';
import initEventParticipantModel from '../models/eventParticipant.model';
import initPostModel from '../models/post.model';
import initCommentModel from '../models/comment.model';
import initRequestModel from '../models/request.model';
import initInvitationModel from '../models/invitation.model';
import initNotificationModel from '../models/notification.model';

import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';
import { InvitationStatus } from 'interfaces/invitation.interface';

async function seedDatabase() {
  try {
    await DB.sequelize.authenticate();

    const User = initUserModel(DB.sequelize);
    const Event = initEventModel(DB.sequelize);
    const EventParticipant = initEventParticipantModel(DB.sequelize);
    const Post = initPostModel(DB.sequelize);
    const Comment = initCommentModel(DB.sequelize);
    const Request = initRequestModel(DB.sequelize);
    const Invitation = initInvitationModel(DB.sequelize);
    const Notification = initNotificationModel(DB.sequelize);

    // Clear tables in correct order to avoid FK constraint errors
    await EventParticipant.destroy({ where: {} });
    await Invitation.destroy({ where: {} });
    await Request.destroy({ where: {} });
    await Comment.destroy({ where: {} });
    await Post.destroy({ where: {} });
    await Notification.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create default admin user
    const defaultUser = {
      id: faker.string.uuid(),
      name: 'admin',
      email: 'bang2004@gmail.com',
      role: 'user',
      phone: faker.phone.number(),
      password: await hash('bang2004', 12),
    };

    // Create 10 primary users
    const users = await Promise.all(
      Array.from({ length: 10 }).map(async (_, i) => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'user',
        password: await hash(`${i + 1}`, 12),
        phone: faker.phone.number(),
      })),
    );

    await User.bulkCreate([...users, defaultUser]);

    // Create 2–3 events per user
    const createRandomEvent = (ownerId: string) => {
      const start = faker.date.future();
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

      return {
        name: faker.lorem.words(3),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        owner_id: ownerId,
        is_public: faker.datatype.boolean(),
        location: faker.location.city(),
        capacity: faker.number.int({ min: 10, max: 100 }),
        description: faker.lorem.paragraph(),
        image_url: faker.image.url(),
      };
    };

    const events = users.flatMap((user) => {
      const eventCount = faker.number.int({ min: 2, max: 3 });
      return Array.from({ length: eventCount }).map(() =>
        createRandomEvent(user.id),
      );
    });

    const defaultUserEvents = Array.from({
      length: faker.number.int({ min: 2, max: 3 }),
    }).map(() => createRandomEvent(defaultUser.id));

    await Event.bulkCreate([...events, ...defaultUserEvents]);

    // Create 100 users who will join events
    const joiningUsers = await Promise.all(
      Array.from({ length: 100 }).map(async (_, i) => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'user',
        password: await hash(`joiner${i + 1}`, 12),
        phone: faker.phone.number(),
      })),
    );

    await User.bulkCreate(joiningUsers);

    const allEvents = await Event.findAll();
    const allUser = await User.findAll();

    // Track participants
    const seen = new Set<string>();
    const participants = [];

    for (const user of [...joiningUsers, ...users, defaultUser]) {
      const eventsToJoin = faker.helpers.arrayElements(
        allEvents.filter((e) => e.owner_id !== user.id),
        faker.number.int({ min: 2, max: 3 }),
      );

      for (const event of eventsToJoin) {
        const key = `${user.id}-${event.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          participants.push({
            user_id: user.id,
            event_id: event.id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }

    await EventParticipant.bulkCreate(participants);

    // Build participant map
    const participantMap: Record<string, string[]> = {};
    for (const event of allEvents) {
      participantMap[event.id] = participants
        .filter((p) => p.event_id === event.id)
        .map((p) => p.user_id);
    }

    // Create posts
    const posts = allEvents.flatMap((event) => {
      const userIds = participantMap[event.id] || [];
      return Array.from({ length: faker.number.int({ min: 2, max: 4 }) }).map(
        () => {
          const authorId = faker.helpers.arrayElement(userIds);
          return {
            id: faker.string.uuid(),
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(2),
            eventId: event.id,
            userId: authorId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        },
      );
    });

    await Post.bulkCreate(posts);

    const allPosts = await Post.findAll();
    const comments = allPosts.flatMap((post) => {
      const validUserIds = participantMap[post.eventId] || [];
      const commenters = faker.helpers.arrayElements(
        validUserIds,
        Math.min(validUserIds.length, faker.number.int({ min: 3, max: 6 })),
      );
      return commenters.map((userId) => ({
        id: faker.string.uuid(),
        content: faker.lorem.sentences(2),
        postId: post.id,
        userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
    });

    await Comment.bulkCreate(comments);

    // Requests: each user requests 4 public events not already joined
    const requests = [];
    for (const user of allUser) {
      const joinedEventIds = new Set(
        participants
          .filter((p) => p.user_id === user.id)
          .map((p) => p.event_id),
      );

      const requestableEvents = allEvents.filter(
        (event) =>
          event.is_public &&
          event.owner_id !== user.id &&
          !joinedEventIds.has(event.id),
      );

      const requested = faker.helpers.arrayElements(
        requestableEvents,
        Math.min(4, requestableEvents.length),
      );

      for (const event of requested) {
        requests.push({
          status: 'pending',
          eventId: event.id,
          userId: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    await Request.bulkCreate(requests);

    const invitations = [];

    for (const event of allEvents) {
      const invitedUserIds = new Set<string>();
      const joinedUserIds = new Set(
        participants
          .filter((p) => p.event_id === event.id)
          .map((p) => p.user_id),
      );

      const candidates = allUser.filter(
        (u) =>
          u.id !== event.owner_id &&
          !joinedUserIds.has(u.id) &&
          !invitedUserIds.has(u.id),
      );

      const selected = faker.helpers.arrayElements(
        candidates,
        Math.min(10, candidates.length),
      );

      for (const user of selected) {
        const key = `${event.id}-${user.id}`;
        if (!invitedUserIds.has(user.id)) {
          invitedUserIds.add(user.id);
          invitations.push({
            id: faker.string.uuid(),
            event_id: event.id,
            user_id: user.id,
            status: InvitationStatus.PENDING,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }

    await Invitation.bulkCreate(invitations);

    const notifications = [];

    // 1. Notifications for requests made to default user's events
    const defaultUserEventIds = allEvents
      .filter((event) => event.owner_id === defaultUser.id)
      .map((e) => e.id);

    const requestsToDefaultUserEvents = requests.filter((r) =>
      defaultUserEventIds.includes(r.eventId),
    );

    for (const req of requestsToDefaultUserEvents) {
      const event = allEvents.find((e) => e.id === req.eventId);
      notifications.push({
        id: faker.string.uuid(),
        userId: defaultUser.id,
        title: 'New Join Request',
        description: `User requested to join your event: ${event?.name}`,
        isRead: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // 2. Notifications for approved requests (default user joined public events)
    const approvedEventIds = participants
      .filter((p) => p.user_id === defaultUser.id)
      .map((p) => p.event_id);

    for (const eventId of approvedEventIds) {
      const event = allEvents.find((e) => e.id === eventId);
      notifications.push({
        id: faker.string.uuid(),
        userId: defaultUser.id,
        title: 'Request Approved',
        description: `You have joined the event: ${event?.name}`,
        isRead: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // 3. Notifications for rejected requests (default user requests not in participants)
    const requestedEventIds = requests
      .filter((r) => r.userId === defaultUser.id)
      .map((r) => r.eventId);

    const rejectedEventIds = requestedEventIds.filter(
      (eid) => !approvedEventIds.includes(eid),
    );

    for (const eventId of rejectedEventIds) {
      const event = allEvents.find((e) => e.id === eventId);
      notifications.push({
        id: faker.string.uuid(),
        userId: defaultUser.id,
        title: 'Request Rejected',
        description: `Your request to join ${event?.name} was rejected.`,
        isRead: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    await Notification.bulkCreate(notifications);

    logger.info(
      `Seeded ${users.length + 1} primary users and ${joiningUsers.length} joiners.`,
    );
    logger.info(`Created ${events.length + defaultUserEvents.length} events.`);
    logger.info(`Inserted ${participants.length} participants.`);
    logger.info(`Created ${posts.length} posts.`);
    logger.info(`Inserted ${comments.length} comments.`);
    logger.info(`Created ${requests.length} requests.`);
    logger.info('Database seeding completed successfully.');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
