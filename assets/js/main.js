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
    // Query elements after DOM is ready
    const fadeElements = document.querySelectorAll('.fade-in');

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

    // Observe all fade-in elements
    fadeElements.forEach(element => {
      observer.observe(element);
    });

    // Also immediately show elements that are already in viewport
    // (in case they load after the observer is set up)
    setTimeout(() => {
      fadeElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add('visible');
        }
      });
    }, 100);
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

  /**
   * Check if a domain looks like a misspelling of a common provider
   * Uses Levenshtein distance to detect typos like gmdail (gmail), gmial (gmail), etc.
   */
  const isSuspiciousDomain = (domain) => {
    // List of very common email providers to check against
    const commonDomains = [
      'gmail', 'gmail.com', 'yahoo', 'yahoo.com', 'outlook', 'outlook.com',
      'hotmail', 'hotmail.com', 'protonmail', 'protonmail.com',
      'aol', 'aol.com', 'icloud', 'icloud.com', 'mail', 'mail.com',
      'google', 'google.com', 'facebook', 'facebook.com'
    ];

    // Extract just the domain name (without TLD)
    const domainName = domain.split('.')[0].toLowerCase();

    // First, check if this is an EXACT match with any common domain (not suspicious)
    for (let common of commonDomains) {
      const commonName = common.split('.')[0].toLowerCase();
      if (domainName === commonName) {
        return false; // Exact match, not suspicious
      }
    }

    // Then check for typos (similar but not exact)
    for (let common of commonDomains) {
      // Get just the domain part if it has a TLD
      const commonName = common.split('.')[0].toLowerCase();

      // Calculate Levenshtein distance
      const distance = levenshteinDistance(domainName, commonName);
      const maxLen = Math.max(domainName.length, commonName.length);

      // If distance is small compared to length, it's likely a typo
      if (distance > 0 && distance <= 3 && distance <= Math.ceil(maxLen * 0.4)) {
        return true;
      }
    }

    return false;
  };

  /**
   * Calculate Levenshtein distance between two strings
   * Used to detect domain name typos/misspellings
   */
  const levenshteinDistance = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
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

    return matrix[len2][len1];
  };

  /**
   * Check if a username looks like random gibberish/fake
   * Detects patterns like: defj, qwerty, xyz, abc, etc.
   */
  const isSuspiciousUsername = (username) => {
    // Remove dots, hyphens, underscores for analysis
    const cleanUsername = username.replace(/[._-]/g, '').toLowerCase();

    // Check for consecutive consonants (6+ in a row indicates likely gibberish)
    // Note: legitimate names can have up to 4 consonants in a row (e.g., "strength")
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/.test(cleanUsername)) {
      return true;
    }

    // Common keyboard patterns and fake usernames
    const suspiciousPatterns = [
      /^qwerty/,      // keyboard pattern
      /^asdf/,        // keyboard pattern (qwerty row left-hand)
      /^as[a-z]/,     // keyboard pattern variations like asfj, asdk, etc.
      /^qs[a-z]/,     // similar keyboard variations
      /^zxcv/,        // keyboard pattern
      /^zx[a-z]/,     // keyboard pattern variations
      /^abc[a-z]*$/,  // abc, abcd, abcde, etc.
      /^xyz[a-z]*$/,  // xyz, xyza, xyzb, etc.
      /^def[a-z]*$/,  // def, defa, defb, etc. (catches defj)
      /^ghi[a-z]*$/,  // ghi pattern
      /^jkl[a-z]*$/,  // jkl pattern
      /^123[0-9]*$/,  // all numbers
      /^[a-z]{3}[0-9]+$/,  // like abc123, def456 (common fake patterns)
      /^test[a-z0-9]*$/,   // test, test1, testa, etc.
      /^user[a-z0-9]*$/,   // generic user pattern
      /^admin[a-z0-9]*$/,  // admin pattern
      /^demo[a-z0-9]*$/,   // demo pattern
      /^temp[a-z0-9]*$/,   // temp pattern
      /^fake[a-z0-9]*$/,   // fake pattern
      /^guest[a-z0-9]*$/   // guest pattern
    ];

    for (let pattern of suspiciousPatterns) {
      if (pattern.test(cleanUsername)) {
        return true;
      }
    }

    // Check vowel-to-consonant ratio (real names have reasonable balance)
    const vowels = cleanUsername.match(/[aeiou]/g) || [];
    const consonants = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

    if (consonants.length > 0) {
      const ratio = vowels.length / (vowels.length + consonants.length);
      // If less than 20% vowels, likely gibberish (normal ratio is 35-45%)
      // Threshold set to catch obvious gibberish while allowing real names like "john" (25%)
      if (ratio < 0.20) {
        return true;
      }
    }

    return false;
  };

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

    // Check if domain looks like a misspelling of a common provider
    if (isSuspiciousDomain(domain)) {
      errorDiv.textContent = 'Domain appears to be a misspelling (e.g., gmdail instead of gmail) - please check your domain';
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

    // Check local part (username) minimum length - reject suspiciously short usernames like "dej"
    if (localPart.length < 4) {
      errorDiv.textContent = 'Username is too short or unreliable - please use a longer username (4+ characters)';
      errorDiv.style.display = 'block';
      e.target.classList.add('form-input-error');
      return;
    }

    // Check if username looks like random gibberish or fake pattern
    if (isSuspiciousUsername(localPart)) {
      errorDiv.textContent = 'Username appears to be randomly generated or suspicious - please use a real username';
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

    // Check if domain looks like a misspelling of a common provider
    if (isSuspiciousDomain(domain)) return false;

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

    // Check local part (username) minimum length - reject suspiciously short usernames
    const localPart = lowerEmail.split('@')[0];
    if (localPart.length < 4) return false;

    // Check if username looks like random gibberish or fake pattern
    if (isSuspiciousUsername(localPart)) return false;

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
