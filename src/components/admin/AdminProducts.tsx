import { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, Star, Package,
  ChevronLeft, Save, AlertTriangle, X, Layers, Tag as TagIcon,
} from 'lucide-react';
import { ImageUpload, GalleryUpload } from '../ImageUpload';
import { supabase } from '../../lib/supabase';
import { useData } from '../../context/DataContext';
import type { Product, Category, ProductVariant } from '../../hooks/useData';
import { formatPrice } from '../../lib/format';
import { isSaleActive } from '../../lib/pricing';
import { FormField, slugify, EmptyState } from './AdminShared';

interface VariantDraft {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price_override: string;
  stock: string;
  sale_price: string;
  sale_start_at: string;
  sale_end_at: string;
  _deleted?: boolean;
}

export function AdminProducts({ categories }: { categories: Category[] }) {
  const { products, variants, loading, refetch } = useData();
  const [mode, setMode] = useState<'list' | 'edit' | 'create'>('list');
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [filterOnSale, setFilterOnSale] = useState('');

  const handleSave = async () => {
    await refetch();
    setMode('list');
    setEditingItem(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete its variants. This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      await refetch();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.slug.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory && p.category_id !== filterCategory) return false;
    if (filterStock === 'in' && !p.in_stock) return false;
    if (filterStock === 'out' && p.in_stock) return false;
    if (filterFeatured === 'yes' && !p.featured) return false;
    if (filterFeatured === 'no' && p.featured) return false;
    if (filterOnSale === 'yes' && !isSaleActive(p.sale_price, p.sale_start_at, p.sale_end_at)) return false;
    if (filterOnSale === 'no' && isSaleActive(p.sale_price, p.sale_start_at, p.sale_end_at)) return false;
    return true;
  });

  const hasFilters = search || filterCategory || filterStock || filterFeatured || filterOnSale;

  if (mode !== 'list') {
    return (
      <ProductForm
        product={editingItem}
        categories={categories}
        variants={editingItem ? variants.filter((v) => v.product_id === editingItem.id) : []}
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
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-lux text-sm w-auto">
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parent_id ? `— ${c.name}` : c.name}
            </option>
          ))}
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
        <select value={filterOnSale} onChange={(e) => setFilterOnSale(e.target.value)} className="input-lux text-sm w-auto">
          <option value="">All Pricing</option>
          <option value="yes">On Sale Now</option>
          <option value="no">Not On Sale</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterCategory(''); setFilterStock(''); setFilterFeatured(''); setFilterOnSale(''); }}
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
                <th className="py-3 px-4">Variants</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const productVariantCount = variants.filter((v) => v.product_id === p.id).length;
                const onSale = isSaleActive(p.sale_price, p.sale_start_at, p.sale_end_at);
                return (
                  <tr key={p.id} className="border-b border-sage-100 hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-14 bg-cream-100 overflow-hidden flex-shrink-0">
                        {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-ink-700 font-medium">{p.name}</p>
                      {onSale && <span className="text-[10px] px-1.5 py-0.5 bg-bronze-100 text-bronze-700 uppercase">Sale</span>}
                    </td>
                    <td className="py-3 px-4 text-ink-600">
                      {categories.find((c) => c.id === p.category_id)?.name || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="text-ink-600">{formatPrice(p.price)}</span>
                        {onSale && p.sale_price != null && (
                          <span className="text-xs text-bronze-600 ml-1">{formatPrice(p.sale_price)}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-ink-600">
                      {productVariantCount > 0 ? `${productVariantCount}` : '—'}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Product Form ───

function toLocalDatetimeValue(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalDatetimeValue(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

function ProductForm({ product, categories, variants, isEdit, onSave, onCancel }: {
  product: Product | null;
  categories: Category[];
  variants: ProductVariant[];
  isEdit: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    description_paragraph: product?.description_paragraph || '',
    description_features: (product?.description_features || []).join('\n'),
    price: product?.price?.toString() || '',
    compare_at_price: product?.compare_at_price?.toString() || '',
    image_url: product?.image_url || '',
    gallery: (product?.gallery || []),
    category_id: product?.category_id || '',
    demographic: product?.demographic || '',
    product_type: product?.product_type || '',
    rating: product?.rating?.toString() || '0',
    review_count: product?.review_count?.toString() || '0',
    featured: product?.featured || false,
    in_stock: product?.in_stock ?? true,
    tags: (product?.tags || []).join(', '),
    // Product-level sale
    sale_price: product?.sale_price?.toString() || '',
    sale_start_at: toLocalDatetimeValue(product?.sale_start_at),
    sale_end_at: toLocalDatetimeValue(product?.sale_end_at),
  });
  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>(
    variants.map((v) => ({
      id: v.id,
      size: v.size || '',
      color: v.color || '',
      sku: v.sku,
      price_override: v.price_override?.toString() || '',
      stock: v.stock.toString(),
      sale_price: v.sale_price?.toString() || '',
      sale_start_at: toLocalDatetimeValue(v.sale_start_at),
      sale_end_at: toLocalDatetimeValue(v.sale_end_at),
    })),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const featuresArray = useMemo(
    () => form.description_features.split('\n').map((f) => f.trim()).filter(Boolean),
    [form.description_features],
  );

  const addVariant = () => {
    setVariantDrafts((prev) => [
      ...prev,
      { size: '', color: '', sku: '', price_override: '', stock: '0', sale_price: '', sale_start_at: '', sale_end_at: '' },
    ]);
  };

  const updateVariant = (index: number, patch: Partial<VariantDraft>) => {
    setVariantDrafts((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };

  const removeVariant = (index: number) => {
    setVariantDrafts((prev) => prev.map((v, i) => (i === index ? { ...v, _deleted: true } : v)));
  };

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

    // Validate variant SKUs — each must be non-empty and unique within this product.
    const activeVariants = variantDrafts.filter((v) => !v._deleted);
    const skuSet = new Set<string>();
    for (const v of activeVariants) {
      if (!v.sku.trim()) {
        setError('Every variant must have a unique SKU.');
        setSaving(false);
        return;
      }
      if (skuSet.has(v.sku.trim())) {
        setError(`Duplicate SKU: "${v.sku.trim()}". Each SKU must be unique.`);
        setSaving(false);
        return;
      }
      skuSet.add(v.sku.trim());
    }

    const data = {
      name: form.name,
      slug,
      description: form.description || null,
      description_paragraph: form.description_paragraph || null,
      description_features: featuresArray,
      price: parseInt(form.price) || 0,
      compare_at_price: form.compare_at_price ? parseInt(form.compare_at_price) : null,
      image_url: form.image_url || null,
      gallery: form.gallery,
      category_id: form.category_id || null,
      demographic: form.demographic || null,
      product_type: form.product_type || null,
      rating: parseFloat(form.rating) || 0,
      review_count: parseInt(form.review_count) || 0,
      featured: form.featured,
      in_stock: form.in_stock,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sale_price: form.sale_price ? parseInt(form.sale_price) : null,
      sale_start_at: fromLocalDatetimeValue(form.sale_start_at),
      sale_end_at: fromLocalDatetimeValue(form.sale_end_at),
    };

    let productId = product?.id;
    let result;
    if (isEdit && product) {
      result = await supabase.from('products').update(data).eq('id', product.id);
    } else {
      result = await supabase.from('products').insert(data).select('id').single();
      if (result.data) productId = (result.data as { id: string }).id;
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    // Save variants
    if (productId) {
      for (const draft of variantDrafts) {
        const variantData = {
          product_id: productId,
          size: draft.size || null,
          color: draft.color || null,
          sku: draft.sku.trim(),
          price_override: draft.price_override ? parseInt(draft.price_override) : null,
          stock: parseInt(draft.stock) || 0,
          sale_price: draft.sale_price ? parseInt(draft.sale_price) : null,
          sale_start_at: fromLocalDatetimeValue(draft.sale_start_at),
          sale_end_at: fromLocalDatetimeValue(draft.sale_end_at),
        };

        if (draft._deleted && draft.id) {
          const { error: delErr } = await supabase.from('product_variants').delete().eq('id', draft.id);
          if (delErr) {
            setError('Failed to delete variant: ' + delErr.message);
            setSaving(false);
            return;
          }
        } else if (draft.id) {
          const { error: updErr } = await supabase.from('product_variants').update(variantData).eq('id', draft.id);
          if (updErr) {
            setError('Failed to update variant: ' + updErr.message);
            setSaving(false);
            return;
          }
        } else {
          const { error: insErr } = await supabase.from('product_variants').insert(variantData);
          if (insErr) {
            setError('Failed to create variant: ' + insErr.message);
            setSaving(false);
            return;
          }
        }
      }
    }

    onSave();
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

        {/* Two-part descriptions */}
        <FormField label="Paragraph Description">
          <textarea
            value={form.description_paragraph}
            onChange={(e) => setForm({ ...form, description_paragraph: e.target.value })}
            rows={4}
            className="input-lux resize-none"
            placeholder="General product overview shown on the product page..."
          />
          <p className="text-xs text-sage-500 mt-1">A general overview paragraph displayed on the product detail page.</p>
        </FormField>

        <FormField label="Bullet-Point Feature List">
          <textarea
            value={form.description_features}
            onChange={(e) => setForm({ ...form, description_features: e.target.value })}
            rows={5}
            className="input-lux resize-none"
            placeholder={"One feature per line, e.g.\n100% premium cotton\nReinforced stitching\nMachine washable"}
          />
          <p className="text-xs text-sage-500 mt-1">
            One feature per line. These show as a bulleted list on the product detail page.
            {featuresArray.length > 0 && ` (${featuresArray.length} features)`}
          </p>
        </FormField>

        <FormField label="Legacy Description (optional)">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="input-lux resize-none"
            placeholder="Optional — kept for backwards compatibility."
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

        {/* Sale / Discount management */}
        <div className="p-5 bg-cream-100 border border-bronze-200">
          <div className="flex items-center gap-2 mb-4">
            <TagIcon size={16} className="text-bronze-500" />
            <h3 className="font-medium text-ink-700 text-sm tracking-wide uppercase">Sale / Discount (Product Level)</h3>
          </div>
          <p className="text-xs text-sage-500 mb-4">
            Set a sale price and optional start/end date-time. The sale price activates and expires automatically based on the dates.
          </p>
          <div className="space-y-3">
            <FormField label="Sale Price (KES)">
              <input
                type="number"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                className="input-lux"
                placeholder="Leave empty for no sale"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Sale Start Date/Time">
                <input
                  type="datetime-local"
                  value={form.sale_start_at}
                  onChange={(e) => setForm({ ...form, sale_start_at: e.target.value })}
                  className="input-lux"
                />
              </FormField>
              <FormField label="Sale End Date/Time">
                <input
                  type="datetime-local"
                  value={form.sale_end_at}
                  onChange={(e) => setForm({ ...form, sale_end_at: e.target.value })}
                  className="input-lux"
                />
              </FormField>
            </div>
            <p className="text-xs text-sage-500">
              Leave start/end empty for an always-on sale. The sale is only active between these times.
            </p>
          </div>
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
                <option key={c.id} value={c.id}>
                  {c.parent_id ? `— ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Demographic (optional)">
            <select
              value={form.demographic}
              onChange={(e) => setForm({ ...form, demographic: e.target.value })}
              className="input-lux"
            >
              <option value="">Any</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Product Type (optional)">
            <select
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value })}
              className="input-lux"
            >
              <option value="">Any</option>
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
            <span className="text-sm text-ink-700">In Stock (no variants)</span>
          </label>
        </div>

        {/* ─── Variant Manager ─── */}
        <div className="p-5 bg-cream-100 border border-sage-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-bronze-500" />
              <h3 className="font-medium text-ink-700 text-sm tracking-wide uppercase">Product Variants</h3>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-bronze-600 hover:text-bronze-700 border border-bronze-300 hover:border-bronze-500 transition-colors"
            >
              <Plus size={12} />
              Add Variant
            </button>
          </div>
          <p className="text-xs text-sage-500 mb-4">
            Create size/color combinations. Each variant has a unique SKU for order tracking and its own stock level.
            Stock is automatically deducted when a customer places an order.
          </p>

          {variantDrafts.filter((v) => !v._deleted).length === 0 ? (
            <p className="text-sm text-sage-500 text-center py-6">No variants yet. Add one to enable size/color selection.</p>
          ) : (
            <div className="space-y-3">
              {variantDrafts.map((variant, index) => {
                if (variant._deleted) return null;
                return (
                  <div key={index} className="bg-white border border-sage-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-ink-600 uppercase tracking-wide">Variant {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-sage-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Size">
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => updateVariant(index, { size: e.target.value })}
                          className="input-lux text-sm"
                          placeholder="e.g. M, L, XL, 42"
                        />
                      </FormField>
                      <FormField label="Color">
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, { color: e.target.value })}
                          className="input-lux text-sm"
                          placeholder="e.g. Black"
                        />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <FormField label="SKU (unique)" required>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, { sku: e.target.value })}
                          className="input-lux text-sm"
                          placeholder="e.g. SHRT-BLK-M"
                          required
                        />
                      </FormField>
                      <FormField label="Price Override">
                        <input
                          type="number"
                          value={variant.price_override}
                          onChange={(e) => updateVariant(index, { price_override: e.target.value })}
                          className="input-lux text-sm"
                          placeholder="Product price"
                        />
                      </FormField>
                      <FormField label="Stock">
                        <input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, { stock: e.target.value })}
                          className="input-lux text-sm"
                          placeholder="0"
                        />
                      </FormField>
                    </div>
                    {/* Per-variant sale */}
                    <div className="pt-2 border-t border-sage-100">
                      <p className="text-[10px] font-medium tracking-widest uppercase text-bronze-500 mb-2">Variant Sale (optional)</p>
                      <div className="grid grid-cols-3 gap-3">
                        <FormField label="Sale Price">
                          <input
                            type="number"
                            value={variant.sale_price}
                            onChange={(e) => updateVariant(index, { sale_price: e.target.value })}
                            className="input-lux text-sm"
                            placeholder="None"
                          />
                        </FormField>
                        <FormField label="Sale Start">
                          <input
                            type="datetime-local"
                            value={variant.sale_start_at}
                            onChange={(e) => updateVariant(index, { sale_start_at: e.target.value })}
                            className="input-lux text-sm"
                          />
                        </FormField>
                        <FormField label="Sale End">
                          <input
                            type="datetime-local"
                            value={variant.sale_end_at}
                            onChange={(e) => updateVariant(index, { sale_end_at: e.target.value })}
                            className="input-lux text-sm"
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
