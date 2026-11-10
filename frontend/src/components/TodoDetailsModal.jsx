import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCreatedDate, formatDueDate } from '../utils/dates';

export default function TodoDetailsModal({ todo, onClose }) {
  const isCompleted = todo.status === 'completed';

  // Close the popup when Escape is pressed
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="details-title" className="details-title">
          {todo.title}
        </h2>

        <span
          className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}
        >
          {isCompleted ? 'Completed' : 'Pending'}
        </span>

        <dl className="details-list">
          <dt>Description</dt>
          <dd>{todo.description || 'No description'}</dd>

       <dt>Due date</dt>
<dd>{todo.dueDate ? formatDueDate(todo.dueDate) : 'No due date'}</dd>

<dt>Created</dt>
<dd>{formatCreatedDate(todo.createdAt)}</dd>
        </dl>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <Link to={`/todos/${todo._id}/edit`} className="btn btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}