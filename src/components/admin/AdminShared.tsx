import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export function FormField({ label, required, children }: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
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

export function TabButton({ active, onClick, icon: Icon, label, count }: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  count?: number;
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
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 ${active ? 'bg-ink-700 text-cream-100' : 'bg-cream-200 text-sage-500'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2.5 py-1 capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

export function EmptyState({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="text-center py-16">
      <Icon size={32} className="mx-auto text-sage-300 mb-3" strokeWidth={1.5} />
      <p className="text-sage-500 text-sm">{message}</p>
    </div>
  );
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
