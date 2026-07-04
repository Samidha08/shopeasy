import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearCart, selectCartItems, selectCartSummary } from '../cart';
import { addOrder } from '../orders';
import { selectAuthUser } from '../auth';
import { ROUTES, orderConfirmation } from '../../routes/routePaths';
import { openRazorpayCheckout } from '../../utils/razorpay';
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';
import {
  initialAddressValues,
  normalizeAddress,
  validateAddress,
} from './checkoutSchema';

function createOrderId() {
  return `SE-${Date.now()}`;
}

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const summary = useSelector(selectCartSummary);
  const user = useSelector(selectAuthUser);
  const [step, setStep] = useState('address');
  const [addressValues, setAddressValues] = useState(initialAddressValues);
  const [address, setAddress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setAddressValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateAddress(addressValues);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setAddress(normalizeAddress(addressValues));
    setStep('payment');
  };

  const handlePaymentSuccess = (response) => {
    const orderId = createOrderId();
    const order = {
      id: orderId,
      items,
      address,
      paymentId: response.razorpay_payment_id,
      amount: summary.finalTotal,
      createdAt: new Date().toISOString(),
      status: 'Paid',
    };
    

    dispatch(addOrder(order));
    dispatch(clearCart());
    setIsProcessing(false);
    toast.success('Payment successful. Order placed.');
    navigate(orderConfirmation(orderId), { replace: true });
  };

  const handleDemoSuccess = () => {
  handlePaymentSuccess({
    razorpay_payment_id: `pay_demo_${Date.now()}`,
  });
};

  // const handlePaymentError = () => {
  //   setIsProcessing(false);
  //   toast.error('Payment was not completed. Your cart is unchanged.');
  // };

  const handlePaymentError = () => {
  setIsProcessing(false);

  const shouldContinue = window.confirm(
    'Payment could not be completed in Test Mode. Continue with Demo Payment Success?'
  );

  if (shouldContinue) {
    handleDemoSuccess();
    return;
  }

  toast.error('Payment was cancelled. Your cart is unchanged.');
};

  const handlePayNow = () => {
    if (!address) {
      setStep('address');
      return;
    }

    setIsProcessing(true);
    openRazorpayCheckout({
      amount: summary.finalTotal,
      name: address.fullName || user?.firstName || user?.username,
      email: user?.email,
      contact: address.mobileNumber,
      onSuccess: handlePaymentSuccess,
      onFailure: handlePaymentError,
      onDismiss: handlePaymentError,
    });
  };

  return (
    <section className="checkout-page">
      <div className="checkout-page__header">
        <span className="landing-section__eyebrow">Checkout</span>
        <h1 className="checkout-page__title">Complete your order</h1>
        <p className="checkout-page__description">
          Add your delivery details, review your cart, and pay securely with
          Razorpay.
        </p>
      </div>

      {step === 'address' ? (
        <AddressStep
          values={addressValues}
          errors={errors}
          isSubmitting={isProcessing}
          onChange={handleAddressChange}
          onSubmit={handleAddressSubmit}
        />
      ) : (
        <PaymentStep
          address={address}
          items={items}
          summary={summary}
          isProcessing={isProcessing}
          onBack={() => setStep('address')}
          onPayNow={handlePayNow}
        />
      )}
    </section>
  );
}

export default CheckoutPage;
