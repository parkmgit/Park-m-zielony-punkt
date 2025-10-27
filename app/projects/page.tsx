'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderPlus, Edit, Trash2, ArrowLeft, TreePine } from 'lucide-react';

interface Project {
  id: number;
  project_number: string;
  name: string;
  location?: string;
  client?: string;
  trees_to_plant: number;
  trees_planted: number;
  sites_count?: number;
  trees_count?: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć projekt "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Projekt został usunięty');
        loadProjects();
      } else {
        const error = await response.json();
        alert(error.error || 'Błąd podczas usuwania projektu');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Wystąpił błąd podczas usuwania projektu');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      if (response.ok) {
        alert('Projekt został zaktualizowany');
        setEditingProject(null);
        loadProjects();
      } else {
        const error = await response.json();
        alert(error.error || 'Błąd podczas aktualizacji projektu');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Wystąpił błąd podczas aktualizacji projektu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">Ładowanie projektów...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót
          </Link>

          <Link
            href="/add-project"
            className="inline-flex items-center gap-2 bg-green-600 dark:bg-[#22c55e] text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            Dodaj Projekt
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur rounded-3xl shadow-lg dark:shadow-[0_0_30px_rgba(34,197,94,0.3)] p-8 border-[3px] border-gray-200 dark:border-[#22c55e]">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-[#22c55e] mb-6">
            Lista Projektów
          </h1>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderPlus className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Nie masz jeszcze żadnych projektów
              </p>
              <Link
                href="/add-project"
                className="inline-flex items-center gap-2 bg-green-600 dark:bg-[#22c55e] text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-500"
              >
                <FolderPlus className="w-5 h-5" />
                Dodaj Pierwszy Projekt
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 border-2 border-gray-200 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-500 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                          {project.project_number}
                        </span>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {project.name}
                        </h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {project.location && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Lokalizacja</p>
                            <p className="text-gray-800 dark:text-white">{project.location}</p>
                          </div>
                        )}
                        {project.client && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Klient</p>
                            <p className="text-gray-800 dark:text-white">{project.client}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Drzewa</p>
                          <p className="text-gray-800 dark:text-white flex items-center gap-2">
                            <TreePine className="w-4 h-4 text-green-600 dark:text-green-400" />
                            {project.trees_count || 0} / {project.trees_to_plant}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="Edytuj"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.name)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        title="Usuń"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-green-500">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Edytuj Projekt
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  Numer Projektu
                </label>
                <input
                  type="text"
                  value={editingProject.project_number}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, project_number: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  Nazwa Projektu
                </label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  Lokalizacja
                </label>
                <input
                  type="text"
                  value={editingProject.location || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, location: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  Klient
                </label>
                <input
                  type="text"
                  value={editingProject.client || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  Ilość drzew do posadzenia
                </label>
                <input
                  type="number"
                  value={editingProject.trees_to_plant}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      trees_to_plant: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-600 dark:bg-[#22c55e] text-white py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-500 font-semibold"
              >
                Zapisz
              </button>
              <button
                onClick={() => setEditingProject(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 font-semibold"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
