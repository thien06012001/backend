import path from 'path';
import logger from 'utils/logger';
import { DB } from '..';
import fs from 'fs';

import initUserModel from '../models/user.model';
import initEventModel from '../models/event.model';
import initEventParticipantModel from '../models/eventParticipant.model';
import initPostModel from '../models/post.model';
import initCommentModel from '../models/comment.model';

import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';

async function seedDatabase() {
  try {
    await DB.sequelize.authenticate();

    const User = initUserModel(DB.sequelize);
    const Event = initEventModel(DB.sequelize);
    const EventParticipant = initEventParticipantModel(DB.sequelize);
    const Post = initPostModel(DB.sequelize);
    const Comment = initCommentModel(DB.sequelize);

    // Clear tables
    await EventParticipant.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Comment.destroy({ where: {} });
    await Post.destroy({ where: {} });

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

    await User.bulkCreate(users);
    await User.create(defaultUser);

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

    // Fetch all events
    const allEvents = await Event.findAll();

    // Create unique participant entries
    const seen = new Set<string>();
    const participants: {
      user_id: string;
      event_id: string;
      created_at: Date;
      updated_at: Date;
    }[] = [];

    for (const user of joiningUsers) {
      const eventsToJoin = faker.helpers.arrayElements(
        allEvents,
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

    // Build eventId -> participant users map
    const participantMap: Record<string, typeof joiningUsers> = {};

    for (const event of allEvents) {
      const pUsers = participants
        .filter((p) => p.event_id === event.id)
        .map((p) => joiningUsers.find((u) => u.id === p.user_id))
        .filter(Boolean) as typeof joiningUsers;

      participantMap[event.id] = pUsers;
    }

    // Create 2–4 posts per event (authored by participants)
    const posts = allEvents.flatMap((event) => {
      const participantUsers = participantMap[event.id] || [];

      return Array.from({ length: faker.number.int({ min: 2, max: 4 }) }).map(
        () => {
          const author =
            participantUsers[
              faker.number.int({ min: 0, max: participantUsers.length - 1 })
            ];

          return {
            id: faker.string.uuid(),
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(2),
            eventId: event.id,
            userId: author.id, // 👈 post author
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        },
      );
    });

    await Post.bulkCreate(posts);

    const allPosts = await Post.findAll();

    // Create 3–6 comments per post from event participants only
    const comments = allPosts.flatMap((post) => {
      const eventId = post.eventId;
      const validUsers = participantMap[eventId] || [];

      const commentingUsers = faker.helpers.arrayElements(
        validUsers,
        Math.min(validUsers.length, faker.number.int({ min: 3, max: 6 })),
      );

      return commentingUsers.map((user) => ({
        id: faker.string.uuid(),
        content: faker.lorem.sentences(2),
        postId: post.id,
        userId: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
    });

    await Comment.bulkCreate(comments);

    logger.info(
      `Seeded ${users.length + 1} primary users and ${joiningUsers.length} joiners.`,
    );
    logger.info(`Created ${events.length + defaultUserEvents.length} events.`);
    logger.info(`Inserted ${participants.length} participants.`);
    logger.info(`Created ${posts.length} posts.`);
    logger.info(`Inserted ${comments.length} comments.`);
    logger.info('Database seeding completed successfully.');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
