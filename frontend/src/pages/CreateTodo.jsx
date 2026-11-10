import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TodoForm from '../components/TodoForm';

export default function CreateTodo() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError('');

    try {
      await api.post('/todos', values);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <TodoForm
        onSubmit={handleSubmit}
        submitLabel="Create Todo"
        submitting={submitting}
        error={error}
      />
    </div>
  );
}