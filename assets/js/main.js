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
  // Strict email validation - only allow alphanumeric, dots, hyphens, underscores
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Only letters, spaces, hyphens, and apostrophes for names
  const nameRegex = /^[a-zA-Z\s'-]+$/;

  // List of common disposable/fake email domains to block
  const disposableEmailDomains = new Set([
    'tempmail.com', 'temp-mail.com', '10minutemail.com', 'guerrillamail.com',
    'mailinator.com', 'maildrop.cc', 'sharklasers.com', 'spam4.me',
    'trashmail.com', 'yopmail.com', 'throwaway.email', 'temp.email',
    'mailnesia.com', 'maileater.com', 'fakeinbox.com', 'throwawaymail.com',
    'grr.la', 'tempmail.us', 'mail.tm', 'quickmail.nl', 'dispostable.com',
    '10minutemail.net', 'tempmail.net', 'testing.org', 'sharklasers.net',
    'trashmail.net', 'yopmail.fr', 'yopmail.net', 'yopmail.de', 'temp-mail.org',
    'tempemailaddress.com', 'trashemaildomain.com', 'fakeemail.com',
    'go.cot', 'test.test', 'dev.test', 'local.test', 'localhost.test',
    'example.cot', 'fake.cot', 'test.cot', 'temp.cot'
  ]);

  // Whitelist of legitimate TLDs
  const legitimateTLDs = new Set([
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
    'io', 'co', 'uk', 'ca', 'us', 'au', 'de', 'fr', 'jp', 'ru', 'cn', 'in', 'br', 'mx',
    'info', 'biz', 'name', 'mobi', 'asia', 'tel', 'aero', 'coop', 'museum', 'pro',
    'xxx', 'cat', 'jobs', 'post', 'geo', 'travel', 'tel', 'vote', 'nyc', 'london',
    'tv', 'cc', 'ws', 'app', 'dev', 'online', 'site', 'shop', 'blog', 'cloud',
    'ai', 'tech', 'digital', 'link', 'download', 'social', 'website', 'space',
    'services', 'solutions', 'systems', 'net', 'world', 'email', 'me'
  ]);

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
   * Validate email format and check for disposable/fake domains
   */
  const validateEmail = (e) => {
    const email = e.target.value.toLowerCase().trim();
    const errorDiv = document.getElementById('email-error');

    if (!email) {
      errorDiv.style.display = 'none';
      e.target.classList.remove('form-input-error');
      return;
    }

    // Check basic format
    if (!emailRegex.test(email)) {
      errorDiv.textContent = 'Please enter a valid email address (e.g., name@example.com)';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Extract local and domain parts
    const [localPart, domain] = email.split('@');

    // Check for invalid characters in local part (before @)
    if (/[^a-z0-9._-]/.test(localPart)) {
      errorDiv.textContent = 'Email contains invalid characters';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Check for invalid characters in domain
    if (/[^a-z0-9.-]/.test(domain)) {
      errorDiv.textContent = 'Domain contains invalid characters';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Check if domain is in disposable list
    if (disposableEmailDomains.has(domain)) {
      errorDiv.textContent = 'Please use a legitimate email address, not a temporary/disposable one';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Check for suspicious patterns in email
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      errorDiv.textContent = 'Invalid email format detected';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Check for consecutive dots in domain
    if (domain.includes('..')) {
      errorDiv.textContent = 'Invalid domain format detected';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Extract and validate TLD
    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];

    // Check if TLD is legitimate
    if (!legitimateTLDs.has(tld)) {
      errorDiv.textContent = 'Email uses an invalid or suspicious domain extension';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Check domain name (without TLD) minimum length - reject overly short domains like "r.com"
    const domainNamePart = domain.split('.').slice(0, -1).join('.');
    if (domainNamePart.length < 3) {
      errorDiv.textContent = 'Domain name is too short or unreliable - please use a longer domain';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Check minimum length
    if (email.length < 5) {
      errorDiv.textContent = 'Email address is too short';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Check maximum length (RFC 5321)
    if (email.length > 254) {
      errorDiv.textContent = 'Email address is too long';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // All checks passed
    errorDiv.style.display = 'none';
    e.target.classList.remove('form-input-error');
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
    if (!email) return false;

    const lowerEmail = email.toLowerCase().trim();

    // Check basic format
    if (!emailRegex.test(lowerEmail)) return false;

    // Extract local and domain parts
    const [localPart, domain] = lowerEmail.split('@');

    // Check for invalid characters in local part
    if (/[^a-z0-9._-]/.test(localPart)) return false;

    // Check for invalid characters in domain
    if (/[^a-z0-9.-]/.test(domain)) return false;

    // Check if domain is disposable
    if (disposableEmailDomains.has(domain)) return false;

    // Check for suspicious patterns
    if (lowerEmail.includes('..') || lowerEmail.startsWith('.') || lowerEmail.endsWith('.')) {
      return false;
    }

    // Check for consecutive dots in domain
    if (domain.includes('..')) return false;

    // Extract and validate TLD
    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];

    // Check if TLD is legitimate
    if (!legitimateTLDs.has(tld)) return false;

    // Check domain name (without TLD) minimum length - reject overly short domains like "r.com"
    const domainNamePart = domain.split('.').slice(0, -1).join('.');
    if (domainNamePart.length < 3) return false;

    // Check minimum length
    if (lowerEmail.length < 5) return false;

    // Check maximum length
    if (lowerEmail.length > 254) return false;

    return true;
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
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

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

    // Show success message
    showSuccessMessage(form);

    // Submit form to FormSubmit.co
    // This will send the data and redirect back to the portfolio
    form.submit();
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
