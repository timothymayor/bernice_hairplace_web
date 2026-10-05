import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Check, ShoppingBag, Eye, Lock } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    formatPrice,
    setSelectedProduct,
    setCurrentView,
  } = useShop();

  const [selectedLength, setSelectedLength] = useState<number>(() =>
    quickViewProduct ? quickViewProduct.defaultLength : 20
  );
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const handleAdd = () => {
    addToCart(quickViewProduct, selectedLength, quantity);
    setQuickViewProduct(null);
  };

  const handleViewFull = () => {
    setSelectedProduct(quickViewProduct);
    setQuickViewProduct(null);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1412]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FBF9F6] max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-[#EAE8E5] relative flex flex-col md:flex-row">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-10 bg-white/80 p-1.5 rounded-full text-[#1A1412] hover:bg-white shadow"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Stage */}
        <div className="md:w-1/2 relative bg-[#F5F3F0] aspect-[3/4] md:aspect-auto">
          <img
            src={quickViewProduct.images.main}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
          {quickViewProduct.badge && (
            <span className="absolute top-3 left-3 bg-[#1A1412] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              {quickViewProduct.badge}
            </span>
          )}
        </div>

        {/* Product Details & Selection */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#725B38] block mb-1">
              {quickViewProduct.subtitle}
            </span>
            <h3 className="font-editorial text-xl text-[#1A1412] font-semibold mb-2">
              {quickViewProduct.name}
            </h3>
            <p className="font-editorial text-2xl font-bold text-[#1A1412] mb-4">
              {formatPrice(quickViewProduct.price)}
            </p>

            {/* Length Buttons */}
            <div className="mb-4">
              <label className="block text-[11px] uppercase font-bold text-[#1A1412] tracking-wider mb-2">
                Select Length (Inches)
              </label>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.lengths.map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setSelectedLength(len)}
                    className={`py-1.5 px-3 text-xs font-semibold rounded border transition-all ${
                      selectedLength === len
                        ? 'bg-[#1A1412] text-white border-[#1A1412]'
                        : 'bg-white text-[#4E4542] border-[#D1C4C0] hover:bg-[#F5F3F0]'
                    }`}
                  >
                    {len}″
                  </button>
                ))}
              </div>
            </div>

            {/* Specs Micro Points */}
            <div className="space-y-1 text-xs text-[#4E4542] pb-4">
              <p className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#725B38]" />
                100% Unprocessed Single-Donor
              </p>
              <p className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#725B38]" />
                Full Cuticles Aligned • Zero Tangles
              </p>
              <p className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#725B38]" />
                Lagos Express Same-Day Dispatch Ready
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#EAE8E5]">
            <button
              onClick={handleAdd}
              className="w-full h-11 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
              <span>Add to Luxury Bag</span>
            </button>

            <button
              onClick={handleViewFull}
              className="w-full py-2 text-xs text-[#725B38] hover:text-[#1A1412] font-semibold uppercase tracking-wider flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Full Dossier & Certification →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
