import React, { useState } from "react";

const EMPTY = { name: "", description: "", status: "pending" };

export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      await onCreate({
        name: form.name.trim(),
        description: form.description.trim() || null,
        status: form.status,
      });
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>New task</h2>
      {error && <div className="error">{error}</div>}
      <label htmlFor="name">Name</label>
      <input id="name" name="name" value={form.name} onChange={onChange} maxLength={200} />
      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" value={form.description} onChange={onChange} rows={3} />
      <label htmlFor="status">Status</label>
      <select id="status" name="status" value={form.status} onChange={onChange}>
        <option value="pending">Pending</option>
        <option value="in_progress">In progress</option>
        <option value="finished">Finished</option>
      </select>
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create task"}
      </button>
    </form>
  );
}