export const openRazorpayCheckout = ({
  amount,
  name,
  email,
  contact,
  onSuccess,
  onFailure,
  onDismiss,
}) => {
  if (!window.Razorpay) {
    onFailure?.();
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: Math.round(amount * 100),
    currency: 'INR',
    name: 'ShopEasy',
    description: 'Order Payment',
    handler: function (response) {
      onSuccess(response);
    },
    prefill: {
      name,
      email,
      contact,
    },
    modal: {
      ondismiss: function () {
        onDismiss?.();
      },
    },
    theme: {
      color: '#5680E9',
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.on('payment.failed', function () {
    onFailure?.();
  });
  paymentObject.open();
};
