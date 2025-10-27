'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Tree } from '@/lib/types';

// Dynamically import TreeMap to avoid SSR issues with Leaflet
const TreeMap = dynamic(() => import('@/components/TreeMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px]">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
    </div>
  )
});

interface Project {
  id: number;
  project_number: string;
  name: string;
}

export default function MapPage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');

  useEffect(() => {
    fetchTrees();
    fetchProjects();
  }, []);

  const fetchTrees = async () => {
    try {
      const response = await fetch('/api/trees');
      const data = await response.json();
      setTrees(data);
    } catch (error) {
      console.error('Error fetching trees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const filteredTrees = trees.filter(tree => {
    const statusMatch = filterStatus ? tree.status === filterStatus : true;
    const projectMatch = filterProject ? tree.project_id?.toString() === filterProject : true;
    return statusMatch && projectMatch;
  });

  // Statystyki dla aktualnie wyfiltrowanych drzew (po projekcie)
  const treesForStats = filterProject 
    ? trees.filter(t => t.project_id?.toString() === filterProject)
    : trees;

  const stats = {
    total: treesForStats.length,
    posadzone: treesForStats.filter(t => t.status === 'posadzone').length,
    utrzymanie: treesForStats.filter(t => t.status === 'utrzymanie').length,
    wymiana: treesForStats.filter(t => t.status === 'wymiana').length,
    usuniete: treesForStats.filter(t => t.status === 'usuniete').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Powrót
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mapa Drzew</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Filtr projektów */}
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400"
              >
                <option value="">Wszystkie projekty</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_number} - {project.name}
                  </option>
                ))}
              </select>
              
              <Link
                href="/add-tree"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center whitespace-nowrap"
              >
                + Dodaj Drzewo
              </Link>
            </div>
          </div>

          {/* Stats - Legenda kolorów pinezek */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <button
              onClick={() => setFilterStatus('')}
              className={`p-4 rounded-lg text-left transition-all cursor-pointer ${
                filterStatus === ''
                  ? 'bg-gray-800 dark:bg-slate-700 text-white shadow-lg scale-105'
                  : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-white hover:scale-105'
              }`}
            >
              <p className="text-sm font-semibold">📍 Wszystkie</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </button>

            <button
              onClick={() => setFilterStatus('posadzone')}
              className={`p-4 rounded-lg text-left transition-all border-2 cursor-pointer ${
                filterStatus === 'posadzone'
                  ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/50 scale-105'
                  : 'bg-green-50 dark:bg-slate-800 border-green-500 hover:bg-green-100 dark:hover:bg-slate-700 text-green-800 dark:text-green-400 hover:scale-105'
              }`}
            >
              <p className="text-sm font-semibold">🌳 Posadzone</p>
              <p className="text-2xl font-bold">{stats.posadzone}</p>
            </button>

            <button
              onClick={() => setFilterStatus('utrzymanie')}
              className={`p-4 rounded-lg text-left transition-all border-2 cursor-pointer ${
                filterStatus === 'utrzymanie'
                  ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-blue-50 dark:bg-slate-800 border-blue-500 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-800 dark:text-blue-400 hover:scale-105'
              }`}
            >
              <p className="text-sm font-semibold">🔧 Utrzymanie</p>
              <p className="text-2xl font-bold">{stats.utrzymanie}</p>
            </button>

            <button
              onClick={() => setFilterStatus('wymiana')}
              className={`p-4 rounded-lg text-left transition-all border-2 cursor-pointer ${
                filterStatus === 'wymiana'
                  ? 'bg-yellow-500 border-yellow-400 text-white shadow-lg shadow-yellow-500/50 scale-105'
                  : 'bg-yellow-50 dark:bg-slate-800 border-yellow-500 hover:bg-yellow-100 dark:hover:bg-slate-700 text-yellow-800 dark:text-yellow-400 hover:scale-105'
              }`}
            >
              <p className="text-sm font-semibold">⚠️ Wymiana</p>
              <p className="text-2xl font-bold">{stats.wymiana}</p>
            </button>

            <button
              onClick={() => setFilterStatus('usuniete')}
              className={`p-4 rounded-lg text-left transition-all border-2 cursor-pointer ${
                filterStatus === 'usuniete'
                  ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/50 scale-105'
                  : 'bg-red-50 dark:bg-slate-800 border-red-500 hover:bg-red-100 dark:hover:bg-slate-700 text-red-800 dark:text-red-400 hover:scale-105'
              }`}
            >
              <p className="text-sm font-semibold">❌ Usunięte</p>
              <p className="text-2xl font-bold">{stats.usuniete}</p>
            </button>
          </div>

          {/* Map */}
          {loading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : (
            <TreeMap trees={filteredTrees} />
          )}
        </div>
      </div>
    </div>
  );
}
