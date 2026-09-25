/**
 * Paystack Integration Utilities
 * 
 * This file handles the frontend Paystack integration.
 * The actual payment verification happens server-side.
 * 
 * IMPORTANT: Never expose your Paystack SECRET key in frontend code.
 * Only the PUBLIC key should be used here.
 */

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo (multiply NGN by 100)
  reference: string;
  metadata?: Record<string, unknown>;
  callback?: (response: { reference: string; status: string; trans: string; transaction: string }) => void;
  onClose?: () => void;
}

/**
 * Initialize Paystack inline payment
 * Requires Paystack inline JS to be loaded
 */
export const initializePaystackPayment = (config: PaystackConfig): void => {
  const handler = (window as any).PaystackPop?.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount * 100, // Convert to kobo
    currency: 'NGN',
    ref: config.reference,
    metadata: config.metadata,
    callback: (response: any) => {
      config.callback?.({
        reference: response.reference,
        status: response.status,
        trans: response.trans,
        transaction: response.transaction,
      });
    },
    onClose: () => {
      config.onClose?.();
    },
  });

  if (handler) {
    handler.openIframe();
  } else {
    // Fallback: redirect to checkout URL
    console.warn('Paystack inline not loaded. Falling back to redirect.');
  }
};

/**
 * Get the Paystack public key (for validation)
 */
export const getPaystackPublicKey = (): string => {
  return PAYSTACK_PUBLIC_KEY;
};

/**
 * Check if Paystack is configured
 */
export const isPaystackConfigured = (): boolean => {
  return !!PAYSTACK_PUBLIC_KEY && PAYSTACK_PUBLIC_KEY.startsWith('pk_');
};
