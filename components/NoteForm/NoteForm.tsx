'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createNote } from '@/lib/api/notes';
import type { NewNote, NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
  onCreated: () => void;
}

const noteTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must be at most 500 characters'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(noteTags, 'Select a valid tag')
    .required('Tag is required'),
});

const NoteForm = ({ onCancel, onCreated }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCreated();
    },
  });

  const formik = useFormik<NewNote>({
    initialValues: {
      title: '',
      content: '',
      tag: 'Todo',
    },
    validationSchema,
    onSubmit: (values) => {
      createMutation.mutate(values);
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className={css.input}
          {...formik.getFieldProps('title')}
        />
        <span className={css.error}>
          {formik.touched.title && formik.errors.title
            ? formik.errors.title
            : ''}
        </span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={8}
          className={css.textarea}
          {...formik.getFieldProps('content')}
        />
        <span className={css.error}>
          {formik.touched.content && formik.errors.content
            ? formik.errors.content
            : ''}
        </span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" className={css.select} {...formik.getFieldProps('tag')}>
          {noteTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span className={css.error}>
          {formik.touched.tag && formik.errors.tag ? formik.errors.tag : ''}
        </span>
      </div>

      {createMutation.isError && (
        <p className={css.error}>Failed to create note. Try again.</p>
      )}

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
