import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Lock, LogOut, Package, FolderTree, Plus, Pencil, Trash2, Search,
  Star, ChevronLeft, Save, AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ImageUpload, GalleryUpload } from '../components/ImageUpload';
import { supabase } from '../lib/supabase';
import { useData } from '../context/DataContext';
import type { Product, Category } from '../hooks/useData';
import { formatPrice } from '../lib/format';

const ADMIN_PASSWORD = 'eyara-admin-2025';

type Tab = 'products' | 'categories';
type Mode = 'list' | 'edit' | 'create';

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('eyara_admin') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('products');
  const { products, categories, loading, refetch } = useData();
  const [mode, setMode] = useState<Mode>('list');
  const [editingItem, setEditingItem] = useState<Product | Category | null>(null);
  const [search, setSearch] = useState('');

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

  const handleSave = async () => {
    await refetch();
    setMode('list');
    setEditingItem(null);
  };

  const handleCancel = () => {
    setMode('list');
    setEditingItem(null);
  };

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      await refetch();
    }
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

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
        {mode === 'list' && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-sage-200">
              <TabButton active={tab === 'products'} onClick={() => setTab('products')} icon={Package} label="Products" count={products.length} />
              <TabButton active={tab === 'categories'} onClick={() => setTab('categories')} icon={FolderTree} label="Categories" count={categories.length} />
            </div>

            {tab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-4 gap-4">
                  <div className="relative flex-1 max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="input-lux pl-10 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => { setMode('create'); setEditingItem(null); }}
                    className="btn-primary whitespace-nowrap"
                  >
                    <Plus size={16} />
                    Add Product
                  </button>
                </div>

                {loading ? (
                  <p className="text-sage-500 text-center py-12">Loading...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-widest text-sage-500">
                          <th className="py-3 pr-4">Image</th>
                          <th className="py-3 pr-4">Name</th>
                          <th className="py-3 pr-4">Category</th>
                          <th className="py-3 pr-4">Price</th>
                          <th className="py-3 pr-4">Stock</th>
                          <th className="py-3 pr-4">Featured</th>
                          <th className="py-3 pr-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="border-b border-sage-100 hover:bg-cream-100/50 transition-colors">
                            <td className="py-3 pr-4">
                              <div className="w-12 h-14 bg-cream-100 overflow-hidden flex-shrink-0">
                                {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <p className="text-ink-700 font-medium">{p.name}</p>
                              <p className="text-xs text-sage-400">{p.demographic} · {p.product_type}</p>
                            </td>
                            <td className="py-3 pr-4 text-ink-600">
                              {categories.find((c) => c.id === p.category_id)?.name || '—'}
                            </td>
                            <td className="py-3 pr-4 text-ink-600">{formatPrice(p.price)}</td>
                            <td className="py-3 pr-4">
                              <span className={`text-xs px-2 py-1 ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {p.in_stock ? 'In Stock' : 'Out'}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              {p.featured && <Star size={16} className="text-bronze-500 fill-bronze-500" />}
                            </td>
                            <td className="py-3 pr-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => { setMode('edit'); setEditingItem(p); }}
                                  className="p-2 text-ink-500 hover:text-bronze-500 transition-colors"
                                  title="Edit"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
                                      handleDelete('products', p.id);
                                    }
                                  }}
                                  className="p-2 text-ink-500 hover:text-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                      <p className="text-center text-sage-500 py-12">No products found.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {tab === 'categories' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-sage-500">{categories.length} categories</p>
                  <button
                    onClick={() => { setMode('create'); setEditingItem(null); }}
                    className="btn-primary"
                  >
                    <Plus size={16} />
                    Add Category
                  </button>
                </div>

                {loading ? (
                  <p className="text-sage-500 text-center py-12">Loading...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-widest text-sage-500">
                          <th className="py-3 pr-4">Name</th>
                          <th className="py-3 pr-4">Slug</th>
                          <th className="py-3 pr-4">Demographic</th>
                          <th className="py-3 pr-4">Type</th>
                          <th className="py-3 pr-4">Order</th>
                          <th className="py-3 pr-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c.id} className="border-b border-sage-100 hover:bg-cream-100/50 transition-colors">
                            <td className="py-3 pr-4 text-ink-700 font-medium">{c.name}</td>
                            <td className="py-3 pr-4 text-sage-500 text-xs">{c.slug}</td>
                            <td className="py-3 pr-4 text-ink-600 capitalize">{c.demographic}</td>
                            <td className="py-3 pr-4 text-ink-600 capitalize">{c.product_type}</td>
                            <td className="py-3 pr-4 text-ink-600">{c.sort_order}</td>
                            <td className="py-3 pr-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => { setMode('edit'); setEditingItem(c); }}
                                  className="p-2 text-ink-500 hover:text-bronze-500 transition-colors"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    const productCount = products.filter((p) => p.category_id === c.id).length;
                                    const msg = productCount > 0
                                      ? `"${c.name}" has ${productCount} products. Deleting it will unlink those products. Continue?`
                                      : `Delete "${c.name}"? This cannot be undone.`;
                                    if (confirm(msg)) handleDelete('categories', c.id);
                                  }}
                                  className="p-2 text-ink-500 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {categories.length === 0 && (
                      <p className="text-center text-sage-500 py-12">No categories found.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {mode !== 'list' && tab === 'products' && (
          <ProductForm
            product={editingItem as Product | null}
            categories={categories}
            isEdit={mode === 'edit'}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {mode !== 'list' && tab === 'categories' && (
          <CategoryForm
            category={editingItem as Category | null}
            isEdit={mode === 'edit'}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, count }: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 text-sm font-medium tracking-wide transition-colors border-b-2 -mb-px ${
        active
          ? 'border-bronze-500 text-ink-700'
          : 'border-transparent text-sage-500 hover:text-ink-600'
      }`}
    >
      <Icon size={16} strokeWidth={1.5} />
      {label}
      <span className={`text-xs px-2 py-0.5 ${active ? 'bg-ink-700 text-cream-100' : 'bg-cream-200 text-sage-500'}`}>{count}</span>
    </button>
  );
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

// ─── Product Form ───

function ProductForm({ product, categories, isEdit, onSave, onCancel }: {
  product: Product | null;
  categories: Category[];
  isEdit: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    compare_at_price: product?.compare_at_price?.toString() || '',
    image_url: product?.image_url || '',
    gallery: (product?.gallery || []),
    category_id: product?.category_id || '',
    demographic: product?.demographic || 'men',
    product_type: product?.product_type || 'clothes',
    rating: product?.rating?.toString() || '0',
    review_count: product?.review_count?.toString() || '0',
    featured: product?.featured || false,
    in_stock: product?.in_stock ?? true,
    tags: (product?.tags || []).join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = form.slug || slugify(form.name);
    if (!form.name.trim()) {
      setError('Product name is required.');
      setSaving(false);
      return;
    }

    const data = {
      name: form.name,
      slug,
      description: form.description || null,
      price: parseInt(form.price) || 0,
      compare_at_price: form.compare_at_price ? parseInt(form.compare_at_price) : null,
      image_url: form.image_url || null,
      gallery: form.gallery,
      category_id: form.category_id || null,
      demographic: form.demographic,
      product_type: form.product_type,
      rating: parseFloat(form.rating) || 0,
      review_count: parseInt(form.review_count) || 0,
      featured: form.featured,
      in_stock: form.in_stock,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    let result;
    if (isEdit && product) {
      result = await supabase.from('products').update(data).eq('id', product.id);
    } else {
      result = await supabase.from('products').insert(data);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      onSave();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="p-2 text-ink-500 hover:text-bronze-500 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-serif text-2xl text-ink-700 font-light">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <FormField label="Product Name" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, slug: isEdit ? form.slug : slugify(e.target.value) })}
            className="input-lux"
            placeholder="e.g. Blue & Black Check Shirt"
            required
          />
        </FormField>

        <FormField label="Slug (URL)">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="input-lux"
            placeholder="auto-generated from name"
          />
        </FormField>

        <FormField label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="input-lux resize-none"
            placeholder="Product description..."
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price (KES)" required>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input-lux"
              placeholder="0"
              required
            />
          </FormField>
          <FormField label="Compare-at Price (KES)">
            <input
              type="number"
              value={form.compare_at_price}
              onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })}
              className="input-lux"
              placeholder="Original price (optional)"
            />
          </FormField>
        </div>

        <ImageUpload
          label="Primary Image"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
        />

        <GalleryUpload
          label="Gallery Images"
          value={form.gallery}
          onChange={(urls) => setForm({ ...form, gallery: urls })}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="input-lux"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Demographic">
            <select
              value={form.demographic}
              onChange={(e) => setForm({ ...form, demographic: e.target.value as 'men' | 'women' | 'kids' })}
              className="input-lux"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Product Type">
            <select
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value as 'clothes' | 'shoes' })}
              className="input-lux"
            >
              <option value="clothes">Clothes</option>
              <option value="shoes">Shoes</option>
            </select>
          </FormField>
          <FormField label="Tags (comma-separated)">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input-lux"
              placeholder="clothing, shirts, casual"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Rating (0-5)">
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="input-lux"
              placeholder="0"
            />
          </FormField>
          <FormField label="Review Count">
            <input
              type="number"
              min="0"
              value={form.review_count}
              onChange={(e) => setForm({ ...form, review_count: e.target.value })}
              className="input-lux"
              placeholder="0"
            />
          </FormField>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-bronze-500"
            />
            <span className="text-sm text-ink-700">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
              className="w-4 h-4 accent-bronze-500"
            />
            <span className="text-sm text-ink-700">In Stock</span>
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            <Save size={16} />
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Category Form ───

