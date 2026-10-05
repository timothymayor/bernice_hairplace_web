import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, ProductCategory } from '../types';
import {
  Search,
  X,
  Heart,
  ChevronRight,
  FilterX,
  Truck,
  ShieldCheck,
  Store,
  Plus,
  SlidersHorizontal,
  DollarSign,
  Check,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    products,
    setSelectedProduct,
    setQuickViewProduct,
    setCurrentView,
    wishlist,
    toggleWishlist,
    formatPrice,
    searchQuery,
    setSearchQuery,
    currency,
  } = useShop();

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [selectedLengthRange, setSelectedLengthRange] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'>('featured');
  const [visibleLimit, setVisibleLimit] = useState<number>(8);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Price range filter state (in NGN)
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [selectedPricePreset, setSelectedPricePreset] = useState<string>('all');

  // Price presets
  const pricePresets = [
    { id: 'all', label: 'All Prices', min: 0, max: 500000 },
    { id: 'under100k', label: 'Under ₦100,000', min: 0, max: 100000 },
    { id: '100k-250k', label: '₦100k – ₦250k', min: 100000, max: 250000 },
    { id: '250k-400k', label: '₦250k – ₦400k', min: 250000, max: 400000 },
    { id: 'above400k', label: 'Over ₦400,000', min: 400000, max: 500000 },
  ];

  const handlePricePresetSelect = (preset: typeof pricePresets[0]) => {
    setSelectedPricePreset(preset.id);
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      bundles: products.filter((p) => p.category === 'bundles').length,
      wigs: products.filter((p) => p.category === 'wigs').length,
      frontals: products.filter((p) => p.category === 'frontals' || p.category === 'closures').length,
      care: products.filter((p) => p.category === 'care').length,
    };
  }, [products]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Category Filter
        if (activeCategory !== 'all') {
          if (activeCategory === 'wigs' && p.category !== 'wigs') return false;
          if (activeCategory === 'bundles' && p.category !== 'bundles') return false;
          if (activeCategory === 'frontals' && p.category !== 'frontals' && p.category !== 'closures') return false;
          if (activeCategory === 'care' && p.category !== 'care') return false;
        }

        // 2. Search Query (Queries product name, description, subtitle, texture, origin, and sku)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSubtitle = p.subtitle.toLowerCase().includes(q);
          const matchTexture = p.texture.toLowerCase().includes(q);
          const matchOrigin = p.origin.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchFullSpecs =
            p.fullSpecs.origin.toLowerCase().includes(q) ||
            p.fullSpecs.texture.toLowerCase().includes(q) ||
            p.fullSpecs.bleachGrade.toLowerCase().includes(q);

          if (!matchName && !matchDesc && !matchSubtitle && !matchTexture && !matchOrigin && !matchSku && !matchFullSpecs) {
            return false;
          }
        }

        // 3. Price Range Filter
        if (p.price < minPrice || p.price > maxPrice) {
          return false;
        }

        // 4. Texture Filter
        if (selectedTexture && p.texture !== selectedTexture) {
          return false;
        }

        // 5. Length Filter
        if (selectedLengthRange) {
          if (selectedLengthRange === '16' && !p.lengths.some((l) => l >= 14 && l <= 18)) return false;
          if (selectedLengthRange === '20' && !p.lengths.some((l) => l >= 20 && l <= 24)) return false;
          if (selectedLengthRange === '26' && !p.lengths.some((l) => l >= 26 && l <= 30)) return false;
          if (selectedLengthRange === '32' && !p.lengths.some((l) => l >= 32)) return false;
        }

        // 6. Lagos In-Stock Filter
        if (inStockOnly && !p.isInStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [
    products,
    activeCategory,
    searchQuery,
    minPrice,
    maxPrice,
    selectedTexture,
    selectedLengthRange,
    inStockOnly,
    sortBy,
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleLimit);

  const handleResetAllFilters = () => {
    setActiveCategory('all');
    setSelectedTexture('');
    setSelectedLengthRange('');
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
    setMinPrice(0);
    setMaxPrice(500000);
    setSelectedPricePreset('all');
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleLimit((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 600);
  };

  const isAnyFilterActive =
    activeCategory !== 'all' ||
    selectedTexture !== '' ||
    selectedLengthRange !== '' ||
    searchQuery.trim() !== '' ||
    minPrice > 0 ||
    maxPrice < 500000 ||
    sortBy !== 'featured';

  return (
    <div className="flex flex-col w-full bg-[#FBF9F6]">
      {/* Top Editorial Header & Breadcrumbs Bar */}
      <section className="w-full bg-[#FBF9F6] py-10 lg:py-12 border-b border-[#EAE8E5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 mb-4 text-[#807571] text-[11px] uppercase tracking-widest font-semibold">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#1A1412] transition-colors">
              Atelier
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#725B38]" />
            <button onClick={() => setCurrentView('shop')} className="hover:text-[#1A1412] transition-colors">
              Catalog
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#725B38]" />
            <span className="text-[#1A1412] font-bold">Raw Hair Extensions, Closures & Wigs</span>
          </nav>

          {/* Heading Block */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFEEEB] rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#725B38]"></span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#4E4542]">
                  Lagos Studio Stock • Sourced Single Donor Vault
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1412] font-normal tracking-tight">
                Raw Hair Extensions & Wigs
              </h1>

              <p className="text-sm text-[#4E4542] mt-3 font-light leading-relaxed">
                Discover our signature unprocessed single-donor lengths from 14″ to 32″ and Swiss HD lace units. Filter by texture, price range, and hair categories below.
              </p>
            </div>

            {/* Quality Seal Guarantee Card */}
            <div className="p-4 bg-[#F5F3F0] rounded-xl flex items-center gap-4 shadow-sm border border-[#EAE8E5] shrink-0">
              <div className="w-10 h-10 rounded bg-[#1A1412] text-[#FEDEB2] flex items-center justify-center font-editorial text-xl font-bold">
                ★
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#807571]">
                  100% Single-Donor Unprocessed
                </p>
                <p className="text-xs font-bold text-[#1A1412]">Intact Cuticles • Zero Acid Polish</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Search Console */}
      <section className="w-full bg-white sticky top-20 z-30 shadow-sm border-b border-[#EAE8E5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 py-4 space-y-4">
          {/* Row 1: Search Bar & Primary Category Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input querying Product Names & Descriptions */}
            <div className="relative w-full lg:w-96 shrink-0">
              <Search className="w-4 h-4 text-[#725B38] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, description, texture..."
                className="w-full h-11 pl-10 pr-9 bg-[#F5F3F0] text-xs text-[#1A1412] font-medium rounded-lg placeholder-[#807571] focus:outline-none focus:bg-white border border-[#D1C4C0] focus:border-[#725B38] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#807571] hover:text-[#1A1412]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips with Item Counts */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'all'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'bg-[#EFEEEB] text-[#4E4542] hover:bg-[#EAE8E5]'
                }`}
              >
                <span>All Pieces</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'all' ? 'bg-[#725B38] text-white' : 'bg-[#D1C4C0] text-[#1A1412]'}`}>
                  {categoryCounts.all}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('bundles')}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'bundles'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'bg-[#EFEEEB] text-[#4E4542] hover:bg-[#EAE8E5]'
                }`}
              >
                <span>Bundles</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'bundles' ? 'bg-[#725B38] text-white' : 'bg-[#D1C4C0] text-[#1A1412]'}`}>
                  {categoryCounts.bundles}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('wigs')}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'wigs'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'bg-[#EFEEEB] text-[#4E4542] hover:bg-[#EAE8E5]'
                }`}
              >
                <span>HD Wigs</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'wigs' ? 'bg-[#725B38] text-white' : 'bg-[#D1C4C0] text-[#1A1412]'}`}>
                  {categoryCounts.wigs}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('frontals')}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'frontals'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'bg-[#EFEEEB] text-[#4E4542] hover:bg-[#EAE8E5]'
                }`}
              >
                <span>Closures & Frontals</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'frontals' ? 'bg-[#725B38] text-white' : 'bg-[#D1C4C0] text-[#1A1412]'}`}>
                  {categoryCounts.frontals}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('care')}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'care'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'bg-[#EFEEEB] text-[#4E4542] hover:bg-[#EAE8E5]'
                }`}
              >
                <span>Silk Care</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'care' ? 'bg-[#725B38] text-white' : 'bg-[#D1C4C0] text-[#1A1412]'}`}>
                  {categoryCounts.care}
                </span>
              </button>
            </div>

            {/* Toggle Filter Drawer on Mobile / Quick Sorting */}
            <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold uppercase transition-colors ${
                  isFilterDrawerOpen || minPrice > 0 || maxPrice < 500000
                    ? 'bg-[#1A1412] text-white border-[#1A1412]'
                    : 'bg-[#F5F3F0] text-[#4E4542] border-[#D1C4C0] hover:bg-[#EAE8E5]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Price & Texture Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-3 bg-[#F5F3F0] border border-[#D1C4C0] text-xs uppercase font-bold text-[#1A1412] rounded-lg cursor-pointer hover:bg-white focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated ★</option>
                <option value="newest">Latest Curations</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price Range Filter & Detailed Customizer (Collapsible / Expandable Panel) */}
          {isFilterDrawerOpen && (
            <div className="p-5 bg-[#F5F3F0] rounded-xl border border-[#EAE8E5] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Price Presets */}
                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-[#1A1412] flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#725B38]" />
                      Price Range Filter ({currency})
                    </span>
                    <span className="text-xs font-bold text-[#725B38]">
                      {formatPrice(minPrice)} — {formatPrice(maxPrice)}
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {pricePresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePricePresetSelect(preset)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                          selectedPricePreset === preset.id
                            ? 'bg-[#1A1412] text-white shadow-sm'
                            : 'bg-white text-[#4E4542] border border-[#D1C4C0] hover:bg-[#EFEEEB]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Range Slider */}
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[10px] text-[#807571] font-bold">₦0</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="25000"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(parseInt(e.target.value, 10));
                        setSelectedPricePreset('custom');
                      }}
                      className="w-full h-2 bg-[#D1C4C0] rounded-lg appearance-none cursor-pointer accent-[#725B38]"
                    />
                    <span className="text-[10px] text-[#807571] font-bold">₦500k</span>
                  </div>
                </div>

                {/* Texture Quick Select */}
                <div className="md:col-span-3 space-y-1.5">
                  <span className="text-xs uppercase font-bold text-[#1A1412] block">
                    Hair Texture Profile
                  </span>
                  <select
                    value={selectedTexture}
                    onChange={(e) => setSelectedTexture(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#D1C4C0] rounded-lg text-xs uppercase font-semibold text-[#1A1412] focus:outline-none focus:ring-1 focus:ring-[#725B38]"
                  >
                    <option value="">Texture: All</option>
                    <option value="Bone Straight">Bone Straight (Cambodian/Vietnamese)</option>
                    <option value="Deep Wave">Deep Wave (South Indian)</option>
                    <option value="Burmese Curly">Burmese Curly (Lush Spirals)</option>
                    <option value="Body Wave">Body Wave (Brazilian)</option>
                    <option value="Natural Wavy">Natural Wavy (Vietnamese)</option>
                  </select>
                </div>

                {/* Length & Stock Toggles */}
                <div className="md:col-span-3 space-y-1.5">
                  <span className="text-xs uppercase font-bold text-[#1A1412] block">
                    Length & Availability
                  </span>
                  <div className="flex gap-2">
                    <select
                      value={selectedLengthRange}
                      onChange={(e) => setSelectedLengthRange(e.target.value)}
                      className="w-1/2 h-10 px-2 bg-white border border-[#D1C4C0] rounded-lg text-xs uppercase font-semibold text-[#1A1412] focus:outline-none"
                    >
                      <option value="">Length: All</option>
                      <option value="16">16″ – 18″</option>
                      <option value="20">20″ – 24″</option>
                      <option value="26">26″ – 30″</option>
                      <option value="32">32″ Tailbone</option>
                    </select>

                    <label className="w-1/2 flex items-center justify-center gap-1.5 px-2 h-10 bg-white border border-[#D1C4C0] rounded-lg cursor-pointer text-center">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="accent-[#1A1412] w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-[10px] uppercase font-bold text-[#1A1412]">In Stock</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Chips Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] uppercase tracking-wider text-[#807571] font-bold">
              Active Filters ({filteredProducts.length} results):
            </span>

            {/* Category badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFEEEB] rounded-full text-xs font-bold text-[#1A1412]">
              <span>Category: {activeCategory.toUpperCase()}</span>
            </span>

            {/* Search Query badge */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEDEB2] text-[#281800] rounded-full text-xs font-bold">
                <span>Query: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Price badge */}
            {(minPrice > 0 || maxPrice < 500000) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEDEB2] text-[#281800] rounded-full text-xs font-bold">
                <span>Price: {formatPrice(minPrice)} – {formatPrice(maxPrice)}</span>
                <button
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(500000);
                    setSelectedPricePreset('all');
                  }}
                  className="hover:opacity-75"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Texture badge */}
            {selectedTexture && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFEEEB] text-[#1A1412] rounded-full text-xs font-bold">
                <span>Texture: {selectedTexture}</span>
                <button onClick={() => setSelectedTexture('')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Length badge */}
            {selectedLengthRange && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFEEEB] text-[#1A1412] rounded-full text-xs font-bold">
                <span>Length: {selectedLengthRange}″ Range</span>
                <button onClick={() => setSelectedLengthRange('')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Reset All */}
            {isAnyFilterActive && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="text-xs text-[#725B38] hover:text-[#1A1412] font-bold uppercase tracking-wider underline underline-offset-4 ml-2"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Product Catalog Grid Section */}
      <section className="w-full bg-[#FBF9F6] py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          {displayedProducts.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-[#EAE8E5] shadow-sm my-6 p-8">
              <FilterX className="w-14 h-14 text-[#807571] mb-4" />
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#1A1412] mb-2 font-medium">
                No Matching Hair Curations Found
              </h3>
              <p className="text-xs sm:text-sm text-[#807571] max-w-md mb-6 leading-relaxed">
                We couldn't find any pieces matching your search query "{searchQuery}" or selected price range ({formatPrice(minPrice)} – {formatPrice(maxPrice)}).
              </p>
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="px-8 py-3.5 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs uppercase font-bold tracking-wider rounded transition-colors shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((prod) => {
                const isWishlisted = wishlist.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#EAE8E5] shadow-sm hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-[3/4] bg-[#F5F3F0] overflow-hidden">
                      <img
                        src={prod.images.main}
                        alt={prod.name}
                        onClick={() => {
                          setSelectedProduct(prod);
                          setCurrentView('product-detail');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                        {prod.badge && (
                          <span className="px-2.5 py-1 bg-[#1A1412] text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">
                            {prod.badge}
                          </span>
                        )}
                        {prod.secondaryBadge && (
                          <span className="px-2.5 py-1 bg-[#FEDEB2] text-[#281800] text-[9px] font-bold uppercase tracking-wider rounded shadow-sm">
                            {prod.secondaryBadge}
                          </span>
                        )}
                      </div>

                      {/* Wishlist Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(prod.id)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${
                          isWishlisted ? 'text-[#BA1A1A]' : 'text-[#1A1412] hover:text-[#BA1A1A]'
                        }`}
                        aria-label="Save to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      {/* Quick Add Slide-up Drawer */}
                      <div className="absolute inset-x-3 bottom-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(prod)}
                          className="w-full h-11 bg-[#1A1412] hover:bg-[#201A18] text-white text-[11px] font-semibold uppercase tracking-widest rounded shadow-md flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Quick Add Options</span>
                        </button>
                      </div>
                    </div>

                    {/* Product Metadata & Description Snippet */}
                    <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#725B38] mb-1 truncate">
                          {prod.subtitle}
                        </p>
                        <h3
                          onClick={() => {
                            setSelectedProduct(prod);
                            setCurrentView('product-detail');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-editorial text-lg text-[#1A1412] group-hover:text-[#725B38] transition-colors cursor-pointer leading-tight mb-1"
                        >
                          {prod.name}
                        </h3>
                        <p className="text-xs text-[#807571] line-clamp-2 leading-relaxed mb-3">
                          {prod.description}
                        </p>
                      </div>

                      <div className="pt-4 flex items-baseline justify-between border-t border-[#F5F3F0]">
                        <div>
                          <p className="font-editorial text-xl font-bold text-[#1A1412]">
                            {formatPrice(prod.price)}
                          </p>
                          <span className="text-[10px] text-[#807571] font-semibold">
                            {prod.lengths.join('″ / ')}″ Available
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-[#725B38] bg-[#F5F3F0] px-2 py-1 rounded">
                          {prod.inStockLocation || 'Lagos Ready'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Catalog Progress & Load More */}
          {displayedProducts.length > 0 && (
            <div className="mt-14 pt-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <p className="text-xs uppercase tracking-widest text-[#807571] font-bold mb-2">
                Showing {displayedProducts.length} of {filteredProducts.length} handcrafted pieces
              </p>
              <div className="w-full h-1.5 bg-[#EAE8E5] rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#725B38] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((displayedProducts.length / filteredProducts.length) * 100))}%` }}
                />
              </div>

              {displayedProducts.length < filteredProducts.length ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="h-11 px-8 bg-[#EAE8E5] hover:bg-[#E4E2DF] text-[#1A1412] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-sm"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#725B38]" />
                      <span>Syncing Vault Inventory...</span>
                    </>
                  ) : (
                    <>
                      <span>Discover More Styles</span>
                      <Plus className="w-4 h-4 text-[#725B38]" />
                    </>
                  )}
                </button>
              ) : (
                <span className="text-xs uppercase font-bold text-[#807571] bg-[#EFEEEB] px-4 py-2 rounded-lg">
                  All Lagos Pieces Displayed
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Value & Delivery Assurance Ribbon */}
      <section className="w-full bg-[#F5F3F0] py-14 border-t border-[#EAE8E5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl flex items-start gap-4 shadow-sm border border-[#EAE8E5]">
              <div className="w-12 h-12 rounded-lg bg-[#F5F3F0] flex items-center justify-center text-[#725B38] shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-editorial text-lg text-[#1A1412] mb-1">Island & Mainland Express</h4>
                <p className="text-xs text-[#4E4542] leading-relaxed">
                  Same-day courier to Ikoyi, Lekki, and VI. Mainland delivery within 24 hours via private trusted couriers.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl flex items-start gap-4 shadow-sm border border-[#EAE8E5]">
              <div className="w-12 h-12 rounded-lg bg-[#F5F3F0] flex items-center justify-center text-[#725B38] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-editorial text-lg text-[#1A1412] mb-1">Paystack Secure Checkout</h4>
                <p className="text-xs text-[#4E4542] leading-relaxed">
                  Bank transfers, USSD, and all local & international Mastercard/Visa cards encrypted and confirmed instantly.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl flex items-start gap-4 shadow-sm border border-[#EAE8E5]">
              <div className="w-12 h-12 rounded-lg bg-[#F5F3F0] flex items-center justify-center text-[#725B38] shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-editorial text-lg text-[#1A1412] mb-1">Victoria Island Studio</h4>
                <p className="text-xs text-[#4E4542] leading-relaxed">
                  Experience the cuticles and lace melting in person. Complimentary wig fitting upon pickup confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
