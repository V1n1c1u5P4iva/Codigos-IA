import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { STATUS_OPTIONS } from "../constants";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    try {
      setTasks(await api.listTasks(filter || undefined));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(action) {
    setError("");
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDelete(task) {
    if (!window.confirm(`Delete "${task.name}"?`)) return;
    run(() => api.deleteTask(task.id));
  }

  function handleStatusChange(task, status) {
    run(() => api.updateTask(task.id, { status }));
  }

  return (
    <>
      <h2>New task</h2>
      <TaskForm
        submitLabel="Add task"
        resetOnSuccess
        onSubmit={async (data) => {
          await api.createTask(data);
          await load();
        }}
      />

      <div className="list-header">
        <h2>My tasks</h2>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && tasks.length === 0 && <p className="muted">Loading…</p>}
      {!loading && tasks.length === 0 && !error && (
        <p className="muted">No tasks found.</p>
      )}

      <ul className="task-list">
        {tasks.map((task) =>
          editingId === task.id ? (
            <li key={task.id}>
              <TaskForm
                initial={task}
                submitLabel="Update"
                onCancel={() => setEditingId(null)}
                onSubmit={async (data) => {
                  await api.updateTask(task.id, data);
                  setEditingId(null);
                  await load();
                }}
              />
            </li>
          ) : (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={(t) => setEditingId(t.id)}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )
        )}
      </ul>
    </>
  );
}