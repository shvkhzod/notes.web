import type NoteSettingsRepositoryInterface from '@/domain/noteSettings.repository.interface';
import type NoteSettings from '@/domain/entities/NoteSettings';
import type NotesApiTransport from '@/infrastructure/transport/notes-api';
import type { NoteId } from '@/domain/entities/Note';
import type { GetNoteSettingsResponsePayload } from '@/infrastructure/transport/notes-api/types/GetNoteSettingsResponsePayload';

/**
 * Note settings repository
 */
export default class NoteSettingsRepository implements NoteSettingsRepositoryInterface {
  /**
   * Transport instance
   */
  private readonly transport: NotesApiTransport;

  /**
   * Note repository constructor
   *
   * @param notesApiTransport - notes api transport instance
   */
  constructor(notesApiTransport: NotesApiTransport) {
    this.transport = notesApiTransport;
  }

  /**
   * Returns setting for a note by note ID
   *
   * @param id - Note id
   * @returns { NoteSettings } - NoteSettings instance
   */
  public async getNoteSettingsById(id: NoteId): Promise<NoteSettings> {
    return await this.transport.get<GetNoteSettingsResponsePayload>('/note-settings/' + id);
  }

  /**
   * Updates note settings
   *
   * @param id - Note id
   * @param data - Note settings data with new values
   * @returns { NoteSettings } updated note settings
   */
  public async patchNoteSettingsByNoteId(id: NoteId, data: Partial<NoteSettings>): Promise<NoteSettings> {
    return await this.transport.patch<NoteSettings>('/note-settings/' + id, data);
  }
}
