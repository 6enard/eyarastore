import { useState } from 'react';
import {
  ShoppingCart, ChevronLeft, Search, X, Trash2, Package,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useData } from '../../context/DataContext';
import type { Order, OrderStatus } from '../../hooks/useData';
import { formatPrice } from '../../lib/format';
import { StatusBadge, EmptyState, formatDateTime, formatDate } from './AdminShared';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function AdminOrders() {
  const { orders, orderItems, loading, refetch } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
      alert('Failed to update status: ' + error.message);
    } else {
      await refetch();
    }
  };

  const handleDelete = async (id: string, orderNumber: string) => {
    if (!confirm(`Delete order "${orderNumber}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      await refetch();
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (search && !o.order_number.toLowerCase().includes(search.toLowerCase()) && !o.customer_name.toLowerCase().includes(search.toLowerCase()) && !o.customer_email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && o.status !== filterStatus) return false;
    return true;
  });

  const hasFilters = search || filterStatus;

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        items={orderItems.filter((item) => item.order_id === selectedOrder.id)}
        onBack={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-ink-700 font-light mb-1">Orders</h2>
        <p className="text-sm text-sage-500">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, email..."
            className="input-lux pl-10 text-sm"
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-lux text-sm w-auto">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); }}
            className="text-sm text-sage-500 hover:text-bronze-500 transition-colors flex items-center gap-1"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink-700" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState icon={ShoppingCart} message={hasFilters ? 'No orders match your filters.' : 'No orders yet.'} />
      ) : (
        <div className="overflow-x-auto bg-white border border-sage-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-widest text-sage-500 bg-cream-50">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const itemCount = orderItems.filter((item) => item.order_id === order.id).length;
                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-sage-100 hover:bg-cream-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-medium text-ink-700">{order.order_number}</td>
                    <td className="py-3 px-4">
                      <p className="text-ink-700">{order.customer_name}</p>
                      <p className="text-xs text-sage-400">{order.customer_email}</p>
                    </td>
                    <td className="py-3 px-4 text-sage-500">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4 text-ink-600">{itemCount}</td>
                    <td className="py-3 px-4 text-ink-600">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDelete(order.id, order.order_number)}
                          className="p-2 text-ink-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Order Detail View ───

function OrderDetail({ order, items, onBack, onStatusChange, onDelete }: {
  order: Order;
  items: ReturnType<typeof useData>['orderItems'];
  onBack: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onDelete: (id: string, orderNumber: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-ink-500 hover:text-bronze-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="font-serif text-2xl text-ink-700 font-light">{order.order_number}</h2>
            <p className="text-sm text-sage-500">{formatDateTime(order.created_at)}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 bg-white border border-sage-200">
          <div className="px-5 py-4 border-b border-sage-200">
            <h3 className="font-medium text-ink-700">Order Items ({items.length})</h3>
          </div>
          {items.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={Package} message="No items in this order." />
            </div>
          ) : (
            <div className="divide-y divide-sage-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-16 bg-cream-100 overflow-hidden flex-shrink-0">
                    {item.product_image && <img src={item.product_image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-700">{item.product_name}</p>
                    <p className="text-xs text-sage-500">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <div className="text-sm text-ink-600 font-medium">{formatPrice(item.line_total)}</div>
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-4 border-t border-sage-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sage-500">Subtotal</span>
              <span className="text-ink-600">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sage-500">Shipping</span>
              <span className="text-ink-600">{formatPrice(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between text-base font-medium pt-2 border-t border-sage-100">
              <span className="text-ink-700">Total</span>
              <span className="text-ink-700">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer info + status */}
        <div className="space-y-6">
          {/* Status manager */}
          <div className="bg-white border border-sage-200 p-5">
            <h3 className="font-medium text-ink-700 mb-4">Order Status</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(order.id, status)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all border ${
                    order.status === status
                      ? 'border-bronze-500 bg-bronze-50 text-ink-700 font-medium'
                      : 'border-sage-200 text-sage-500 hover:border-sage-300 hover:text-ink-600'
                  }`}
                >
                  <span className="capitalize">{status}</span>
                  {order.status === status && <span className="w-2 h-2 rounded-full bg-bronze-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white border border-sage-200 p-5">
            <h3 className="font-medium text-ink-700 mb-4">Customer</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-sage-500 tracking-widest uppercase mb-0.5">Name</p>
                <p className="text-ink-700">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-sage-500 tracking-widest uppercase mb-0.5">Email</p>
                <p className="text-ink-700">{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-xs text-sage-500 tracking-widest uppercase mb-0.5">Phone</p>
                  <p className="text-ink-700">{order.customer_phone}</p>
                </div>
              )}
              {order.shipping_address && (
                <div>
                  <p className="text-xs text-sage-500 tracking-widest uppercase mb-0.5">Address</p>
                  <p className="text-ink-700">{order.shipping_address}</p>
                </div>
              )}
              {order.city && (
                <div>
                  <p className="text-xs text-sage-500 tracking-widest uppercase mb-0.5">City</p>
                  <p className="text-ink-700">{order.city}</p>
                </div>
              )}
            </div>
          </div>

          {order.notes && (
            <div className="bg-white border border-sage-200 p-5">
              <h3 className="font-medium text-ink-700 mb-2">Notes</h3>
              <p className="text-sm text-sage-500">{order.notes}</p>
            </div>
          )}

          <button
            onClick={() => {
              if (confirm(`Delete order "${order.order_number}"? This cannot be undone.`)) {
                onDelete(order.id, order.order_number);
                onBack();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            Delete Order
          </button>
        </div>
      </div>
    </div>
  );
}
