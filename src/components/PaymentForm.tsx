import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  loading?: boolean;
}



export default function PaymentForm({ amount, onSuccess, onError, loading = false }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardErrors, setCardErrors] = useState<{[key: string]: string}>({});

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ').substr(0, 19) : '';
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    // Clear error when user starts typing
    if (cardErrors.cardNumber) {
      setCardErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  // Handle expiry date input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    // Clear error when user starts typing
    if (cardErrors.cardExpiry) {
      setCardErrors(prev => ({ ...prev, cardExpiry: '' }));
    }
  };

  // Handle CVC input
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substr(0, 3);
    setCvc(value);
    // Clear error when user starts typing
    if (cardErrors.cardCvc) {
      setCardErrors(prev => ({ ...prev, cardCvc: '' }));
    }
  };

  // Validation functions
  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiryDate = (expiry: string): boolean => {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    const year = parseInt(match[2]) + 2000;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;

    return true;
  };

  const validateCVC = (cvc: string): boolean => {
    return /^\d{3}$/.test(cvc);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setCardErrors({});

    // Validate all fields
    const errors: {[key: string]: string} = {};

    if (!validateCardNumber(cardNumber)) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!validateExpiryDate(expiryDate)) {
      errors.cardExpiry = 'Please enter a valid expiry date (MM/YY) that is not expired';
    }

    if (!validateCVC(cvc)) {
      errors.cardCvc = 'Please enter a valid 3-digit security code';
    }

    // If there are validation errors, show them
    if (Object.keys(errors).length > 0) {
      setCardErrors(errors);
      setIsProcessing(false);
      return;
    }

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // All validations passed - successful payment
      onSuccess({
        id: 'ord_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'succeeded',
        amount: amount * 100,
        currency: 'usd',
        message: 'Payment processed successfully! Check your email for order confirmation and shipping updates.'
      });

    } catch (err) {
      onError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
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
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              cardErrors.cardNumber ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            maxLength={19}
          />
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
          <input
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={handleExpiryChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              cardErrors.cardExpiry ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            maxLength={5}
          />
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
          <input
            type="text"
            placeholder="123"
            value={cvc}
            onChange={handleCvcChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              cardErrors.cardCvc ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            maxLength={3}
          />
          {cardErrors.cardCvc && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{cardErrors.cardCvc}</span>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || loading}
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
