import { useToast } from '@/hooks/useToast';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
              ? AlertCircle
              : Info;
        const colors =
          toast.type === 'success'
            ? 'bg-green-600'
            : toast.type === 'error'
              ? 'bg-red-600'
              : 'bg-burgundy-700';
        return (
          <div
            key={toast.id}
            className="animate-in slide-in-from-right flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-burgundy-100"
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full ${colors} text-white`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium text-charcoal">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-charcoal/40 hover:text-charcoal/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
