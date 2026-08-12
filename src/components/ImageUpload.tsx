import { useState, useRef } from 'react';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BUCKET = 'product-images';

function generateFilePath(file: File): string {
  const ext = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${ext}`;
}

async function uploadImage(file: File): Promise<string> {
  const path = generateFilePath(file);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ─── Single Image Upload ───

export function ImageUpload({
  value,
  onChange,
  label,
  aspect = 'aspect-[4/5]',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="label-lux">{label}</label>}

      <div className="flex gap-4">
        {/* Preview */}
        <div className={`${aspect} w-24 flex-shrink-0 bg-cream-100 border border-sage-200 overflow-hidden relative`}>
          {uploading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 size={20} className="text-sage-400 animate-spin" />
            </div>
          ) : value ? (
            <>
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1 right-1 w-6 h-6 bg-ink-700/80 text-cream-100 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sage-300">
              <Upload size={20} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-outline text-sm disabled:opacity-50"
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-sage-500 hover:text-bronze-500 transition-colors ml-2"
          >
            Or paste a URL instead
          </button>

          {showUrlInput && (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://..."
                className="input-lux text-sm flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  if (urlDraft.trim()) {
                    onChange(urlDraft.trim());
                    setUrlDraft('');
                    setShowUrlInput(false);
                  }
                }}
                className="btn-outline text-sm whitespace-nowrap"
              >
                <LinkIcon size={14} />
                Set
              </button>
            </div>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Gallery Upload (multiple images) ───

export function GalleryUpload({
  value,
  onChange,
  label,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setError('');
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      onChange([...value, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeUrl = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    if (urlDraft.trim()) {
      onChange([...value, urlDraft.trim()]);
      setUrlDraft('');
      setShowUrlInput(false);
    }
  };

  return (
    <div>
      {label && <label className="label-lux">{label}</label>}

      <div className="space-y-3">
        {/* Existing images */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {value.map((url, i) => (
              <div key={i} className="relative w-20 h-24 bg-cream-100 border border-sage-200 overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-ink-700/80 text-cream-100 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
              e.target.value = '';
            }}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-outline text-sm disabled:opacity-50"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs text-sage-500 hover:text-bronze-500 transition-colors"
            >
              Or paste URLs
            </button>
          </div>

          {showUrlInput && (
            <div className="flex gap-2 mt-2">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
                placeholder="https://..."
                className="input-lux text-sm flex-1"
              />
              <button type="button" onClick={addUrl} className="btn-outline text-sm whitespace-nowrap">
                Add
              </button>
            </div>
          )}

          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
