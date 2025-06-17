import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MonApp</h3>
            <p>La meilleure solution pour vos besoins.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-blue-300">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-blue-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-blue-300">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-blue-300">CGU</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>© {new Date().getFullYear()} MonApp. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;