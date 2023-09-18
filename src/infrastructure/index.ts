import NoteRepository from '@/infrastructure/note.repository';
import NoteSettingsRepository from '@/infrastructure/noteSettings.repository';
import NoteStore from '@/infrastructure/storage/note';
import NoteSettingsStore from '@/infrastructure/storage/noteSettings';
import NotesApiTransport from '@/infrastructure/transport/notes-api';
import AuthRepository from '@/infrastructure/auth.repository';
import AuthStore from '@/infrastructure/storage/auth';
import UserRepository from '@/infrastructure/user.repository';
import { UserStore } from '@/infrastructure/storage/user';
import type EventBus from '@/domain/event-bus';
import type AuthCompletedEvent from '@/domain/event-bus/events/AuthCompleted';
import { AUTH_COMPLETED_EVENT_NAME } from '@/domain/event-bus/events/AuthCompleted';

/**
 * Repositories
 */
export interface Repositories {
  /**
   * Working with Note data
   */
  note: NoteRepository;

  /**
   * Working with Note settings data
   */
  noteSettings: NoteSettingsRepository;

  /**
   * Working with Auth data
   */
  auth: AuthRepository;

  /**
   * Working with User data
   */
  user: UserRepository;
}

/**
 * Init repositories
 *
 * @param noteApiUrl - Note API url
 * @param eventBus - Common domain event bus
 */
export function init(noteApiUrl: string, eventBus: EventBus): Repositories {
  /**
   * Init storages
   */
  const noteStore = new NoteStore();
  const authStore = new AuthStore();
  const userStore = new UserStore();
  const noteSettingsStore = new NoteSettingsStore();

  /**
   * Init transport
   */
  const notesApiTransport = new NotesApiTransport(noteApiUrl);

  /**
   * When we got authorized
   */
  eventBus.addEventListener(AUTH_COMPLETED_EVENT_NAME, (event: AuthCompletedEvent) => {
    /**
     * Authorize API transport
     */
    notesApiTransport.authorize(event.detail.accessToken);

    /**
     * Save refresh token
     */
    authStore.setRefreshToken(event.detail.refreshToken);
  });

  /**
   * Init repositories
   */
  const noteRepository = new NoteRepository(noteStore, notesApiTransport);
  const noteSettingsRepository = new NoteSettingsRepository(noteSettingsStore, notesApiTransport);
  const authRepository = new AuthRepository(authStore, notesApiTransport);
  const userRepository = new UserRepository(userStore, notesApiTransport);

  return {
    note: noteRepository,
    noteSettings: noteSettingsRepository,
    auth: authRepository,
    user: userRepository,
  };
}
