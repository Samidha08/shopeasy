import { addressFields } from './checkoutSchema';

function AddressStep({
  values,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  return (
    <form className="checkout-form" onSubmit={onSubmit} noValidate>
      <div className="checkout-section__header">
        <span className="landing-section__eyebrow">Step 1</span>
        <h2 className="checkout-section__title">Delivery address</h2>
      </div>

      <div className="checkout-form__grid">
        {addressFields.map((field) => (
          <label
            key={field.name}
            className={
              field.name.includes('addressLine')
                ? 'checkout-form__field checkout-form__field--wide'
                : 'checkout-form__field'
            }
          >
            <span className="checkout-form__label">
              {field.label}
              {!field.required ? (
                <span className="checkout-form__optional"> Optional</span>
              ) : null}
            </span>
            <input
              className="checkout-form__input"
              type={field.type}
              name={field.name}
              value={values[field.name]}
              onChange={onChange}
              autoComplete={field.autoComplete}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors[field.name])}
            />
            {errors[field.name] ? (
              <span className="checkout-form__error">{errors[field.name]}</span>
            ) : null}
          </label>
        ))}
      </div>

      <button type="submit" className="primary-button checkout-form__button">
        Continue to Payment
      </button>
    </form>
  );
}

export default AddressStep;
