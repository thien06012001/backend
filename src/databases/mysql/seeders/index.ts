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
    // Connect to the database
    await DB.sequelize.authenticate();

    // Initialize all models
    const User = initUserModel(DB.sequelize);
    const Event = initEventModel(DB.sequelize);
    const EventParticipant = initEventParticipantModel(DB.sequelize);
    const Post = initPostModel(DB.sequelize);
    const Comment = initCommentModel(DB.sequelize);
    const Request = initRequestModel(DB.sequelize);
    const Invitation = initInvitationModel(DB.sequelize);
    const Notification = initNotificationModel(DB.sequelize);
    const Configuration = initConfigurationModel(DB.sequelize);

    // Clear existing data
    await EventParticipant.destroy({ where: {} });
    await Invitation.destroy({ where: {} });
    await Request.destroy({ where: {} });
    await Comment.destroy({ where: {} });
    await Post.destroy({ where: {} });
    await Notification.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Configuration.destroy({ where: {} });

    // Insert default configuration
    const defaultConfig = {
      maxActiveEvents: 5,
      maxEventCapacity: 50,
      id: faker.string.uuid(),
      defaultParticipantReminder: 2,
      defaultInvitationReminder: 2,
    };
    await Configuration.create(defaultConfig);

    // Create a default user
    const defaultUser = {
      id: faker.string.uuid(),
      name: 'default',
      email: 'default@default.com',
      role: 'user',
      password: await hash('default', 12),
      phone: faker.phone.number(),
    };

    // Generate 10 random users
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

    // Define possible event timing types
    const types: ('past' | 'current' | 'upcoming')[] = [
      'past',
      'current',
      'upcoming',
    ];

    // Function to generate a random event based on type
    const createRandomEvent = (
      ownerId: string,
      type: 'past' | 'current' | 'upcoming',
    ) => {
      const now = new Date();
      let start: Date;
      let end: Date;

      // Determine the start and end time based on the event type
      if (type === 'past') {
        // Past events end between 1 to 14 days ago
        end = faker.date.between({
          from: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          to: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        });
        // Set start time 2 hours before end time
        start = new Date(end.getTime() - 2 * 60 * 60 * 1000);
      } else if (type === 'current') {
        // Current events span 2 hours, centered around the current time
        start = new Date(now.getTime() - 1 * 60 * 60 * 1000); // started 1 hour ago
        end = new Date(now.getTime() + 1 * 60 * 60 * 1000); // ends 1 hour from now
      } else {
        // Upcoming events start within the next 14 days
        start = faker.date.soon({ days: 14 });
        // Set end time 2 hours after start time
        end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      }

      // Return the event object with randomly generated details
      return {
        name: faker.lorem.words(3), // Random event name
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        owner_id: ownerId, // Link event to its creator
        is_public: faker.datatype.boolean(), // Randomly public or private
        location: faker.location.city(), // Random city name
        capacity: faker.number.int({
          min: 10,
          max: defaultConfig.maxEventCapacity, // Respect configured max
        }),
        description: faker.lorem.paragraph(), // Random description text
        image_url: faker.image.url(), // Random image link
        participantReminder: faker.number.int({ min: 2, max: 4 }), // Reminder before start (days)
        invitationReminder: faker.number.int({ min: 2, max: 4 }), // Reminder for invite response
      };
    };

    // Create random events for all users
    const events = users.flatMap((user) => {
      const count = faker.number.int({ min: 2, max: 3 });
      return Array.from({ length: count }).map(() => {
        const type = faker.helpers.arrayElement(types);
        return createRandomEvent(user.id, type);
      });
    });

    // Create random events for the default user
    const defaultUserEvents = Array.from({
      length: faker.number.int({ min: 2, max: 3 }),
    }).map(() => {
      const type = faker.helpers.arrayElement(types);
      return createRandomEvent(defaultUser.id, type);
    });

    await Event.bulkCreate([...events, ...defaultUserEvents]);

    // Create 100 users who will participate in events
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

    // Prepare to assign users as participants to events (2–3 events per user)
    const seen = new Set<string>(); // Track unique user-event pairs to avoid duplicates
    const participants = [];

    // Iterate through all users (joiningUsers, normal users, and the default user)
    for (const user of [...joiningUsers, ...users, defaultUser]) {
      // Select 2–3 random events that the user does not own
      const eventsToJoin = faker.helpers.arrayElements(
        allEvents.filter((e) => e.owner_id !== user.id),
        faker.number.int({ min: 2, max: 3 }),
      );

      for (const event of eventsToJoin) {
        // Create a unique key for user-event combination
        const key = `${user.id}-${event.id}`;

        // Avoid duplicate participant entries
        if (!seen.has(key)) {
          seen.add(key);

          // Push the participant entry to the list
          participants.push({
            user_id: user.id,
            event_id: event.id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }

    // Bulk insert all participants into the EventParticipant table
    await EventParticipant.bulkCreate(participants);

    // Build a map of event ID to list of user IDs who are participants
    const participantMap: Record<string, string[]> = {};
    for (const event of allEvents) {
      participantMap[event.id] = participants
        .filter((p) => p.event_id === event.id)
        .map((p) => p.user_id); // Get all user_ids for the current event
    }

    // Generate posts for each event (2–4 posts per event)
    const posts = allEvents.flatMap((event) => {
      const userIds = participantMap[event.id] || []; // Get valid user IDs for this event

      // Create a random number of posts (2–4) for the event
      return Array.from({ length: faker.number.int({ min: 2, max: 4 }) }).map(
        () => {
          const authorId = faker.helpers.arrayElement(userIds); // Random participant as post author

          return {
            id: faker.string.uuid(),
            title: faker.lorem.sentence(), // Random post title
            content: faker.lorem.paragraphs(2), // Random post content
            eventId: event.id,
            userId: authorId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        },
      );
    });

    // Insert all generated posts into the database
    await Post.bulkCreate(posts);

    // Generate comments for posts by users who are participants of the event
    const allPosts = await Post.findAll();

    const comments = allPosts.flatMap((post) => {
      // Get the list of user IDs who are participants of the post's event
      const validUserIds = participantMap[post.eventId] || [];

      // Randomly select 3–6 participants to comment on the post
      const commenters = faker.helpers.arrayElements(
        validUserIds,
        Math.min(validUserIds.length, faker.number.int({ min: 3, max: 6 })),
      );

      // Create a comment for each selected user
      return commenters.map((userId) => ({
        id: faker.string.uuid(),
        content: faker.lorem.sentences(2), // Random comment content
        postId: post.id,
        userId, // Commenting user ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
    });

    // Bulk insert all generated comments into the database
    await Comment.bulkCreate(comments);

    // Ensure each public event has at least 4 join requests
    const requests = [];

    // Loop through all public events
    for (const event of allEvents.filter((e) => e.is_public)) {
      // Collect user IDs who have already joined this event
      const alreadyJoined = new Set(
        participants
          .filter((p) => p.event_id === event.id)
          .map((p) => p.user_id),
      );

      // Filter out the event owner and users who are already participants
      const eligibleUsers = allUser.filter(
        (u) => u.id !== event.owner_id && !alreadyJoined.has(u.id),
      );

      // Select up to 4 eligible users randomly
      const selected = faker.helpers.arrayElements(
        eligibleUsers,
        Math.min(4, eligibleUsers.length),
      );

      // Create a pending join request for each selected user
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

    // Insert all generated join requests into the database
    await Request.bulkCreate(requests);

    // Ensure each user receives at least 2 invitations to private events
    const invitations = [];

    for (const user of allUser) {
      // Get all event IDs the user is already participating in
      const joined = new Set(
        participants
          .filter((p) => p.user_id === user.id)
          .map((p) => p.event_id),
      );

      // Filter private events that the user is not already in and doesn't own
      const privateEvents = allEvents.filter(
        (e) => !e.is_public && e.owner_id !== user.id && !joined.has(e.id),
      );

      // Select up to 2 private events to send invitations for
      const selected = faker.helpers.arrayElements(
        privateEvents,
        Math.min(2, privateEvents.length),
      );

      // Create a pending invitation for each selected private event
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

    // Insert all generated invitations into the database
    await Invitation.bulkCreate(invitations);

    // Generate notifications for the default user
    const notifications = [];

    // Get all event IDs owned by the default user
    const defaultUserEventIds = allEvents
      .filter((e) => e.owner_id === defaultUser.id)
      .map((e) => e.id);

    // Find all join requests sent to the default user's events
    const requestsToDefaultUserEvents = requests.filter((r) =>
      defaultUserEventIds.includes(r.eventId),
    );

    // Notify default user of incoming join requests to their events
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

    // Find events that the default user has successfully joined
    const approvedEventIds = participants
      .filter((p) => p.user_id === defaultUser.id)
      .map((p) => p.event_id);

    // Notify default user of approved join requests
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

    // Find all events the default user requested to join
    const requestedEventIds = requests
      .filter((r) => r.userId === defaultUser.id)
      .map((r) => r.eventId);

    // Identify which requests were rejected (not in approved list)
    const rejectedEventIds = requestedEventIds.filter(
      (eid) => !approvedEventIds.includes(eid),
    );

    // Notify default user of rejected join requests
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

    // Insert all notifications into the database
    await Notification.bulkCreate(notifications);

    // Add an admin user
    const adminUser = {
      id: faker.string.uuid(),
      name: 'admin',
      email: 'admin@admin.com',
      role: 'admin',
      phone: faker.phone.number(),
      password: await hash('admin', 12),
    };
    await User.create(adminUser);

    // Log summary
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
