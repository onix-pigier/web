"use client";

import { useState } from 'react';
import Link from 'next/link';

// Données temporaires pour démonstration
const mockData = [
  {
    id: 1,
    date: '2023-05-15',
    employee: 'Jean Dupont',
    hours: 8,
    rate: 25,
    amount: 200
  },
  {
    id: 2,
    date: '2023-05-16',
    employee: 'Marie Martin',
    hours: 7.5,
    rate: 30,
    amount: 225
  },
];

export default function Resultats() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrage et tri des données
  const filteredData = mockData.filter(item =>
    item.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Résultats </h2>
          <div className="flex space-x-4">
            <Link href="/resultats" className="text-teal-600 hover:text-teal-800 font-medium">
              Résultat
            </Link>
            <Link href="/about" className="text-teal-600 hover:text-teal-800 font-medium">
              À propos
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom ou date..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th 
                  className="border p-3 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort('date')}
                >
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border p-3 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort('numero')}
                >
                  Numéro de téléphone {sortConfig.key === 'numéro' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border p-3 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort('Nom')}
                >
                  Nom {sortConfig.key === 'Nom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border p-3 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort('prénoms')}
                >
                  Prénoms {sortConfig.key === 'prénoms' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border p-3 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort('satisfaction')}
                >
                  Niveau de satisfaction  {sortConfig.key === 'satiscation' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border p-3 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort('Genre')}
                >
                  Genre {sortConfig.key === 'Genre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border p-3 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort('commune')}
                >
                    Commune  {sortConfig.key === 'commune' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                sortedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border p-3">{item.date}</td>
                    <td className="border p-3">{item.employee}</td>
                    <td className="border p-3">{item.hours}</td>
                    <td className="border p-3">{item.rate}</td>
                    <td className="border p-3 font-medium">€{item.amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border p-3 text-center text-gray-500">
                    Aucun résultat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Développé par NAE, CESARIO et AICA (Groupe 3)</p>
        </div>
      </div>
    </div>
  );
}