import RegisterForm from './RegisterForm';

function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="landing-section__eyebrow">Account</span>
          <h1 className="auth-card__title">Create an account</h1>
        </div>

        <RegisterForm />
      </div>
    </section>
  );
}

export default RegisterPage;
