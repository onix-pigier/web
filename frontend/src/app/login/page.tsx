"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface LoginResponse {
  message: string;
  success: boolean;
  error?: boolean;
}

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  // Vérifie si l'email vient d'être vérifié
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setVerifiedSuccess(true);
      // Nettoie l'URL sans recharger la page
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('verified');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setVerifiedSuccess(false);

    try {
      const res = await fetch('http://localhost:8000/api/utilisateur/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, mot_de_passe }),
      });

      const resultat: LoginResponse = await res.json();

      if (!res.ok) {
        throw new Error(resultat.message || 'Erreur de connexion');
      }

      if (resultat.success) {
        router.push('/resultats');
      } else {
        setError(resultat.message || 'Identifiants incorrects');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-teal-600">Connexion</h1>
      
      {/* Message de succès après vérification d'email */}
      {verifiedSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Email vérifié avec succès ! Vous pouvez maintenant vous connecter.
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 text-teal-600 font-bold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="mot_de_passe" className="block mb-1 font-bold text-teal-600">
            Mot de passe
          </label>
          <input
            type="password"
            id="mot_de_passe"
            value={mot_de_passe}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>
        
        <div className="text-right">
          <Link 
            href="/forgot-password" 
            className="text-sm text-teal-600 hover:underline"
            tabIndex={isLoading ? -1 : 0}
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          className={`w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link 
            href="/register" 
            className="text-teal-500 hover:underline"
            tabIndex={isLoading ? -1 : 0}
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;