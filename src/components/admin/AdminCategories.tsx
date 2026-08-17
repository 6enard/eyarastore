import { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, ChevronLeft, Save, AlertTriangle, FolderTree, ArrowRight,
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

  const mainCategories = useMemo(() => categories.filter((c) => !c.parent_id), [categories]);
  const subsOf = (parentId: string) => categories.filter((c) => c.parent_id === parentId);

  const handleSave = async () => {
    await refetch();
    setMode('list');
    setEditingItem(null);
  };

  const handleDelete = async (id: string, name: string) => {
    const productCount = products.filter((p) => p.category_id === id).length;
    const subCount = subsOf(id).length;
    const parts: string[] = [];
    if (productCount > 0) parts.push(`${productCount} products`);
    if (subCount > 0) parts.push(`${subCount} sub-categories`);
    const msg = parts.length > 0
      ? `"${name}" has ${parts.join(' and ')}. Deleting it will unlink them. Continue?`
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
          <h2 className="font-serif text-2xl text-ink-700 font-light mb-1">Categories</h2>
          <p className="text-sm text-sage-500">{categories.length} categories ({mainCategories.length} main, {categories.length - mainCategories.length} sub)</p>
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
        <EmptyState icon={FolderTree} message="No categories yet. Add your first main category, then create sub-categories under it." />
      ) : (
        <div className="space-y-6">
          {mainCategories.map((main) => {
            const productCount = products.filter((p) => p.category_id === main.id).length;
            const children = subsOf(main.id);
            return (
              <div key={main.id} className="bg-white border border-sage-200">
                {/* Main category header */}
                <div className="flex items-start justify-between p-5 border-b border-sage-100">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-cream-100 overflow-hidden flex-shrink-0">
                      {main.image_url && <img src={main.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-ink-700">{main.name}</h3>
                      <p className="text-xs text-sage-400">{main.slug}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 bg-bronze-100 text-bronze-700 uppercase tracking-wide">Main</span>
                        <span className="text-[10px] px-2 py-0.5 bg-cream-100 text-ink-600">{productCount} {productCount === 1 ? 'product' : 'products'}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-cream-100 text-ink-600">{children.length} sub</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setMode('create'); setEditingItem({ ...main, parent_id: main.id, id: '', name: '', slug: '', description: '', image_url: '', demographic: main.demographic, product_type: main.product_type, sort_order: 0, created_at: '' }); }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-bronze-600 hover:text-bronze-700 transition-colors border border-bronze-300 hover:border-bronze-500"
                      title="Add sub-category"
                    >
                      <Plus size={12} />
                      Sub
                    </button>
                    <button
                      onClick={() => { setMode('edit'); setEditingItem(main); }}
                      className="p-2 text-ink-500 hover:text-bronze-500 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(main.id, main.name)}
                      className="p-2 text-ink-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Sub categories */}
                {children.length > 0 && (
                  <div className="divide-y divide-sage-100">
                    {children.map((sub) => {
                      const subProductCount = products.filter((p) => p.category_id === sub.id).length;
                      return (
                        <div key={sub.id} className="flex items-center justify-between px-5 py-3 pl-10">
                          <div className="flex items-center gap-3">
                            <ArrowRight size={14} className="text-sage-400" />
                            <div className="w-10 h-10 bg-cream-100 overflow-hidden flex-shrink-0">
                              {sub.image_url && <img src={sub.image_url} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-ink-700">{sub.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-sage-400">{sub.slug}</span>
                                <span className="text-[10px] px-2 py-0.5 bg-cream-100 text-ink-600">{subProductCount} {subProductCount === 1 ? 'product' : 'products'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setMode('edit'); setEditingItem(sub); }}
                              className="p-1.5 text-ink-500 hover:text-bronze-500 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id, sub.name)}
                              className="p-1.5 text-ink-500 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Orphan categories (shouldn't happen, but display defensively) */}
          {categories.filter((c) => c.parent_id && !mainCategories.some((m) => m.id === c.parent_id)).map((orphan) => (
            <div key={orphan.id} className="bg-white border border-sage-200 p-5">
              <p className="text-sm text-amber-600">{orphan.name} — orphaned sub-category (parent deleted)</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Category Form ───

function CategoryForm({ category, categories, isEdit, onSave, onCancel }: {
  category: Category | null;
  categories: Category[];
  isEdit: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const mainCategories = categories.filter((c) => !c.parent_id);
  // If category has a parent_id but no id, it's the "add sub" placeholder.
  const isSubCreate = !isEdit && category?.parent_id && !category?.id;
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    parent_id: isSubCreate ? (category?.parent_id || '') : (category?.parent_id || ''),
    demographic: category?.demographic || '',
    product_type: category?.product_type || '',
    sort_order: category?.sort_order?.toString() || '0',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isSub = Boolean(form.parent_id);

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

    const data: Record<string, unknown> = {
      name: form.name,
      slug,
      description: form.description || null,
      image_url: form.image_url || null,
      parent_id: form.parent_id || null,
      sort_order: parseInt(form.sort_order) || 0,
    };
    // demographic / product_type are optional for hierarchical categories.
    data.demographic = form.demographic || null;
    data.product_type = form.product_type || null;

    let result;
    if (isEdit && category?.id) {
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
          {isEdit ? 'Edit Category' : isSub ? 'New Sub-Category' : 'New Main Category'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        <FormField label="Parent Category" >
          <select
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            className="input-lux"
          >
            <option value="">None (Main Category)</option>
            {mainCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <p className="text-xs text-sage-500 mt-1">
            {isSub
              ? 'This will be a sub-category shown under the selected parent.'
              : 'Leave as "None" to create a top-level main category shown in the header navigation.'}
          </p>
        </FormField>

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
