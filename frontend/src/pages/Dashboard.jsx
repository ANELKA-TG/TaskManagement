import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import TodoList from '../components/TodoList';
import ConfirmModal from '../components/ConfirmModal';
import TodoDetailsModal from '../components/TodoDetailsModal';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

const GENERIC_ERROR = 'Something went wrong. Please try again.';

export default function Dashboard() {
  const { user } = useAuth();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [todoToView, setTodoToView] = useState(null);
  const [deleting, setDeleting] = useState(false);
const [updatingIds, setUpdatingIds] = useState([]);

  useEffect(() => {
    api
      .get('/todos')
      .then((res) => setTodos(res.data))
      .catch(() => setError(GENERIC_ERROR))
      .finally(() => setLoading(false));
  }, []);

 const handleToggleStatus = async (todo) => {
  // Ignore extra clicks while this todo's request is still running
  if (updatingIds.includes(todo._id)) return;

  const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
  setError('');
  setUpdatingIds((prev) => [...prev, todo._id]);

  // 1. Update the UI immediately
  setTodos((prev) =>
    prev.map((t) => (t._id === todo._id ? { ...t, status: newStatus } : t))
  );

  try {
    // 2. Save to the server in the background
    await api.put(`/todos/${todo._id}`, { status: newStatus });
  } catch {
    // 3. If saving failed, undo the change and show an error
    setTodos((prev) =>
      prev.map((t) => (t._id === todo._id ? { ...t, status: todo.status } : t))
    );
    setError('Something went wrong. Please try again.');
  } finally {
    setUpdatingIds((prev) => prev.filter((id) => id !== todo._id));
  }
};

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      await api.delete(`/todos/${todoToDelete._id}`);
      setTodos((prev) => prev.filter((t) => t._id !== todoToDelete._id));
      setTodoToDelete(null);
    } catch {
      setError(GENERIC_ERROR);
      setTodoToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const countFor = (key) =>
    key === 'all' ? todos.length : todos.filter((t) => t.status === key).length;

  const visibleTodos =
    filter === 'all' ? todos : todos.filter((t) => t.status === filter);

  if (loading) return <Loading message="Loading your todos..." />;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Hello, {user.name}</h1>
          <p className="muted">My Todo List</p>
        </div>
        <Link to="/todos/new" className="btn btn-primary">
          + Add Todo
        </Link>
      </div>

      {error && <p className="alert-error">{error}</p>}

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label} ({countFor(f.key)})
          </button>
        ))}
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No todos yet. Click "+ Add Todo" to create your first one.</p>
        </div>
      ) : visibleTodos.length === 0 ? (
        <div className="empty-state">
          <p>No {filter} todos.</p>
        </div>
      ) : (
        <TodoList
          todos={visibleTodos}
          onView={setTodoToView}
          onToggleStatus={handleToggleStatus}
          onDelete={setTodoToDelete}
        />
      )}

      {todoToDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this todo?"
          busy={deleting}
          onCancel={() => setTodoToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {todoToView && (
  <TodoDetailsModal todo={todoToView} onClose={() => setTodoToView(null)} />
)}
       </div>
  );
}