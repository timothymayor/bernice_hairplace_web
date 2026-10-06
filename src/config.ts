// Store contact settings. Override per environment in Vercel (Project → Settings → Environment Variables).
export const WHATSAPP_NUMBER = (import.meta.env?.VITE_WHATSAPP_NUMBER || '2348128904120').replace(/\D/g, '');

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
