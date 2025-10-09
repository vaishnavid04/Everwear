import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'Inter, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export default function PaymentForm({ amount, onSuccess, onError, loading = false }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardErrors, setCardErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardErrors({});

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      onError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
      });

      if (error) {
        onError(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // For demo purposes, we'll simulate a successful payment
      // In a real app, you would send the payment method to your backend
      setTimeout(() => {
        onSuccess({
          id: 'pi_demo_' + Math.random().toString(36).substr(2, 9),
          status: 'succeeded',
          amount: amount * 100,
          currency: 'usd',
        });
        setIsProcessing(false);
      }, 2000);

    } catch (err) {
      onError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const handleCardChange = (elementType: string) => (event: any) => {
    if (event.error) {
      setCardErrors(prev => ({
        ...prev,
        [elementType]: event.error.message
      }));
    } else {
      setCardErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[elementType];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Amount */}
      <div className="bg-gradient-primary text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6" />
            <span className="text-lg font-semibold">Payment Details</span>
          </div>
          <div className="text-2xl font-bold">
            ${amount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Card Number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          Card Number
        </label>
        <div className="relative">
          <div className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <CardNumberElement
              options={cardElementOptions}
              onChange={handleCardChange('cardNumber')}
            />
          </div>
          {cardErrors.cardNumber && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{cardErrors.cardNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Expiry Date
          </label>
          <div className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <CardExpiryElement
              options={cardElementOptions}
              onChange={handleCardChange('cardExpiry')}
            />
          </div>
          {cardErrors.cardExpiry && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{cardErrors.cardExpiry}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            CVC
          </label>
          <div className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <CardCvcElement
              options={cardElementOptions}
              onChange={handleCardChange('cardCvc')}
            />
          </div>
          {cardErrors.cardCvc && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{cardErrors.cardCvc}</span>
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || loading}
        className="w-full btn-gradient disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Pay ${amount.toFixed(2)}</span>
          </>
        )}
      </button>
    </form>
  );
}
