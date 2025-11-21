import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Simple Todo Wallet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
