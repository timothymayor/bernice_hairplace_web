import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';

export const CollectionsView: React.FC = () => {
  const { setCurrentView, setSelectedProduct, products } = useShop();

  const collections = [
    {
      title: 'Cambodian Temple Raw Harvest',
      tag: '01 • Single Donor',
      desc: 'Collected ethically in rural Phnom Penh. Super double drawn, flat-iron pressed, mirror reflection.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4bVhdqMLMJnOq0sr7vNNpOJJ5mQoQcjGtwycB3LI--bsLHY7QaRBrsDnfVDxKVer4LoiqIQFp4-rHSCCj9_m42kaM8pz16i_NqR8ZSYYvT2HHZ8MwuKc19eJTMVatLclFkN5HrM2jK2R6t9pdoJym1A_8oCt6kjTdmYWABeqHxUhXN177r4yJmx93X_jb45IzmxZLge2OoAUiUKRBZQiwvO6M8Bdd7T_hj5Ya9tvU1ztSieCy-lHu',
      itemsCount: '12 Curations',
      targetId: 'prod-cambodian-bone-straight',
    },
    {
      title: 'Swiss Invisible 0.08mm HD Lace',
      tag: '02 • Real Film Mesh',
      desc: 'Transparent skin melt frontals and closures with bleached single knots and pre-plucked transition.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbV83ON1BWouAAKd_MASSaeosH5kEgNWaRn3Qn7dBYEnS1n6HK2aU7pxqy0OLWKyFDoxxIuFk03nkhyFu9vseMAe7Ey2AtU8NQ-6jdhzAF1OAquLY-aAIG6__j-s9PKQHgu-f8EG-X_fEVxoH0HZGY_BWRkGTEjqiZ43rjHLpao63cbrMd73Re6w3MhGYcPEEyzyX9_NPxwAMxb50xMb224J9T-FBqU6216ApMQ5ye0wESf56Bf1Jf',
      itemsCount: '8 Variants',
      targetId: 'prod-hd-swiss-closure-5x5',
    },
    {
      title: 'Burmese Raw Natural Curly',
      tag: '03 • Volume & Ringlets',
      desc: 'Deep hydrated coils and low-maintenance luster designed to thrive in high-humidity climates.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOWw6GdQ1Jfj-SMELxf1BsLdfCcOYKwDhGjMGauagRi5HHEEtr6Egt0DvnYNGq7_wLnjMTCw1ANbl_JumbXwY3SI4TL6YsggM3--k4YovF3h5kkcU5Y_V6VQTOLY2fHOJaBZOPDZaT3487VBs5wfp-XXVhKx6JsHkNJ_eay8TkgWhSLfEepBZBrXTmQp7XPr7bxbRkJHIEFSfvCxaAzUS1O91JVIdeIGPsFVbeP0V-i1pNIOFtOgws',
      itemsCount: '6 Atelier Units',
      targetId: 'prod-burmese-curly-hd-unit',
    },
    {
      title: 'Vietnamese Super Double Drawn',
      tag: '04 • Maximum Fullness',
      desc: 'Extreme root-to-tip thickness with razor-sharp blunt ends. Preserved natural cuticle elasticity.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwTWb1tbm77RBqIVK48uCHcePVF3zGvOCj86OxjqPDBwaLb9SM-qTwDRYb8tucfddL__kMkG3S40WAzrgFZsAp0lzhJeXgzzqvenVgIGQtp3rQ-SktkJUQQxJMIgBhg8Tzv3JcwSYLfh-3HfglGMjtK3aM1rWu2-MKLS9eXVr5yAS4oOLYTelTzbgO8QJOYIihsrjZjbLhTVb8GuNUuEuELuEIZ9iLlGPZzkgaSUyHv9tfpmfBqYpe',
      itemsCount: '7 Textures',
      targetId: 'prod-vietnamese-bone-straight',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[#FBF9F6]">
      {/* Editorial Header */}
      <section className="py-12 lg:py-16 border-b border-[#EAE8E5] bg-[#F5F3F0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#725B38] block mb-2">
              The Archives & Portfolios
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1412] font-normal tracking-tight">
              Curated Collections
            </h1>
            <p className="text-sm text-[#4E4542] mt-3 font-light leading-relaxed">
              Explore our taxonomies organized by raw geographical origin, temple cuticles, and artisanal Swiss lace mesh ventilations.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Matrix */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((col, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const target = products.find((p) => p.id === col.targetId) || products[0];
                  setSelectedProduct(target);
                  setCurrentView('product-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#EAE8E5] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EFEEEB]">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider text-[#1A1412]">
                    {col.tag}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-[#FEDEB2] font-semibold">
                      {col.itemsCount}
                    </span>
                    <h3 className="font-editorial text-2xl font-medium mt-0.5">
                      {col.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex items-center justify-between">
                  <p className="text-xs text-[#4E4542] max-w-md leading-relaxed">
                    {col.desc}
                  </p>
                  <button className="w-10 h-10 rounded-full bg-[#F5F3F0] group-hover:bg-[#1A1412] group-hover:text-white text-[#1A1412] flex items-center justify-center transition-colors shrink-0 ml-4">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
