import type { ReactNode } from 'react';
import css from './LayoutNotes.module.css';

interface NotesFilterLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function NotesFilterLayout({
  sidebar,
  children,
}: NotesFilterLayoutProps) {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
}
