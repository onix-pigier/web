"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import Axios from '@/src/utils/axios';
import SummaryApi from '@/src/common/SummaryApi';
import AxiosToastError from '@/src/utils/AxiosToastError';

const RegisterPage = () => {
  const router = useRouter();
  const [data, setData] = useState({
    nom: '',
    email: '',
    role: '',
    mot_de_passe: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const valideValue = Object.values(data).every(el => el);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des mots de passe
    if (data.mot_de_passe !== data.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    // Validation du rôle
    const rolesValides = ['admin', 'Responsable'];
    if (!rolesValides.includes(data.role)) {
      toast.error("Veuillez sélectionner un rôle valide");
      return;
    }

    // Validation de la force du mot de passe
    if (data.mot_de_passe.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: {
          nom: data.nom,
          email: data.email,
          mot_de_passe: data.mot_de_passe,
          role: data.role
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || "Inscription réussie !");
        
        // Redirection vers la page de vérification avec l'ID utilisateur
        router.push(`/verifie-email?email=${response.data.}`);
        
        // Réinitialisation du formulaire
        setData({
          nom: '',
          email: '',
          mot_de_passe: '',
          role: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-teal-600">Créer un compte</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Nom */}
        <div>
          <label htmlFor="nom" className="block mb-1 text-teal-600 font-bold">
            Nom complet
          </label>
          <input
            type="text"
            id="nom"
            autoFocus
            name="nom"
            value={data.nom}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
            required
            disabled={isLoading}
          />
        </div>

        {/* Champ Email */}
        <div>
          <label htmlFor="email" className="block mb-1 text-teal-600 font-bold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
            required
            disabled={isLoading}
          />
        </div>

        {/* Champ Mot de passe */}
        <div className="relative">
          <label htmlFor="password" className="block mb-1 text-teal-600 font-bold">
            Mot de passe (8 caractères minimum)
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="mot_de_passe"
            value={data.mot_de_passe}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
            required
            minLength={8}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-9 text-teal-500"
            disabled={isLoading}
          >
            {showPassword ? "Cacher" : "Voir"}
          </button>
        </div>

        {/* Champ Confirmation Mot de passe */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="block mb-1 text-teal-600 font-bold">
            Confirmer le mot de passe
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
            required
            minLength={8}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-9 text-teal-500"
            disabled={isLoading}
          >
            {showConfirmPassword ? "Cacher" : "Voir"}
          </button>
        </div>

        {/* Sélection du Rôle */}
        <div className="flex space-x-4 pt-2">
          <p className="font-bold text-teal-600">Rôle :</p>
          {["admin", "Responsable"].map(opt => (
            <label key={opt} className="flex items-center">
              <input
                type="radio"
                name="role"
                value={opt}
                onChange={handleChange}
                className="mr-2"
                required
                disabled={isLoading}
              />
              <span className="capitalize">{opt}</span>
            </label>
          ))}
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={!valideValue || isLoading}
          className={`w-full text-white p-2 rounded-md transition ${
            valideValue && !isLoading
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inscription en cours...
            </span>
          ) : "S'inscrire"}
        </button>
      </form>

      {/* Lien vers la page de connexion */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{' '}
          <Link 
            href="/login" 
            className="text-teal-500 hover:underline font-medium"
            tabIndex={isLoading ? -1 : 0}
          >
            Se connecter
          </Link>
        </p>
      </div>

      {/* Configuration du Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: { 
            style: { 
              background: '#059669', 
              color: 'white',
              fontWeight: 500
            },
          },
          error: { 
            style: { 
              background: '#DC2626', 
              color: 'white',
              fontWeight: 500
            },
          },
        }}
      />
    </div>
  );
};

export default RegisterPage;