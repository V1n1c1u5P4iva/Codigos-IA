import React, { useState } from "react";

const STATUS_OPTIONS = ["pending", "in_progress", "finished"];

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: task.name,
    description: task.description || "",
    status: task.status,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });

  const save = async () => {
    setError("");
    if (!draft.name.trim()) {
      setError("Name is required");
      return;
    }
    setBusy(true);
    try {
      await onUpdate(task.id, {
        name: draft.name.trim(),
        description: draft.description.trim() || null,
        status: draft.status,
      });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this task?")) return;
    setBusy(true);
    try {
      await onDelete(task.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="task">
      {error && <div className="error">{error}</div>}
      {!editing ? (
        <>
          <div className="row between">
            <h3>{task.name}</h3>
            <span className={`badge ${task.status}`}>{task.status.replace("_", " ")}</span>
          </div>
          {task.description && <p className="desc">{task.description}</p>}
          <div className="row">
            <button className="link-btn" onClick={() => setEditing(true)} disabled={busy}>
              Edit
            </button>
            <button className="link-btn" onClick={remove} disabled={busy} style={{ color: "#d63b3b" }}>
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <label>Name</label>
          <input name="name" value={draft.name} onChange={onChange} maxLength={200} />
          <label>Description</label>
          <textarea name="description" value={draft.description} onChange={onChange} rows={3} />
          <label>Status</label>
          <select name="status" value={draft.status} onChange={onChange}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
          <div className="row">
            <button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save"}</button>
            <button className="secondary" onClick={() => { setEditing(false); setError(""); }} disabled={busy}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}