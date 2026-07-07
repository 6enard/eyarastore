import { RouterProvider, useRouter } from './context/RouterContext';
import { CartProvider } from './context/CartContext';
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

function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-cream-50">
          <Header />
          <main className="flex-1">
            <Pages />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </RouterProvider>
  );
}

export default App;
