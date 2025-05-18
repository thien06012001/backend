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
import initConfigurationModel from '../models/configuration.model';

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
    const Configuration = initConfigurationModel(DB.sequelize);

    await EventParticipant.destroy({ where: {} });
    await Invitation.destroy({ where: {} });
    await Request.destroy({ where: {} });
    await Comment.destroy({ where: {} });
    await Post.destroy({ where: {} });
    await Notification.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Configuration.destroy({ where: {} });

    const defaultConfig = {
      maxActiveEvents: 5,
      maxEventCapacity: 50,
      id: faker.string.uuid(),
      defaultParticipantReminder: 2,
      defaultInvitationReminder: 2,
    };
    await Configuration.create(defaultConfig);

    const defaultUser = {
      id: faker.string.uuid(),
      name: 'admin',
      email: 'admin@admin.com',
      role: 'admin',
      phone: faker.phone.number(),
      password: await hash('admin', 12),
    };

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

    const types: ('past' | 'current' | 'upcoming')[] = [
      'past',
      'current',
      'upcoming',
    ];

    const createRandomEvent = (
      ownerId: string,
      type: 'past' | 'current' | 'upcoming',
    ) => {
      const now = new Date();
      let start: Date;
      let end: Date;

      if (type === 'past') {
        end = faker.date.between({
          from: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          to: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        });
        start = new Date(end.getTime() - 2 * 60 * 60 * 1000);
      } else if (type === 'current') {
        start = new Date(now.getTime() - 1 * 60 * 60 * 1000);
        end = new Date(now.getTime() + 1 * 60 * 60 * 1000);
      } else {
        start = faker.date.soon({ days: 14 });
        end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      }

      return {
        name: faker.lorem.words(3),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        owner_id: ownerId,
        is_public: faker.datatype.boolean(),
        location: faker.location.city(),
        capacity: faker.number.int({
          min: 10,
          max: defaultConfig.maxEventCapacity,
        }),
        description: faker.lorem.paragraph(),
        image_url: faker.image.url(),
        participantReminder: faker.number.int({ min: 2, max: 4 }),
        invitationReminder: faker.number.int({ min: 2, max: 4 }),
      };
    };

    const events = users.flatMap((user) => {
      const count = faker.number.int({ min: 2, max: 3 });
      return Array.from({ length: count }).map(() => {
        const type = faker.helpers.arrayElement(types);
        return createRandomEvent(user.id, type);
      });
    });

    const defaultUserEvents = Array.from({
      length: faker.number.int({ min: 2, max: 3 }),
    }).map(() => {
      const type = faker.helpers.arrayElement(types);
      return createRandomEvent(defaultUser.id, type);
    });

    await Event.bulkCreate([...events, ...defaultUserEvents]);

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

    const participantMap: Record<string, string[]> = {};
    for (const event of allEvents) {
      participantMap[event.id] = participants
        .filter((p) => p.event_id === event.id)
        .map((p) => p.user_id);
    }

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

    // ✅ Ensure each public event has at least 4 join requests
    const requests = [];

    for (const event of allEvents.filter((e) => e.is_public)) {
      const alreadyJoined = new Set(
        participants
          .filter((p) => p.event_id === event.id)
          .map((p) => p.user_id),
      );
      const eligibleUsers = allUser.filter(
        (u) => u.id !== event.owner_id && !alreadyJoined.has(u.id),
      );
      const selected = faker.helpers.arrayElements(
        eligibleUsers,
        Math.min(4, eligibleUsers.length),
      );

      for (const user of selected) {
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

    // ✅ Ensure each user gets at least 2 invitations to private events
    const invitations = [];

    for (const user of allUser) {
      const joined = new Set(
        participants
          .filter((p) => p.user_id === user.id)
          .map((p) => p.event_id),
      );
      const privateEvents = allEvents.filter(
        (e) => !e.is_public && e.owner_id !== user.id && !joined.has(e.id),
      );
      const selected = faker.helpers.arrayElements(
        privateEvents,
        Math.min(2, privateEvents.length),
      );

      for (const event of selected) {
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

    await Invitation.bulkCreate(invitations);

    // Notifications
    const notifications = [];

    const defaultUserEventIds = allEvents
      .filter((e) => e.owner_id === defaultUser.id)
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
        eventId: event!.id,
      });
    }

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
        eventId: event!.id,
      });
    }

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
        eventId: event!.id,
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
    logger.info(`Created ${invitations.length} invitations.`);
    logger.info('Database seeding completed successfully.');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
