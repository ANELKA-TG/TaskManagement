import TodoCard from './TodoCard';

export default function TodoList({ todos, onView, onToggleStatus, onDelete }) {
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoCard
          key={todo._id}
          todo={todo}
          onView={onView}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}