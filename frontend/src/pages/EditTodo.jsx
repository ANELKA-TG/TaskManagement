import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import TodoForm from '../components/TodoForm';
import Loading from '../components/Loading';

export default function EditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/todos/${id}`)
      .then((res) => setTodo(res.data))
      .catch((err) =>
        setLoadError(
          err.response?.status === 404
            ? 'Todo not found'
            : 'Something went wrong. Please try again.'
        )
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError('');

    try {
      await api.put(`/todos/${id}`, values);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading todo..." />;

  if (loadError) {
    return (
      <div className="empty-state">
        <p>{loadError}</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <TodoForm
        initialValues={todo}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        submitting={submitting}
        error={error}
      />
    </div>
  );
}