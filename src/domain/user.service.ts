import type UserRepository from '@/domain/user.repository.interface';
import type EventBus from '@/domain/event-bus';
import { AUTH_COMPLETED_EVENT_NAME } from './event-bus/events/AuthCompleted';

/**
 * Business logic for User
 */
export default class UserService {
  /**
   * Facade for accessing user data
   */
  private readonly repository: UserRepository;

  /**
   * Service constructor
   *
   * @param eventBus - Common domain event bus
   * @param userRepository - repository instance
   */
  constructor(private readonly eventBus: EventBus, userRepository: UserRepository) {
    this.repository = userRepository;

    /**
     * When we got authorized
     */
    eventBus.addEventListener(AUTH_COMPLETED_EVENT_NAME, () => {
      this.repository.loadUser();
    });
  }
}