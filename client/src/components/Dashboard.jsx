import { useState, useEffect } from "react";
import { LogOut, PlusCircle, Sparkles } from "lucide-react";
import ProjectCard from "./ProjectCard";

const API_URL = "http://localhost:5000/api/projects";

function Dashboard({ setToken }) {
  const [skills, setSkills] = useState("");
  const [project, setProject] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();
      setSavedProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  function generateProject() {
    if (!skills.trim()) return;
    const text = skills.toLowerCase();

    if (text.includes("react")) {
      setProject({
        title: "AI Resume Analyzer",
        description: "Build an AI-powered ATS system that parses resumes and ranks candidates.",
      });
    } else if (text.includes("java")) {
      setProject({
        title: "Microservices Job Portal",
        description: "A highly scalable job portal using Spring Boot microservices and Kafka.",
      });
    } else {
      setProject({
        title: "Smart Interview Platform",
        description: "A platform that conducts mock interviews using NLP and provides feedback.",
      });
    }
  }

  async function saveProject() {
    if (!project) return;

    try {
      const response = await fetch(`${API_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save project");
        return;
      }

      setProject(null);
      setSkills("");
      loadProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  }

  async function deleteProject(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete project");
        return;
      }

      loadProjects();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateProject(id) {
    const newTitle = prompt("Enter new title:");
    const newDesc = prompt("Enter new description:");

    if (!newTitle || !newDesc) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to update project");
        return;
      }

      loadProjects();
    } catch (err) {
      console.error(err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="container animate-slide-up">
      <nav className="navbar">
        <div className="logo">
          <Sparkles />
          <span>AI Project Builder</span>
        </div>
        <button onClick={handleLogout} className="btn btn-danger">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="glass-panel" style={{ marginBottom: "3rem" }}>
        <h2>Generate New Project</h2>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Enter your skills (e.g., React, Node.js, Java)..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button onClick={generateProject} className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
            <Sparkles size={18} /> Generate
          </button>
        </div>

        {project && (
          <div className="glass-panel animate-slide-up" style={{ marginTop: "2rem", background: "rgba(99, 102, 241, 0.1)", borderColor: "var(--primary-color)" }}>
            <h3 style={{ color: "var(--primary-color)" }}>{project.title}</h3>
            <p style={{ marginBottom: "1.5rem" }}>{project.description}</p>
            <button onClick={saveProject} className="btn btn-primary">
              <PlusCircle size={18} /> Save Project
            </button>
          </div>
        )}
      </div>

      <h2>Your Saved Projects</h2>
      {savedProjects.length === 0 ? (
        <p style={{ textAlign: "center", padding: "3rem 0" }}>No saved projects yet. Generate one above!</p>
      ) : (
        <div className="projects-grid">
          {savedProjects.map((item) => (
            <ProjectCard
              key={item._id}
              project={item}
              onUpdate={() => updateProject(item._id)}
              onDelete={() => deleteProject(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
