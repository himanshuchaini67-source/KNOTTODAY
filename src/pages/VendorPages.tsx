import { useState } from 'react';
import { Tag, Check, X, Sparkles } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { VendorCard } from '@/components/VendorCard';
import { BookingModal } from '@/components/BookingModal';
import { SearchBar } from '@/components/SearchFilter';
import { useLanguage } from '@/hooks/useLanguage';
import { vendorsData, images } from '@/data/mockData';
import type { Vendor } from '@/types';

interface VendorPageProps {
  title: string;
  subtitle: string;
  pageTitle: string;
  pageDescription: string;
  heroImage: string;
  category?: string;
  showPortfolio?: boolean;
  serviceCategories?: string[];
}

export function VendorPage({
  title,
  subtitle,
  pageTitle,
  pageDescription,
  heroImage,
  category,
  showPortfolio,
  serviceCategories,
}: VendorPageProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);

  const allVendors = category
    ? vendorsData.filter((v) => v.category === category)
    : vendorsData;

  const filtered = allVendors.filter((v) => {
    // Search keyword matching
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      v.services.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    // Clickable Tag matching
    const matchTag =
      selectedTag === 'all' ||
      v.services.some(
        (s) =>
          s.toLowerCase().includes(selectedTag.toLowerCase()) ||
          selectedTag.toLowerCase().includes(s.toLowerCase())
      ) ||
      v.name.toLowerCase().includes(selectedTag.toLowerCase()) ||
      v.description.toLowerCase().includes(selectedTag.toLowerCase()) ||
      v.category.toLowerCase().includes(selectedTag.toLowerCase());

    return matchSearch && matchTag;
  });

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag('all');
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <Layout title={title} subtitle={subtitle}>
      <PageHeader title={pageTitle} description={pageDescription} image={heroImage} />

      {/* ─── Clickable Service Category Tags ─── */}
      {serviceCategories && serviceCategories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold uppercase tracking-wider text-charcoal/60">
            <Tag className="h-3.5 w-3.5 text-[#6F8F7B]" />
            <span>Select Category / Specialization:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* "All" button */}
            <button
              type="button"
              onClick={() => setSelectedTag('all')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs ${
                selectedTag === 'all'
                  ? 'bg-[#3E5F4D] text-white shadow-sm ring-1 ring-[#3E5F4D]'
                  : 'border border-[#AFC8B4]/60 bg-white/90 text-charcoal/80 hover:bg-[#F4EBDD] hover:border-[#6F8F7B]'
              }`}
            >
              All ({allVendors.length})
            </button>

            {/* Individual Clickable Tags */}
            {serviceCategories.map((cat) => {
              const isSelected = selectedTag === cat;

              // Count matching vendors for this tag
              const count = allVendors.filter(
                (v) =>
                  v.services.some(
                    (s) =>
                      s.toLowerCase().includes(cat.toLowerCase()) ||
                      cat.toLowerCase().includes(s.toLowerCase())
                  ) ||
                  v.name.toLowerCase().includes(cat.toLowerCase()) ||
                  v.description.toLowerCase().includes(cat.toLowerCase()) ||
                  v.category.toLowerCase().includes(cat.toLowerCase())
              ).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleTagClick(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                    isSelected
                      ? 'bg-[#3E5F4D] text-white shadow-sm ring-1 ring-[#3E5F4D] font-bold'
                      : 'border border-[#AFC8B4]/60 bg-white/90 text-charcoal/80 hover:bg-[#F4EBDD] hover:border-[#6F8F7B] hover:text-[#3E5F4D]'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-champagne-300 stroke-[3]" />}
                  <span>{cat}</span>
                  {count > 0 && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] ${
                        isSelected
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-[#E7EFE9] text-[#3E5F4D] font-bold'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Active Filter Notification Banner ─── */}
      {selectedTag !== 'all' && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-[#AFC8B4]/70 bg-[#F6F9F7] px-4 py-2 text-xs text-[#3E5F4D] shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-charcoal/70">Filtered by:</span>
            <span className="rounded-md border border-[#AFC8B4] bg-white px-2 py-0.5 font-bold text-[#3E5F4D]">
              {selectedTag}
            </span>
            <span className="text-charcoal/60">
              ({filtered.length} vendor{filtered.length !== 1 ? 's' : ''} available)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search vendors by name, service or city location..."
        />
      </div>

      {/* Vendor Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onBook={() => setBookingVendor(vendor)}
            showPortfolio={showPortfolio}
            onPortfolio={() => setBookingVendor(vendor)}
            onTagClick={handleTagClick}
            selectedTag={selectedTag}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center border-dashed">
          <p className="text-sm font-semibold text-charcoal/60">
            No vendors found matching &quot;{selectedTag !== 'all' ? selectedTag : search}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedTag('all');
              setSearch('');
            }}
            className="mt-3 btn-secondary text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      <BookingModal
        isOpen={!!bookingVendor}
        onClose={() => setBookingVendor(null)}
        vendor={bookingVendor}
      />
    </Layout>
  );
}

// ─── Specific vendor pages ───

export function ServicesPage() {
  return (
    <VendorPage
      title="Services"
      subtitle="All wedding service vendors"
      pageTitle="Wedding Services Directory"
      pageDescription="Discover trusted vendors for every aspect of your wedding"
      heroImage={images.stageFloral}
      serviceCategories={['Makeup Artists', 'DJ / Music', 'Photography', 'Decoration', 'Catering']}
    />
  );
}

export function MakeupPage() {
  return (
    <VendorPage
      title="Makeup Artists"
      subtitle="Bridal makeup and grooming"
      pageTitle="Makeup Artists"
      pageDescription="Professional bridal makeup and grooming artists"
      heroImage={images.makeup}
      category="Makeup Artists"
      serviceCategories={[
        'Bridal Makeup',
        'Groom Grooming',
        'Hairstyling',
        'Reception Makeup',
        'Mehendi Makeup',
        'Haldi Makeup',
        'Trial Session',
      ]}
    />
  );
}

export function MusicDjPage() {
  return (
    <VendorPage
      title="Music & DJ"
      subtitle="DJ and music services"
      pageTitle="Music & DJ"
      pageDescription="Set the perfect mood with professional DJ and music services"
      heroImage={images.dj}
      category="DJ / Music"
      serviceCategories={[
        'Sangeet DJ',
        'DJ Night',
        'Sound System',
        'Sound Equipment',
        'Lighting',
        'MC Services',
      ]}
    />
  );
}

export function PhotographyPage() {
  return (
    <VendorPage
      title="Photography"
      subtitle="Capture every moment"
      pageTitle="Photography & Videography"
      pageDescription="Beautiful wedding photography and cinematic films"
      heroImage={images.photography}
      category="Photography"
      showPortfolio
      serviceCategories={[
        'Wedding Photography',
        'Candid Photography',
        'Pre-Wedding',
        'Videography',
        'Drone Photography',
        'Traditional',
        'Cinematic Film',
      ]}
    />
  );
}

export function DecorationPage() {
  return (
    <VendorPage
      title="Decoration"
      subtitle="Wedding decor and styling"
      pageTitle="Wedding Decoration"
      pageDescription="Stunning floral and thematic decor for every celebration"
      heroImage={images.mandap}
      category="Decoration"
      serviceCategories={[
        'Wedding Stage',
        'Mandap',
        'Floral Decoration',
        'Reception',
        'Mehendi',
        'Haldi',
        'Entrance',
        'Lighting',
      ]}
    />
  );
}

export function CateringPage() {
  return (
    <VendorPage
      title="Catering"
      subtitle="Food and beverage services"
      pageTitle="Wedding Catering"
      pageDescription="Delicious cuisine for your wedding celebrations"
      heroImage={images.food}
      category="Catering"
      serviceCategories={[
        'Vegetarian',
        'Non-Vegetarian',
        'South Indian',
        'North Indian',
        'Snacks',
        'Desserts',
        'Beverages',
      ]}
    />
  );
}
