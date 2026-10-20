export {};

declare global {
  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }

  interface RazorpayPaymentFailureResponse {
    error: {
      code: string;
      description: string;
      reason?: string;
      source?: string;
      step?: string;
      metadata?: Record<string, string>;
    };
  }

  interface RazorpayOptions {
    key: string;
    amount: number | string;
    currency?: string;
    order_id?: string;
    name?: string;
    description?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: { color?: string };
    notes?: Record<string, string | number>;
    handler?: (response: RazorpayPaymentResponse) => void;
    modal?: { ondismiss?: () => void };
  }

  interface RazorpayInstance {
    open(): void;
    on(
      event: "payment.failed",
      handler: (response: RazorpayPaymentFailureResponse) => void,
    ): void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
