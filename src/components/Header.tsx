import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, ShoppingBag, Menu, X, ShieldCheck, User as UserIcon, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    currentView,
    setCurrentView,
    user,
    isLoggedIn,
    loginWithGoogle,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    formatPrice,
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { label: 'Shop', view: 'shop' },
    { label: 'Collections', view: 'collections' },
    { label: 'Bundles & Wigs', view: 'bundles-wigs' },
    { label: 'About', view: 'about' },
    { label: 'Docs / Architecture', view: 'docs', icon: true },
  ];

  // Live matching products for autocomplete preview
  const searchMatches = searchQuery.trim().length > 1
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.texture.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
        );
      }).slice(0, 4)
    : [];

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentView !== 'shop') {
      setCurrentView('shop');
    }
    setIsSearchActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSearchProduct = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    setIsSearchActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#201A18] text-[#FAF8F5] px-4 sm:px-10 py-2 text-center flex items-center justify-center gap-2 border-b border-[#2D2623]/40 z-50 relative">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse"></span>
        <p className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
          Complimentary Express Lagos Delivery on Orders Over ₦150,000
        </p>
      </div>

      {/* Main Header Bar */}
      <header className="fixed top-8 left-0 right-0 z-40 bg-[#FBF9F6]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#EAE8E5]">
        <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-10 flex items-center justify-between">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-[#1B1C1A] p-2 hover:bg-[#EFEEEB] rounded"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group text-left"
            >
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1WmDz5BViSwqywijLWVRyiCAakBOYXtIZt94yZtV_3L5rkxWOzd5IqHiTTAKgn2_NaMmEsjgsTmm8xHoH603aBP35qJc2an2rLHXLSDfRA3NzH_2ylUWyGDoM3fyAG-D5TKfkFd297FN7avuarEhlK3k46Vhi10Ekt4-osB8KYUdFNnzBGAFdL92_Iqy41msamxcyN4hIolDiWfMlaO9H6LPEoJmsMAhMiMNllBJPfQYPboDOodhxC8rQU"
                alt="Bernice Hairplace Wordmark Logo"
                className="h-7 sm:h-8 w-auto object-contain"
              />
              <div className="hidden xl:block">
                <span className="font-editorial text-xl font-medium tracking-tight text-[#1A1412] uppercase block">
                  Bernice Hairplace
                </span>
                <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-[#725B38] block">
                  Lagos • Luxury Raw Hair
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => {
                    setCurrentView(link.view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 py-1 ${
                    isActive
                      ? 'text-[#1A1412] border-b-2 border-[#1A1412] font-bold'
                      : 'text-[#4E4542] hover:text-[#1A1412]'
                  } ${link.icon ? 'flex items-center gap-1.5 text-[#725B38]' : ''}`}
                >
                  {link.icon && <BookOpen className="w-3.5 h-3.5" />}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Currency Selector */}
            <div className="hidden sm:flex items-center bg-[#EFEEEB] rounded p-0.5 text-[11px] font-bold">
              <button
                onClick={() => setCurrency('NGN')}
                className={`px-2 py-1 rounded transition-colors ${
                  currency === 'NGN' ? 'bg-[#1A1412] text-white shadow-sm' : 'text-[#4E4542] hover:text-[#1A1412]'
                }`}
              >
                NGN (₦)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded transition-colors ${
                  currency === 'USD' ? 'bg-[#1A1412] text-white shadow-sm' : 'text-[#4E4542] hover:text-[#1A1412]'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Search Icon Trigger */}
            <button
              onClick={() => {
                setIsSearchActive(!isSearchActive);
              }}
              className={`p-2 transition-colors rounded ${
                isSearchActive || searchQuery
                  ? 'bg-[#1A1412] text-white'
                  : 'text-[#4E4542] hover:text-[#1A1412] hover:bg-[#EFEEEB]'
              }`}
              aria-label="Search catalog"
              title="Search hair catalog & descriptions"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account / VIP User */}
            {isLoggedIn && user ? (
              <button
                onClick={() => {
                  setCurrentView('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 text-[#4E4542] hover:text-[#1A1412] transition-colors p-1.5 rounded hover:bg-[#EFEEEB]"
                title="Account Dashboard"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.firstName}
                  className="w-8 h-8 rounded-full object-cover border border-[#C5A880]"
                />
                <span className="hidden xl:inline text-xs uppercase tracking-wider font-semibold text-[#1A1412]">
                  {user.firstName}
                </span>
              </button>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EFEEEB] hover:bg-[#EAE8E5] text-[#1A1412] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                <UserIcon className="w-4 h-4 text-[#725B38]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#EAE8E5] hover:bg-[#E4E2DF] text-[#1A1412] rounded transition-all shadow-sm active:scale-95"
              aria-label="View Luxury Bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#1A1412]" />
              <span className="text-xs font-bold uppercase tracking-wider">Bag ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Expandable Live Search Bar with Instant Autocomplete Results */}
        {isSearchActive && (
          <div className="bg-[#EFEEEB] px-4 sm:px-10 py-4 border-t border-[#EAE8E5] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-[#725B38] absolute left-3.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hair names, textures, Swiss HD lace, descriptions (e.g. 'Cambodian', 'bone straight', '613')..."
                  className="w-full h-12 pl-11 pr-24 bg-white border border-[#D1C4C0] rounded-lg text-sm text-[#1A1412] focus:outline-none focus:ring-2 focus:ring-[#725B38] shadow-sm font-medium"
                />
                
                <div className="absolute right-2.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-[#807571] hover:text-[#1A1412]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1A1412] hover:bg-[#201A18] text-white text-[11px] font-bold uppercase tracking-wider rounded"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Instant Live Autocomplete Dropdown */}
              {searchQuery.trim().length > 1 && (
                <div className="mt-3 bg-white border border-[#D1C4C0] rounded-xl p-3 shadow-xl space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-2 pb-2 border-b border-[#F5F3F0]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#725B38] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Live Matches ({searchMatches.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="text-xs font-bold text-[#1A1412] hover:underline flex items-center gap-1"
                    >
                      <span>View all catalog results</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#725B38]" />
                    </button>
                  </div>

                  {searchMatches.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#807571]">
                      No exact matches found for "{searchQuery}". Press Search to filter full catalog.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {searchMatches.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectSearchProduct(item)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F3F0] cursor-pointer transition-colors border border-transparent hover:border-[#EAE8E5]"
                        >
                          <img
                            src={item.images.main}
                            alt={item.name}
                            className="w-12 h-14 rounded object-cover shrink-0 bg-[#EFEEEB]"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase font-bold text-[#725B38] block truncate">
                              {item.subtitle}
                            </span>
                            <h4 className="text-xs font-bold text-[#1A1412] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs font-bold text-[#1A1412] mt-0.5">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FBF9F6] border-t border-[#EAE8E5] px-6 py-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E5]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#725B38]">Atelier Directory</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrency('NGN')}
                  className={`px-2 py-0.5 text-xs rounded ${currency === 'NGN' ? 'bg-[#1A1412] text-white' : 'text-[#4E4542]'}`}
                >
                  NGN
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-0.5 text-xs rounded ${currency === 'USD' ? 'bg-[#1A1412] text-white' : 'text-[#4E4542]'}`}
                >
                  USD
                </button>
              </div>
            </div>

            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  setCurrentView(link.view);
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-left text-sm font-semibold uppercase tracking-wider py-2 flex items-center justify-between ${
                  currentView === link.view ? 'text-[#725B38] font-bold' : 'text-[#1A1412]'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-[#C5A880]">→</span>
              </button>
            ))}

            <div className="pt-3 border-t border-[#EAE8E5] flex items-center justify-between text-xs text-[#4E4542]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#725B38]" /> Paystack Encrypted
              </span>
              <span>Victoria Island, Lagos</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
