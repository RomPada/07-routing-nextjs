import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

export const dynamic = 'force-dynamic';

const validTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

interface NotesByTagPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesByTagPage({ params }: NotesByTagPageProps) {
  const { slug } = await params;

  if (slug.length !== 1) {
    notFound();
  }

  const filter = slug[0];
  const tag = filter === 'all' ? undefined : (filter as NoteTag);

  if (tag && !validTags.includes(tag)) {
    notFound();
  }

  const initialPage = 1;
  const initialSearch = '';
  const queryClient = new QueryClient();
  const queryKey = ['notes', initialPage, initialSearch, tag] as const;

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () =>
      fetchNotes({ page: initialPage, search: initialSearch, tag }),
  });

  const queryState = queryClient.getQueryState(queryKey);
  if (queryState?.status === 'error') {
    throw queryState.error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
