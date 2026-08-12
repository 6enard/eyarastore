import { useState } from 'react';
import {
  Lock, LogOut, Package, FolderTree, ShoppingCart, LayoutDashboard,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { TabButton } from '../components/admin/AdminShared';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminOrders } from '../components/admin/AdminOrders';

const ADMIN_PASSWORD = 'eyara-admin-2025';

type Tab = 'dashboard' | 'products' | 'categories' | 'orders';

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('eyara_admin') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const { products, categories, orders } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('eyara_admin', 'true');
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('eyara_admin');
    setAuthed(false);
    setPassword('');
  };

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container-lux py-20">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-ink-700">
              <Lock size={28} className="text-cream-100" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-3xl text-ink-700 font-light mb-2">Admin Access</h1>
            <p className="text-sm text-sage-500">Enter your password to manage the store.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="input-lux text-center"
              autoFocus
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              <Lock size={16} />
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Admin header */}
      <div className="bg-ink-700 text-cream-100">
        <div className="container-lux py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={22} strokeWidth={1.5} />
            <span className="font-serif text-lg font-light tracking-wide">Eyara Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-cream-200/70 hover:text-bronze-400 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="container-lux py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-sage-200 overflow-x-auto scrollbar-hide">
          <TabButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
          <TabButton active={tab === 'products'} onClick={() => setTab('products')} icon={Package} label="Products" count={products.length} />
          <TabButton active={tab === 'categories'} onClick={() => setTab('categories')} icon={FolderTree} label="Categories" count={categories.length} />
          <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={ShoppingCart} label="Orders" count={orders.length} />
        </div>

        {tab === 'dashboard' && <AdminDashboard onNavigate={(t) => setTab(t as Tab)} />}
        {tab === 'products' && <AdminProducts categories={categories} />}
        {tab === 'categories' && <AdminCategories products={products} />}
        {tab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
}
