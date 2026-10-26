import { useState, type FormEvent } from 'react';
import { Plus, Music, Clock, Users, Trash2, Pencil } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { sangeetData, images } from '@/data/mockData';
import type { SangeetPerformance, PerformanceStatus } from '@/types';

const emptyPerf: Omit<SangeetPerformance, 'id'> = {
  name: '', song: '', side: 'Bride', participants: '', practiceDate: '', practiceTime: '', duration: '', status: 'Planned', notes: '',
};

export function SangeetPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [performances, setPerformances] = useState<SangeetPerformance[]>(sangeetData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerf, setEditingPerf] = useState<SangeetPerformance | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SangeetPerformance | null>(null);
  const [formData, setFormData] = useState<Omit<SangeetPerformance, 'id'>>(emptyPerf);

  const openAdd = () => {
    setEditingPerf(null);
    setFormData(emptyPerf);
    setIsFormOpen(true);
  };

  const openEdit = (perf: SangeetPerformance) => {
    setEditingPerf(perf);
    const { id, ...rest } = perf;
    void id;
    setFormData(rest);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingPerf) {
      setPerformances((prev) => prev.map((p) => (p.id === editingPerf.id ? { ...formData, id: editingPerf.id } : p)));
      showToast('Performance updated successfully!');
    } else {
      setPerformances((prev) => [...prev, { ...formData, id: `s${Date.now()}` }]);
      showToast('Performance added successfully!');
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setPerformances((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast('Performance removed.', 'info');
    }
  };

  const cycleStatus = (id: string) => {
    const order: PerformanceStatus[] = ['Planned', 'Practicing', 'Ready', 'Completed'];
    setPerformances((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextIndex = (order.indexOf(p.status) + 1) % order.length;
        return { ...p, status: order[nextIndex] };
      })
    );
  };

  const ready = performances.filter((p) => p.status === 'Ready').length;
  const practicing = performances.filter((p) => p.status === 'Practicing').length;

  return (
    <Layout title="Sangeet" subtitle={`${performances.length} performances planned`}>
      <PageHeader
        title="Sangeet Performances"
        description="Coordinate dance performances and music for the Sangeet night"
        image={images.sangeet}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Performance
          </button>
        }
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-burgundy-700">{performances.length}</p>
          <p className="text-sm text-charcoal/60">Total Performances</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-blue-600">{practicing}</p>
          <p className="text-sm text-charcoal/60">Practicing</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-green-600">{ready}</p>
          <p className="text-sm text-charcoal/60">Ready</p>
        </div>
      </div>

      {/* Performance list */}
      <div className="space-y-3">
        {performances.map((perf) => (
          <div key={perf.id} className="card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                  perf.side === 'Bride' ? 'bg-rose-50 text-rose-600' : 'bg-champagne-50 text-champagne-700'
                }`}>
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-burgundy-900">{perf.name}</p>
                  <p className="text-xs text-charcoal/50">{perf.song}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-charcoal/50">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {perf.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {perf.practiceDate} · {perf.practiceTime}
                    </span>
                    <span>Duration: {perf.duration}</span>
                  </div>
                  {perf.notes && <p className="mt-1 text-xs text-charcoal/40">{perf.notes}</p>}
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <span className={`badge ${perf.side === 'Bride' ? 'bg-rose-50 text-rose-700' : 'bg-champagne-50 text-champagne-700'}`}>
                  {perf.side}
                </span>
                <button onClick={() => cycleStatus(perf.id)}>
                  <StatusBadge status={perf.status} type="performance" />
                </button>
                <button onClick={() => openEdit(perf)} className="rounded p-1 text-charcoal/30 hover:text-burgundy-600">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTarget(perf)} className="rounded p-1 text-charcoal/30 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {performances.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-charcoal/50">No performances yet. Add one to get started!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingPerf ? 'Edit Performance' : 'Add Performance'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Performance Name *</label>
              <input type="text" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field" placeholder="e.g. Couple Dance" />
            </div>
            <div>
              <label className="label-field">Song</label>
              <input type="text" value={formData.song}
                onChange={(e) => setFormData({ ...formData, song: e.target.value })}
                className="input-field" placeholder="e.g. Tum Se Hi" />
            </div>
            <div>
              <label className="label-field">Bride / Groom Side</label>
              <select value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value as 'Bride' | 'Groom' })}
                className="input-field">
                <option value="Bride">Bride</option>
                <option value="Groom">Groom</option>
              </select>
            </div>
            <div>
              <label className="label-field">Participants</label>
              <input type="text" value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                className="input-field" placeholder="e.g. Priya, Meera" />
            </div>
            <div>
              <label className="label-field">Practice Date</label>
              <input type="text" value={formData.practiceDate}
                onChange={(e) => setFormData({ ...formData, practiceDate: e.target.value })}
                className="input-field" placeholder="e.g. Dec 10, 2026" />
            </div>
            <div>
              <label className="label-field">Practice Time</label>
              <input type="text" value={formData.practiceTime}
                onChange={(e) => setFormData({ ...formData, practiceTime: e.target.value })}
                className="input-field" placeholder="e.g. 5:00 PM" />
            </div>
            <div>
              <label className="label-field">Duration</label>
              <input type="text" value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field" placeholder="e.g. 4 min" />
            </div>
            <div>
              <label className="label-field">Status</label>
              <select value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PerformanceStatus })}
                className="input-field">
                <option value="Planned">Planned</option>
                <option value="Practicing">Practicing</option>
                <option value="Ready">Ready</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Notes</label>
            <input type="text" value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field" placeholder="Choreography notes..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary flex-1">{t('cancel')}</button>
            <button type="submit" className="btn-primary flex-1">{editingPerf ? t('save') : 'Add Performance'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Performance"
        message={`Delete "${deleteTarget?.name}"?`}
      />
    </Layout>
  );
}
