/*"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi'; // Import d'une icône de recherche

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Recherche envoyée:', query); // À remplacer par l'appel API
      // router.push(`/search?q=${encodeURIComponent(query)}`); // Pour navigation
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="relative max-w-md mx-auto w-full"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          aria-label="Barre de recherche"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 focus:outline-none"
          aria-label="Lancer la recherche"
        >
          <FiSearch className ="h-5 w-5" />
        </button>
      </div>
      
      {/* Suggestions (optionnel) */
    //}
      {/* {query && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
          <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Résultats pour "{query}"
          </div>
        </div>
      )} */}
 //   </form>
/*  );
};

export default SearchBar;*/