// app/about/page.tsx
export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">À propos de nous</h2>
        <p className="text-center">
          Nous sommes le groupe 3 ! <br />
          Ceci est notre site web pour le projet de dev web.
        </p>
        <button className="mt-4 bg-teal-500 text-white p-2 rounded hover:bg-teal-600">
          Contactez le client
        </button>
      </div>
      <p className="mt-4 text-sm">Made by NAE, CESARIO et AICA (Groupe 3)</p>
    </div>
  );
}