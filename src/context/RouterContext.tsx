import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Route =
  | { name: 'home' }
  | { name: 'shop'; demographic?: string; productType?: string }
  | { name: 'product'; slug: string }
  | { name: 'about' }
  | { name: 'contact' };

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
    if (parts[1] && parts[2]) return { name: 'shop', demographic: parts[1], productType: parts[2] };
    if (parts[1]) return { name: 'shop', demographic: parts[1] };
    return { name: 'shop' };
  }
  if (parts[0] === 'product' && parts[1]) {
    return { name: 'product', slug: parts[1] };
  }
  if (parts[0] === 'about') return { name: 'about' };
  if (parts[0] === 'contact') return { name: 'contact' };
  return { name: 'home' };
}

function routeToPath(route: Route): string {
  switch (route.name) {
    case 'home': return '/';
    case 'shop':
      if (route.demographic && route.productType) return `/shop/${route.demographic}/${route.productType}`;
      if (route.demographic) return `/shop/${route.demographic}`;
      return '/shop';
    case 'product': return `/product/${route.slug}`;
    case 'about': return '/about';
    case 'contact': return '/contact';
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
