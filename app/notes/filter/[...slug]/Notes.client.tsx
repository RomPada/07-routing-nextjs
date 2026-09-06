'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes } from '@/lib/api/notes';
import type { NoteTag } from '@/types/note';
import css from './NotesPage.module.css';

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value.trim());
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string): void => {
    setSearchValue(value);
    updateSearch(value);
  };

  const handlePageChange = ({ selected }: { selected: number }): void => {
    setPage(selected + 1);
  };

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const handleCreated = (): void => {
    setPage(1);
    closeModal();
  };

  useEffect(() => {
    setPage(1);
  }, [tag]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', page, searchQuery, tag],
    queryFn: () => fetchNotes({ page, search: searchQuery, tag }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.totalPages > 0 && page > data.totalPages) {
      setPage(data.totalPages);
    }
  }, [data, page]);

  const hasNotes = Boolean(data?.notes.length);
  const hasPagination = Boolean(data && data.totalPages > 1);

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={handleSearchChange} />

        {hasPagination && data ? (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        ) : null}

        <button type="button" className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}

      {isError && (
        <p>
          Could not fetch the list of notes.{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )}

      {!isLoading && !isError && hasNotes && data && (
        <NoteList notes={data.notes} />
      )}

      {!isLoading && !isError && !hasNotes && <p>No notes found.</p>}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onCreated={handleCreated} />
        </Modal>
      )}
    </main>
  );
}
