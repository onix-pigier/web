"use client";

import { useState } from 'react';

export default function Coordinates() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    contact: '',
    sexe: '',
    commune: '',
    age: '',
    motif: '',
    satisfaction: '',
    commentaire: '',
    service: ''
  });

  const communes = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"];
  const motifs = ["Consultation", "Traitement", "Urgence", "Autre"];
  const services = ["Cardiologie", "Pédiatrie", "Radiologie", "Chirurgie"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données soumises:', formData);
    // Ajoutez ici l'envoi au backend
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">
          Formulaire Unique
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section Informations Personnelles */}
          <div className="space-y-4 p-4 bg-gray-50 rounded">
            <h3 className="font-bold text-lg text-teal-600">Informations Personnelles</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                className="p-2 border rounded"
                required
                onChange={handleChange}
              />
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                className="p-2 border rounded"
                required
                onChange={handleChange}
              />
            </div>

            <input
              type="tel"
              name="contact"
              placeholder="Téléphone"
              className="w-full p-2 border rounded"
              required
              onChange={handleChange}
            />

            <select
              name="commune"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            >
              <option value="">Commune</option>
              {communes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <input
              type="text"
              name="age"
              placeholder="Âge"
              min="0"
              max="120"
              className="w-full p-2 border rounded"
              required
              onChange={handleChange}
            />

            <div className="flex space-x-4">
              <label className="flex items-center text-teal-600">
                <input type="radio" name="sexe" value="M" onChange={handleChange} className="mr-2" />
                Masculin
              </label>
              <label className="flex items-center text-teal-600">
                <input type="radio" name="sexe" value="F" onChange={handleChange} className="mr-2" />
                Féminin
              </label>
            </div>
          </div>

          {/* Section Avis */}
          <div className="space-y-4 p-4 bg-gray-50 rounded">
            <h3 className="font-bold text-lg text-teal-600">Avis sur la Prestation</h3>
            
            <select
              name="motif"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            >
              <option value="">Motif de présence</option>
              {motifs.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select
              name="service"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            >
              <option value="">Service concerné</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Date
  </label>
  <div className="flex gap-2">
    <input
      type="number"
      name="day"
      placeholder="JJ"
      min="1"
      max="31"
      className="w-16 px-2 py-1 border border-gray-300 rounded"
      required
    />
    <input
      type="number"
      name="month"
      placeholder="MM"
      min="1"
      max="12"
      className="w-16 px-2 py-1 border border-gray-300 rounded"
      required
    />
    <input
      type="number"
      name="year"
      placeholder="AAAA"
      min="1900"
      max="2100"
      className="w-24 px-2 py-1 border border-gray-300 rounded"
      required
    />
  </div>
</div>


            <div className=" flex space-x-2">
              <p className='text-teal-600'>Satisfaction:</p>
              {["Satisfait", "Moyen", "Mécontent"].map(opt => (
                <label key={opt} className="flex items-center text-teal-600">
                  <input 
                    type="radio" 
                    name="satisfaction" 
                    value={opt} 
                    onChange={handleChange}
                    className="mr-2" 
                    required
                  />
                  {opt}
                </label>
              ))}
            </div>

            <textarea
              name="commentaire"
              placeholder="Commentaire..."
              rows={3}
              className="w-full p-2 border rounded text-teal-600"
              onChange={handleChange}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-between">
            <button
              type="reset"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              Envoyer
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Made by NAE, CESARIO et AICA
        </p>
      </div>
    </div>
  );
}