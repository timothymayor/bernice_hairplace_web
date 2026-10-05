import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShieldCheck,
  Truck,
  Lock,
  Headphones,
  ArrowRight,
  Plus,
  Heart,
  CheckCircle,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    addToCart,
    toggleWishlist,
    wishlist,
    formatPrice,
    setCurrentView,
    setSelectedProduct,
    setQuickViewProduct,
    setIsConciergeOpen,
  } = useShop();

  // Texture & Length Visualizer State
  const [activeTexture, setActiveTexture] = useState<'straight' | 'deepwave' | 'naturalwavy'>('straight');
  const [activeLength, setActiveLength] = useState<number>(24);

  const textureData = {
    straight: {
      name: 'Cambodian Raw Bone Straight',
      origin: '100% Raw Cambodian Donor',
      desc: 'Sleek, mirror shine with natural heavy blunt ends. Flat-iron pressed with intact cuticles that withstand high humidity without puffing.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkuQoxES7kMlEH6Ack8EMhc2kmKLRsflWN8waJJRvms2xOh96ODB8rZgGAzi2ZG7wRJK-A_cNcC_uOwawJN1CykIrwaRtR7TbUss653SBbO7mj2EmgDznIJTgrNy6UktYFF_fwfmf0EQ7GD2DhZjxkBlboOhDdSnH-fUkycCOlCo_NnOnN2c90yoaZfSaRsvGFrWnimJ59QIehP-F2wadFPZ4FSPykMTSzRxb2bQitJSDJUt-tw0lV',
    },
    deepwave: {
      name: 'Burmese Lush Deep Wave',
      origin: 'Single Donor Burma Virgin Harvest',
      desc: 'Natural bouncy spiral pattern that stays resilient without tangling in tropical warmth. Low-maintenance luster that defines effortlessly with water.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDLzuJJ02llQglblQQVt5xBsnPXlqPKVEA2zBOJX1x5Lfylc-ew_eM-BQMIh-jyvMhuVQFo1o1xrnER04TUyi3aMQ7G7cqo1BtROLoAW9DQ7wecMputSpw5w89jQcU4RuH6mBHmZazBGZW-G8LOo9_g3A6n7E9HJOurvxOqPBuJP_Nymryp9FwF_jpWoQ9qGMPdKKrzqQVrWA6q71ykaUd5i33FdjBMgTlkx7IvyaFSEtosEA9_8yM',
    },
    naturalwavy: {
      name: 'Vietnamese Natural Wavy',
      origin: 'Raw Vietnamese Mountain Harvest',
      desc: 'Organic soft S-curl with ultra-dense strands. Yields breathtaking body curls and holds pin-curls for 48+ hours in Lagos climate.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXDM8I80oe2gVZXC-LMsn_Rg5fhCQjf9uun5xcyZpdRGjLSJ9YoxGoNFVFGtCBX3zQWn3M7-I9JpSS9msnWJTC01UH2-ZzdSVdjEzNEEVxbxXYgAhU59mhTSLOy2YL8FnVR1vaJq_WgUsGZWsW6F62vLHD12ukmR59sQMpAHV1rM5HpcbOajVtyf4tyMNf936fZ9w54nz97T3CDKloylQkSVjhACyERz-NhBVdD7L628VpHdlXvzy9',
    },
  };

  const getLengthDescription = (len: number) => {
    switch (len) {
      case 18:
        return '18 Inches (Collarbone Fall)';
      case 20:
        return '20 Inches (Mid-Bust Fall)';
      case 22:
        return '22 Inches (Bra-Strap Fall)';
      case 24:
        return '24 Inches (Past Waist)';
      case 26:
        return '26 Inches (Waist / Mid-Hip)';
      case 28:
        return '28 Inches (Hip Statement)';
      case 30:
        return '30 Inches (Thigh Level)';
      case 32:
        return '32 Inches (Tailbone Drama)';
      default:
        return `${len} Inches`;
    }
  };

  const bestsellers = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Top Trust Band */}
      <div className="w-full bg-[#EFEEEB] py-2.5 px-4 sm:px-10 border-b border-[#EAE8E5]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4 text-[#4E4542] text-[11px] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#725B38]"></span>
            <span>100% Raw Single-Donor Hair</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#725B38]"></span>
            <span>Same-Day Ikoyi & VI Dispatch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#725B38]"></span>
            <span>Paystack Verified Naira & USD</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#725B38]"></span>
            <span>5+ Years Guaranteed Longevity</span>
          </div>
        </div>
      </div>

      {/* Editorial Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#FBF9F6] py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-6 flex flex-col items-start z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-[1px] bg-[#725B38]"></span>
                <span className="text-xs uppercase tracking-widest text-[#725B38] font-bold">
                  Atelier Victoria Island, Lagos
                </span>
              </div>

              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-[68px] lg:leading-[74px] text-[#1A1412] font-normal tracking-tight mb-4">
                Hair that <br />
                <span className="italic font-light text-[#725B38]">completes</span> the look.
              </h1>

              <p className="text-base text-[#4E4542] font-light max-w-lg mb-8 leading-relaxed">
                Raw single-donor virgin hair extensions and custom HD lace units crafted for effortless African luxury.
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-12 px-8 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center transition-all shadow-md active:scale-98"
                >
                  Shop Hair
                </button>

                <button
                  onClick={() => {
                    setCurrentView('collections');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-12 px-8 bg-[#FEDEB2] hover:bg-[#E0C298] text-[#281800] text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center transition-all"
                >
                  Explore Collections
                </button>
              </div>

              {/* Micro Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#D1C4C0]/40 w-full max-w-lg">
                <div>
                  <p className="font-editorial text-2xl text-[#1A1412]">5+ Yrs</p>
                  <p className="text-[10px] uppercase text-[#807571] font-bold tracking-wider">Lifespan Value</p>
                </div>
                <div>
                  <p className="font-editorial text-2xl text-[#1A1412]">HD 0.08mm</p>
                  <p className="text-[10px] uppercase text-[#807571] font-bold tracking-wider">Undetectable Lace</p>
                </div>
                <div>
                  <p className="font-editorial text-2xl text-[#1A1412]">100%</p>
                  <p className="text-[10px] uppercase text-[#807571] font-bold tracking-wider">Raw Cuticle Intact</p>
                </div>
              </div>
            </div>

            {/* Hero Imagery Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-[4/5] bg-[#F5F3F0] overflow-hidden rounded-xl shadow-2xl group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxazG0n64YuZo2B7kdqQcnoncwygq8mtiqImKaQ805_kL5Zfh_FjYSj_VtxwU374N0O_XMQ38OHbhde0hTaMweZHgDiTI2-SfqlL0bE13a_SPykl2wun0RxYgTKR32y6d2qlKZYBgf51odhDN_1bsxn7VZ7aX1Of9F-c6Mavdpe9sHCr3Ua-1fMMHJRhiwqR-zXdhTIw8_8YMT4o0fiwfLaloY3NpS7cRYw-NVZwJOt90fioPfzeY"
                  alt="Editorial beauty portrait of an elegant Nigerian woman with flowing raw hair extensions"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/70 via-transparent to-transparent"></div>

                {/* Inset Release Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md flex items-center justify-between rounded-lg shadow-lg border border-white/40">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#725B38]">
                      Latest Atelier Release
                    </span>
                    <p className="font-editorial text-lg text-[#1A1412] font-medium">
                      The Obsidian Temple Silk Unit
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProduct(products[0]);
                      setCurrentView('product-detail');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-10 h-10 bg-[#1A1412] hover:bg-[#725B38] text-white rounded flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Decorative Floating Certification Pill */}
              <div className="hidden sm:block absolute -top-6 -left-6 bg-white p-4 shadow-xl rounded-lg max-w-xs z-20 border border-[#EAE8E5]">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-[#725B38]" />
                  <span className="text-xs font-bold text-[#1A1412]">Unprocessed Purity</span>
                </div>
                <p className="text-[11px] text-[#807571] leading-relaxed">
                  Single-donor human hair sourced directly with zero chemical baths or acid polishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories Grid */}
      <section className="w-full bg-[#F5F3F0] py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#725B38] block mb-1">
                The Portfolios
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1A1412]">
                Curated Categories
              </h2>
            </div>
            <p className="text-xs text-[#4E4542] max-w-md leading-relaxed">
              Explore our foundational collections, sourced ethically and tailored in our Lagos atelier for flawless installation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <div
              onClick={() => {
                setCurrentView('bundles-wigs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer flex flex-col bg-white overflow-hidden rounded shadow-sm hover:shadow-xl transition-all duration-300 border border-[#EAE8E5]"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-[#EFEEEB]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwN_TKOKEtrkhthfi6nhO6OLZSbxKggolKjfmHwFBh-ci4l79bn5_0jG5P6L4OPspHCJ37OwiyaFMQOGT-yF0q6TJz50c5nKrS76lsRkGt21PxcPwqwAi1CPRtiDOENObseMyrqfLdeXMTWunL6cQIHxp-DpvAZ3ds5jUdFaxTZO2RP9Qu_8URmNzMIH_o_8yehUwr1krb4oMO4wB_SAP7Y2Ne4Fy7iriykvcz5U00DaHwK7nhyPi4"
                  alt="Raw Virgin Bundles"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider text-[#1A1412]">
                  Virgin Donors
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-lg text-[#1A1412] group-hover:text-[#725B38] transition-colors">
                    Raw Virgin Bundles
                  </h3>
                  <p className="text-xs text-[#807571]">Cambodian, Burmese, Vietnamese</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#807571] group-hover:translate-x-1 group-hover:text-[#1A1412] transition-all" />
              </div>
            </div>

            {/* Category 2 */}
            <div
              onClick={() => {
                setCurrentView('bundles-wigs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer flex flex-col bg-white overflow-hidden rounded shadow-sm hover:shadow-xl transition-all duration-300 border border-[#EAE8E5]"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-[#EFEEEB]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaRys2c0INHuaurtR70FtmYd8vtCLQQnODyCAgLpGJMCKmG6IIc5tqa800lnod_w18lN21xE2kI1_CTn1YSuXdNp1Z-S4tnBoLKpncZugSKy1qZS3-602NUhxIIqqgPCaM2LSzKimNzhk3vv192vmB_PPGgTcsnjKMeYPCPkHf4tDL_m3OeViHHsvQvacRNxj3iuL3DiynOt8-zG2xLyS6VbC6Y-H70i9QfmtzHMCBE5YhqpYN3S2Q"
                  alt="HD Lace Units"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider text-[#1A1412]">
                  Ultra Invisible
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-lg text-[#1A1412] group-hover:text-[#725B38] transition-colors">
                    HD Lace Units
                  </h3>
                  <p className="text-xs text-[#807571]">Real Swiss Film, Hand-Tied Knots</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#807571] group-hover:translate-x-1 group-hover:text-[#1A1412] transition-all" />
              </div>
            </div>

            {/* Category 3 */}
            <div
              onClick={() => {
                setCurrentView('collections');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer flex flex-col bg-white overflow-hidden rounded shadow-sm hover:shadow-xl transition-all duration-300 border border-[#EAE8E5]"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-[#EFEEEB]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSztRFzIYr_0wp6LGY8hD1Omdtukg2Tp_x28vytJa_HdkKYERGCRLhwiw7wCC-lFAqmgeoMZnnIfJ-pFPk0GrdOXopTjxnOsCzYwawUy5Wm5t7RJC04PhHFuNevtniRVeL5kHWPG4-PhN-bKxylw94PqxqjI35mt2cW3fi4cjW6XXBVLFwYkhHt1k4vwk-dW16qUdc4RG3hfXIp68HSb5ye6M9amLeoYkM80ostTXHlUT8j0sHihWS"
                  alt="Closures & Frontals"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider text-[#1A1412]">
                  Melt Precision
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-lg text-[#1A1412] group-hover:text-[#725B38] transition-colors">
                    Closures & Frontals
                  </h3>
                  <p className="text-xs text-[#807571]">5×5, 6×6 & 13×6 Seamless Finish</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#807571] group-hover:translate-x-1 group-hover:text-[#1A1412] transition-all" />
              </div>
            </div>

            {/* Category 4 */}
            <div
              onClick={() => {
                setCurrentView('collections');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer flex flex-col bg-white overflow-hidden rounded shadow-sm hover:shadow-xl transition-all duration-300 border border-[#EAE8E5]"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-[#EFEEEB]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP1liuPPKMk8c5ah8ZHNx1LZE4l6oFiSaMqKxOEANiGfHbfiXBKgnyZsYoyCvWxRq1b8-k0wJkhFmiluPTGjjCWY-w_UNH8vUJvzn33ODFIZyLqOKXkYp2r2iQcu9JjV93ZDgVnK7DPDIw34xry3Ohza3x5lG2uTa1uFRRRn_Syulrs_yKPMcIBqb7FksGoeM_vdmrFidAYRzjH-EppLDaV3Anh5CvvGwErXAeff2bFyNJ49NVkCPo"
                  alt="Silk Care & Elixirs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider text-[#1A1412]">
                  Preservation
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-lg text-[#1A1412] group-hover:text-[#725B38] transition-colors">
                    Silk Care & Elixirs
                  </h3>
                  <p className="text-xs text-[#807571]">Hydration Mists, Argan Essences</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#807571] group-hover:translate-x-1 group-hover:text-[#1A1412] transition-all" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lagos Atelier Bestsellers */}
      <section className="w-full bg-[#FBF9F6] py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#725B38] block mb-1">
                Private Selection
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1A1412]">
                Lagos Atelier Bestsellers
              </h2>
            </div>
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs uppercase tracking-wider font-bold text-[#725B38] hover:text-[#1A1412] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View All 38 Creations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((prod) => {
              const isWishlisted = wishlist.includes(prod.id);
              return (
                <div key={prod.id} className="group flex flex-col bg-white rounded-lg p-3 border border-[#EAE8E5] shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-[4/5] overflow-hidden rounded bg-[#EFEEEB] mb-3">
                    {prod.badge && (
                      <span className="absolute top-2.5 left-2.5 z-10 bg-[#1A1412] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                        {prod.badge}
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center transition-colors ${
                        isWishlisted ? 'text-[#BA1A1A]' : 'text-[#1A1412] hover:text-[#BA1A1A]'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <img
                      src={prod.images.main}
                      alt={prod.name}
                      onClick={() => {
                        setSelectedProduct(prod);
                        setCurrentView('product-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Quick Add Bottom Drawer */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 backdrop-blur translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2 border-t border-[#EAE8E5]">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-[#807571]">
                        <span>Lengths Available</span>
                        <span className="text-[#725B38]">{prod.lengths.join('″ / ')}″</span>
                      </div>
                      <button
                        onClick={() => setQuickViewProduct(prod)}
                        className="w-full py-2 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Quick Add Options</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#807571] mb-1 truncate">
                      {prod.subtitle}
                    </span>
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
                    <p className="text-xs text-[#807571] line-clamp-1 mb-3">
                      {prod.fullSpecs.texture}
                    </p>

                    <div className="mt-auto flex items-baseline justify-between pt-2 border-t border-[#F5F3F0]">
                      <span className="font-editorial text-lg font-bold text-[#1A1412]">
                        {formatPrice(prod.price)}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#725B38] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#725B38]"></span>
                        {prod.inStockLocation || 'In Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Texture & Length Visualizer */}
      <section className="w-full bg-[#EFEEEB] py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Interactive Selector Rail */}
            <div className="lg:col-span-6">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#725B38] block mb-1">
                Interactive Studio Tool
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1A1412] mb-3">
                Explore Textures & Proportions
              </h2>
              <p className="text-xs text-[#4E4542] leading-relaxed mb-6">
                Every Bernice Hairpiece maintains identical density from root to ends. Toggle our staple donor textures and adjust lengths to preview the fall.
              </p>

              {/* 1. Texture Selector */}
              <div className="mb-6">
                <label className="block text-xs uppercase font-bold text-[#1A1412] tracking-wider mb-2">
                  1. Select Raw Donor Texture
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTexture('straight')}
                    className={`py-2.5 px-3 rounded text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeTexture === 'straight'
                        ? 'bg-[#1A1412] text-white shadow-sm'
                        : 'bg-white text-[#4E4542] border border-[#D1C4C0] hover:bg-[#F5F3F0]'
                    }`}
                  >
                    Bone Straight
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTexture('deepwave')}
                    className={`py-2.5 px-3 rounded text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeTexture === 'deepwave'
                        ? 'bg-[#1A1412] text-white shadow-sm'
                        : 'bg-white text-[#4E4542] border border-[#D1C4C0] hover:bg-[#F5F3F0]'
                    }`}
                  >
                    Deep Wave
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTexture('naturalwavy')}
                    className={`py-2.5 px-3 rounded text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeTexture === 'naturalwavy'
                        ? 'bg-[#1A1412] text-white shadow-sm'
                        : 'bg-white text-[#4E4542] border border-[#D1C4C0] hover:bg-[#F5F3F0]'
                    }`}
                  >
                    Natural Wavy
                  </button>
                </div>
              </div>

              {/* 2. Length Visualizer Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs uppercase font-bold text-[#1A1412] tracking-wider">
                    2. Hair Length Visualizer
                  </label>
                  <span className="font-editorial text-lg text-[#725B38] font-bold">
                    {getLengthDescription(activeLength)}
                  </span>
                </div>

                <input
                  type="range"
                  min="18"
                  max="32"
                  step="2"
                  value={activeLength}
                  onChange={(e) => setActiveLength(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#D1C4C0] rounded-lg appearance-none cursor-pointer accent-[#725B38]"
                />

                <div className="flex justify-between text-[10px] text-[#807571] font-bold uppercase mt-2">
                  <span>18″ (Collarbone)</span>
                  <span>22″ (Mid-Back)</span>
                  <span>26″ (Waist)</span>
                  <span>32″ (Tailbone)</span>
                </div>
              </div>

              {/* Dynamic Specifications */}
              <div className="p-4 bg-white rounded-lg border border-[#EAE8E5] shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#807571] block">
                      Donor Bundle Weight
                    </span>
                    <p className="font-editorial text-lg text-[#1A1412] font-semibold">100g ± 5g</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#807571] block">
                      Heat Tolerance
                    </span>
                    <p className="font-editorial text-lg text-[#1A1412] font-semibold">Up to 450°F</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F5F3F0] flex items-center justify-between text-xs">
                  <span className="text-[#807571]">Recommended for full density: 3 – 4 Bundles</span>
                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs uppercase tracking-wider font-bold text-[#725B38] hover:underline"
                  >
                    Configure Bundle Drop →
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Studio Rendering Frame */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-md aspect-[4/5] bg-white rounded-xl overflow-hidden relative shadow-xl border border-[#EAE8E5]">
                <img
                  src={textureData[activeTexture].img}
                  alt={textureData[activeTexture].name}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Length Ruler Overlay */}
                <div className="absolute right-4 top-8 bottom-8 flex flex-col justify-between items-end pointer-events-none text-white text-[10px] font-bold uppercase drop-shadow">
                  <span className={activeLength === 18 ? 'text-[#FEDEB2] scale-110' : 'opacity-60'}>18″</span>
                  <span className={activeLength === 22 ? 'text-[#FEDEB2] scale-110' : 'opacity-60'}>22″</span>
                  <span className={activeLength === 24 ? 'text-[#FEDEB2] scale-110' : 'opacity-60'}>24″ — Active</span>
                  <span className={activeLength === 28 ? 'text-[#FEDEB2] scale-110' : 'opacity-60'}>28″</span>
                  <span className={activeLength === 32 ? 'text-[#FEDEB2] scale-110' : 'opacity-60'}>32″</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-[#1A1412]/85 backdrop-blur-md p-3 rounded text-white flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      {textureData[activeTexture].name}
                    </p>
                    <p className="text-[10px] text-[#FEDEB2]">
                      {activeLength} Inches • {textureData[activeTexture].origin}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(products[0], activeLength, 1);
                    }}
                    className="px-3 py-1.5 bg-[#FEDEB2] text-[#281800] text-[10px] uppercase font-bold tracking-wider rounded"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Editorial Craft Story */}
      <section className="w-full bg-[#FBF9F6] py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Visual */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="aspect-[3/4] bg-[#EFEEEB] rounded-xl overflow-hidden shadow-lg border border-[#EAE8E5]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA8Ct7tbVWgvCidkt56BtQok6gnyuKUXsp_5egmlwYuWtWhGzt4Njl2m2zqqIs9yG869a35fJwbYKC2rg99PFQe8EPd2AsaJdDn8FLtZcsdpiQsjmzjpqjVDXbVnly2xTj0jNw_CEV8ffuwN5pf_hrnWhkNY-dUGXNkCy4KnFLM2LXBmbLll1OJEbJ1YQqvDKNkMFEV0pE3gsPbNnlvfIZSKf6c9-QlpVIDFj5a9SemBllIRcrTAyl"
                  alt="Artisan hair specialist inspecting raw hair wefts"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -right-6 p-5 bg-[#1A1412] text-white rounded-lg shadow-xl max-w-xs hidden sm:block border border-[#2D2623]">
                <p className="font-editorial text-sm italic mb-2 font-light">
                  "Pure hair is an heirloom, not a disposable trend."
                </p>
                <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold block">
                  Bernice • Creative Director
                </span>
              </div>
            </div>

            {/* Story Content */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#725B38] block">
                The Atelier Standard
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1A1412]">
                Handcrafted in Victoria Island. Preserved for Years.
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#4E4542] leading-relaxed">
                <p>
                  In a market crowded with synthetic blends and heavily processed acid-bathed fibers, Bernice Hairplace was founded in Lagos to restore uncompromising integrity to high-fashion hair commerce.
                </p>
                <p>
                  Every bundle in our Victoria Island showroom is collected from a single living donor with natural cuticles aligned in the same biological direction. This guarantees zero matting, zero shedding, and an organic natural luster that responds to styling heat, humidity, and premium hair color exactly like your own natural hair.
                </p>
                <p className="font-semibold text-[#1A1412]">
                  Invest once. Wear continuously. With routine care, our single-donor bundles and artisanal HD units retain their silky movement for 5+ years.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-11 px-6 bg-[#EAE8E5] hover:bg-[#E4E2DF] text-[#1A1412] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Read Sourcing Manifesto
                </button>
                <button
                  onClick={() => setIsConciergeOpen(true)}
                  className="text-xs uppercase font-bold text-[#725B38] hover:underline flex items-center gap-1"
                >
                  <span>Book Atelier Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Assurance Grid */}
      <section className="w-full bg-[#EAE8E5] py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#725B38] block mb-1">
              Our Uncompromised Promises
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1412]">
              The Bernice Client Assurance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-start border border-[#D1C4C0]/40">
              <div className="w-12 h-12 rounded bg-[#F5F3F0] flex items-center justify-center text-[#725B38] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-editorial text-lg text-[#1A1412] mb-2">100% Unprocessed</h4>
              <p className="text-xs text-[#4E4542] leading-relaxed">
                Zero chemical acid wash, zero synthetic fillers. Only pure raw temple bundles with aligned, live cuticles.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-start border border-[#D1C4C0]/40">
              <div className="w-12 h-12 rounded bg-[#F5F3F0] flex items-center justify-center text-[#725B38] mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-editorial text-lg text-[#1A1412] mb-2">Lagos Island Priority</h4>
              <p className="text-xs text-[#4E4542] leading-relaxed">
                Same-day door-to-door dispatch to Ikoyi, Victoria Island, Lekki, and rapid delivery throughout mainland Lagos.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-start border border-[#D1C4C0]/40">
              <div className="w-12 h-12 rounded bg-[#F5F3F0] flex items-center justify-center text-[#725B38] mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-editorial text-lg text-[#1A1412] mb-2">Paystack Encrypted</h4>
              <p className="text-xs text-[#4E4542] leading-relaxed">
                Seamless and secure checkout. We accept local Naira debit cards, bank transfers, and international USD cards.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-start border border-[#D1C4C0]/40">
              <div className="w-12 h-12 rounded bg-[#F5F3F0] flex items-center justify-center text-[#725B38] mb-4">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="font-editorial text-lg text-[#1A1412] mb-2">Bespoke Concierge</h4>
              <p className="text-xs text-[#4E4542] leading-relaxed">
                Dedicated hair advisory via WhatsApp or in-person at our Victoria Island studio for custom wig sizing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
