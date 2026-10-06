import React, { useEffect, useRef } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { WhatsAppConciergeModal } from './components/WhatsAppConciergeModal';
import { CustomOrderModal } from './views/CustomOrderModal';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { PaymentStatusView } from './views/PaymentStatusView';
import { OrdersView } from './views/OrdersView';
import { CollectionsView } from './views/CollectionsView';
import { AboutView } from './views/AboutView';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const VIEW_PATHS: Record<string, string> = {
  home: '/',
  shop: '/shop',
  'bundles-wigs': '/bundles-wigs',
  collections: '/collections',
  about: '/about',
  checkout: '/checkout',
  'payment-status': '/order-status',
  orders: '/orders',
};

const MainAppContent: React.FC = () => {
  const { currentView, setCurrentView, selectedProduct, setSelectedProduct, getProductBySlug, toast } = useShop();
  const isFirstSync = useRef(true);

  // Keep the URL in sync with the current view so Back/refresh and shared product links work.
  useEffect(() => {
    const applyPath = () => {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      const productMatch = path.match(/^\/product\/([^/]+)$/);
      if (productMatch) {
        const product = getProductBySlug(decodeURIComponent(productMatch[1]));
        if (product) {
          setSelectedProduct(product);
          setCurrentView('product-detail');
          return;
        }
      }
      const view = Object.keys(VIEW_PATHS).find((v) => VIEW_PATHS[v] === path);
      setCurrentView(view ?? (path === '/account' ? 'orders' : 'home'));
    };
    applyPath();
    window.addEventListener('popstate', applyPath);
    return () => window.removeEventListener('popstate', applyPath);
  }, []);

  useEffect(() => {
    // The first run happens before the view parsed from the URL is applied; skip it.
    if (isFirstSync.current) {
      isFirstSync.current = false;
      return;
    }
    const path =
      currentView === 'product-detail' && selectedProduct
        ? `/product/${selectedProduct.slug}`
        : (VIEW_PATHS[currentView] ?? '/');
    if (window.location.pathname !== path) window.history.pushState(null, '', path);
  }, [currentView, selectedProduct]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
      case 'bundles-wigs':
        return <CatalogView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'checkout':
        return <CheckoutView />;
      case 'payment-status':
        return <PaymentStatusView />;
      case 'orders':
      case 'account':
        return <OrdersView />;
      case 'collections':
        return <CollectionsView />;
      case 'about':
        return <AboutView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] text-[#1B1C1A] selection:bg-[#FEDEB2] selection:text-[#281800]">
      <Header />

      {/* Main View Display with top padding for fixed header */}
      <main className="flex-1 w-full pt-28">
        {renderView()}
      </main>

      <Footer />

      {/* Slide-over & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <WhatsAppConciergeModal />
      <CustomOrderModal />

      {/* Floating Interactive Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[#1A1412] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-[#30312F]">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-[#BA1A1A] shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-[#C5A880] shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-[#FEDEB2] shrink-0" />
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#FEDEB2]">
                {toast.message}
              </p>
              {toast.submessage && (
                <p className="text-[11px] text-[#D0C4C0] font-medium mt-0.5">
                  {toast.submessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
