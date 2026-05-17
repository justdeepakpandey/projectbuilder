import { Edit2, Trash2 } from "lucide-react";

function ProjectCard({ project, onUpdate, onDelete }) {
  return (
    <div className="glass-panel animate-slide-up" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%" }}>
      <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>{project.title}</h3>
      <p style={{ flexGrow: 1, fontSize: "0.9rem", marginBottom: "1.5rem" }}>{project.description}</p>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
        <button onClick={onUpdate} className="btn" style={{ flex: 1, background: "rgba(255, 255, 255, 0.1)", color: "var(--text-main)" }}>
          <Edit2 size={16} /> Edit
        </button>
        <button onClick={onDelete} className="btn btn-danger" style={{ flex: 1 }}>
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;