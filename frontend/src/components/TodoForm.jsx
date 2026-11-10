import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDueDate, parseISODate, toISODate } from '../utils/dates';

const DESCRIPTION_MAX = 200;

export default function TodoForm({
  initialValues,
  onSubmit,
  submitLabel,
  submitting,
  error,
}) {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    dueDate: initialValues?.dueDate ? initialValues.dueDate.slice(0, 10) : '',
    status: initialValues?.status || 'pending',
  });
  const [titleError, setTitleError] = useState('');
  const [dueDateError, setDueDateError] = useState('');

  // The deadline can't be before the creation day (today, for a new todo)
  const minDateISO = toISODate(
    initialValues?.createdAt ? new Date(initialValues.createdAt) : new Date()
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!form.title.trim()) {
      setTitleError('Todo title is required');
      valid = false;
    } else {
      setTitleError('');
    }

    if (form.dueDate && form.dueDate < minDateISO) {
      setDueDateError(
        `Due date cannot be before the creation date (${formatDueDate(minDateISO)})`
      );
      valid = false;
    } else {
      setDueDateError('');
    }

    if (!valid) return;

    onSubmit({ ...form, dueDate: form.dueDate || null });
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit} noValidate>
      <h1>{submitLabel === 'Create Todo' ? 'Create Todo' : 'Edit Todo'}</h1>

      {error && <p className="alert-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
        />
        {titleError && <span className="field-error">{titleError}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          maxLength={DESCRIPTION_MAX}
          value={form.description}
          onChange={handleChange}
        />
        <span className="char-count">
          {form.description.length}/{DESCRIPTION_MAX}
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <DatePicker
          id="dueDate"
          selected={parseISODate(form.dueDate)}
          onChange={(date) => setForm({ ...form, dueDate: toISODate(date) })}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          minDate={parseISODate(minDateISO)}
          isClearable
          autoComplete="off"
        />
        {dueDateError && <span className="field-error">{dueDateError}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>

      <p className="auth-switch">
        <Link to="/dashboard">Cancel</Link>
      </p>
    </form>
  );
}