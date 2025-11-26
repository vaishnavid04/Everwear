import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import PaymentForm from './PaymentForm';
import PaymentStatus from './PaymentStatus';
import { CustomerDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: any[];
  onSuccess: (paymentIntent: unknown, customerDetails: CustomerDetails) => void;
}

type CheckoutStep = 'details' | 'payment' | 'success' | 'error' | 'processing';

export default function CheckoutModal({ isOpen, onClose, total, items, onSuccess }: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('details');
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleCustomerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = (intent: unknown) => {
    setCurrentStep('processing');
    const intentObj = intent as { message?: string };
    setSuccessMessage(intentObj.message || 'Payment processed successfully!');

    // Simulate processing time
    setTimeout(() => {
      setCurrentStep('success');
      setTimeout(() => {
        onSuccess(intent, customerDetails);
        onClose();
        resetModal();
      }, 3000);
    }, 2000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setCurrentStep('error');
  };

  const handleRetryPayment = () => {
    setError('');
    setCurrentStep('payment');
  };

  const resetModal = () => {
    setCurrentStep('details');
    setCustomerDetails({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
    });
    setError('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  if (!isOpen) return null;

  // Show payment status overlay for processing, success, and error states
  if (['processing', 'success', 'error'].includes(currentStep)) {
    return (
      <PaymentStatus
        status={currentStep as 'processing' | 'success' | 'error'}
        message={currentStep === 'success' ? successMessage : error}
        onRetry={handleRetryPayment}
        onClose={handleClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-primary text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          {currentStep === 'payment' && (
            <button
              onClick={() => setCurrentStep('details')}
              className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {currentStep === 'details' && 'Shipping Details'}
              {currentStep === 'payment' && 'Payment Information'}
            </h2>
            <p className="text-white/80">
              {currentStep === 'details' && 'Please provide your shipping information'}
              {currentStep === 'payment' && 'Secure payment processing'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentStep === 'details' ? 'bg-white' : 'bg-white/50'
              }`} />
              <div className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                currentStep === 'payment' ? 'bg-white' : 'bg-white/30'
              }`} />
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentStep === 'payment' ? 'bg-white' : 'bg-white/50'
              }`} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {currentStep === 'details' && (
            <form onSubmit={handleCustomerDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={customerDetails.firstName}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={customerDetails.lastName}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={customerDetails.email}
                  onChange={(e) =>
                    setCustomerDetails({ ...customerDetails, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={customerDetails.address}
                  onChange={(e) =>
                    setCustomerDetails({ ...customerDetails, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={customerDetails.city}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={customerDetails.zipCode}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, zipCode: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-gradient mt-6"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {currentStep === 'payment' && (
            <PaymentForm
              amount={total}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              cartItems={items}
              customerDetails={customerDetails}
            />
          )}


        </div>
      </div>
    </div>
  );
}
