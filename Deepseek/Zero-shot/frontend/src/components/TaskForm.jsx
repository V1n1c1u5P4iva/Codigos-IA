import { useEffect, useState } from 'react';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'finished', label: 'Finished' },
];

export default function TaskForm({ initial, onSubmit, onCancel, loading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
      setStatus(initial.status);
    } else {
      setName('');
      setDescription('');
      setStatus('pending');
    }
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name, description, status });
  }

  return (
    <div className="card">
      <h3>{initial ? 'Edit Task' : 'New Task'}</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="task-name">Name</label>
        <input
          id="task-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
        />

        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={5000}
        />

        <label htmlFor="task-status">Status</label>
        <select
          id="task-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="row">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : initial ? 'Save changes' : 'Create task'}
          </button>
          {initial && (
            <button type="button" className="secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}