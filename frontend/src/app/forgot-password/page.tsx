"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulation d'appel API
  const mockApiCall = async (email: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock API call for email: ${email}`);
        resolve({ success: true });
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // À remplacer par un vrai appel API plus tard
      await mockApiCall(email);
      setMessage('Un lien de réinitialisation a été envoyé à votre email');
    } catch (error) {
      setMessage("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-bold">
            Email associé à votre compte
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-teal-500"
            placeholder="votre@email.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded text-white ${
            isLoading ? 'bg-gray-400' : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link 
          href="/login" 
          className="text-teal-500 hover:underline"
        >
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
}