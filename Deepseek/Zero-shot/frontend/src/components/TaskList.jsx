const STATUS_LABEL = {
  pending: 'Pending',
  in_progress: 'In Progress',
  finished: 'Finished',
};

export default function TaskList({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <p style={{ color: '#6b7280' }}>No tasks yet. Create your first one above.</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className={`task ${task.status}`}>
          <div className="row between">
            <h3 style={{ margin: 0 }}>{task.name}</h3>
            <span className={`badge ${task.status}`}>{STATUS_LABEL[task.status]}</span>
          </div>
          {task.description && (
            <p style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{task.description}</p>
          )}
          <div className="meta">
            Created: {new Date(task.created_at).toLocaleString()} &middot;{' '}
            Updated: {new Date(task.updated_at).toLocaleString()}
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="ghost" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button
              className="ghost"
              style={{ color: '#dc2626' }}
              onClick={() => onDelete(task)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}