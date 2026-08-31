// src/lib/payhere.ts
//
// Shared redirect logic for PayHere checkout. Both BookingForm.tsx (quick pay from the
// experience page) and payment/page.tsx (the review step) need to do the exact same thing:
// call our /api/checkout/payhere route to get a signed hash + fields, then build and submit
// a real HTML form POST to PayHere's checkout URL (PayHere requires an actual form submission,
// not a redirect to a URL with query params). Keeping this in one place means a future change
// to the checkout flow only needs updating here, not in two components separately.

export async function redirectToPayHere(bookingId: string): Promise<{ error?: string }> {
  try {
    const res = await fetch('/api/checkout/payhere', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });

    const { checkoutUrl, fields, error } = await res.json();

    if (error || !checkoutUrl) {
      return { error: error || 'Could not start payment. Please try again.' };
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = checkoutUrl;
    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();

    return {};
  } catch {
    return { error: 'Could not start payment. Please try again.' };
  }
}
