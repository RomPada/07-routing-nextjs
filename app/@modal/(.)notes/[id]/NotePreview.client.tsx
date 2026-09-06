'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/notes';
import css from './NotePreview.module.css';

export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const closeModal = (): void => {
    router.back();
  };

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <Modal onClose={closeModal}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (error || !note) {
    return (
      <Modal onClose={closeModal}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  const formattedDate = note.updatedAt
    ? `Updated at: ${new Date(note.updatedAt).toLocaleDateString()}`
    : `Created at: ${new Date(note.createdAt).toLocaleDateString()}`;

  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
          <button className={css.backBtn} type="button" onClick={closeModal}>
            Go back
          </button>
        </div>
      </div>
    </Modal>
  );
}
