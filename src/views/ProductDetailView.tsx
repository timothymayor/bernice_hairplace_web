import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { getUnitPrice } from '../lib/pricing';
import { Product } from '../types';
import {
  ShieldCheck,
  Star,
  Check,
  ChevronDown,
  Plus,
  Minus,
  ShoppingBag,
  Lock,
  Truck,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    products,
    addToCart,
    formatPrice,
    setCurrentView,
    showToast,
    setIsConciergeOpen,
  } = useShop();

  const product: Product = selectedProduct || products[0];

  const [activeImageKey, setActiveImageKey] = useState<'main' | 'luster' | 'weft' | 'cuticle' | 'styled'>('main');
  const [selectedLength, setSelectedLength] = useState<number>(product.defaultLength);
  const [bundleQuantity, setBundleQuantity] = useState<number>(1);
  const [isCrossSellAdded, setIsCrossSellAdded] = useState(false);

  // Accordion states
  const [openSpecs, setOpenSpecs] = useState(true);
  const [openDelivery, setOpenDelivery] = useState(false);
  const [openLongevity, setOpenLongevity] = useState(false);

  const unitPrice = getUnitPrice(product, selectedLength);
  const totalPrice = unitPrice * bundleQuantity;
  const isMultiBundle = bundleQuantity >= 3;

  const handleAddMainToCart = () => {
    addToCart(product, selectedLength, bundleQuantity);
  };

  const handleInstantPaystack = () => {
    addToCart(product, selectedLength, bundleQuantity);
    setCurrentView('checkout');
  };

  const handleAddRecommendation = () => {
    if (product.recommendedPairing) {
      const closureProd = products.find((p) => p.category === 'frontals' || p.category === 'closures') || products[1];
      addToCart(closureProd, 16, 1);
      setIsCrossSellAdded(true);
      showToast('Stylist Recommendation Added', '5x5 HD Closure added to your luxury bag.', 'success');
    }
  };

  const galleryImages = [
    { key: 'main', label: 'Styled', img: product.images.main },
    { key: 'luster', label: 'Luster', img: product.images.luster },
    { key: 'weft', label: 'Weft Detail', img: product.images.weft },
    { key: 'cuticle', label: 'Cuticle Align', img: product.images.cuticle },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb Bar */}
      <div className="w-full bg-[#F5F3F0]/60 py-3 px-4 sm:px-10 border-b border-[#EAE8E5]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#807571] font-medium">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#1A1412] transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => setCurrentView('shop')} className="hover:text-[#1A1412] transition-colors">
              Shop
            </button>
            <span>/</span>
            <button onClick={() => setCurrentView('shop')} className="hover:text-[#1A1412] transition-colors">
              {product.category === 'wigs' ? 'HD Wigs' : 'Raw Bundles'}
            </button>
            <span>/</span>
            <span className="text-[#1A1412] font-bold truncate max-w-xs">{product.name}</span>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-[#725B38] text-[11px] uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-[#725B38] animate-pulse"></span>
            <span>Single-Donor Temple Harvest • In Stock for Lagos Dispatch</span>
          </div>
        </div>
      </div>

      {/* Main Product Stage */}
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Gallery & Provenance Certificate */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Main Image Stage */}
            <div className="relative w-full aspect-square bg-[#F5F3F0] rounded-xl overflow-hidden group shadow-sm border border-[#EAE8E5]">
              <img
                src={product.images[activeImageKey] || product.images.main}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Single Donor Quality Tag */}
              <div className="absolute top-4 left-4 z-20">
                <span className="badge-blur bg-[#1A1412]/85 text-white text-[10px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded border border-white/10 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
                  <span>{product.badge || 'Single-Donor Certified'}</span>
                </span>
              </div>

              {/* Editorial Luster Badge */}
              <div className="absolute top-4 right-4 z-20 hidden sm:block">
                <span className="badge-blur bg-white/85 text-[#1A1412] text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded shadow-sm">
                  {product.secondaryBadge || 'High Editorial Luster'}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block text-[11px] bg-[#1A1412]/90 text-white px-4 py-1.5 rounded font-medium shadow-md">
                  Zoom: 100% Raw Unprocessed Single-Donor Fiber
                </span>
              </div>
            </div>

            {/* 4-Thumbnail Gallery Strip */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {galleryImages.map((thumb) => {
                const isActive = activeImageKey === thumb.key;
                return (
                  <button
                    key={thumb.key}
                    type="button"
                    onClick={() => setActiveImageKey(thumb.key as any)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-[#F5F3F0] ${
                      isActive ? 'border-[#1A1412] shadow-md' : 'border-[#EAE8E5] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb.img} alt={thumb.label} className="w-full h-full object-cover rounded" />
                    <span className="absolute bottom-0 inset-x-0 bg-[#1A1412]/80 text-white text-[9px] py-0.5 text-center uppercase tracking-tighter font-semibold">
                      {thumb.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Authentic Provenance Guarantee Certificate */}
            <div className="border border-[#C5A880]/40 bg-[#F5F3F0]/60 p-5 rounded-xl sm:flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-[#1A1412] text-[#C5A880] rounded-lg shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-widest text-[#1A1412]">
                    Authentic Provenance Guarantee
                  </h4>
                  <p className="text-xs text-[#4E4542] mt-1 leading-relaxed">
                    100% Raw Single-Donor Unprocessed Fiber. Hand-selected with intact unidirectional cuticles. Guaranteed lifespan of <strong className="text-[#1A1412] font-semibold">{product.fullSpecs.lifespan}</strong> with appropriate hydration care.
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 shrink-0 text-right">
                <span className="inline-block text-[11px] font-mono uppercase bg-white px-3 py-1.5 border border-[#D1C4C0] font-bold text-[#725B38] rounded">
                  Cert ID: BH-8994-LA
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Purchasing & Customization Rail */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* Title & Rating */}
            <div className="border-b border-[#EAE8E5] pb-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#725B38] font-bold mb-2">
                <span>Signature Collection</span>
                <span className="font-mono text-[11px] text-[#807571]">SKU: {product.sku}</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1412] font-medium tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="ml-1.5 font-bold text-[#1A1412] text-xs">{product.rating}</span>
                </div>
                <span className="text-[#D1C4C0]">•</span>
                <span className="text-xs font-medium text-[#807571] underline underline-offset-4 decoration-[#C5A880]">
                  {product.reviewCount} verified salon reviews
                </span>
              </div>

              {/* Price & Savings */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-editorial text-3xl font-bold text-[#1A1412] tracking-tight">
                  {formatPrice(totalPrice)}
                </span>
                <span className="text-xs text-[#807571] uppercase font-semibold">
                  {bundleQuantity > 1 ? `(${bundleQuantity} Bundles Total)` : 'Per 100g Bundle'}
                </span>
              </div>

              <div className="mt-2.5 inline-flex items-center gap-1.5 bg-[#FEDEB2]/50 px-3 py-1 rounded border border-[#FEDEB2] text-[11px] text-[#281800] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#725B38]" />
                <span>Save ₦20,000 automatically on a 3-bundle luxury install</span>
              </div>
            </div>

            {/* Variations */}
            <div className="space-y-5">
              {/* Length Selector */}
              <div>
                <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-2.5">
                  <span className="font-bold text-[#1A1412]">
                    Length: <strong className="text-[#725B38]">{selectedLength} Inches</strong>
                  </span>
                  <button
                    onClick={() => setIsConciergeOpen(true)}
                    className="text-[#807571] text-[11px] underline hover:text-[#1A1412]"
                  >
                    Length Consultation
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.lengths.map((len) => {
                    const isSelected = selectedLength === len;
                    return (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setSelectedLength(len)}
                        className={`py-2.5 text-xs font-semibold rounded transition-all ${
                          isSelected
                            ? 'bg-[#1A1412] text-white shadow-sm border border-[#1A1412]'
                            : 'bg-white text-[#4E4542] border border-[#D1C4C0] hover:border-[#1A1412]'
                        }`}
                      >
                        {len}″
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hair Tone Swatch */}
              <div>
                <div className="flex justify-between text-xs uppercase tracking-wider mb-2">
                  <span className="font-bold text-[#1A1412]">Raw Donor Shade:</span>
                  <span className="text-[#807571] font-semibold">{product.donorShade}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full hair-swatch-gradient ring-2 ring-offset-2 ring-[#1A1412] p-0.5"></div>
                  <span className="text-xs text-[#4E4542] font-medium">
                    Single donor virgin melanin • Can bleach safely to #613 Platinum Blonde
                  </span>
                </div>
              </div>

              {/* Bundle Quantity Stepper */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#1A1412] mb-2">
                  Number of Bundles / Units
                </label>
                <div className="flex items-center w-36 border border-[#1A1412]/40 rounded bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setBundleQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-[#1A1412] hover:bg-[#F5F3F0] transition-colors font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-full text-center text-sm font-bold text-[#1A1412]">
                    {bundleQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBundleQuantity((q) => q + 1)}
                    className="px-3.5 py-2 text-[#1A1412] hover:bg-[#F5F3F0] transition-colors font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddMainToCart}
                className="w-full py-4 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                <span>Add to Luxury Bag</span>
                <span>—</span>
                <span>{formatPrice(totalPrice)}</span>
              </button>

              <button
                onClick={handleInstantPaystack}
                className="w-full py-3.5 bg-[#FBF9F6] hover:bg-[#F5F3F0] border border-[#C5A880] text-[#1A1412] text-xs font-bold uppercase tracking-[0.18em] rounded transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#725B38]" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Stylist Recommendation Upsell */}
            {product.recommendedPairing && (
              <div className="border border-[#EAE8E5] bg-[#F5F3F0] p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#725B38]">
                    Stylist Recommendation
                  </span>
                  <span className="text-[11px] text-[#807571] font-semibold">Flawless Melt</span>
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    src={product.recommendedPairing.image}
                    alt={product.recommendedPairing.name}
                    className="w-14 h-14 bg-white border border-[#D1C4C0] rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[#1A1412] truncate">
                      {product.recommendedPairing.name}
                    </h5>
                    <p className="text-[11px] text-[#807571]">{product.recommendedPairing.specs}</p>
                    <p className="text-xs font-bold text-[#1A1412] mt-0.5">
                      {formatPrice(product.recommendedPairing.price)}
                    </p>
                  </div>

                  <button
                    onClick={handleAddRecommendation}
                    disabled={isCrossSellAdded}
                    className={`px-3 py-1.5 rounded text-[11px] uppercase font-bold tracking-wider transition-colors ${
                      isCrossSellAdded
                        ? 'bg-[#725B38] text-white'
                        : 'bg-white border border-[#1A1412] text-[#1A1412] hover:bg-[#1A1412] hover:text-white'
                    }`}
                  >
                    {isCrossSellAdded ? 'Added' : '+ Add'}
                  </button>
                </div>
              </div>
            )}

            {/* Specs & Info Accordions */}
            <div className="border-t border-[#EAE8E5] pt-4 divide-y divide-[#EAE8E5]">
              {/* Specs */}
              <div className="py-3">
                <button
                  onClick={() => setOpenSpecs(!openSpecs)}
                  className="w-full flex justify-between items-center text-left text-xs uppercase tracking-wider font-bold text-[#1A1412]"
                >
                  <span>Hair Specs & Donor Origin</span>
                  <ChevronDown className={`w-4 h-4 text-[#725B38] transition-transform ${openSpecs ? 'rotate-180' : ''}`} />
                </button>
                {openSpecs && (
                  <div className="mt-3 text-xs text-[#4E4542] leading-relaxed space-y-1.5 pl-1 animate-in fade-in duration-200">
                    <p>
                      <strong className="text-[#1A1412]">Origin:</strong> {product.fullSpecs.origin}
                    </p>
                    <p>
                      <strong className="text-[#1A1412]">Texture:</strong> {product.fullSpecs.texture}
                    </p>
                    <p>
                      <strong className="text-[#1A1412]">Weight:</strong> {product.fullSpecs.weight}
                    </p>
                    <p>
                      <strong className="text-[#1A1412]">Weft:</strong> {product.fullSpecs.weft}
                    </p>
                    <p>
                      <strong className="text-[#1A1412]">Bleach Purity:</strong> {product.fullSpecs.bleachGrade}
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="py-3">
                <button
                  onClick={() => setOpenDelivery(!openDelivery)}
                  className="w-full flex justify-between items-center text-left text-xs uppercase tracking-wider font-bold text-[#1A1412]"
                >
                  <span>Lagos Delivery & Global Shipping</span>
                  <ChevronDown className={`w-4 h-4 text-[#725B38] transition-transform ${openDelivery ? 'rotate-180' : ''}`} />
                </button>
                {openDelivery && (
                  <div className="mt-3 text-xs text-[#4E4542] leading-relaxed space-y-2 pl-1 animate-in fade-in duration-200">
                    <p className="text-[#1A1412] font-semibold">⚡ Same-Day Delivery available for orders placed before 2:00 PM within:</p>
                    <ul className="list-disc pl-4 space-y-1 text-[#4E4542]">
                      <li>Ikoyi, Victoria Island & Lekki Phase 1 (Within 3 Hours)</li>
                      <li>Lagos Mainland & Greater Lekki (Same Day Dispatch)</li>
                      <li>Abuja & Port Harcourt: 24 to 48 hours via Air Cargo</li>
                      <li>Worldwide via DHL Express (3-5 business days)</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Longevity */}
              <div className="py-3">
                <button
                  onClick={() => setOpenLongevity(!openLongevity)}
                  className="w-full flex justify-between items-center text-left text-xs uppercase tracking-wider font-bold text-[#1A1412]"
                >
                  <span>Longevity & Styling Guide</span>
                  <ChevronDown className={`w-4 h-4 text-[#725B38] transition-transform ${openLongevity ? 'rotate-180' : ''}`} />
                </button>
                {openLongevity && (
                  <div className="mt-3 text-xs text-[#4E4542] leading-relaxed space-y-1.5 pl-1 animate-in fade-in duration-200">
                    <p>
                      Wash bi-weekly with sulfate-free hydrating shampoo and lightweight silicone-free conditioners. Can withstand thermal styling up to 450°F. Apply 2-3 drops of pure botanical argan oil weekly to maintain its natural reflective glass luster.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
