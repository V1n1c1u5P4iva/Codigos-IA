import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import { api } from '../api';
import { clearSession, getUser } from '../auth';

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = getUser();

  async function loadTasks() {
    try {
      const data = await api.listTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(payload) {
    setError('');
    setLoading(true);
    try {
      const created = await api.createTask(payload);
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(payload) {
    if (!editing) return;
    setError('');
    setLoading(true);
    try {
      const updated = await api.updateTask(editing.id, payload);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete task "${task.name}"?`)) return;
    setError('');
    try {
      await api.deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      if (editing && editing.id === task.id) setEditing(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <div className="container">
      <div className="row between" style={{ marginBottom: 16 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>My Tasks</h1>
          {user && (
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              Logged in as <strong>{user.username}</strong> ({user.email})
            </div>
          )}
        </div>
        <button className="secondary" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <TaskForm
        initial={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
        onCancel={() => setEditing(null)}
        loading={loading}
      />

      <TaskList tasks={tasks} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}