import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Route =
  | { name: 'home' }
  | { name: 'shop'; categorySlug?: string; subSlug?: string }
  | { name: 'product'; slug: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'returns' }
  | { name: 'admin' };

interface RouterValue {
  route: Route;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterValue | undefined>(undefined);

function parsePath(path: string): Route {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'shop') {
    if (parts[1] && parts[2]) return { name: 'shop', categorySlug: parts[1], subSlug: parts[2] };
    if (parts[1]) return { name: 'shop', categorySlug: parts[1] };
    return { name: 'shop' };
  }
  if (parts[0] === 'product' && parts[1]) {
    return { name: 'product', slug: parts[1] };
  }
  if (parts[0] === 'about') return { name: 'about' };
  if (parts[0] === 'contact') return { name: 'contact' };
  if (parts[0] === 'returns') return { name: 'returns' };
  if (parts[0] === 'admin') return { name: 'admin' };
  return { name: 'home' };
}

function routeToPath(route: Route): string {
  switch (route.name) {
    case 'home': return '/';
    case 'shop':
      if (route.categorySlug && route.subSlug) return `/shop/${route.categorySlug}/${route.subSlug}`;
      if (route.categorySlug) return `/shop/${route.categorySlug}`;
      return '/shop';
    case 'product': return `/product/${route.slug}`;
    case 'about': return '/about';
    case 'contact': return '/contact';
    case 'returns': return '/returns';
    case 'admin': return '/admin';
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(parsePath(path));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within RouterProvider');
  return context;
}

export { routeToPath };
export type { Route };
