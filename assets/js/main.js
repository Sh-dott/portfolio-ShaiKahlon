/**
 * Portfolio Application - Main JavaScript Entry Point
 * ====================================================
 * Modern ES6+ modular architecture for a professional portfolio website
 */

// ============================================================================
// Module: Navigation Manager
// ============================================================================

const NavigationManager = (() => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  /**
   * Initialize navigation event listeners
   */
  const init = () => {
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', toggleMobileMenu);
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', handleNavigation);
    });
  };

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    mobileMenu.classList.toggle('active');
  };

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
  };

  /**
   * Handle smooth scrolling for navigation links
   * Accounts for fixed header height (60px)
   */
  const handleNavigation = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const target = document.querySelector(href);

    if (target) {
      closeMobileMenu();
      const headerHeight = 60;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return { init };
})();

// ============================================================================
// Module: Animation Manager
// ============================================================================

const AnimationManager = (() => {
  const fadeElements = document.querySelectorAll('.fade-in');
  const progressBars = document.querySelectorAll('.progress-fill');

  /**
   * Initialize all animations
   */
  const init = () => {
    observeFadeInElements();
    observeSkillBars();
  };

  /**
   * Set up Intersection Observer for fade-in animations
   */
  const observeFadeInElements = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
      observer.observe(element);
    });
  };

  /**
   * Set up Intersection Observer for skill bar animations
   */
  const observeSkillBars = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    progressBars.forEach(bar => {
      observer.observe(bar);
    });
  };

  return { init };
})();

// ============================================================================
// Module: Typing Animation
// ============================================================================

const TypingAnimation = (() => {
  const roles = [
    'Fraud Analyst',
    'Online Investigator',
    'Problem Solver',
    'Threat Detection Specialist',
    'OSINT/WEBINT Researcher'
  ];

  const config = {
    speed: 100,
    deleteSpeed: 50,
    pauseTime: 2000,
    delay: 1000
  };

  let state = {
    roleIndex: 0,
    charIndex: 0,
    isDeleting: false
  };

  /**
   * Initialize typing animation
   */
  const init = () => {
    setTimeout(startAnimation, config.delay);
  };

  /**
   * Start the main typing animation loop
   */
  const startAnimation = () => {
    const roleText = document.getElementById('role-text');
    if (!roleText) return;

    const currentRole = roles[state.roleIndex];
    const displayText = `A passionate ${currentRole.substring(0, state.charIndex)}`;

    if (state.isDeleting) {
      handleDeletion(roleText, currentRole);
    } else {
      handleTyping(roleText, currentRole);
    }

    roleText.textContent = displayText;
  };

  /**
   * Handle typing phase
   */
  const handleTyping = (element, currentRole) => {
    state.charIndex++;

    if (state.charIndex > currentRole.length) {
      state.isDeleting = true;
      setTimeout(startAnimation, config.pauseTime);
      return;
    }

    setTimeout(startAnimation, config.speed);
  };

  /**
   * Handle deletion phase
   */
  const handleDeletion = (element, currentRole) => {
    state.charIndex--;

    if (state.charIndex < 0) {
      state.isDeleting = false;
      state.roleIndex = (state.roleIndex + 1) % roles.length;
      setTimeout(startAnimation, 500);
      return;
    }

    setTimeout(startAnimation, config.deleteSpeed);
  };

  return { init };
})();

// ============================================================================
// Module: Particle System
// ============================================================================

const ParticleSystem = (() => {
  const config = {
    count: 50,
    maxSize: 4,
    minSize: 2,
    maxDuration: 6,
    minDuration: 3,
    maxDelay: 2,
    minDelay: 0
  };

  /**
   * Initialize particle system
   */
  const init = () => {
    createParticles();
  };

  /**
   * Create and render floating particles in hero section
   */
  const createParticles = () => {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    for (let i = 0; i < config.count; i++) {
      const particle = createParticleElement();
      container.appendChild(particle);
    }
  };

  /**
   * Create a single particle element with randomized properties
   */
  const createParticleElement = () => {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * config.maxSize + config.minSize;
    const duration = Math.random() * (config.maxDuration - config.minDuration) + config.minDuration;
    const delay = Math.random() * config.maxDelay;

    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';

    return particle;
  };

  return { init };
})();

// ============================================================================
// Module: Form Handler
// ============================================================================

