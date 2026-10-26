import { Modal } from '@/components/Modal';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmDialogProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center py-4 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-600" />
        </div>
        <p className="text-sm text-charcoal/70">{message}</p>
        <div className="mt-6 flex w-full gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            {t('cancel')}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
