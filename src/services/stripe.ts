import { loadStripe } from '@stripe/stripe-js';

// This is your test publishable API key.
// In production, you would get this from environment variables
const stripePromise = loadStripe('pk_test_51234567890abcdef...' || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

export { stripePromise };

// Mock payment intent creation for demo purposes
// In a real app, this would be handled by your backend
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  // This is a mock implementation for demo purposes
  // In production, you would call your backend API
  return {
    client_secret: 'pi_mock_client_secret_' + Math.random().toString(36).substr(2, 9),
    id: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
    amount: amount * 100, // Stripe uses cents
    currency,
    status: 'requires_payment_method'
  };
};

// Mock payment confirmation for demo purposes
export const confirmPayment = async (clientSecret: string, paymentMethod: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock successful payment
  return {
    paymentIntent: {
      id: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
      status: 'succeeded',
      amount: 2000,
      currency: 'usd',
      client_secret: clientSecret
    },
    error: null
  };
};

export const formatPrice = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
