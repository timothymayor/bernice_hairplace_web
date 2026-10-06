import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Award, Sparkles, Store, CheckCircle, ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentView, setIsConciergeOpen } = useShop();

  return (
    <div className="flex flex-col w-full bg-[#FBF9F6]">
      {/* Manifesto Hero Header */}
      <section className="py-16 lg:py-20 bg-[#201A18] text-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C5A880] block mb-3">
              Our Genesis & Sourcing Manifesto
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-6">
              "Pure raw hair is an heirloom, not a disposable trend."
            </h1>
            <p className="text-sm sm:text-base text-[#D0C4C0] font-light leading-relaxed mb-8">
              Founded in Victoria Island, Lagos, Bernice Hairplace was established on a radical standard: to eliminate chemically polished silicones and acid-bathed blends from modern luxury beauty commerce.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('shop')}
                className="px-8 py-3.5 bg-white text-[#1A1412] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#FEDEB2] transition-colors shadow-md"
              >
                Explore Sourced Bundles
              </button>
              <button
                onClick={() => setIsConciergeOpen(true)}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-md transition-colors"
              >
                Meet Our Master Colorist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="py-16 border-b border-[#EAE8E5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-[#EAE8E5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5F3F0] flex items-center justify-center text-[#725B38]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl text-[#1A1412] font-semibold">100% Single Donor</h3>
              <p className="text-xs text-[#4E4542] leading-relaxed">
                Every bundle originates from a single living donor with natural cuticles flowing in the identical biological direction. This eliminates matting and preserves organic elasticity.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-[#EAE8E5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5F3F0] flex items-center justify-center text-[#725B38]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl text-[#1A1412] font-semibold">Zero Acid Baths</h3>
              <p className="text-xs text-[#4E4542] leading-relaxed">
                We reject industrial acid washing that strips natural cuticles and coats hair in temporary silicone glazes. Our hair retains its genuine shine through years of thermal styling.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-[#EAE8E5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5F3F0] flex items-center justify-center text-[#725B38]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl text-[#1A1412] font-semibold">Artisanal Swiss HD Lace</h3>
              <p className="text-xs text-[#4E4542] leading-relaxed">
                Hand-knotted with real 0.08mm Swiss film mesh. Each knot is individually pre-bleached to mimic natural scalp follicles across all melanin complexions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Victoria Island Showroom Section */}
      <section className="py-16 bg-[#F5F3F0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#725B38]">
                Private Suite & Salon Experience
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1A1412]">
                Victoria Island Studio Suite
              </h2>
              <p className="text-xs sm:text-sm text-[#4E4542] leading-relaxed">
                Located in the heart of Victoria Island, our studio offers one-on-one lace tone matching, custom cap measurements, and complimentary wig fitting upon order pickup.
              </p>
              <div className="space-y-2 pt-2 text-xs text-[#1A1412] font-medium">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#725B38]" />
                  <span>Mon – Sat: 10:00 AM – 7:00 PM</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#725B38]" />
                  <span>Complimentary Espresso & Champagne Bar</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#725B38]" />
                  <span>Private Consultation Rooms with Salon Luminescence</span>
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsConciergeOpen(true)}
                  className="h-12 px-8 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Book Private Studio Consultation
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-xl border border-[#EAE8E5]">
                <img
                  src="/images/img-25-6142051ada.jpg"
                  alt="Victoria Island Atelier Studio"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
