import { useState } from 'react';
import './App.css';

const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
];

const initialForm = {
  email: '', fullName: '', address: '', address2: '',
  city: '', province: '', postalCode: '', agree: false,
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    // Keep a snapshot: editing the form only changes the result after Submit.
    setSubmitted({ ...form });
  }

  return (
    <main>
      <form className="entry-form" onSubmit={handleSubmit}>
        <h1>Data Entry Form</h1>
        <div className="form-row two-columns">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter email"
              autoComplete="email" required value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="fullName">Name</label>
            <input id="fullName" name="fullName" placeholder="Full Name"
              autoComplete="name" required pattern=".*\S.*" value={form.fullName} onChange={handleChange} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="address">Address</label>
          <input id="address" name="address" placeholder="1234 Main St"
            autoComplete="address-line1" required pattern=".*\S.*" value={form.address} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="address2">Address 2</label>
          <input id="address2" name="address2" placeholder="Apartment, studio, or floor"
            autoComplete="address-line2" value={form.address2} onChange={handleChange} />
        </div>
        <div className="form-row three-columns">
          <div className="field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" autoComplete="address-level2" required
              pattern=".*\S.*" value={form.city} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="province">Province</label>
            <select id="province" name="province" autoComplete="address-level1"
              required value={form.province} onChange={handleChange}>
              <option value="">Choose...</option>
              {provinces.map(province => <option key={province}>{province}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="postalCode">Postal Code</label>
            <input id="postalCode" name="postalCode" autoComplete="postal-code" required
              value={form.postalCode} onChange={handleChange} />
          </div>
        </div>
        <label className="agreement" htmlFor="agree">
          <input id="agree" name="agree" type="checkbox" required
            checked={form.agree} onChange={handleChange} />
          Agree Terms &amp; Condition?
        </label>
        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <section className="result" aria-label="Submitted information" aria-live="polite">
          <dl>
            <dt>Email:</dt><dd>{submitted.email}</dd>
            <dt>Full Name:</dt><dd>{submitted.fullName}</dd>
            <dt>Address:</dt><dd>{submitted.address}</dd>
            {submitted.address2 && <><dt>Address 2:</dt><dd>{submitted.address2}</dd></>}
            <dt>City:</dt><dd>{submitted.city}</dd>
            <dt>Province:</dt><dd>{submitted.province}</dd>
            <dt>Postal Code:</dt><dd>{submitted.postalCode}</dd>
            <dt>Agree Terms &amp; Condition?:</dt><dd>{submitted.agree ? 'Yes' : 'No'}</dd>
          </dl>
        </section>
      )}
    </main>
  );
}
