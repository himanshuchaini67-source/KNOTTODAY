import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, UtensilsCrossed, Users, ArrowRight, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SearchBar } from '@/components/SearchFilter';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { guestsData } from '@/data/mockData';
import type { Guest } from '@/types';

const emptyGuest: Omit<Guest, 'id'> = {
  name: '',
  phone: '',
  email: '',
  side: 'Bride',
  numberOfGuests: 1,
  rsvp: 'Pending',
  notes: '',
};

export function GuestsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const userId = user?.id || 'visitor';
  const guestsKey = `wedding_guests_list_${userId}`;
  const plateRateKey = `wedding_plate_rate_${userId}`;

  // Initial load from localStorage or mock
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(guestsKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return guestsData;
  });

  const [plateRate, setPlateRate] = useState<number>(() => {
    try {
      const savedRate = localStorage.getItem(plateRateKey);
      if (savedRate) return Number(savedRate) || 1500;
    } catch (e) {
      console.error(e);
    }
    return 1500;
  });

  const [search, setSearch] = useState('');
  const [sideFilter, setSideFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Guest | null>(null);
  const [formData, setFormData] = useState<Omit<Guest, 'id'>>(emptyGuest);

  // Helper to persist guests and notify other components (e.g. BillPage)
  const saveGuests = (newGuests: Guest[]) => {
    setGuests(newGuests);
    try {
      localStorage.setItem(guestsKey, JSON.stringify(newGuests));
      window.dispatchEvent(new Event('wedding_data_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  const updatePlateRate = (newRate: number) => {
    const val = Math.max(0, newRate);
    setPlateRate(val);
    try {
      localStorage.setItem(plateRateKey, String(val));
      window.dispatchEvent(new Event('wedding_data_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync from other tabs/windows if updated
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(guestsKey);
        if (saved) setGuests(JSON.parse(saved));
        const savedRate = localStorage.getItem(plateRateKey);
        if (savedRate) setPlateRate(Number(savedRate) || 1500);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, [guestsKey, plateRateKey]);

  // Dynamic calculations
  const totalPeopleCount = guests.reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const bridePeopleCount = guests
    .filter((g) => g.side === 'Bride')
    .reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const groomPeopleCount = guests
    .filter((g) => g.side === 'Groom')
    .reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const dynamicFoodBill = totalPeopleCount * plateRate;

  const filtered = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchSide = sideFilter === 'all' || g.side === sideFilter;
    return matchSearch && matchSide;
  });

  const openAdd = () => {
    setEditingGuest(null);
    setFormData(emptyGuest);
    setIsFormOpen(true);
  };

  const openEdit = (guest: Guest) => {
    setEditingGuest(guest);
    const { id, ...rest } = guest;
    void id;
    setFormData(rest);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingGuest) {
      const updated = guests.map((g) =>
        g.id === editingGuest.id ? { ...formData, id: editingGuest.id } : g
      );
      saveGuests(updated);
      showToast('Guest updated successfully!');
    } else {
      const newGuest: Guest = { ...formData, id: `g${Date.now()}` };
      saveGuests([...guests, newGuest]);
      showToast('Guest added successfully!');
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      const updated = guests.filter((g) => g.id !== deleteTarget.id);
      saveGuests(updated);
      showToast('Guest removed.', 'info');
      setDeleteTarget(null);
    }
  };

  const changeGuestCount = (id: string, count: number) => {
    if (count < 1) return;
    const updated = guests.map((g) => (g.id === id ? { ...g, numberOfGuests: count } : g));
    saveGuests(updated);
  };

  return (
    <Layout
      title={t('guests')}
      subtitle={`${guests.length} entries (${totalPeopleCount} total attendees) &bull; Dynamic Food Bill: ₹${dynamicFoodBill.toLocaleString('en-IN')}`}
    >
      <PageHeader
        title="Guest Management"
        description="Manage your wedding guest list and dynamically calculate your catering & food bill based on live headcount"
        action={
          <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> {t('addGuest')}
          </button>
        }
      />

      {/* ─── DYNAMIC FOOD BILL & CATERING SUMMARY BANNER ─── */}
      <div className="mb-6 overflow-hidden rounded-2xl border-2 border-champagne-300 bg-gradient-to-br from-amber-50/70 via-white to-rose-50/40 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-burgundy-800 to-burgundy-950 text-champagne-300 shadow-md">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-champagne-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-burgundy-900">
                  Dynamic Calculation
                </span>
                <span className="text-xs text-charcoal/50">Auto-synced with Wedding Bill</span>
              </div>
              <h3 className="mt-1 text-lg font-bold text-burgundy-950">
                Dynamic Catering &amp; Food Bill: ₹{dynamicFoodBill.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-charcoal/65">
                Formula: <span className="font-semibold text-burgundy-900">{totalPeopleCount} Total Guests</span> &times; <span className="font-semibold text-burgundy-900">₹{plateRate.toLocaleString('en-IN')} / plate</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Headcount Pill */}
            <div className="rounded-xl border border-burgundy-100 bg-white px-3.5 py-2 text-center shadow-xs">
              <span className="block text-[10px] font-bold uppercase text-charcoal/50">Total Headcount</span>
              <span className="text-base font-bold text-burgundy-950">{totalPeopleCount} people</span>
              <div className="flex justify-center gap-2 text-[10px] text-charcoal/60">
                <span className="text-rose-600">Bride: {bridePeopleCount}</span>
                <span>•</span>
                <span className="text-champagne-700">Groom: {groomPeopleCount}</span>
              </div>
            </div>

            {/* Configurable Plate Rate */}
            <div className="rounded-xl border border-burgundy-100 bg-white px-3.5 py-2 shadow-xs">
              <label className="block text-[10px] font-bold uppercase text-charcoal/50">Rate per Plate (₹)</label>
              <div className="mt-0.5 flex items-center gap-1.5">
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={plateRate}
                  onChange={(e) => updatePlateRate(Number(e.target.value))}
                  className="w-24 rounded-lg border border-burgundy-200 bg-burgundy-50/30 px-2 py-0.5 text-center text-sm font-bold text-burgundy-950 focus:border-burgundy-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Direct Bill Link */}
            <Link
              to="/bill"
              className="inline-flex items-center gap-1.5 rounded-xl bg-burgundy-700 px-4 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-burgundy-800"
            >
              <span>View in Bill</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchBar value={search} onChange={setSearch} placeholder="Search guests by name..." />
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Filter by Side</label>
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="rounded-lg border border-burgundy-100 bg-white px-3 py-2 text-sm text-charcoal focus:border-burgundy-300 focus:outline-none focus:ring-2 focus:ring-burgundy-50"
          >
            <option value="all">All Sides ({guests.length})</option>
            <option value="Bride">Bride's Side ({guests.filter((g) => g.side === 'Bride').length})</option>
            <option value="Groom">Groom's Side ({guests.filter((g) => g.side === 'Groom').length})</option>
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card hidden overflow-hidden lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-burgundy-50 bg-burgundy-50/30 text-left text-xs uppercase text-charcoal/50">
              <th className="px-4 py-3 font-semibold">Guest / Family Name</th>
              <th className="px-4 py-3 font-semibold">Side</th>
              <th className="px-4 py-3 font-semibold">Attending Headcount</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const count = Number(g.numberOfGuests) || 1;
              return (
                <tr key={g.id} className="border-b border-burgundy-50 last:border-0 hover:bg-burgundy-50/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-charcoal">{g.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        g.side === 'Bride' ? 'bg-rose-50 text-rose-700' : 'bg-champagne-50 text-champagne-700'
                      }`}
                    >
                      {g.side}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeGuestCount(g.id, count - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-burgundy-200 bg-white text-xs font-bold text-burgundy-900 hover:bg-burgundy-50"
                        title="Decrease headcount"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={count}
                        onChange={(e) => changeGuestCount(g.id, Number(e.target.value))}
                        className="w-16 rounded-md border border-burgundy-100 bg-white px-2 py-1 text-center text-sm font-semibold text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-1 focus:ring-burgundy-100"
                      />
                      <button
                        type="button"
                        onClick={() => changeGuestCount(g.id, count + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-burgundy-200 bg-white text-xs font-bold text-burgundy-900 hover:bg-burgundy-50"
                        title="Increase headcount"
                      >
                        +
                      </button>
                      <span className="text-xs text-charcoal/50">people</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(g)}
                      className="rounded-lg p-1.5 text-burgundy-600 hover:bg-burgundy-50"
                      title={t('edit')}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(g)}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                      title={t('delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((g) => {
          const count = Number(g.numberOfGuests) || 1;
          return (
            <div key={g.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-charcoal">{g.name}</p>
                </div>
                <span
                  className={`badge ${
                    g.side === 'Bride' ? 'bg-rose-50 text-rose-700' : 'bg-champagne-50 text-champagne-700'
                  }`}
                >
                  {g.side}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-charcoal/50">Guests:</span>
                  <button
                    type="button"
                    onClick={() => changeGuestCount(g.id, count - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded border border-burgundy-200 bg-white text-xs font-bold text-burgundy-900"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={count}
                    onChange={(e) => changeGuestCount(g.id, Number(e.target.value))}
                    className="w-14 rounded-md border border-burgundy-100 bg-white px-1.5 py-0.5 text-center text-sm font-semibold text-charcoal focus:border-burgundy-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => changeGuestCount(g.id, count + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded border border-burgundy-200 bg-white text-xs font-bold text-burgundy-900"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(g)}
                    className="rounded-lg border border-burgundy-100 px-3 py-1.5 text-xs font-medium text-burgundy-600 hover:bg-burgundy-50"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(g)}
                    className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card mt-4 p-12 text-center">
          <p className="text-charcoal/50">No guests found matching your search.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingGuest ? 'Edit Guest' : 'Add New Guest'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Guest or family name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Side</label>
              <select
                value={formData.side}
                onChange={(e) =>
                  setFormData({ ...formData, side: e.target.value as 'Bride' | 'Groom' })
                }
                className="input-field"
              >
                <option value="Bride">Bride</option>
                <option value="Groom">Groom</option>
              </select>
            </div>
            <div>
              <label className="label-field">Number of Guests (Headcount)</label>
              <input
                type="number"
                min={1}
                value={formData.numberOfGuests}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfGuests: Number(e.target.value) })
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="btn-secondary flex-1"
            >
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingGuest ? t('save') : t('addGuest')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Guest"
        message={`Remove "${deleteTarget?.name}" from the guest list? This will also update the dynamic food bill calculation.`}
      />
    </Layout>
  );
}
