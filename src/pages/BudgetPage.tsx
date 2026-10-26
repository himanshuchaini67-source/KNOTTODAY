import { useState, type FormEvent } from 'react';
import { Plus, Trash2, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { budgetData } from '@/data/mockData';
import type { BudgetItem } from '@/types';

const emptyItem: Omit<BudgetItem, 'id'> = {
  category: '', description: '', planned: 0, spent: 0,
};

const budgetCategories = [
  'Venue', 'Jewellery', 'Clothes', 'Makeup', 'Photography', 'Decoration',
  'Catering', 'DJ / Music', 'Transportation', 'Invitations', 'Other',
];

export function BudgetPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [items, setItems] = useState<BudgetItem[]>(budgetData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BudgetItem | null>(null);
  const [formData, setFormData] = useState<Omit<BudgetItem, 'id'>>(emptyItem);

  const totalPlanned = items.reduce((s, i) => s + i.planned, 0);
  const totalSpent = items.reduce((s, i) => s + i.spent, 0);
  const remaining = totalPlanned - totalSpent;
  const spentPercent = totalPlanned > 0 ? Math.round((totalSpent / totalPlanned) * 100) : 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setItems((prev) => [...prev, { ...formData, id: `b${Date.now()}` }]);
    showToast('Budget item added successfully!');
    setIsFormOpen(false);
    setFormData(emptyItem);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      showToast('Budget item removed.', 'info');
    }
  };

  const summaryCards = [
    { label: t('totalBudget'), value: totalPlanned, icon: Wallet, color: 'bg-burgundy-600' },
    { label: 'Planned', value: totalPlanned, icon: TrendingUp, color: 'bg-blue-600' },
    { label: t('spent'), value: totalSpent, icon: TrendingDown, color: 'bg-rose-500' },
    { label: t('remaining'), value: remaining, icon: PiggyBank, color: 'bg-green-600' },
  ];

  const formatINR = (v: number) => `₹${v.toLocaleString('en-IN')}`;

  return (
    <Layout title={t('budget')} subtitle="Track your wedding expenses">
      <PageHeader
        title="Wedding Budget"
        description="Plan and track your wedding spending with ease"
        action={
          <button onClick={() => setIsFormOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> {t('addBudgetItem')}
          </button>
        }
      />

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.color} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xl font-semibold text-burgundy-900 lg:text-2xl">{formatINR(card.value)}</p>
              <p className="text-sm text-charcoal/60">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="mb-6 card p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-charcoal/70">Overall Budget Progress</span>
          <span className="text-sm font-semibold text-burgundy-700">{spentPercent}% spent</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-burgundy-50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-burgundy-500 to-rose-500 transition-all"
            style={{ width: `${spentPercent}%` }}
          />
        </div>
      </div>

      {/* Budget items */}
      <div className="space-y-3">
        {items.map((item) => {
          const percent = item.planned > 0 ? Math.round((item.spent / item.planned) * 100) : 0;
          const isOverBudget = item.spent > item.planned;
          return (
            <div key={item.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-burgundy-50 px-2 py-0.5 text-xs font-medium text-burgundy-600">
                      {item.category}
                    </span>
                    {isOverBudget && (
                      <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                        Over Budget
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-charcoal">{item.description}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-burgundy-700">{formatINR(item.spent)}</p>
                    <p className="text-xs text-charcoal/40">of {formatINR(item.planned)}</p>
                  </div>
                  <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-1.5 text-charcoal/30 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-burgundy-50">
                  <div
                    className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-charcoal/50">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Budget Item"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Category *</label>
            <select required value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field">
              <option value="">Select category</option>
              {budgetCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Description *</label>
            <input type="text" required value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field" placeholder="e.g. Venue booking advance" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Planned Amount (₹) *</label>
              <input type="number" required min={0} value={formData.planned}
                onChange={(e) => setFormData({ ...formData, planned: Number(e.target.value) })}
                className="input-field" />
            </div>
            <div>
              <label className="label-field">Spent Amount (₹)</label>
              <input type="number" min={0} value={formData.spent}
                onChange={(e) => setFormData({ ...formData, spent: Number(e.target.value) })}
                className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary flex-1">{t('cancel')}</button>
            <button type="submit" className="btn-primary flex-1">{t('addBudgetItem')}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Budget Item"
        message={`Remove "${deleteTarget?.description}" from the budget?`}
      />
    </Layout>
  );
}