function CategoryForm({ category, isEdit, onSave, onCancel }: {
  category: Category | null;
  isEdit: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    demographic: category?.demographic || 'men',
    product_type: category?.product_type || 'clothes',
    sort_order: category?.sort_order?.toString() || '0',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = form.slug || slugify(form.name);
    if (!form.name.trim()) {
      setError('Category name is required.');
      setSaving(false);
      return;
    }

    const data = {
      name: form.name,
      slug,
      description: form.description || null,
      image_url: form.image_url || null,
      demographic: form.demographic,
      product_type: form.product_type,
      sort_order: parseInt(form.sort_order) || 0,
    };

    let result;
    if (isEdit && category) {
      result = await supabase.from('categories').update(data).eq('id', category.id);
    } else {
      result = await supabase.from('categories').insert(data);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      onSave();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="p-2 text-ink-500 hover:text-bronze-500 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-serif text-2xl text-ink-700 font-light">
          {isEdit ? 'Edit Category' : 'New Category'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        <FormField label="Category Name" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, slug: isEdit ? form.slug : slugify(e.target.value) })}
            className="input-lux"
            placeholder="e.g. Men's Jackets"
            required
          />
        </FormField>

        <FormField label="Slug (URL)">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="input-lux"
            placeholder="auto-generated from name"
          />
        </FormField>

        <FormField label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="input-lux resize-none"
            placeholder="Category description..."
          />
        </FormField>

        <ImageUpload
          label="Category Image"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          aspect="aspect-square"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Demographic">
            <select
              value={form.demographic}
              onChange={(e) => setForm({ ...form, demographic: e.target.value as 'men' | 'women' | 'kids' })}
              className="input-lux"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </FormField>
          <FormField label="Product Type">
            <select
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value as 'clothes' | 'shoes' })}
              className="input-lux"
            >
              <option value="clothes">Clothes</option>
              <option value="shoes">Shoes</option>
            </select>
          </FormField>
        </div>

        <FormField label="Sort Order">
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            className="input-lux"
            placeholder="0"
          />
        </FormField>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            <Save size={16} />
            {saving ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Form Field Wrapper ───

function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="label-lux">
        {label}
        {required && <span className="text-bronze-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
