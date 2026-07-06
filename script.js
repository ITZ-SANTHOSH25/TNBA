/* ============================================
   Tamil Nadu Blood Bank Management System
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSideNav();
  initBottomNav();
  initAIAssistant();
  initCountUp();
  initAnnouncementsScroll();
  initTabs();
  initForms();
  initModals();
  initEligibilityChecker();
  initFeedbackOptions();
  initTooltips();
});

/* --- Side Navigation --- */
function initSideNav() {
  const menuBtn = document.querySelector('.menu-btn');
  const overlay = document.querySelector('.side-nav-overlay');
  const sideNav = document.querySelector('.side-nav');
  const closeBtn = document.querySelector('.side-nav-close');

  if (!menuBtn || !sideNav) return;

  function openNav() {
    sideNav.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    sideNav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  if (overlay) overlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  // Set active nav item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.side-nav-item').forEach(item => {
    const href = item.getAttribute('href') || item.dataset.page;
    if (href === currentPage) {
      item.classList.add('active');
    }
  });
}

/* --- Bottom Navigation --- */
function initBottomNav() {
  const navItems = document.querySelectorAll('.bottom-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* --- AI Assistant --- */
function initAIAssistant() {
  const btn = document.querySelector('.ai-assistant-btn');
  const chat = document.querySelector('.ai-assistant-chat');
  const closeChat = document.querySelector('.ai-chat-close');
  const chatInput = document.querySelector('.ai-chat-input input');
  const chatSend = document.querySelector('.ai-chat-input button');
  const messages = document.querySelector('.ai-chat-messages');

  if (!btn || !chat) return;

  btn.addEventListener('click', () => {
    chat.classList.toggle('open');
  });

  if (closeChat) {
    closeChat.addEventListener('click', () => {
      chat.classList.remove('open');
    });
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message user';
    userMsg.textContent = text;
    messages.appendChild(userMsg);

    chatInput.value = '';

    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message bot';
      const responses = [
        "I can help you with blood donation eligibility, finding nearby blood banks, or scheduling a donation appointment.",
        "For emergency blood requirements, please call 104 or use our Emergency Blood Request feature.",
        "You can check your eligibility to donate blood using our Eligibility Checker tool.",
        "Regular blood donation helps maintain a healthy supply. Consider donating every 3 months!",
        "Please ensure you've had a good meal and are well-hydrated before donating blood."
      ];
      botMsg.textContent = responses[Math.floor(Math.random() * responses.length)];
      messages.appendChild(botMsg);
      messages.scrollTop = messages.scrollHeight;
    }, 800);

    messages.scrollTop = messages.scrollHeight;
  }

  if (chatSend) chatSend.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
}

/* --- Count Up Animation --- */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(start + (target - start) * easeOut);
          el.textContent = current.toLocaleString('en-IN');

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = target.toLocaleString('en-IN');
          }
        }

        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* --- Announcements Auto Scroll --- */
function initAnnouncementsScroll() {
  const scroll = document.querySelector('.announcements-scroll');
  if (!scroll) return;

  let scrollAmount = 0;
  const scrollStep = 1;
  let isPaused = false;

  scroll.addEventListener('mouseenter', () => isPaused = true);
  scroll.addEventListener('mouseleave', () => isPaused = false);
  scroll.addEventListener('touchstart', () => isPaused = true);
  scroll.addEventListener('touchend', () => {
    setTimeout(() => isPaused = false, 3000);
  });

  setInterval(() => {
    if (!isPaused) {
      scrollAmount += scrollStep;
      if (scrollAmount >= scroll.scrollWidth - scroll.clientWidth) {
        scrollAmount = 0;
      }
      scroll.scrollTo({ left: scrollAmount, behavior: 'auto' });
    }
  }, 30);
}

/* --- Tabs --- */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.tab');
    const parent = tabGroup.parentElement;
    const contents = parent.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        contents.forEach(c => c.classList.remove('active'));
        const targetContent = parent.querySelector(`[data-tab-content="${target}"]`);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  });
}

/* --- Form Handling --- */
function initForms() {
  // Login forms
  document.querySelectorAll('#hospitalLoginForm, #bloodBankLoginForm, #donorRegForm, #bloodRequestForm, #emergencyRequestForm, #campRegForm, #feedbackForm').forEach(form => {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Form submitted successfully!');
    });
  });

  // Search form
  const searchForm = document.getElementById('bloodSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const resultsSection = document.querySelector('.availability-results');
      if (resultsSection) {
        resultsSection.style.display = 'grid';
        const filterBar = document.querySelector('.search-filter-bar');
        if (filterBar) {
          filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      showToast('Searching blood availability...');
    });
  }

  // Password toggle
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else {
        input.type = 'password';
        btn.textContent = '👁️';
      }
    });
  });
}

/* --- Toast Notifications --- */
function showToast(message, duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}

/* --- Modal --- */
function initModals() {
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('active');
    });
  });

  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        const modal = el.closest('.modal-overlay') || el.closest('.modal');
        if (modal) modal.classList.remove('active');
      }
    });
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

/* --- Eligibility Checker --- */
function initEligibilityChecker() {
  const checker = document.querySelector('.eligibility-checker');
  if (!checker) return;

  const steps = checker.querySelectorAll('.eligibility-step');
  const stepDots = checker.querySelectorAll('.step-dot');
  let currentStep = 0;

  function showStep(index) {
    steps.forEach(s => s.classList.remove('active'));
    stepDots.forEach((d, i) => {
      d.classList.remove('active', 'completed');
      if (i < index) d.classList.add('completed');
      if (i === index) d.classList.add('active');
    });
    if (steps[index]) steps[index].classList.add('active');
    currentStep = index;
  }

  checker.querySelectorAll('.elig-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
      }
    });
  });

  checker.querySelectorAll('.elig-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });
  });

  checker.querySelectorAll('.elig-restart').forEach(btn => {
    btn.addEventListener('click', () => {
      currentStep = 0;
      showStep(0);
      checker.querySelectorAll('.question-option').forEach(o => o.classList.remove('selected'));
    });
  });

  // Question option selection
  checker.querySelectorAll('.question-option').forEach(option => {
    option.addEventListener('click', () => {
      const parent = option.closest('.question-options');
      parent.querySelectorAll('.question-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
}

/* --- Feedback Options --- */
function initFeedbackOptions() {
  const options = document.querySelectorAll('.feedback-option');
  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
}

/* --- Tooltips --- */
function initTooltips() {
  // Simple tooltip behavior via title attribute
}

/* --- Navigation Helper --- */
function navigateTo(page) {
  window.location.href = page;
}

/* --- Back Button --- */
function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
}

/* --- Blood Search Filter Chips --- */
function filterBloodType(type) {
  const chips = document.querySelectorAll('.blood-type-chip');
  chips.forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  showToast(`Filtering by ${type}`);
}

/* --- Dashboard Quick Actions (Admin) --- */
function dashboardAction(action) {
  showToast(`${action} action triggered`);
}

/* --- Print Helper --- */
function printPage() {
  window.print();
}

/* --- Share Helper --- */
function shareContent() {
  if (navigator.share) {
    navigator.share({
      title: 'Tamil Nadu Blood Bank Management System',
      text: 'Donate Blood, Save Lives - Tamil Nadu Blood Bank Management System',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
  }
}
