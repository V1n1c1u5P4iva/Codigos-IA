import { useCallback, useEffect, useState } from "react";

import { api } from "../api";
import { useAuth } from "../AuthContext.jsx";
import TaskForm from "../components/TaskForm.jsx";
import { STATUS_LABELS, STATUS_OPTIONS } from "../constants";

export default function Tasks() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setTasks(await api.listTasks(filter));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(values) {
    const created = await api.createTask(values);
    if (!filter || filter === created.status) {
      setTasks((prev) => [created, ...prev]);
    }
  }

  async function handleUpdate(id, values) {
    const updated = await api.updateTask(id, values);
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? updated : t));
      return filter ? next.filter((t) => t.status === filter) : next;
    });
    setEditingId(null);
  }

  async function handleQuickStatus(task, status) {
    setError("");
    try {
      await handleUpdate(task.id, { status });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete the task "${task.name}"?`)) return;
    setError("");
    try {
      await api.deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <header className="topbar">
        <h1>Task Manager</h1>
        <div className="topbar-user">
          <span>{user.name}</span>
          <button className="btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <section className="card">
        <h2>New task</h2>
        <TaskForm
          submitLabel="Add task"
          onSubmit={handleCreate}
          resetOnSuccess
        />
      </section>

      <section className="card">
        <div className="list-header">
          <h2>My tasks</h2>
          <label className="inline-label">
            Filter
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="muted">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="muted">No tasks here yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task">
                {editingId === task.id ? (
                  <TaskForm
                    initial={task}
                    submitLabel="Save"
                    onSubmit={(values) => handleUpdate(task.id, values)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div className="task-main">
                      <div className="task-title-row">
                        <h3>{task.name}</h3>
                        <span className={`badge ${task.status}`}>
                          {STATUS_LABELS[task.status]}
                        </span>
                      </div>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                      <small className="muted">
                        Created {new Date(task.created_at).toLocaleString()}
                      </small>
                    </div>

                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleQuickStatus(task, e.target.value)}
                        aria-label="Change status"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <button className="btn" onClick={() => setEditingId(task.id)}>
                        Edit
                      </button>
                      <button className="btn danger" onClick={() => handleDelete(task)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}