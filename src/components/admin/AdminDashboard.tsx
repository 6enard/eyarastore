import {
  Package, ShoppingCart, DollarSign, TrendingUp,
  FolderTree, Star, AlertCircle, Clock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../lib/format';
import { StatusBadge, formatDate } from './AdminShared';
import type { Order } from '../../hooks/useData';

export function AdminDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { products, categories, orders, loading } = useData();

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStockProducts = products.filter((p) => !p.in_stock).length;
  const featuredProducts = products.filter((p) => p.featured).length;

  const recentOrders = orders.slice(0, 5);

  const topProducts = [...products]
    .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
    .slice(0, 5);

  const stats: { label: string; value: string; icon: LucideIcon; accent: string; onClick?: () => void }[] = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, accent: 'text-green-600' },
    { label: 'Orders', value: orders.length.toString(), icon: ShoppingCart, accent: 'text-blue-600', onClick: () => onNavigate('orders') },
    { label: 'Products', value: products.length.toString(), icon: Package, accent: 'text-ink-700', onClick: () => onNavigate('products') },
    { label: 'Categories', value: categories.length.toString(), icon: FolderTree, accent: 'text-bronze-500', onClick: () => onNavigate('categories') },
  ];

  const secondaryStats: { label: string; value: string; icon: LucideIcon; color: string }[] = [
    { label: 'Pending Orders', value: pendingOrders.toString(), icon: Clock, color: 'text-amber-500' },
    { label: 'Out of Stock', value: lowStockProducts.toString(), icon: AlertCircle, color: 'text-red-500' },
    { label: 'Featured', value: featuredProducts.toString(), icon: Star, color: 'text-bronze-500' },
    { label: 'Avg. Order Value', value: orders.length > 0 ? formatPrice(Math.round(totalRevenue / orders.filter((o) => o.status !== 'cancelled').length || 0)) : 'KES 0', icon: TrendingUp, color: 'text-green-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink-700 font-light mb-1">Dashboard</h2>
        <p className="text-sm text-sage-500">Store overview and key metrics</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={stat.onClick}
            disabled={!stat.onClick}
            className="bg-white border border-sage-200 p-5 text-left transition-all hover:shadow-md hover:border-sage-300 disabled:cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.accent} strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-serif text-ink-700 font-light">{stat.value}</p>
            <p className="text-xs text-sage-500 tracking-widest uppercase mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 bg-cream-100 border border-sage-200 px-4 py-3">
            <stat.icon size={18} className={stat.color} strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-ink-700">{stat.value}</p>
              <p className="text-xs text-sage-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white border border-sage-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-sage-200">
            <h3 className="font-medium text-ink-700">Recent Orders</h3>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-bronze-500 hover:text-bronze-600 tracking-widest uppercase"
            >
              View All
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-sage-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="divide-y divide-sage-100">
              {recentOrders.map((order) => (
                <RecentOrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white border border-sage-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-sage-200">
            <h3 className="font-medium text-ink-700">Top Products</h3>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs text-bronze-500 hover:text-bronze-600 tracking-widest uppercase"
            >
              View All
            </button>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-sage-500 text-center py-8">No products yet</p>
          ) : (
            <div className="divide-y divide-sage-100">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-10 h-12 bg-cream-100 overflow-hidden flex-shrink-0">
                    {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-700 truncate">{product.name}</p>
                    <p className="text-xs text-sage-500">
                      {product.review_count} reviews · {formatPrice(product.price)}
                    </p>
                  </div>
                  {product.featured && <Star size={14} className="text-bronze-500 fill-bronze-500 flex-shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentOrderRow({ order }: { order: Order }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-700 truncate">{order.order_number}</p>
        <p className="text-xs text-sage-500">
          {order.customer_name} · {formatDate(order.created_at)}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm text-ink-600">{formatPrice(order.total)}</span>
        <StatusBadge status={order.status} />
      </div>
    </div>
  );
}
