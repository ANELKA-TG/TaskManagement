import { Link } from 'react-router-dom';

export default function TodoCard({ todo, onView, onToggleStatus, onDelete }) {
  const isCompleted = todo.status === 'completed';

  return (
    <div className={`todo-card ${isCompleted ? 'completed' : ''}`}>
      <h3 className="todo-title">{todo.title}</h3>

      <div className="todo-actions">
        <button className="btn btn-outline" onClick={() => onView(todo)}>
          View Details
        </button>

        <button className="btn btn-outline" onClick={() => onToggleStatus(todo)}>
          {isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        </button>

        {!isCompleted && (
          <Link to={`/todos/${todo._id}/edit`} className="btn btn-outline">
            Edit
          </Link>
        )}

        <button className="btn btn-danger" onClick={() => onDelete(todo)}>
          Delete
        </button>
      </div>
    </div>
  );
}