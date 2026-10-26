import { useState, useEffect, type FormEvent } from 'react';
import { Heart, UserRound, Sparkles } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

interface EditCoupleNamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditCoupleNamesModal({ isOpen, onClose }: EditCoupleNamesModalProps) {
  const { user, updateCoupleNames } = useAuth();
  const { showToast } = useToast();

  const [brideInput, setBrideInput] = useState('');
  const [groomInput, setGroomInput] = useState('');

  // Sync state whenever modal opens or user changes
  useEffect(() => {
    if (user) {
      setBrideInput(user.brideName || '');
      setGroomInput(user.groomName || '');
    }
  }, [user, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!brideInput.trim() || !groomInput.trim()) {
      showToast('Please enter both Bride and Groom names.', 'error');
      return;
    }

    const cleanBride = brideInput.trim();
    const cleanGroom = groomInput.trim();

    updateCoupleNames(cleanBride, cleanGroom);
    showToast(`Couple names updated to ${cleanBride} & ${cleanGroom}!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Bride & Groom Names">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-charcoal/60">
          Personalize your wedding planner by setting the names of the Bride and Groom. This updates across all client checklists, portals, and headers.
        </p>

        {/* Bride Name Field */}
        <div>
          <label className="label-field flex items-center gap-1.5 text-xs font-semibold text-burgundy-900">
            <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
            Bride&apos;s Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Aishwarya"
            value={brideInput}
            onChange={(e) => setBrideInput(e.target.value)}
            className="input-field text-sm font-medium"
            autoFocus
          />
        </div>

        {/* Groom Name Field */}
        <div>
          <label className="label-field flex items-center gap-1.5 text-xs font-semibold text-burgundy-900">
            <UserRound className="h-4 w-4 text-burgundy-700" />
            Groom&apos;s Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rohan"
            value={groomInput}
            onChange={(e) => setGroomInput(e.target.value)}
            className="input-field text-sm font-medium"
          />
        </div>

        {/* Live Preview Pill */}
        <div className="rounded-xl border border-champagne-200 bg-champagne-50/60 p-3 text-center">
          <p className="text-[11px] uppercase tracking-wider text-charcoal/50">Preview</p>
          <p className="font-serif text-base font-bold text-burgundy-900 mt-0.5">
            {brideInput.trim() || 'Bride'} &amp; {groomInput.trim() || 'Groom'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-champagne-300" />
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
