import { RabbitServiceName } from '../interface/rabbit.interface';

export const RABBIT_SERVICE_OPTIONS = 'RABBIT_SERVICE_OPTIONS';

export const RABBIT_SERVICES: Record<RabbitServiceName, { queue: string }> =
  {
    ACCOUNT_SERVICE: {
        queue: 'account_queue'
    },
    MEMBER_SERVICE: {
        queue: 'member_queue'
    },
    FEED_SERVICE: {
        queue: 'feed_queue'
    },
    STORY_SERVICE: {
        queue: 'feed_queue'
    },
    SURVEY_SERVICE: {
        queue: 'survey_queue'
    },
    MODERATION_SERVICE: {
        queue: 'moderation_queue'
    },
    REACTION_SERVICE: {
        queue: 'reaction_queue'
    },
    EMAIL_SERVICE: {
        queue: 'email_queue'
    },
    NOTIFICATION_SERVICE: {
        queue: 'notification_queue'
    }
}
