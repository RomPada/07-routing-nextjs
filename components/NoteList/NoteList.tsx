'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { deleteNote } from '@/lib/api';
import type { Note } from '@/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (noteId: string): void => {
    deleteMutation.mutate(noteId);
  };

  return (
    <>
      <ul className={css.list}>
        {notes.map((note) => {
          const isDeleting =
            deleteMutation.isPending && deleteMutation.variables === note.id;

          return (
            <li className={css.listItem} key={note.id}>
              <h2 className={css.title}>{note.title}</h2>
              <p className={css.content}>{note.content}</p>
              <div className={css.footer}>
                <span className={css.tag}>{note.tag}</span>
                <Link className={css.link} href={`/notes/${note.id}`}>
                  View details
                </Link>
                <button
                  type="button"
                  className={css.button}
                  disabled={isDeleting}
                  onClick={() => handleDelete(note.id)}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {deleteMutation.isError && <p>Failed to delete note. Try again.</p>}
    </>
  );
};

export default NoteList;
