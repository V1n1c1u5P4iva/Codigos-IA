import { STATUS_LABELS, STATUS_OPTIONS } from "../constants";

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <li className="card task">
      <div className="task-main">
        <h3>{task.name}</h3>
        {task.description && <p>{task.description}</p>}
        <small className="muted">
          Created {new Date(task.created_at).toLocaleString()}
        </small>
      </div>

      <div className="task-actions">
        <span className={`badge badge-${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
        <select
          aria-label="Change status"
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button className="secondary" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </li>
  );
}