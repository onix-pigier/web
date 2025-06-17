
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-teal-600 mb-6">Bienvenue</h1>
      <div className="space-x-4">
        <Link href="/login" className="text-teal-500 hover:underline">
          Connexion
        </Link>
        <Link href="/coordinates" className="text-teal-500 hover:underline">
          Saisir Coordonnées
        </Link>
        <Link href="/resultats" className="text-teal-500 hover:underline">
          Résultats
        </Link>
      </div>
      <Toaster />
    </div>
  );
}
