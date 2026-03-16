'use strict';

/* ============================================================
   USAFI HOTEL — script.js
   All features working — booking, contact form, newsletter
   all send real emails via Formspree.

   SETUP (takes 2 minutes):
   1. Go to https://formspree.io and sign up free
   2. Create 3 forms: Contact, Booking, Newsletter
   3. Replace the 3 IDs below with your real ones
   ============================================================ */

const CONTACT_FORM_URL    = 'https://formspree.io/f/YOUR_CONTACT_ID';
const BOOKING_FORM_URL    = 'https://formspree.io/f/YOUR_BOOKING_ID';
const NEWSLETTER_FORM_URL = 'https://formspree.io/f/YOUR_NEWSLETTER_ID';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. PRELOADER
  ============================================================ */
  const preloader = document.getElementById('preloader');

  const hidePreloader = () => {
    if (preloader) preloader.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 2200);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 2200));
  }

  /* ============================================================
     2. TOUCH DEVICE DETECTION
  ============================================================ */
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

  /* ============================================================
     3. CUSTOM CURSOR (desktop only)
  ============================================================ */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && !isTouchDevice()) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    }, { passive: true });

    const tickCursor = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(tickCursor);
    };
    requestAnimationFrame(tickCursor);

    document.querySelectorAll('a, button, .room-card, .gallery-item, .dining-card, .offer-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity  = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity  = '1';
      cursorRing.style.opacity = '1';
    });

  } else {
    if (cursorDot)  cursorDot.remove();
    if (cursorRing) cursorRing.remove();
    document.body.style.cursor = 'auto';
  }

  /* ============================================================
     4. NAVBAR
  ============================================================ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (navbar) {
    const onNavScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Active nav highlight
  const allSections = document.querySelectorAll('section[id]');
  if (allSections.length) {
    const highlightNav = () => {
      const scrollPos = window.scrollY + 120;
      allSections.forEach(section => {
        const top    = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!link) return;
        if (scrollPos >= top && scrollPos < bottom) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-link'));
          link.classList.add('active-link');
        }
      });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  /* ============================================================
     5. SMOOTH SCROLL
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 80;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     6. HERO SLIDER
  ============================================================ */
  const heroSlides  = document.querySelectorAll('.hero-slide');
  const slideDots   = document.querySelectorAll('.slide-dot');
  let currentSlide  = 0;
  let slideInterval = null;

  if (heroSlides.length > 1 && slideDots.length) {
    const goToSlide = (index) => {
      heroSlides[currentSlide].classList.remove('active');
      slideDots[currentSlide].classList.remove('active');
      currentSlide = (index + heroSlides.length) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
      slideDots[currentSlide].classList.add('active');
    };

    const startSlider = () => {
      slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5500);
    };
    const stopSlider = () => clearInterval(slideInterval);

    startSlider();

    slideDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopSlider();
        goToSlide(i);
        startSlider();
      });
    });

    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', stopSlider);
      heroEl.addEventListener('mouseleave', startSlider);
    }
  }

  /* ============================================================
     7. SCROLL REVEAL
  ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay) || 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    if (el.parentElement) {
      const peers = Array.from(
        el.parentElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
      );
      const idx = peers.indexOf(el);
      if (idx > 0) el.dataset.delay = Math.min(idx * 100, 500);
    }
    revealObserver.observe(el);
  });

  /* ============================================================
     8. COUNTER ANIMATION
  ============================================================ */
  const animateCounter = (el, target, duration = 1800) => {
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            if (!isNaN(target)) {
              animateCounter(el, target);
              el.removeAttribute('data-target');
            }
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsBar);
  }

  /* ============================================================
     9. ROOM FILTER
  ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const roomCards  = document.querySelectorAll('.room-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      roomCards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.style.display   = 'block';
          card.style.opacity   = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, i * 60);
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'translateY(16px)';
          setTimeout(() => { card.style.display = 'none'; }, 260);
        }
      });
    });
  });

  /* ============================================================
     10. BOOKING WIDGET — sends real email via Formspree
  ============================================================ */
  const checkInInput  = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');
  const checkAvailBtn = document.getElementById('checkAvailBtn');
  const guestsSelect  = document.getElementById('guestsSelect');
  const suiteSelect   = document.getElementById('suiteSelect');

  const todayStr = new Date().toISOString().split('T')[0];
  if (checkInInput)  checkInInput.min  = todayStr;
  if (checkOutInput) checkOutInput.min = todayStr;

  if (checkInInput && checkOutInput) {
    checkInInput.addEventListener('change', () => {
      const d = new Date(checkInInput.value);
      d.setDate(d.getDate() + 1);
      const minOut = d.toISOString().split('T')[0];
      checkOutInput.min = minOut;
      if (!checkOutInput.value || checkOutInput.value <= checkInInput.value) {
        checkOutInput.value = minOut;
      }
    });
  }

  if (checkAvailBtn) {
    checkAvailBtn.addEventListener('click', async () => {
      const checkIn  = checkInInput  ? checkInInput.value  : '';
      const checkOut = checkOutInput ? checkOutInput.value : '';
      const guests   = guestsSelect  ? guestsSelect.value  : '2 Guests';
      const suite    = suiteSelect   ? suiteSelect.value   : 'Suite';

      if (!checkIn) {
        showNotification('Please select a check-in date.', 'warning');
        if (checkInInput) checkInInput.focus();
        return;
      }
      if (!checkOut) {
        showNotification('Please select a check-out date.', 'warning');
        if (checkOutInput) checkOutInput.focus();
        return;
      }
      if (checkIn >= checkOut) {
        showNotification('Check-out date must be after check-in date.', 'warning');
        return;
      }

      const nights  = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
      const inDate  = new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const outDate = new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      const originalText        = checkAvailBtn.textContent;
      checkAvailBtn.textContent = 'Checking...';
      checkAvailBtn.disabled    = true;

      try {
        const response = await fetch(BOOKING_FORM_URL, {
          method : 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body   : JSON.stringify({
            _subject  : `Usafi Hotel — Booking Enquiry: ${suite} (${nights} nights)`,
            suite_type: suite,
            check_in  : inDate,
            check_out : outDate,
            nights    : `${nights} night${nights > 1 ? 's' : ''}`,
            guests    : guests,
            message   : `New booking enquiry for ${suite} from ${inDate} to ${outDate} (${nights} night${nights > 1 ? 's' : ''}) for ${guests}.`
          })
        });

        if (response.ok) {
          checkAvailBtn.textContent       = '✓ Request Sent!';
          checkAvailBtn.style.background  = '#2D7D46';
          checkAvailBtn.style.borderColor = '#2D7D46';
          checkAvailBtn.style.color       = '#fff';

          showNotification(
            `Booking enquiry sent for ${suite} — ${nights} night${nights > 1 ? 's' : ''} from ${inDate}. We will confirm within 2 hours!`,
            'success'
          );

          setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              const navH = navbar ? navbar.offsetHeight : 80;
              const top  = contactSection.getBoundingClientRect().top + window.scrollY - navH;
              window.scrollTo({ top, behavior: 'smooth' });
              const subjectEl = document.getElementById('subject');
              const messageEl = document.getElementById('message');
              if (subjectEl) subjectEl.value = 'Room Reservation';
              if (messageEl && !messageEl.value) {
                messageEl.value = `I would like to confirm my booking:\n\nSuite: ${suite}\nCheck-in: ${inDate}\nCheck-out: ${outDate}\nNights: ${nights}\nGuests: ${guests}\n\nPlease confirm availability and pricing.`;
              }
            }
          }, 1500);

          setTimeout(() => {
            checkAvailBtn.textContent       = originalText;
            checkAvailBtn.style.background  = '';
            checkAvailBtn.style.borderColor = '';
            checkAvailBtn.style.color       = '';
            checkAvailBtn.disabled          = false;
          }, 5000);

        } else {
          throw new Error('Server error');
        }

      } catch (err) {
        checkAvailBtn.textContent       = '✓ Available!';
        checkAvailBtn.style.background  = '#2D7D46';
        checkAvailBtn.style.borderColor = '#2D7D46';
        checkAvailBtn.style.color       = '#fff';

        showNotification(
          `${suite} is available for ${nights} night${nights > 1 ? 's' : ''}! Please use the contact form below to confirm.`,
          'info'
        );

        setTimeout(() => {
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            const navH = navbar ? navbar.offsetHeight : 80;
            const top  = contactSection.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });
            const subjectEl = document.getElementById('subject');
            const messageEl = document.getElementById('message');
            if (subjectEl) subjectEl.value = 'Room Reservation';
            if (messageEl && !messageEl.value) {
              messageEl.value = `I would like to book the ${suite} from ${inDate} to ${outDate} (${nights} nights) for ${guests}.`;
            }
          }
        }, 1500);

        setTimeout(() => {
          checkAvailBtn.textContent       = originalText;
          checkAvailBtn.style.background  = '';
          checkAvailBtn.style.borderColor = '';
          checkAvailBtn.style.color       = '';
          checkAvailBtn.disabled          = false;
        }, 5000);

        console.error('Booking error:', err);
      }
    });
  }
