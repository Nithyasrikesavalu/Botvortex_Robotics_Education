import { API_URL } from "../../config/api";
import React, { useState } from "react";
import { ArrowLeft, Coins, CreditCard, Zap, Crown, Sparkles, Check, Lock, QrCode, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

// UPI Payment Component
const UPIPayment = ({ amount, onSuccess, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");

  const handleUPIPayment = async () => {
    if (!upiId) return;

    setIsProcessing(true);
    // Simulate UPI payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="bg-[#0F1B2E] border border-[#1E2A40] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Smartphone className="w-6 h-6 text-[#00C3FF]" />
        <h3 className="text-xl font-bold text-white">UPI Payment</h3>
      </div>

      <div className="space-y-6">
        {/* UPI ID Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            UPI ID
          </label>
          <input
            type="text"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full bg-[#0B1426] border border-[#1E2A40] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter your UPI ID (e.g., username@paytm, username@ybl)
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-[#0B1426] border border-[#1E2A40] rounded-lg p-6 text-center">
          <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
            <QrCode className="w-16 h-16 text-gray-800" />
          </div>
          <p className="text-gray-300 text-sm mb-2">Scan QR Code to Pay</p>
          <p className="text-[#00C3FF] font-semibold">₹{amount}</p>
        </div>

        {/* Payment Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUPIPayment}
            disabled={!upiId || isProcessing}
            className="w-full bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing UPI Payment...
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5" />
                Pay ₹{amount} via UPI
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full bg-[#1a2333] border border-[#1E2A40] text-gray-300 py-3 px-6 rounded-lg font-semibold hover:border-[#8A5DFF] hover:text-white transition-all"
          >
            Back to Payment Methods
          </button>
        </div>
      </div>
    </div>
  );
};

// Card Payment Component
const CardPayment = ({ amount, onSuccess, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  const handleCardPayment = async () => {
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) return;

    setIsProcessing(true);
    // Simulate card payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="bg-[#0F1B2E] border border-[#1E2A40] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-[#00C3FF]" />
        <h3 className="text-xl font-bold text-white">Card Payment</h3>
      </div>

      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Number
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            className="w-full bg-[#0B1426] border border-[#1E2A40] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:outline-none transition-colors"
            maxLength="19"
          />
        </div>

        {/* Card Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Holder Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardDetails.name}
            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            className="w-full bg-[#0B1426] border border-[#1E2A40] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:outline-none transition-colors"
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              className="w-full bg-[#0B1426] border border-[#1E2A40] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:outline-none transition-colors"
              maxLength="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              className="w-full bg-[#0B1426] border border-[#1E2A40] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:outline-none transition-colors"
              maxLength="3"
            />
          </div>
        </div>

        {/* Accepted Cards */}
        <div className="flex items-center gap-4 pt-2">
          <span className="text-sm text-gray-400">We accept:</span>
          <div className="flex gap-2">
            <div className="w-8 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">Visa</div>
            <div className="w-8 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">MC</div>
            <div className="w-8 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">Rupay</div>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleCardPayment}
            disabled={!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv || isProcessing}
            className="w-full bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Card Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay ₹{amount}
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full bg-[#1a2333] border border-[#1E2A40] text-gray-300 py-3 px-6 rounded-lg font-semibold hover:border-[#8A5DFF] hover:text-white transition-all"
          >
            Back to Payment Methods
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const coinPackages = [
    {
      id: 1,
      coins: 100,
      price: 99,
      popular: false,
      bonus: 0,
      savings: 0,
    },
    {
      id: 2,
      coins: 250,
      price: 199,
      popular: true,
      bonus: 25,
      savings: 10,
    },
    {
      id: 3,
      coins: 500,
      price: 399,
      popular: false,
      bonus: 75,
      savings: 20,
    },
    {
      id: 4,
      coins: 1000,
      price: 699,
      popular: false,
      bonus: 200,
      savings: 35,
    },
    {
      id: 5,
      coins: 2500,
      price: 1299,
      popular: false,
      bonus: 750,
      savings: 50,
    },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay with Visa, Mastercard, or Rupay",
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: Smartphone,
      description: "Pay using UPI apps like GPay, PhonePe, Paytm",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: Zap,
      description: "Pay with your PayPal account",
    },
  ];

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "/signup";
        return;
      }

      const totalCoins = selectedPackage.coins + (selectedPackage.bonus || 0);

      const response = await fetch(`${API_URL}/student/add-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          coins: totalCoins,
          amount: selectedPackage.price,
          paymentMethod: paymentMethod,
          packageId: selectedPackage.id
        })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update coins balance.");
      }
    } catch (error) {
      console.error("Coin update error:", error);
      alert("Server error while updating coins. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    setPaymentMethod(methodId);
    if (selectedPackage) {
      setShowPaymentForm(true);
    }
  };

  const handleBackToMethods = () => {
    setShowPaymentForm(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] to-[#1a2333] flex items-center justify-center p-4">
        <div className="bg-[#0F1B2E] border border-[#1E2A40] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-300 mb-6">
            You've successfully purchased {selectedPackage.coins + selectedPackage.bonus} coins!
          </p>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-[#FFD700] mb-6">
            <Coins className="w-8 h-8" />
            <span>+{selectedPackage.coins + selectedPackage.bonus}</span>
          </div>
          <Link
            to="/index"
            className="w-full bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] to-[#1a2333] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/index"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-white">Get More Rewards</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coin Packages */}
          <div className="lg:col-span-2">
            <div className="bg-[#0F1B2E] border border-[#1E2A40] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Coins className="w-8 h-8 text-[#FFD700]" />
                <h2 className="text-2xl font-bold text-white">Choose Your Rewards Package</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coinPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${selectedPackage?.id === pkg.id
                      ? "border-[#00C3FF] bg-[#00C3FF]/10"
                      : "border-[#1E2A40] bg-[#0B1426] hover:border-[#8A5DFF]"
                      } ${pkg.popular ? "ring-2 ring-[#FFD700]" : ""}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-[#FFD700] text-[#0B1426] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    {pkg.bonus > 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0B1426] px-2 py-1 rounded-full text-xs font-bold">
                        +{pkg.bonus} FREE
                      </div>
                    )}

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Coins className="w-6 h-6 text-[#FFD700]" />
                        <span className="text-2xl font-bold text-white">
                          {pkg.coins.toLocaleString()}
                        </span>
                      </div>

                      {pkg.bonus > 0 && (
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Sparkles className="w-4 h-4 text-[#00C3FF]" />
                          <span className="text-sm text-[#00C3FF] font-semibold">
                            +{pkg.bonus} bonus coins
                          </span>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="text-3xl font-bold text-white">
                          ₹{pkg.price}
                        </div>
                        {pkg.savings > 0 && (
                          <div className="text-sm text-green-400">
                            Save {pkg.savings}%
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-400">
                        ₹{(pkg.price / (pkg.coins + pkg.bonus)).toFixed(2)} per coin
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-[#0F1B2E] border border-[#1E2A40] rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>

              {selectedPackage ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Base Coins:</span>
                    <span className="text-white font-semibold">
                      {selectedPackage.coins.toLocaleString()}
                    </span>
                  </div>

                  {selectedPackage.bonus > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#00C3FF]">Bonus Coins:</span>
                      <span className="text-[#00C3FF] font-semibold">
                        +{selectedPackage.bonus}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[#1E2A40] pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Total Coins:</span>
                      <span className="text-2xl font-bold text-[#FFD700]">
                        {(selectedPackage.coins + selectedPackage.bonus).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-300">Total Amount:</span>
                      <span className="text-white font-bold">₹{selectedPackage.price}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">
                  Select a rewards package to continue
                </p>
              )}
            </div>

            {/* Payment Methods or Payment Form */}
            {!showPaymentForm ? (
              <div className="bg-[#0F1B2E] border border-[#1E2A40] rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Payment Method</h3>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => selectedPackage && handlePaymentMethodSelect(method.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === method.id
                          ? "border-[#00C3FF] bg-[#00C3FF]/10"
                          : "border-[#1E2A40] hover:border-[#8A5DFF]"
                          } ${!selectedPackage ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${paymentMethod === method.id ? "bg-[#00C3FF]" : "bg-[#1E2A40]"
                            }`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{method.name}</div>
                            <div className="text-sm text-gray-400">{method.description}</div>
                          </div>
                          {paymentMethod === method.id && (
                            <Check className="w-5 h-5 text-[#00C3FF]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedPackage && (
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full mt-4 bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-3"
                  >
                    <Lock className="w-5 h-5" />
                    Continue to Payment
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Show UPI Payment Component */}
                {paymentMethod === "upi" && (
                  <UPIPayment
                    amount={selectedPackage?.price}
                    onSuccess={handlePaymentSuccess}
                    onBack={handleBackToMethods}
                  />
                )}

                {/* Show Card Payment Component */}
                {paymentMethod === "card" && (
                  <CardPayment
                    amount={selectedPackage?.price}
                    onSuccess={handlePaymentSuccess}
                    onBack={handleBackToMethods}
                  />
                )}

                {/* PayPal and other methods can be added similarly */}
              </>
            )}

            {/* Security Notice */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Lock className="w-4 h-4" />
                Your payment is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;