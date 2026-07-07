import { RouterProvider, useRouter } from './context/RouterContext';
import { CartProvider } from './context/CartContext';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function Pages() {
  const { route } = useRouter();

  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'shop':
      return <ShopPage demographic={route.demographic} productType={route.productType} />;
    case 'product':
      return <ProductPage slug={route.slug} />;
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    default:
      return <HomePage />;
  }
}

function LoadingOverlay() {
  const { loading, error } = useData();

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-cream-50 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="font-serif text-2xl text-ink-700 mb-2">Failed to Load</p>
          <p className="text-sm text-sage-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-outline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-sage-200 border-t-bronze-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xl text-ink-700">Loading products...</p>
        </div>
      </div>
    );
  }

  return null;
}

function AppContent() {
  const { loading, error } = useData();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <LoadingOverlay />
      <Header />
      <main className="flex-1">
        {!loading && !error && <Pages />}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <DataProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </DataProvider>
    </RouterProvider>
  );
}

export default App;
