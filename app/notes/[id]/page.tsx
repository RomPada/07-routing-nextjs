import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

export const dynamic = 'force-dynamic';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetails({ params }: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  const queryKey = ['note', id] as const;

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchNoteById(id),
  });

  const queryState = queryClient.getQueryState(queryKey);
  if (queryState?.status === 'error') {
    throw queryState.error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
