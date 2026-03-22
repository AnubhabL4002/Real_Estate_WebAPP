// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ── MODAL ──
function openModal(id) {
  const p = PROPERTIES.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalInner').innerHTML = `
    <button class="modal-close" onclick="closeModal()">✕</button>
    <img src="${p.img}" alt="${p.name}" class="modal-img">
    <div class="modal-body">
      <span style="font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);font-weight:600">${p.tag}</span>
      <h2 class="modal-title">${p.name}</h2>
      <div class="modal-location">📍 ${p.location}</div>
      <div class="modal-price">${p.price}</div>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-specs">
        <div class="modal-spec"><div class="modal-spec-val">${p.beds}</div><div class="modal-spec-key">Bedrooms</div></div>
        <div class="modal-spec"><div class="modal-spec-val">${p.baths}</div><div class="modal-spec-key">Bathrooms</div></div>
        <div class="modal-spec"><div class="modal-spec-val">${p.area}</div><div class="modal-spec-key">Area</div></div>
        <div class="modal-spec"><div class="modal-spec-val">${p.floor}</div><div class="modal-spec-key">Floor</div></div>
      </div>
      <div class="modal-contact">
        <div class="modal-agent">
          <div class="modal-agent-avatar">${p.agentInitials}</div>
          <div>
            <div class="modal-agent-name">${p.agent}</div>
            <div class="modal-agent-phone">${p.contact}</div>
          </div>
        </div>
        <a href="tel:${p.contact.replace(/\s/g, '')}" class="btn-primary" style="font-size:10px;padding:12px 28px">Call Now</a>
      </div>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay') || e.target.classList.contains('modal-close')) {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ── COUNT-UP ANIMATION ──
const counters = document.querySelectorAll('[data-target]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      const suffix = target >= 98 ? '' : '+';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

// ── ENQUIRY FORM (AJAX to Django) ──
const form = document.getElementById('enquiryForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const msgEl = document.getElementById('formMsg');
    const csrfToken = form.querySelector('[name=csrfmiddlewaretoken]').value;

    const data = {
      full_name: form.querySelector('[name=full_name]').value,
      phone: form.querySelector('[name=phone]').value,
      email: form.querySelector('[name=email]').value,
      interest: form.querySelector('[name=interest]').value,
      budget: form.querySelector('[name=budget]').value,
      message: form.querySelector('[name=message]').value,
    };

    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const res = await fetch('/enquiry/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === 'success') {
        btn.textContent = '✓ Enquiry Sent!';
        btn.style.background = '#2C6E49';
        btn.style.color = '#fff';
        msgEl.style.display = 'block';
        msgEl.textContent = 'Thank you! Our team will contact you shortly.';
        form.reset();
        setTimeout(() => {
          btn.textContent = 'Send Enquiry →';
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
          msgEl.style.display = 'none';
        }, 4000);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      btn.textContent = 'Send Enquiry →';
      btn.disabled = false;
      msgEl.style.display = 'block';
      msgEl.style.color = '#e57373';
      msgEl.textContent = 'Something went wrong. Please try again.';
    }
  });
}
// ── STAR RATING WIDGET ──
(function () {
  const stars = document.querySelectorAll('#starRating .star');
  const ratingInput = document.getElementById('ratingInput');
  if (!stars.length) return;
  let currentRating = 5;
  function setStars(val, cls) {
    stars.forEach(s => {
      s.classList.remove('active', 'hover');
      if (parseInt(s.dataset.val) <= val) s.classList.add(cls);
    });
  }
  setStars(5, 'active');
  stars.forEach(star => {
    star.addEventListener('mouseover', () => setStars(parseInt(star.dataset.val), 'hover'));
    star.addEventListener('mouseleave', () => setStars(currentRating, 'active'));
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.val);
      ratingInput.value = currentRating;
      setStars(currentRating, 'active');
    });
  });
})();

// ── TESTIMONIAL FORM SUBMIT ──
(function () {
  const form = document.getElementById('testimonialForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('reviewSubmitBtn');
    const msgEl = document.getElementById('reviewMsg');
    const csrfToken = form.querySelector('[name=csrfmiddlewaretoken]').value;
    const data = {
      name: form.querySelector('[name=name]').value.trim(),
      role: form.querySelector('[name=role]').value.trim(),
      text: form.querySelector('[name=text]').value.trim(),
      rating: parseInt(form.querySelector('[name=rating]').value),
    };
    if (!data.name || !data.text) {
      msgEl.style.display = 'block';
      msgEl.style.color = '#e57373';
      msgEl.textContent = 'Please fill in your name and review.';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Submitting...';
    msgEl.style.display = 'none';
    try {
      const res = await fetch('/testimonial/submit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === 'success') {
        btn.textContent = '✓ Review Submitted!';
        btn.style.background = '#2C6E49';
        btn.style.color = '#fff';
        msgEl.style.display = 'block';
        msgEl.style.color = 'var(--gold-dark)';
        msgEl.textContent = '🙏 Thank you! Your review will appear after our team verifies it.';
        form.reset();
        document.getElementById('ratingInput').value = 5;
        document.querySelectorAll('#starRating .star').forEach((s, i) => {
          s.classList.toggle('active', i < 5);
        });
        setTimeout(() => {
          btn.textContent = 'Submit Review →';
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 5000);
      } else { throw new Error(result.message); }
    } catch (err) {
      btn.textContent = 'Submit Review →';
      btn.disabled = false;
      msgEl.style.display = 'block';
      msgEl.style.color = '#e57373';
      msgEl.textContent = 'Something went wrong. Please try again.';
    }
  });
})();

// ── TESTIMONIALS SLIDER ARROWS ──
(function () {
  const track = document.getElementById('testimonialsTrack');
  const prev = document.getElementById('sliderPrev');
  const next = document.getElementById('sliderNext');
  if (!track || !prev || !next) return;

  const scrollAmount = 408; // card width (380) + gap (28)

  next.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
})();