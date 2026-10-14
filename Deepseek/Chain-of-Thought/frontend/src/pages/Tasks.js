import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { api } from "../api";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

export default function Tasks() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const list = await api.listTasks(filter || undefined);
      setTasks(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (payload) => {
    const created = await api.createTask(payload);
    setTasks((prev) => [created, ...prev]);
  };

  const updateTask = async (id, payload) => {
    const updated = await api.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="container">
      <div className="nav">
        <div>
          <h1 style={{ margin: 0, display: "inline-block", marginRight: 16 }}>My tasks</h1>
          <span style={{ fontSize: 13, color: "#666" }}>
            Signed in as {user?.email}
          </span>
        </div>
        <button className="secondary" onClick={logout}>Log out</button>
      </div>

      <TaskForm onCreate={createTask} />

      <div className="card">
        <div className="row between">
          <h2 style={{ margin: 0 }}>Tasks</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 180, margin: 0 }}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
        {loading && <p>Loading...</p>}

        <div style={{ marginTop: 12 }}>
          {!loading && tasks.length === 0 && <p>No tasks yet.</p>}
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}