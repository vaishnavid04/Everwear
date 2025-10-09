import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Loader } from 'lucide-react';

interface PaymentStatusProps {
  status: 'processing' | 'success' | 'error' | 'cancelled';
  message?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export default function PaymentStatus({ status, message, onRetry, onClose }: PaymentStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <Loader className="w-12 h-12 animate-spin" />,
          title: 'Processing Payment',
          description: 'Please wait while we process your payment...',
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12" />,
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          titleColor: 'text-green-900'
        };
      case 'error':
        return {
          icon: <XCircle className="w-12 h-12" />,
          title: 'Payment Failed',
          description: message || 'There was an error processing your payment.',
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900'
        };
      case 'cancelled':
        return {
          icon: <AlertCircle className="w-12 h-12" />,
          title: 'Payment Cancelled',
          description: 'Your payment was cancelled.',
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-900'
        };
      default:
        return {
          icon: <AlertCircle className="w-12 h-12" />,
          title: 'Unknown Status',
          description: 'Something went wrong.',
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-900'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        <div className={`${config.bgColor} p-8 rounded-t-2xl text-center`}>
          <div className={`${config.iconColor} mb-4 flex justify-center`}>
            {config.icon}
          </div>
          <h2 className={`text-2xl font-heading font-bold ${config.titleColor} mb-2`}>
            {config.title}
          </h2>
          <p className={`${config.titleColor} opacity-80`}>
            {config.description}
          </p>
        </div>

        <div className="p-6">
          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Common Solutions:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Check your card details and try again</li>
                  <li>• Ensure you have sufficient funds</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={onRetry}
                  className="flex-1 btn-gradient"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-neutral-200 text-neutral-700 py-3 px-4 rounded-lg font-semibold hover:bg-neutral-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700 text-sm">
                  You will receive a confirmation email shortly with your order details.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full btn-gradient"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {status === 'cancelled' && (
            <div className="flex space-x-3">
              <button
                onClick={onRetry}
                className="flex-1 btn-gradient"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-neutral-200 text-neutral-700 py-3 px-4 rounded-lg font-semibold hover:bg-neutral-300 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  Please do not close this window or refresh the page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
