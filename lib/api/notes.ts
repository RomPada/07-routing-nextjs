import type { AxiosResponse } from 'axios';
import type { NewNote, Note, NoteTag } from '@/types/note';
import { apiClient } from './client';

const DEFAULT_PER_PAGE = 12;

export interface FetchNotesParams {
  page: number;
  search: string;
  tag?: NoteTag;
  perPage?: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page,
  search,
  tag,
  perPage = DEFAULT_PER_PAGE,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> =
    await apiClient.get<FetchNotesResponse>('/notes', {
      params: {
        page,
        perPage,
        ...(search ? { search } : {}),
        ...(tag ? { tag } : {}),
      },
    });

  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.get<Note>(
    `/notes/${noteId}`,
  );

  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.post<Note>(
    '/notes',
    newNote,
  );

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.delete<Note>(
    `/notes/${noteId}`,
  );

  return response.data;
};
