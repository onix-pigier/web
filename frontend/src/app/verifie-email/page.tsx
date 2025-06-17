// app/verifie-email/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Spinner } from '../../../components/ui/Spinner'; // Crée ce composant ou utilise un spinner existant

export default function VerifieEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');
  const [message, setMessage] = useState("Vérification en cours...");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifier() {
      try {
        const res = await fetch('http://localhost:3000/api/utilisateur/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const result = await res.json();
        setMessage(result.message);
        setSuccess(result.success);
        
        if (result.success) {
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 2000);
        }
      } catch (error) {
        setMessage("Erreur de connexion au serveur." + error);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    }

    if (code) verifier();
    else {
      setMessage("Lien de vérification invalide.");
      setSuccess(false);
      setLoading(false);
    }
  }, [code, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Vérification de l&apos;email</h1>
        
        <div className="flex flex-col items-center space-y-4">
          {loading ? (
            <>
              <Spinner className="h-8 w-8 text-blue-500" />
              <p className="text-gray-600">{message}</p>
            </>
          ) : (
            <>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
              }`}>
                {success ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <p className={`text-center ${success ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
              {!success && (
                <button
                  onClick={() => router.push('/register')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Réessayer l&zpos;inscription
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}