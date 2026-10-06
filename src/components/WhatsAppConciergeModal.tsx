import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { whatsappLink } from '../config';
import { X, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export const WhatsAppConciergeModal: React.FC = () => {
  const { isConciergeOpen, setIsConciergeOpen, showToast } = useShop();

  const [serviceType, setServiceType] = useState('lace_color_match');
  const [hairLength, setHairLength] = useState('24" Waist');
  const [notes, setNotes] = useState('');

  if (!isConciergeOpen) return null;

  const handleOpenWhatsApp = () => {
    const message = `Hello Bernice Hairplace! I would like to inquire about ${serviceType.replace(/_/g, ' ')} for length ${hairLength}. Notes: ${notes || 'None'}`;
    window.open(whatsappLink(message), '_blank', 'noopener');
    setIsConciergeOpen(false);
    showToast('Connecting to Master Colorist', 'Opening WhatsApp VIP line...', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1412]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FBF9F6] max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#EAE8E5] relative">
        <button
          onClick={() => setIsConciergeOpen(false)}
          className="absolute top-4 right-4 text-[#807571] hover:text-[#1A1412] p-1.5 rounded-full hover:bg-[#EFEEEB]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#FEDEB2] flex items-center justify-center text-[#725B38]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#725B38] block">
              Victoria Island Studio
            </span>
            <h3 className="font-editorial text-xl text-[#1A1412] font-semibold">
              Hair Specialist Concierge
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#4E4542] leading-relaxed mb-6">
          Connect directly with Amina B. and our Victoria Island master colorists for custom HD lace scalp tone harmonization, bundle weight calibration, and bespoke wig construction.
        </p>

        <div className="space-y-4 mb-6 text-xs text-[#1A1412]">
          <div>
            <label className="block text-[11px] uppercase font-bold text-[#725B38] tracking-wider mb-1.5">
              Service Requested
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-[#D1C4C0] rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#725B38]"
            >
              <option value="lace_color_match">Lace Tint & Scalp Tone Matching (Photo Consultation)</option>
              <option value="bespoke_wig_construction">Bespoke Custom Wig Construction & Cap Sizing</option>
              <option value="bundle_weight_calculation">Bundle Quantity & Density Advice (250% - 300%)</option>
              <option value="vip_studio_appointment">VIP Victoria Island In-Person Appointment</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-[#725B38] tracking-wider mb-1.5">
              Target Hair Length
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['18" Collar', '22" Mid-Back', '26" Waist', '30" Tailbone'].map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setHairLength(len)}
                  className={`py-2 px-1 text-center font-semibold rounded border text-[11px] transition-all ${
                    hairLength === len
                      ? 'bg-[#1A1412] text-white border-[#1A1412] shadow-sm'
                      : 'bg-white text-[#4E4542] border-[#D1C4C0] hover:bg-[#F5F3F0]'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-[#725B38] tracking-wider mb-1.5">
              Specific Instructions or Photos Note
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. I have a medium olive complexion and want pre-bleached knots on a 13x6 frontal..."
              className="w-full p-3 bg-white border border-[#D1C4C0] rounded placeholder-[#807571] focus:outline-none focus:ring-1 focus:ring-[#725B38]"
            />
          </div>
        </div>

        <div className="bg-[#F5F3F0] p-3 rounded mb-6 flex items-center gap-2 text-xs text-[#4E4542]">
          <Sparkles className="w-4 h-4 text-[#725B38] shrink-0" />
          <span>Average concierge response time: &lt; 15 minutes (Mon–Sat)</span>
        </div>

        <button
          onClick={handleOpenWhatsApp}
          className="w-full h-12 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
        >
          <Send className="w-4 h-4 text-[#C5A880]" />
          <span>Open Direct WhatsApp Chat</span>
        </button>
      </div>
    </div>
  );
};
