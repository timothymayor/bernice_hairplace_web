import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, showToast, setIsConciergeOpen } = useShop();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed to Private Registry', 'You will receive priority notices for raw donor harvests.', 'success');
  };

  return (
    <footer className="w-full bg-[#F5F3F0] mt-16 pt-16 pb-12 border-t border-[#EAE8E5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E4E2DF]">
          {/* Brand & Editorial Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-editorial text-2xl text-[#1A1412] font-medium tracking-tight">
              Bernice Hairplace
            </h3>
            <p className="text-xs text-[#4E4542] leading-relaxed max-w-sm">
              Curating raw, virgin single-donor hair extensions, bespoke closures, and lace units. Handcrafted for longevity and effortless Lagosian sophistication.
            </p>

            <div className="pt-2">
              <label className="block text-[11px] uppercase tracking-widest text-[#725B38] font-bold mb-2">
                Private Editorial Dispatch
              </label>
              <form onSubmit={handleSubscribe} className="flex max-w-md shadow-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-11 px-4 bg-white text-xs text-[#1A1412] placeholder-[#807571] border border-[#D1C4C0] border-r-0 rounded-l focus:outline-none focus:ring-1 focus:ring-[#725B38]"
                />
                <button
                  type="submit"
                  className="h-11 px-6 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider rounded-r transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {isSubscribed ? (
                    <>
                      <Check className="w-4 h-4 text-[#C5A880]" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Curations */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1A1412] mb-4">
              Curations
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#4E4542]">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1A1412] transition-colors"
                >
                  Raw Temple Bundles
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('bundles-wigs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1A1412] transition-colors"
                >
                  HD Film Lace Wigs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('collections');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1A1412] transition-colors"
                >
                  Silk Closures & Frontals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('collections');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1A1412] transition-colors"
                >
                  Maintenance & Elixirs
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care & Lagos Studio */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1A1412] mb-4">
              Client Care & Lagos Studio
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#4E4542]">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1A1412] transition-colors text-left"
                >
                  Lagos Island & Mainland Express Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1A1412] transition-colors text-left"
                >
                  Victoria Island Studio Pickup
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsConciergeOpen(true)}
                  className="hover:text-[#1A1412] transition-colors text-left"
                >
                  Bespoke Wig Construction
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1A1412] transition-colors text-left"
                >
                  Texture & Lace Matching Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('docs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#725B38] font-semibold hover:underline"
                >
                  Technical Architecture & API Docs
                </button>
              </li>
            </ul>
          </div>

          {/* Lagos Studio Location */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1A1412] mb-4">
              Lagos Studio Location
            </h4>
            <p className="text-xs text-[#4E4542] leading-relaxed mb-4">
              Victoria Island Studio, Lagos, Nigeria<br />
              Mon – Sat: 10:00 AM – 7:00 PM
            </p>
            <div className="p-3 bg-[#FBF9F6] border border-[#EAE8E5] rounded">
              <span className="text-[10px] uppercase font-bold text-[#725B38] block mb-1">
                Payment Assurance
              </span>
              <p className="text-xs text-[#4E4542] flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#725B38]" />
                Secured locally via Paystack • Naira & USD Accepted
              </p>
            </div>
          </div>
        </div>

        {/* Lower Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#807571]">
          <p>© {new Date().getFullYear()} Bernice Hairplace Luxury Commerce Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider font-medium">
            <button onClick={() => setCurrentView('about')} className="hover:text-[#1A1412] transition-colors">
              Privacy Statement
            </button>
            <button onClick={() => setCurrentView('about')} className="hover:text-[#1A1412] transition-colors">
              Terms of Indulgence
            </button>
            <button onClick={() => setCurrentView('about')} className="hover:text-[#1A1412] transition-colors">
              Lagos Studio
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
