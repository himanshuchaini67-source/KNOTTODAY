import { useState, type FormEvent } from 'react';
import { Calendar, MapPin, Heart, UserRound } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

interface EditWeddingDateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditWeddingDateModal({ isOpen, onClose }: EditWeddingDateModalProps) {
  const { user, updateWeddingDetails } = useAuth();
  const { showToast } = useToast();

  const [dateInput, setDateInput] = useState('');
  const [locationInput, setLocationInput] = useState(user?.location || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!dateInput) return;

    // Format ISO date into human-readable string: e.g. "December 25, 2026"
    const parsedDate = new Date(dateInput);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = parsedDate.toLocaleDateString('en-US', options);

    updateWeddingDetails(formattedDate, locationInput.trim() || undefined, dateInput);
    showToast(`Wedding date set to ${formattedDate}!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Wedding Date & Venue">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-charcoal/60">
          Set your wedding date and venue to customize your countdown and schedules.
        </p>

        <div>
          <label className="label-field flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-burgundy-600" />
            Wedding Date *
          </label>
          <input
            type="date"
            required
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="label-field flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-burgundy-600" />
            Wedding Location / Venue
          </label>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="e.g. The Leela Palace, Udaipur, Rajasthan"
            className="input-field text-sm"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1">
            Save Wedding Date
          </button>
        </div>
      </form>
    </Modal>
  );
}
