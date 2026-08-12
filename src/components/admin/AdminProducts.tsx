import { useState } from 'react';
import {
  Plus, Pencil, Trash2, Search, Star, Package,
  ChevronLeft, Save, AlertTriangle, X,
} from 'lucide-react';
import { ImageUpload, GalleryUpload } from '../ImageUpload';
import { supabase } from '../../lib/supabase';
import { useData } from '../../context/DataContext';
import type { Product, Category } from '../../hooks/useData';
import { formatPrice } from '../../lib/format';
import { FormField, slugify, EmptyState } from './AdminShared';

export function AdminProducts({ categories }: { categories: Category[] }) {
  const { products, loading, refetch } = useData();
  const [mode, setMode] = useState<'list' | 'edit' | 'create'>('list');
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [filterDemographic, setFilterDemographic] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');

  const handleSave = async () => {
    await refetch();
    setMode('list');
    setEditingItem(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      await refetch();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.slug.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDemographic && p.demographic !== filterDemographic) return false;
    if (filterType && p.product_type !== filterType) return false;
    if (filterStock === 'in' && !p.in_stock) return false;
    if (filterStock === 'out' && p.in_stock) return false;
    if (filterFeatured === 'yes' && !p.featured) return false;
    if (filterFeatured === 'no' && p.featured) return false;
    return true;
  });

  const hasFilters = search || filterDemographic || filterType || filterStock || filterFeatured;

  if (mode !== 'list') {
    return (
      <ProductForm
        product={editingItem}
        categories={categories}
        isEdit={mode === 'edit'}
        onSave={handleSave}
        onCancel={() => { setMode('list'); setEditingItem(null); }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="font-serif text-2xl text-ink-700 font-light mb-1">Products</h2>
          <p className="text-sm text-sage-500">{products.length} products in catalog</p>
        </div>
        <button
          onClick={() => { setMode('create'); setEditingItem(null); }}
          className="btn-primary whitespace-nowrap"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-lux pl-10 text-sm"
          />
        </div>
        <select value={filterDemographic} onChange={(e) => setFilterDemographic(e.target.value)} className="input-lux text-sm w-auto">
          <option value="">All Demographics</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-lux text-sm w-auto">
          <option value="">All Types</option>
          <option value="clothes">Clothes</option>
          <option value="shoes">Shoes</option>
        </select>
        <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="input-lux text-sm w-auto">
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <select value={filterFeatured} onChange={(e) => setFilterFeatured(e.target.value)} className="input-lux text-sm w-auto">
          <option value="">All Products</option>
          <option value="yes">Featured Only</option>
          <option value="no">Not Featured</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterDemographic(''); setFilterType(''); setFilterStock(''); setFilterFeatured(''); }}
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
      ) : filteredProducts.length === 0 ? (
        <EmptyState icon={Package} message={hasFilters ? 'No products match your filters.' : 'No products yet. Add your first product.'} />
      ) : (
        <div className="overflow-x-auto bg-white border border-sage-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-widest text-sage-500 bg-cream-50">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b border-sage-100 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-12 h-14 bg-cream-100 overflow-hidden flex-shrink-0">
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-ink-700 font-medium">{p.name}</p>
                    <p className="text-xs text-sage-400">{p.demographic} · {p.product_type}</p>
                  </td>
                  <td className="py-3 px-4 text-ink-600">
                    {categories.find((c) => c.id === p.category_id)?.name || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="text-ink-600">{formatPrice(p.price)}</span>
                      {p.compare_at_price && p.compare_at_price > p.price && (
                        <span className="text-xs text-sage-400 line-through ml-1">{formatPrice(p.compare_at_price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.in_stock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.featured && <Star size={16} className="text-bronze-500 fill-bronze-500" />}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setMode('edit'); setEditingItem(p); }}
                        className="p-2 text-ink-500 hover:text-bronze-500 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
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
        </div>
      )}
    </div>
  );
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
