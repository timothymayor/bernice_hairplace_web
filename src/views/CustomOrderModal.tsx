import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Ruler, Sparkles, Check } from 'lucide-react';

export const CustomOrderModal: React.FC = () => {
  const { isCustomOrderModalOpen, setIsCustomOrderModalOpen, user, updateUserProfile, showToast, setIsConciergeOpen } = useShop();

  const [capSize, setCapSize] = useState(user?.capCircumference || '22.5" (Standard M)');
  const [laceType, setLaceType] = useState(user?.lacePreference || 'Real Swiss HD Invisible 0.08mm');
  const [texture, setTexture] = useState(user?.signatureTexture || 'Raw Southeast Asian Wavy');
  const [parting, setParting] = useState(user?.defaultParting || 'Deep Left C-Curve');
  const [density, setDensity] = useState('250% Super Full');

  if (!isCustomOrderModalOpen) return null;

  const handleSaveProfile = () => {
    updateUserProfile({
      capCircumference: capSize,
      lacePreference: laceType,
      signatureTexture: texture,
      defaultParting: parting,
    });
    setIsCustomOrderModalOpen(false);
    showToast('Custom Sizing Profile Saved', 'Your atelier specifications have been archived for future orders.', 'success');
  };

  const handleCommissionNow = () => {
    handleSaveProfile();
    setIsConciergeOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1412]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FBF9F6] max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#EAE8E5] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsCustomOrderModalOpen(false)}
          className="absolute top-4 right-4 text-[#807571] hover:text-[#1A1412] p-1.5 rounded-full hover:bg-[#EFEEEB]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#FEDEB2] flex items-center justify-center text-[#725B38]">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#725B38] block">
              Bespoke Atelier Commission
            </span>
            <h3 className="font-editorial text-2xl text-[#1A1412] font-semibold">
              Custom Wig Sizing & Archival
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#4E4542] leading-relaxed mb-6">
          Tailor your custom cap dimensions and Swiss lace preferences. Our master wigmakers in Victoria Island construct every unit with calibrated tension and hairline ventilations.
        </p>

        <div className="space-y-4 mb-6 text-xs text-[#1A1412]">
          {/* Cap Circumference */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-[#725B38] tracking-wider mb-1.5">
              1. Head Circumference & Sizing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['21.5" (Petite S)', '22.5" (Standard M)', '23.5" (Full L)'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setCapSize(sz)}
                  className={`py-2 px-1 text-center font-semibold rounded border text-[11px] transition-all ${
                    capSize === sz
                      ? 'bg-[#1A1412] text-white border-[#1A1412] shadow-sm'
                      : 'bg-white text-[#4E4542] border-[#D1C4C0] hover:bg-[#F5F3F0]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Lace Matrix */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-[#725B38] tracking-wider mb-1.5">
              2. Swiss Lace Type
            </label>
            <select
              value={laceType}
              onChange={(e) => setLaceType(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-[#D1C4C0] rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#725B38]"
            >
              <option value="Real Swiss HD Invisible 0.08mm">Real Swiss HD Invisible 0.08mm (Recommended for all tones)</option>
              <option value="Transparent Ultra Thin Film Lace">Transparent Ultra Thin Film Lace</option>
              <option value="High Durability Swiss Classic Mesh">High Durability Swiss Classic Mesh</option>
            </select>
          </div>

          {/* Texture */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-[#725B38] tracking-wider mb-1.5">
              3. Raw Donor Texture
            </label>
            <select
              value={texture}
              onChange={(e) => setTexture(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-[#D1C4C0] rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#725B38]"
            >
              <option value="Raw Cambodian Bone Straight">Raw Cambodian Bone Straight</option>
              <option value="Burmese Raw Curly">Burmese Raw Curly</option>
              <option value="Raw Vietnamese Super Double Drawn">Raw Vietnamese Super Double Drawn</option>
              <option value="South Indian Raw Deep Wave">South Indian Raw Deep Wave</option>
            </select>
          </div>

          {/* Density & Parting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#725B38] tracking-wider mb-1.5">
                4. Preferred Density
              </label>
              <select
                value={density}
                onChange={(e) => setDensity(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-[#D1C4C0] rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#725B38]"
              >
                <option value="200% Natural Glam">200% Natural Glam (3 Bundles)</option>
                <option value="250% Super Full">250% Super Full (3.5 Bundles)</option>
                <option value="300% Maximum Couture">300% Maximum Couture (4 Full Bundles)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-[#725B38] tracking-wider mb-1.5">
                5. Default Hairline Parting
              </label>
              <select
                value={parting}
                onChange={(e) => setParting(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-[#D1C4C0] rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#725B38]"
              >
                <option value="Deep Center Part">Deep Center Part</option>
                <option value="Deep Left C-Curve">Deep Left C-Curve</option>
                <option value="Deep Right Arch">Deep Right Arch</option>
                <option value="Free Part Multi-Way">Free Part Multi-Way</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSaveProfile}
            className="flex-1 h-12 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow"
          >
            <Check className="w-4 h-4 text-[#C5A880]" />
            <span>Save Sizing Profile</span>
          </button>

          <button
            onClick={handleCommissionNow}
            className="flex-1 h-12 bg-white hover:bg-[#F5F3F0] border border-[#C5A880] text-[#1A1412] text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#725B38]" />
            <span>Commission via Concierge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
