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
   * Common email domains for typo detection
   */
  const commonDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
    'protonmail.com', 'icloud.com', 'mail.com', 'aol.com',
    'gmx.com', 'yandex.com', 'company.com', 'business.com'
  ];

  /**
   * Calculate Levenshtein distance between two strings
   * Used to detect domain typos (e.g., gm5il vs gmail)
   */
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  /**
   * Detect if username part is gibberish or invalid
   * Examples: fkr, xyz, asfj, qwerty, test, admin, user, etc.
   */
  const isValidUsername = (username) => {
    const lowerUsername = username.toLowerCase();

    // Reject very short usernames (less than 3 chars)
    if (username.length < 3) {
      return { valid: false, reason: 'short', value: lowerUsername };
    }

    // Reject generic/test usernames
    const genericNames = [
      'test', 'admin', 'user', 'demo', 'guest', 'noreply',
      'no-reply', 'support', 'info', 'contact', 'hello',
      'example', 'sample', 'temp', 'tmp', 'new', 'test123'
    ];

    if (genericNames.includes(lowerUsername)) {
      return { valid: false, reason: 'generic', value: lowerUsername };
    }

    // Reject keyboard patterns (qwerty, asdf, zxcv, etc.)
    const keyboardPatterns = [
      'asdf', 'qwerty', 'qwert', 'qwer', 'qwe',
      'zxcv', 'zxc', 'zx', 'asd', 'asfj', 'dfgh',
      '1234', '123', '12345', 'abcd', 'abc'
    ];

    if (keyboardPatterns.some(pattern => lowerUsername.includes(pattern))) {
      return { valid: false, reason: 'keyboard', value: lowerUsername };
    }

    // Reject usernames with excessive consonants in a row (4+ consonants for length 3-4, 6+ for longer)
    const maxConsonantRow = username.length <= 4 ? 3 : 6;
    const consonantPattern = new RegExp('[bcdfghjklmnpqrstvwxyz]{' + (maxConsonantRow + 1) + ',}');
    if (consonantPattern.test(lowerUsername)) {
      return { valid: false, reason: 'gibberish', value: lowerUsername };
    }

    // Reject usernames with too few vowels (gibberish detection)
    // Stricter for short usernames (3-4 chars need at least 1 vowel, 5+ need at least 20%)
    const vowels = (lowerUsername.match(/[aeiou]/gi) || []).length;
    if (username.length === 3 || username.length === 4) {
      // For 3-4 character names, need at least 1 vowel
      if (vowels === 0) {
        return { valid: false, reason: 'gibberish', value: lowerUsername };
      }
    } else {
      // For 5+ character names, need at least 20% vowels
      const vowelRatio = vowels / username.length;
      if (vowelRatio < 0.2) {
        return { valid: false, reason: 'gibberish', value: lowerUsername };
      }
    }

    return { valid: true, reason: null, value: lowerUsername };
  };

  /**
   * Check if domain is a known/valid email provider
   */
  const isKnownDomain = (domain) => {
    const lowerDomain = domain.toLowerCase();
    return commonDomains.includes(lowerDomain);
  };

  /**
   * Detect if domain is a typo of a common email provider
   * Only returns typo if it's NOT a known domain
   */
  const detectDomainTypo = (domain) => {
    const lowerDomain = domain.toLowerCase();

    // If it's already a known/valid domain, no typo
    if (isKnownDomain(domain)) {
      return { typo: false, isKnown: true };
    }

    // Check if it's close to a known domain (potential typo)
    let bestMatch = null;
    let bestDistance = Infinity;

    for (const commonDomain of commonDomains) {
      const distance = levenshteinDistance(lowerDomain, commonDomain);
      const maxDistance = Math.ceil(commonDomain.length * 0.3); // 30% typo tolerance

      if (distance <= maxDistance && distance > 0 && distance < bestDistance) {
        bestMatch = commonDomain;
        bestDistance = distance;
      }
    }

    if (bestMatch) {
      return { typo: true, suggestion: bestMatch, distance: bestDistance };
    }

    // Domain doesn't match any known provider
    return { typo: false, isKnown: false, unknown: true };
  };

  /**
   * Validate email: check username and domain
   */
  const validateEmailLocal = (email) => {
    if (!email) return { valid: true, error: null };

    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    const [username, domain] = email.split('@');

    // Check username first
    const usernameCheck = isValidUsername(username);
    if (!usernameCheck.valid) {
      const reasons = {
        generic: 'That username looks like a test account. Please use a real name or email.',
        keyboard: 'That username looks like a keyboard pattern. Please use a real name.',
        short: 'Username is too short. Use at least 3 characters.',
        gibberish: 'That username looks like gibberish. Please use a real name.'
      };
      return {
        valid: false,
        error: reasons[usernameCheck.reason] || 'Invalid username format'
      };
    }

    // Check domain (only if username is valid)
    const domainCheck = detectDomainTypo(domain);

    // If domain is a typo, suggest correction
    if (domainCheck.typo) {
      return {
        valid: false,
        error: `Did you mean ${domainCheck.suggestion}? That looks like a typo in the domain.`
      };
    }

    // If domain is unknown (not a typo and not known), still allow it
    // (Users might use corporate/custom domains)
    if (domainCheck.unknown) {
      return { valid: true, error: null };
    }

    // Domain is known/valid
    return { valid: true, error: null };
  };

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
   * Validate email format and show real-time feedback
   */
  const validateEmail = (e) => {
    const email = e.target.value;
    const errorDiv = document.getElementById('email-error');

    if (email) {
      const validation = validateEmailLocal(email);

      if (!validation.valid) {
        errorDiv.textContent = validation.error;
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
    const validation = validateEmailLocal(email);
    return validation.valid;
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
    submitBtn.textContent = 'Sending message...';
    submitBtn.disabled = true;

    // Prepare email content for mailto
    const emailSubject = encodeURIComponent(`New Contact Form Submission from ${name}`);
    const emailBody = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Message:\n${message}\n\n` +
      `---\n` +
      `Sent from portfolio contact form`
    );

    // Send email via mailto link (opens user's email client)
    const mailtoLink = `mailto:kahlonshai1@gmail.com?subject=${emailSubject}&body=${emailBody}&cc=${email}`;

    try {
      // Open the mailto link
      window.location.href = mailtoLink;

      // Show success message after a short delay
      setTimeout(() => {
        showSuccessMessage(form);
        form.reset();
        // Clear error message on success
        document.getElementById('email-error').style.display = 'none';
        document.getElementById('email-error').textContent = '';
      }, 500);
    } catch (error) {
      console.error('Error opening mail client:', error);
      document.getElementById('email-error').textContent = 'Error sending message. Please try again.';
      document.getElementById('email-error').style.display = 'block';
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
