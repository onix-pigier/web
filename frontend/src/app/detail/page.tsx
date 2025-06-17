export default function Detail() {
  const detail = {
    nom: 'Kouassi',
    date: '2025-06-07',
    commentaire:
      "Success is not just about talent. It’s about consistency. Embrace moments of failure, keep moving even when you don’t feel like it. Keep striving. The future is worth the fight.",
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-teal-500 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        Avis détaillé de {detail.nom} ({detail.date})
      </h1>

      <p className="max-w-md text-center text-lg italic">
        {detail.commentaire}
      </p>
    </main>
  );
}
