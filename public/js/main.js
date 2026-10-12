// Aura Luxury Villas - Client Interactions
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation on Scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  const siteHeader = document.querySelector('.site-header');
  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      siteHeader?.classList.toggle('menu-open', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      toggleBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        siteHeader?.classList.remove('menu-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // 3. Villa Details Price Estimator
  const checkIn = document.getElementById('calcCheckIn');
  const checkOut = document.getElementById('calcCheckOut');
  const priceDisplay = document.getElementById('calcTotalPrice');
  const nightsDisplay = document.getElementById('calcNights');
  const pricePerNightEl = document.getElementById('villaBasePrice');

  if (checkIn && checkOut && priceDisplay && pricePerNightEl) {
    const basePrice = Number(pricePerNightEl.dataset.price || 0);

    function updatePrice() {
      if (checkIn.value && checkOut.value) {
        const d1 = new Date(checkIn.value);
        const d2 = new Date(checkOut.value);
        const timeDiff = d2.getTime() - d1.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (nights > 0) {
          const total = nights * basePrice;
          const taxAndService = Math.round(total * 0.12);
          const grandTotal = total + taxAndService;

          if (nightsDisplay) nightsDisplay.textContent = `${nights} Nights (incl. 12% luxury tax & concierge)`;
          priceDisplay.textContent = `$${grandTotal.toLocaleString()}`;
        } else {
          if (nightsDisplay) nightsDisplay.textContent = 'Please choose a check-out date after check-in';
        }
      }
    }

    checkIn.addEventListener('change', updatePrice);
    checkOut.addEventListener('change', updatePrice);
  }

  // Send the villa reservation details directly to WhatsApp.
  const bookingForm = document.querySelector('[data-booking-form]');
  const sendBookingWhatsApp = document.querySelector('[data-send-booking-whatsapp]');
  if (bookingForm && sendBookingWhatsApp) {
    sendBookingWhatsApp.addEventListener('click', () => {
      if (!bookingForm.reportValidity()) return;

      const booking = new FormData(bookingForm);
      const message = [
        'Hello, I would like to enquire about booking this villa.',
        `Villa: ${booking.get('villa_title')}`,
        `Check-in: ${booking.get('check_in')}`,
        `Check-out: ${booking.get('check_out')}`,
        `Guests: ${booking.get('guests_count')}`,
        `Name: ${booking.get('guest_name')}`,
        `Email: ${booking.get('email')}`,
        `Phone / WhatsApp: ${booking.get('phone')}`,
        `Special requests: ${booking.get('message') || 'None'}`
      ].join('\n');

      const whatsappUrl = `https://wa.me/917972540923?text=${encodeURIComponent(message)}`;
      window.location.assign(whatsappUrl);
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  const sendContactWhatsApp = document.querySelector('[data-send-contact-whatsapp]');
  if (contactForm && sendContactWhatsApp) {
    sendContactWhatsApp.addEventListener('click', () => {
      if (!contactForm.reportValidity()) return;

      const inquiry = new FormData(contactForm);
      const message = [
        'Hello, I would like to enquire about booking a villa.',
        `Name: ${inquiry.get('name')}`,
        `Email: ${inquiry.get('email')}`,
        `Phone / WhatsApp: ${inquiry.get('phone')}`,
        `Villa / Destination: ${inquiry.get('villa_name') || 'Not specified'}`,
        `Message: ${inquiry.get('message')}`
      ].join('\n');

      const whatsappUrl = `https://wa.me/917972540923?text=${encodeURIComponent(message)}`;
      window.location.assign(whatsappUrl);
    });
  }

  // 4. Dismiss toast notifications
  const toasts = document.querySelectorAll('.toast-banner');
  toasts.forEach(toast => {
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 400);
    }, 6000);
  });
});