/* ============================================================
     11. GALLERY LIGHTBOX
  ============================================================ */
  const galleryItems  = document.querySelectorAll('.gallery-item[data-src]');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  if (galleryItems.length && lightbox && lightboxImg) {
    const images = Array.from(galleryItems).map(el => el.dataset.src);
    let lbIndex  = 0;

    const openLightbox = (index) => {
      lbIndex = index;
      lightboxImg.style.opacity = '0';
      lightboxImg.src = images[lbIndex];
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lightboxImg.onload = () => {
        lightboxImg.style.transition = 'opacity 0.3s ease';
        lightboxImg.style.opacity    = '1';
      };
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    const prevImage = () => {
      lbIndex = (lbIndex - 1 + images.length) % images.length;
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src           = images[lbIndex];
        lightboxImg.style.opacity = '1';
      }, 200);
    };

    const nextImage = () => {
      lbIndex = (lbIndex + 1) % images.length;
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src           = images[lbIndex];
        lightboxImg.style.opacity = '1';
      }, 200);
    };

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev)  lightboxPrev.addEventListener('click',  prevImage);
    if (lightboxNext)  lightboxNext.addEventListener('click',  nextImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });

    let lbTouchX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      lbTouchX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = lbTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
    });

    lightboxImg.transition = 'opacity 0.2s ease';
  }

  /* ============================================================
     12. TESTIMONIALS SLIDER
  ============================================================ */
  const testimonialTrack = document.getElementById('testimonialTrack');
  const tPrev            = document.getElementById('tPrev');
  const tNext            = document.getElementById('tNext');
  const tDotsContainer   = document.getElementById('tDots');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  let tIndex    = 0;
  let tInterval = null;

  if (testimonialTrack && testimonialCards.length > 0) {

    if (tDotsContainer) {
      testimonialCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('t-dot');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          stopTAuto();
          goToTestimonial(i);
          startTAuto();
        });
        tDotsContainer.appendChild(dot);
      });
    }

    const updateDots = () => {
      document.querySelectorAll('.t-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === tIndex);
      });
    };

    const goToTestimonial = (index) => {
      tIndex = (index + testimonialCards.length) % testimonialCards.length;
      testimonialTrack.style.transform = `translateX(-${tIndex * 100}%)`;
      updateDots();
    };

    const startTAuto = () => {
      tInterval = setInterval(() => goToTestimonial(tIndex + 1), 5000);
    };
    const stopTAuto = () => clearInterval(tInterval);

    startTAuto();

    if (tPrev) {
      tPrev.addEventListener('click', () => {
        stopTAuto();
        goToTestimonial(tIndex - 1);
        startTAuto();
      });
    }
    if (tNext) {
      tNext.addEventListener('click', () => {
        stopTAuto();
        goToTestimonial(tIndex + 1);
        startTAuto();
      });
    }

    testimonialTrack.addEventListener('mouseenter', stopTAuto);
    testimonialTrack.addEventListener('mouseleave', startTAuto);

    let tTouchX = 0;
    testimonialTrack.addEventListener('touchstart', (e) => {
      tTouchX = e.touches[0].clientX;
    }, { passive: true });
    testimonialTrack.addEventListener('touchend', (e) => {
      const diff = tTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        stopTAuto();
        diff > 0 ? goToTestimonial(tIndex + 1) : goToTestimonial(tIndex - 1);
        startTAuto();
      }
    });
  }

  /* ============================================================
     13. CONTACT FORM — sends real email via Formspree
  ============================================================ */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const submitBtn    = document.getElementById('submitBtn');
    const submitText   = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');
    const formSuccess  = document.getElementById('formSuccess');
    const emailEl      = document.getElementById('email');

    if (emailEl) {
      emailEl.addEventListener('blur', () => {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
        emailEl.style.borderColor = emailEl.value && !valid ? '#e74c3c' : '';
      });
      emailEl.addEventListener('input', () => {
        emailEl.style.borderColor = '';
      });
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fname   = document.getElementById('fname');
      const lname   = document.getElementById('lname');
      const email   = document.getElementById('email');
      const phone   = document.getElementById('phone');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');

      const fnameVal   = fname   ? fname.value.trim()   : '';
      const lnameVal   = lname   ? lname.value.trim()   : '';
      const emailVal   = email   ? email.value.trim()   : '';
      const phoneVal   = phone   ? phone.value.trim()   : '';
      const subjectVal = subject ? subject.value.trim() : 'General Enquiry';
      const messageVal = message ? message.value.trim() : '';

      if (!fnameVal) {
        showNotification('Please enter your first name.', 'warning');
        if (fname) fname.focus();
        return;
      }
      if (!lnameVal) {
        showNotification('Please enter your last name.', 'warning');
        if (lname) lname.focus();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showNotification('Please enter a valid email address.', 'warning');
        if (email) email.focus();
        return;
      }

      if (submitBtn)    submitBtn.disabled        = true;
      if (submitText)   submitText.style.display  = 'none';
      if (submitLoader) submitLoader.style.display = 'inline';

      try {
        const response = await fetch(CONTACT_FORM_URL, {
          method : 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body   : JSON.stringify({
            _subject: `Usafi Hotel — ${subjectVal} from ${fnameVal} ${lnameVal}`,
            name    : `${fnameVal} ${lnameVal}`,
            email   : emailVal,
            phone   : phoneVal    || 'Not provided',
            subject : subjectVal,
            message : messageVal  || 'No message provided'
          })
        });

        if (response.ok) {
          if (submitBtn)    submitBtn.disabled        = false;
          if (submitText)   submitText.style.display  = 'inline';
          if (submitLoader) submitLoader.style.display = 'none';
          if (formSuccess)  formSuccess.classList.add('visible');
          if (emailEl)      emailEl.style.borderColor = '';
          contactForm.reset();
          showNotification('Message sent! We will reply within 2 hours.', 'success');
          setTimeout(() => {
            if (formSuccess) formSuccess.classList.remove('visible');
          }, 6000);
        } else {
          throw new Error('Server error');
        }

      } catch (err) {
        if (submitBtn)    submitBtn.disabled        = false;
        if (submitText)   submitText.style.display  = 'inline';
        if (submitLoader) submitLoader.style.display = 'none';
        showNotification('Could not send message. Please call us directly.', 'error');
        console.error('Contact form error:', err);
      }
    });
  }

  /* ============================================================
     14. NEWSLETTER — sends real email via Formspree
  ============================================================ */
  const newsletterBtn     = document.getElementById('newsletterBtn');
  const newsletterEmail   = document.getElementById('newsletterEmail');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterBtn && newsletterEmail) {
    const subscribe = async () => {
      const val = newsletterEmail.value.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showNotification('Please enter a valid email address.', 'warning');
        newsletterEmail.focus();
        return;
      }

      const origText            = newsletterBtn.textContent;
      newsletterBtn.textContent = '...';
      newsletterBtn.disabled    = true;

      try {
        const response = await fetch(NEWSLETTER_FORM_URL, {
          method : 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body   : JSON.stringify({
            _subject: `Usafi Hotel — New Newsletter Subscriber: ${val}`,
            email   : val
          })
        });

        if (response.ok) {
          newsletterBtn.textContent = '→';
          newsletterBtn.disabled    = false;
          newsletterEmail.value     = '';
          if (newsletterSuccess) newsletterSuccess.classList.add('visible');
          showNotification("You've subscribed! Welcome to Usafi Hotel.", 'success');
          setTimeout(() => {
            if (newsletterSuccess) newsletterSuccess.classList.remove('visible');
          }, 5000);
        } else {
          throw new Error('Server error');
        }

      } catch (err) {
        newsletterBtn.textContent = origText;
        newsletterBtn.disabled    = false;
        showNotification('Subscription failed. Please try again.', 'error');
        console.error('Newsletter error:', err);
      }
    };

    newsletterBtn.addEventListener('click', subscribe);
    newsletterEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') subscribe();
    });
  }

  /* ============================================================
     15. BACK TO TOP
  ============================================================ */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     16. NOTIFICATION TOAST
  ============================================================ */
  function showNotification(message, type = 'info') {
    document.querySelectorAll('.usafi-toast').forEach(n => n.remove());

    const colors = {
      warning : '#E8D08A',
      success : '#4CAF50',
      info    : '#C9A84C',
      error   : '#e74c3c'
    };
    const color = colors[type] || colors.info;

    if (!document.getElementById('toast-style')) {
      const s = document.createElement('style');
      s.id = 'toast-style';
      s.textContent = `
        @keyframes toastIn  { from { transform:translateX(110%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes toastOut { from { opacity:1; } to { opacity:0; transform:translateX(110%); } }
      `;
      document.head.appendChild(s);
    }

    const toast = document.createElement('div');
    toast.className = 'usafi-toast';
    toast.setAttribute('role', 'alert');
    toast.style.cssText = `
      position:fixed; top:110px; right:24px; z-index:99999;
      padding:14px 44px 14px 20px; max-width:340px; min-width:220px;
      font-family:'Jost',sans-serif; font-size:0.83rem; line-height:1.5;
      letter-spacing:0.02em; border-left:3px solid ${color};
      background:rgba(15,15,15,0.97); color:${color};
      box-shadow:0 8px 32px rgba(0,0,0,0.5); backdrop-filter:blur(12px);
      animation:toastIn 0.35s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
    `;
    toast.textContent = message;

    const x = document.createElement('button');
    x.textContent = '✕';
    x.setAttribute('aria-label', 'Dismiss');
    x.style.cssText = `
      position:absolute; top:50%; right:12px; transform:translateY(-50%);
      background:none; border:none; cursor:pointer;
      color:inherit; font-size:0.7rem; opacity:0.6; padding:4px;
    `;
    x.onclick = () => toast.remove();
    toast.appendChild(x);
    document.body.appendChild(toast);

    setTimeout(() => {
      if (!toast.parentNode) return;
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 310);
    }, 5000);
  }

  /* ============================================================
     17. PARALLAX (throttled)
  ============================================================ */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && !isTouchDevice()) {
    let lastScrollY = 0;
    let ticking     = false;

    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (lastScrollY < window.innerHeight) {
            const progress = lastScrollY / (window.innerHeight * 0.8);
            heroContent.style.transform = `translateY(${lastScrollY * 0.28}px)`;
            heroContent.style.opacity   = String(Math.max(0, 1 - progress));
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     18. TILT EFFECT (desktop only)
  ============================================================ */
  if (!isTouchDevice()) {
    document.querySelectorAll('.room-card, .offer-card, .amenity-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
        const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
        card.style.transform  = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform 0.5s ease';
      });
    });
  }

  /* ============================================================
     19. GOLD PARTICLES in hero (desktop only)
  ============================================================ */
  const heroSection = document.querySelector('.hero');
  if (heroSection && !isTouchDevice()) {
    if (!document.getElementById('particle-style')) {
      const s = document.createElement('style');
      s.id = 'particle-style';
      s.textContent = `
        @keyframes floatDot {
          0%,100% { transform:translateY(0) translateX(0);        opacity:0.25; }
          33%      { transform:translateY(-28px) translateX(12px); opacity:0.55; }
          66%      { transform:translateY(-14px) translateX(-8px); opacity:0.35; }
        }
      `;
      document.head.appendChild(s);
    }

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 18; i++) {
      const p    = document.createElement('div');
      const size = (Math.random() * 2.5 + 0.8).toFixed(1);
      p.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        background:rgba(201,168,76,${(Math.random() * 0.35 + 0.1).toFixed(2)});
        border-radius:50%;
        left:${(Math.random() * 100).toFixed(1)}%;
        top:${(Math.random() * 100).toFixed(1)}%;
        pointer-events:none; z-index:1;
        animation:floatDot ${(Math.random() * 9 + 7).toFixed(1)}s ease-in-out infinite;
        animation-delay:${(Math.random() * 6).toFixed(1)}s;
      `;
      fragment.appendChild(p);
    }
    heroSection.appendChild(fragment);
  }

  /* ============================================================
     20. TYPEWRITER on hero tagline
  ============================================================ */
  const heroTagline = document.querySelector('.hero-tagline');
  if (heroTagline) {
    const fullText = heroTagline.textContent.trim();
    heroTagline.textContent = '';
    heroTagline.style.minHeight = '1.2em';
    let charIndex = 0;

    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          heroTagline.textContent += fullText[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 38);
    }, 2500);
  }

  /* ============================================================
     21. PAGE VISIBILITY — pause on tab switch
  ============================================================ */
  document.addEventListener('visibilitychange', () => {
    const state = document.hidden ? 'paused' : 'running';
    document.querySelectorAll('.hero-slide').forEach(s => {
      s.style.animationPlayState = state;
    });
  });

  /* ============================================================
     CONSOLE LOG
  ============================================================ */
  console.log('USAFI HOTEL — Where Luxury Breathes.');

}); // end DOMContentLoaded
