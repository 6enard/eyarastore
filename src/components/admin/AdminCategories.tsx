import { useState } from 'react';
import {
  Plus, Pencil, Trash2, ChevronLeft, Save, AlertTriangle, FolderTree,
} from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { supabase } from '../../lib/supabase';
import { useData } from '../../context/DataContext';
import type { Category } from '../../hooks/useData';
import { FormField, slugify, EmptyState } from './AdminShared';

export function AdminCategories({ products }: { products: ReturnType<typeof useData>['products'] }) {
  const { categories, loading, refetch } = useData();
  const [mode, setMode] = useState<'list' | 'edit' | 'create'>('list');
  const [editingItem, setEditingItem] = useState<Category | null>(null);

  const handleSave = async () => {
    await refetch();
    setMode('list');
    setEditingItem(null);
  };

  const handleDelete = async (id: string, name: string) => {
    const productCount = products.filter((p) => p.category_id === id).length;
    const msg = productCount > 0
      ? `"${name}" has ${productCount} products. Deleting it will unlink those products. Continue?`
      : `Delete "${name}"? This cannot be undone.`;
    if (!confirm(msg)) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      await refetch();
    }
  };

  if (mode !== 'list') {
    return (
      <CategoryForm
        category={editingItem}
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
          <h2 className="font-serif text-2xl text-ink-700 font-light mb-1">Categories</h2>
          <p className="text-sm text-sage-500">{categories.length} categories</p>
        </div>
        <button
          onClick={() => { setMode('create'); setEditingItem(null); }}
          className="btn-primary whitespace-nowrap"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink-700" />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState icon={FolderTree} message="No categories yet. Add your first category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => {
            const productCount = products.filter((p) => p.category_id === c.id).length;
            return (
              <div key={c.id} className="bg-white border border-sage-200 p-5 transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-cream-100 overflow-hidden flex-shrink-0">
                      {c.image_url && <img src={c.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-ink-700">{c.name}</h3>
                      <p className="text-xs text-sage-400">{c.slug}</p>
                    </div>
                  </div>
                </div>
                {c.description && <p className="text-sm text-sage-500 mb-3 line-clamp-2">{c.description}</p>}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-cream-100 text-ink-600 capitalize">{c.demographic}</span>
                  <span className="text-xs px-2 py-1 bg-cream-100 text-ink-600 capitalize">{c.product_type}</span>
                  <span className="text-xs px-2 py-1 bg-bronze-100 text-bronze-700">{productCount} {productCount === 1 ? 'product' : 'products'}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-sage-100">
                  <button
                    onClick={() => { setMode('edit'); setEditingItem(c); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-ink-600 hover:text-bronze-500 transition-colors border border-sage-200 hover:border-bronze-400"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-ink-600 hover:text-red-600 transition-colors border border-sage-200 hover:border-red-400"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