const FormHandler = (() => {
  /**
   * Validation regex patterns
   */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Only letters, spaces, hyphens, and apostrophes for names
  const nameRegex = /^[a-zA-Z\s'-]+$/;

  /**
   * Initialize form handling
   */
  const init = () => {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);

      // Add real-time validation for all fields
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      if (nameInput) {
        nameInput.addEventListener('blur', validateName);
        nameInput.addEventListener('input', validateName);
      }

      if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', validateEmail);
      }

      if (messageInput) {
        messageInput.addEventListener('blur', validateMessage);
        messageInput.addEventListener('input', validateMessage);
      }

      // Disable submit button until all fields are valid
      setupFormValidation(contactForm);
    }
  };

  /**
   * Validate name (letters, spaces, hyphens, apostrophes only)
   */
  const validateName = (e) => {
    const name = e.target.value.trim();
    const errorDiv = document.getElementById('name-error');

    if (name && !nameRegex.test(name)) {
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
    } else {
      errorDiv.style.display = 'none';
      e.target.classList.remove('form-input-error');
    }
  };

  /**
   * Validate email format
   */
  const validateEmail = (e) => {
    const email = e.target.value;
    const errorDiv = document.getElementById('email-error');

    if (email && !emailRegex.test(email)) {
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
    } else {
      errorDiv.style.display = 'none';
      e.target.classList.remove('form-input-error');
    }
  };

  /**
   * Validate message (must be at least 5 words, not just numbers)
   */
  const validateMessage = (e) => {
    const message = e.target.value.trim();
    const errorDiv = document.getElementById('message-error');

    if (message) {
      const words = message.split(/\s+/).filter(word => word.length > 0);
      const isOnlyNumbers = /^\d+$/.test(message.replace(/\s/g, ''));

      if (words.length < 5 || isOnlyNumbers) {
        errorDiv.style.display = 'block';
        e.target.classList.add('form-input-error');
      } else {
        errorDiv.style.display = 'none';
        e.target.classList.remove('form-input-error');
      }
    } else {
      errorDiv.style.display = 'none';
      e.target.classList.remove('form-input-error');
    }
  };

  /**
   * Check if all validations pass
   */
  const isNameValid = (name) => {
    return name && nameRegex.test(name);
  };

  const isEmailValid = (email) => {
    return email && emailRegex.test(email);
  };

  const isMessageValid = (message) => {
    if (!message) return false;
    const words = message.split(/\s+/).filter(word => word.length > 0);
    const isOnlyNumbers = /^\d+$/.test(message.replace(/\s/g, ''));
    return words.length >= 5 && !isOnlyNumbers;
  };

  /**
   * Setup form validation to disable submit button until all fields are valid
   */
  const setupFormValidation = (form) => {
    const submitBtn = form.querySelector('.form-submit');
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    const updateButtonState = () => {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      // Enable button only if all fields are valid
      const nameValid = isNameValid(name);
      const emailValid = isEmailValid(email);
      const messageValid = isMessageValid(message);

      submitBtn.disabled = !nameValid || !emailValid || !messageValid;
    };

    // Check validation on input
    nameInput.addEventListener('input', updateButtonState);
    emailInput.addEventListener('input', updateButtonState);
    messageInput.addEventListener('input', updateButtonState);

    // Initial state
    updateButtonState();
  };

  /**
   * Handle form submission
   */
  /**
   * Verify email with online service (AbstractAPI free tier)
   * Checks if email is valid and not disposable
   */
  const verifyEmailOnline = async (email) => {
    try {
      // Using AbstractAPI email validation (free tier: 100 requests/month)
      const response = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=0ba7c6a0dd0f46fb82e11d3fbc0f35ee&email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        console.warn('Email verification service unavailable');
        return { is_valid_format: true, is_disposable: false }; // Fallback to local validation
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Email verification failed:', error);
      return { is_valid_format: true, is_disposable: false }; // Fallback
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const submitBtn = form.querySelector('.form-submit');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Final validation before submission
    if (!isNameValid(name)) {
      document.getElementById('name-error').style.display = 'block';
      nameInput.classList.add('form-input-error');
      return;
    }

    if (!isEmailValid(email)) {
      document.getElementById('email-error').style.display = 'block';
      emailInput.classList.add('form-input-error');
      return;
    }

    if (!isMessageValid(message)) {
      document.getElementById('message-error').style.display = 'block';
      messageInput.classList.add('form-input-error');
      return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Verifying email...';
    submitBtn.disabled = true;

    // Verify email online
    const emailData = await verifyEmailOnline(email);

    // Check if email is valid
    if (!emailData.is_valid_format || emailData.is_disposable || emailData.is_smtp_valid === false) {
      document.getElementById('email-error').textContent =
        'Email is invalid, disposable, or not deliverable. Please use a real email address.';
      document.getElementById('email-error').style.display = 'block';
      emailInput.classList.add('form-input-error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    // Prepare email content
    const emailSubject = encodeURIComponent(`New Contact Form Submission from ${name}`);
    const emailBody = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Message:\n${message}`
    );

    // Send email via FormSubmit API instead of mailto
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('_captcha', 'false');
    formData.append('_next', window.location.href);

    try {
      const response = await fetch('https://formspree.io/f/xvgojokv', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showSuccessMessage(form);
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      document.getElementById('email-error').textContent = 'Error sending message. Please try again.';
      document.getElementById('email-error').style.display = 'block';
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  };

  /**
   * Display success message after form submission
   */
  const showSuccessMessage = (form) => {
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Message Sent! ✓';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      setupFormValidation(form); // Re-enable validation
    }, 3000);
  };

  return { init };
})();

// ============================================================================
// Module: Scroll To Top Button
// ============================================================================

const ScrollToTopButton = (() => {
  /**
   * Initialize scroll to top functionality
   */
  const init = () => {
    window.addEventListener('scroll', toggleVisibility);
  };

  /**
   * Toggle scroll to top button visibility
   */
  const toggleVisibility = () => {
    const scrollPos = window.scrollY;
    const btn = document.querySelector('.scroll-to-top');

    if (btn) {
      if (scrollPos > 300) {
        btn.classList.remove('hidden');
      } else {
        btn.classList.add('hidden');
      }
    }
  };

  return { init };
})();

// ============================================================================
// Application Initialization
// ============================================================================

/**
 * Initialize all modules when DOM is fully loaded
 */
const initializeApp = () => {
  console.log('Initializing Portfolio Application...');

  // Initialize modules in order
  NavigationManager.init();
  AnimationManager.init();
  TypingAnimation.init();
  ParticleSystem.init();
  FormHandler.init();
  ScrollToTopButton.init();

  console.log('Portfolio Application Ready!');
};

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Optional: Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NavigationManager,
    AnimationManager,
    TypingAnimation,
    ParticleSystem,
    FormHandler,
    ScrollToTopButton
  };
}
