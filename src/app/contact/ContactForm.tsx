'use client';

import { useState } from 'react';
import Reveal from '../../components/Reveal';

const ENQUIRY_EMAIL = 'sales@extremeadventure.lk';

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    activity: '',
    groupSize: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = form.activity ? `Enquiry: ${form.activity}` : 'Enquiry via website';
    const body = [
      `Name: ${form.fullName}`,
      `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      form.preferredDate && `Preferred date: ${form.preferredDate}`,
      form.activity && `Activity: ${form.activity}`,
      form.groupSize && `Group size: ${form.groupSize}`,
      '',
      'Message:',
      form.message || '(none)',
    ]
      .filter(Boolean)
      .join('\n');
    window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Reveal className="booking-form">
      <form onSubmit={handleSubmit}>
        <div className="field-row two">
          <div>
            <label htmlFor="fname">Full Name</label>
            <input
              id="fname"
              type="text"
              placeholder="Your full name"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="femail">Email</label>
            <input
              id="femail"
              type="email"
              placeholder="you@email.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="field-row two">
          <div>
            <label htmlFor="fphone">Phone</label>
            <input
              id="fphone"
              type="tel"
              placeholder="+94 7X XXX XXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="fdate">Preferred Date</label>
            <input
              id="fdate"
              type="text"
              placeholder="DD / MM / YYYY"
              value={form.preferredDate}
              onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
            />
          </div>
        </div>

        <div className="field-row two">
          <div>
            <label htmlFor="factivity">Activity</label>
            <select
              id="factivity"
              value={form.activity}
              onChange={(e) => setForm({ ...form, activity: e.target.value })}
            >
              <option value="">Select an experience</option>
              <option>Abseiling</option>
              <option>Hiking</option>
              <option>Camping &amp; Trekking</option>
              <option>Rafting</option>
              <option>Canyoning</option>
              <option>Kayaking</option>
              <option>River Expedition</option>
            </select>
          </div>
          <div>
            <label htmlFor="fgroup">Group Size</label>
            <input
              id="fgroup"
              type="number"
              min="1"
              placeholder="e.g. 6"
              value={form.groupSize}
              onChange={(e) => setForm({ ...form, groupSize: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="fmessage">Message</label>
          <textarea
            id="fmessage"
            placeholder="Tell us about your experience level, or any questions"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Send Enquiry
        </button>
        <p className="form-note">
          We reply within one business day. For urgent or same-day
          bookings, please call or WhatsApp.
        </p>
      </form>
    </Reveal>
  );
}
