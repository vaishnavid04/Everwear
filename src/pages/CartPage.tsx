import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CustomerDetails } from "../types";
import { X, ShoppingBag, CreditCard, Truck, Check, Sparkles, Star, LogIn } from "lucide-react";
import CheckoutModal from "../components/CheckoutModal";

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const { state: authState } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [paymentIntent, setPaymentIntent] = useState<unknown>(null);
  const [orderId] = useState(() => Math.floor(Math.random() * 1000000));

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity === 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: id });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity },
      });
    }
  };

  const handlePaymentSuccess = (intent: unknown, details: CustomerDetails) => {
    setPaymentIntent(intent);
    setCustomerDetails(details);
    setShowCheckout(false);
    setShowOrderConfirmation(true);
  };

  const handleFinishOrder = () => {
    setShowOrderConfirmation(false);
    dispatch({ type: "CLEAR_CART" });
    setPaymentIntent(null);
  };

  const handleCheckoutClick = () => {
    if (!authState.isAuthenticated) {
      // Save current URL to return after login
      localStorage.setItem('everwear_return_url', '/cart');
      navigate('/login');
    } else {
      setShowCheckout(true);
    }
  };

  if (state.items.length === 0 && !showOrderConfirmation) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="relative mb-8">
            <ShoppingBag className="w-24 h-24 mx-auto text-neutral-400" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-float" />
            </div>
          </div>
          <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items yet. Start shopping to fill your cart with amazing products!
          </p>
          <a
            href="/"
            className="btn-gradient inline-flex items-center space-x-2"
          >
            <span>Start Shopping</span>
            <Star className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-heading font-bold text-neutral-900 mb-4">Shopping Cart</h1>
          <p className="text-neutral-600 text-lg">Review your items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item, index) => (
              <div
                key={item.id}
                className="card-gradient rounded-xl overflow-hidden card-hover animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center p-6">
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{item.quantity}</span>
                    </div>
                  </div>
                  <div className="flex-1 ml-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading font-semibold text-neutral-900 text-lg">{item.name}</h3>
                        <p className="text-xl font-bold text-gradient-primary mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                        {item.designFile && (
                          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-accent text-white">
                            <Sparkles className="w-4 h-4 mr-1" />
                            Custom Design: {item.designFile}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                        }
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-4 mt-6">
                      <div className="flex items-center space-x-3 bg-neutral-100 rounded-lg p-1">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-white hover:bg-gradient-primary rounded-md transition-all duration-200"
                        >
                          -
                        </button>
                        <span className="font-semibold text-neutral-900 min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-white hover:bg-gradient-primary rounded-md transition-all duration-200"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-lg font-bold text-neutral-900">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-gradient p-8 rounded-xl h-fit animate-slideUp" style={{ animationDelay: '200ms' }}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2">Order Summary</h2>
              <p className="text-neutral-600">Review your order details</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-neutral-600">
                <span className="font-medium">Subtotal ({state.items.length} items)</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="font-medium">Shipping</span>
                <span className="font-semibold">{total > 100 ? "Free" : "$10.00"}</span>
              </div>
              {total > 100 && (
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Free shipping applied!</span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between font-bold text-xl text-neutral-900">
                  <span>Total</span>
                  <span className="text-gradient-primary">${(total > 100 ? total : total + 10).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full btn-gradient flex items-center justify-center space-x-3 text-lg"
            >
              {authState.isAuthenticated ? (
                <>
                  <CreditCard size={24} />
                  <span>Secure Checkout</span>
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  <span>Login to Checkout</span>
                </>
              )}
            </button>

            {!authState.isAuthenticated && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                  <LogIn className="w-4 h-4" />
                  <span>Create an account or login to save your cart and checkout securely</span>
                </div>
              </div>
            )}

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        total={total > 100 ? total : total + 10}
        items={state.items}
        onSuccess={handlePaymentSuccess}
      />

      {/* Enhanced Order Confirmation Modal */}
      {showOrderConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="bg-gradient-primary text-white p-6 rounded-t-2xl text-center relative">
              {/* Close Button */}
              <button
                onClick={handleFinishOrder}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-heading font-bold mb-2">
                Order Confirmed!
              </h2>
              <p className="text-white/90">Thank you for your purchase</p>
              <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-lg">
                <p className="text-sm font-mono">Order #{paymentIntent?.id || orderId}</p>
              </div>
            </div>

            <div className="p-6">
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-heading font-semibold text-neutral-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <div>
                        <p className="font-medium text-neutral-900">{item.name}</p>
                        <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                        {item.designFile && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            <p className="text-xs text-yellow-600">Custom Design: {item.designFile}</p>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-neutral-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{total > 100 ? "Free" : "$10.00"}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-2">
                    <div className="flex justify-between font-bold text-lg text-neutral-900">
                      <span>Total Paid</span>
                      <span className="text-gradient-primary">${(total > 100 ? total : total + 10).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="mb-6">
                <h3 className="font-heading font-semibold text-neutral-900 mb-3">Shipping Details</h3>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="font-medium text-neutral-900">
                    {customerDetails.firstName} {customerDetails.lastName}
                  </p>
                  <p className="text-neutral-600">{customerDetails.email}</p>
                  <p className="text-neutral-600">
                    {customerDetails.address}
                  </p>
                  <p className="text-neutral-600">
                    {customerDetails.city}, {customerDetails.zipCode}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleFinishOrder}
                className="w-full btn-gradient flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
