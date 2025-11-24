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
// Security Module
// ============================================================================

const SecurityHelper = (() => {
  /**
   * Generate CSRF token
   */
  const generateCSRFToken = () => {
    return btoa(Math.random().toString()).substring(0, 32);
  };

  /**
   * Store CSRF token in sessionStorage
   */
  const setCSRFToken = () => {
    const token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
    return token;
  };

  /**
   * Get CSRF token from sessionStorage
   */
  const getCSRFToken = () => {
    return sessionStorage.getItem('csrf_token') || setCSRFToken();
  };

  /**
   * HTML escape to prevent XSS
   */
  const escapeHTML = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  };

  /**
   * Sanitize input text - remove dangerous characters and patterns
   */
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';

    // Remove HTML/script tags
    let sanitized = input.replace(/<[^>]*>/g, '');

    // Remove control characters (ASCII 0-31, except tab/newline)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Trim whitespace
    return sanitized.trim();
  };

  /**
   * Detect SQL injection patterns
   */
  const detectSQLInjection = (input) => {
    if (typeof input !== 'string') return false;

    const sqlPatterns = [
      // SQL keywords and operators
      /(\b)(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|JAVASCRIPT|ONERROR|ONLOAD)(\b)/gi,
      // SQL comments
      /(--|#|\/\*|\*\/|;)/g,
      // SQL logic operators
      /(\bOR\b|\bAND\b)(\s*)(1\s*=\s*1|'.*'|".*")/gi,
      // Common SQL injection attempts
      /(\d+\s*=\s*\d+|'\s*=\s*'|"\s*=\s*")/g,
      // Escaped quotes
      /\\['"`]/g,
      // Stacked queries
      /;\s*\w+/g,
      // Hex encoding (x'...')
      /0x[0-9a-f]+/gi,
      // Command execution patterns
      /(\bexec\b|\bexecute\b|\bscript\b)/gi,
      // LDAP injection
      /[\*\(\)\\\&\|]/g
    ];

    for (let pattern of sqlPatterns) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Detect XSS injection patterns
   */
  const detectXSSInjection = (input) => {
    if (typeof input !== 'string') return false;

    const xssPatterns = [
      // Script tags
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      // Event handlers
      /on\w+\s*=\s*["'][^"']*["']/gi,
      // JavaScript protocol
      /javascript:/gi,
      // Data URIs with script
      /data:text\/html/gi,
      // SVG with script
      /<svg[^>]*onload/gi,
      // Iframe injection
      /<iframe[^>]*>/gi,
      // Object/embed tags
      /<(object|embed)[^>]*>/gi,
      // Meta refresh
      /<meta[^>]*refresh/gi,
      // Form injection
      /<form[^>]*>/gi,
      // Link with javascript
      /<a[^>]*href\s*=\s*"javascript:/gi
    ];

    for (let pattern of xssPatterns) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Detect NoSQL injection patterns
   */
  const detectNoSQLInjection = (input) => {
    if (typeof input !== 'string') return false;

    // NoSQL injection patterns
    const noSqlPatterns = [
      // MongoDB operators
      /(\$where|\$ne|\$gt|\$lt|\$exists|\$regex|\$or)/gi,
      // JSON with operators
      /{"[^"]*":\s*{"\$[a-z]+"/gi,
      // Multiple colons (suspicious in usernames/emails)
      /::+/g
    ];

    for (let pattern of noSqlPatterns) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Detect LDAP injection patterns
   */
  const detectLDAPInjection = (input) => {
    if (typeof input !== 'string') return false;

    // LDAP injection patterns
    const ldapPatterns = [
      /[*()\\&|]/g, // LDAP filter special chars
      /\*/g // Wildcard abuse
    ];

    // Only flag if multiple LDAP chars present (to avoid false positives)
    let matchCount = 0;
    for (let pattern of ldapPatterns) {
      if (pattern.test(input)) {
        matchCount++;
      }
    }
    return matchCount > 1;
  };

  /**
   * Detect command injection patterns
   */
  const detectCommandInjection = (input) => {
    if (typeof input !== 'string') return false;

    // Command injection patterns
    const commandPatterns = [
      // Shell metacharacters
      /[;&|`$()]/g,
      // Command separators
      /(\|\||&&|;|&|\||`)/g,
      // Backticks with commands
      /`[^`]*`/g,
      // Command substitution
      /\$\([^)]*\)/g,
      // Process substitution
      /<\([^)]*\)/g
    ];

    // Only flag if clearly suspicious patterns present
    let matchCount = 0;
    for (let pattern of commandPatterns) {
      const match = input.match(pattern);
      if (match && match.length > 1) {
        matchCount++;
      }
    }
    return matchCount > 1;
  };

  /**
   * Path traversal detection
   */
  const detectPathTraversal = (input) => {
    if (typeof input !== 'string') return false;

    // Path traversal patterns
    const pathPatterns = [
      /\.\.\//g,
      /\.\.\\/g,
      /\.\.%2f/gi,
      /\.\.%5c/gi,
      /^\/[a-z]:/gi, // Drive letters on Windows
      /etc\/passwd/gi,
      /windows\/system32/gi,
      /winnt\/system32/gi
    ];

    for (let pattern of pathPatterns) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Comprehensive input validation
   */
  const validateInputSecurity = (fieldName, input) => {
    if (typeof input !== 'string') {
      return { valid: false, threat: 'Non-string input detected' };
    }

    // Check length (prevent buffer overflow)
    const maxLengths = {
      'name': 100,
      'email': 255,
      'message': 5000
    };

    if (maxLengths[fieldName] && input.length > maxLengths[fieldName]) {
      return { valid: false, threat: 'Input exceeds maximum length' };
    }

    // Check for SQL injection
    if (detectSQLInjection(input)) {
      return { valid: false, threat: 'SQL injection attempt detected' };
    }

    // Check for XSS injection
    if (detectXSSInjection(input)) {
      return { valid: false, threat: 'XSS injection attempt detected' };
    }

    // Check for NoSQL injection
    if (detectNoSQLInjection(input)) {
      return { valid: false, threat: 'NoSQL injection attempt detected' };
    }

    // Check for LDAP injection
    if (detectLDAPInjection(input)) {
      return { valid: false, threat: 'LDAP injection attempt detected' };
    }

    // Check for command injection
    if (detectCommandInjection(input)) {
      return { valid: false, threat: 'Command injection attempt detected' };
    }

    // Check for path traversal
    if (detectPathTraversal(input)) {
      return { valid: false, threat: 'Path traversal attempt detected' };
    }

    return { valid: true, threat: null };
  };

  /**
   * Validate honeypot field (should be empty)
   */
  const validateHoneypot = (honeypotValue) => {
    // If honeypot field has any value, it's a bot
    return !honeypotValue || honeypotValue.trim() === '';
  };

  /**
   * Rate limiting check (max 5 submissions per minute per IP simulation)
   */
  const checkRateLimit = () => {
    const now = Date.now();
    const key = 'form_submission_times';
    const submissions = JSON.parse(localStorage.getItem(key) || '[]');

    // Remove submissions older than 1 minute
    const recentSubmissions = submissions.filter(time => now - time < 60000);

    // Check if user has submitted more than 5 times in the last minute
    if (recentSubmissions.length >= 5) {
      return false; // Rate limit exceeded
    }

    // Add current submission time
    recentSubmissions.push(now);
    localStorage.setItem(key, JSON.stringify(recentSubmissions));
    return true;
  };

  return {
    generateCSRFToken,
    setCSRFToken,
    getCSRFToken,
    escapeHTML,
    sanitizeInput,
    validateHoneypot,
    checkRateLimit,
    detectSQLInjection,
    detectXSSInjection,
    detectNoSQLInjection,
    detectLDAPInjection,
    detectCommandInjection,
    detectPathTraversal,
    validateInputSecurity
  };
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
      // ================================================================
      // SECURITY: Initialize CSRF token
      // ================================================================
      const csrfTokenField = document.getElementById('csrf_token');
      if (csrfTokenField) {
        csrfTokenField.value = SecurityHelper.getCSRFToken();
      }

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
   * Validate name - uses database lookup + semantic analysis
   * Smart two-stage validation:
   * 1. Check if name is in database (48,605 real names)
   * 2. If not in database, analyze if it LOOKS like a real name
   */
  const validateName = (e) => {
    const name = e.target.value.trim();
    const errorDiv = document.getElementById('name-error');

    if (!name) {
      errorDiv.style.display = 'none';
      e.target.classList.remove('form-input-error');
      return;
    }

    // Check minimum length (3+ characters required for any name)
    if (name.length < 3) {
      errorDiv.textContent = 'Name must be at least 3 characters long (e.g., "Dan", "Sam", "John").';
      errorDiv.style.display = 'block';
      errorDiv.style.color = '#ef4444'; // Red
      e.target.classList.add('form-input-error');
      return;
    }

    // Check format first (English letters only, no numbers or special chars)
    if (!nameRegex.test(name)) {
      errorDiv.textContent = 'Please enter your name in English only (A-Z). Spaces, hyphens, and apostrophes are allowed (e.g., "John Smith", "Mary-Jane", "O\'Brien").';
      errorDiv.style.display = 'block';
      errorDiv.style.color = '#ef4444'; // Red
      e.target.classList.add('form-input-error');
      return;
    }

    // ===== ADVANCED ML-BASED VALIDATION =====
    // Use machine learning validator with database
    let validationResult = null;
    let isValidName = false;

    if (typeof MLNameValidator !== 'undefined' && typeof NamesDatabase !== 'undefined') {
      // Get database names for similarity matching
      const databaseNames = Array.from(NamesDatabase.getFirstNames());

      // Use ML validator with database context
      validationResult = MLNameValidator.validateName(name, databaseNames);
      isValidName = validationResult.valid;
    } else {
      // Fallback if ML validator not loaded
      const isInDatabase = typeof NamesDatabase !== 'undefined' && NamesDatabase.isRealName(name);
      isValidName = isInDatabase;

      if (!isInDatabase && typeof SemanticNameValidator !== 'undefined') {
        validationResult = SemanticNameValidator.validateName(name);
        isValidName = validationResult.valid;
      }
    }

    // Show appropriate feedback
    if (!isValidName) {
      let message = '';

      if (validationResult) {
        if (validationResult.reason) {
          message = validationResult.reason;
        }

        // Add suggestions if available
        if (validationResult.suggestions && validationResult.suggestions.length > 0) {
          message += `. Did you mean: ${validationResult.suggestions.join(', ')}?`;
        }
      } else {
        message = 'This doesn\'t appear to be a real human name.';
      }

      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      errorDiv.style.color = '#ef4444'; // Red for errors
      e.target.classList.add('form-input-error');
    } else {
      // Valid name - hide error messages
      errorDiv.style.display = 'none';
      errorDiv.style.color = ''; // Reset color
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

    if (!message) {
      errorDiv.style.display = 'none';
      e.target.classList.remove('form-input-error');
      return;
    }

    // Use MessageAnalyzer for comprehensive message validation
    if (typeof MessageAnalyzer !== 'undefined') {
      const validation = MessageAnalyzer.validateMessage(message);

      if (!validation.valid) {
        // Display comprehensive error message with all issues
        let errorText = 'Message validation failed:\n';
        validation.issues.forEach(issue => {
          errorText += `• ${issue}\n`;
        });

        // Add suggestions if available
        const suggestions = MessageAnalyzer.getSuggestions(message);
        if (suggestions.length > 0) {
          errorText += '\nSuggestions:\n';
          suggestions.forEach(suggestion => {
            errorText += `• ${suggestion}\n`;
          });
        }

        errorDiv.textContent = errorText;
        errorDiv.style.display = 'block';
        e.target.classList.add('form-input-error');
      } else {
        // Message is valid - show quality feedback if not perfect
        const quality = MessageAnalyzer.calculateQuality(message);
        const feedback = MessageAnalyzer.getQualityFeedback(message);

        if (quality >= 70) {
          // Good quality message - no error display needed
          errorDiv.style.display = 'none';
          e.target.classList.remove('form-input-error');
        } else if (quality >= 50) {
          // Message is acceptable but could be better
          const suggestions = MessageAnalyzer.getSuggestions(message);
          let feedbackText = `Message quality: ${Math.round(quality)}/100. `;

          if (feedback.warning) {
            feedbackText += feedback.warning;
          }

          if (feedback.suggestion) {
            feedbackText += ` ${feedback.suggestion}`;
          }

          if (suggestions.length > 0) {
            feedbackText += '\n\nSuggestions:\n';
            suggestions.forEach(suggestion => {
              feedbackText += `• ${suggestion}\n`;
            });
          }

          errorDiv.textContent = feedbackText;
          errorDiv.style.display = 'block';
          e.target.classList.remove('form-input-error'); // Valid but with suggestions
        }
      }
    } else {
      // Fallback if MessageAnalyzer is not available
      const words = message.split(/\s+/).filter(word => word.length > 0);
      const isOnlyNumbers = /^\d+$/.test(message.replace(/\s/g, ''));

      if (words.length < 5 || isOnlyNumbers) {
        errorDiv.textContent = 'Message must contain at least 5 words and not be only numbers';
        errorDiv.style.display = 'block';
        e.target.classList.add('form-input-error');
      } else {
        errorDiv.style.display = 'none';
        e.target.classList.remove('form-input-error');
      }
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

    // Use MessageAnalyzer for validation if available
    if (typeof MessageAnalyzer !== 'undefined') {
      const validation = MessageAnalyzer.validateMessage(message);
      return validation.valid;
    }

    // Fallback validation
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
    const honeypotInput = form.querySelector('#website');
    const submitBtn = form.querySelector('.form-submit');

    // ================================================================
    // SECURITY CHECK 1: Honeypot validation (bot detection)
    // ================================================================
    if (!SecurityHelper.validateHoneypot(honeypotInput.value)) {
      console.warn('Honeypot field filled - suspected bot submission blocked');
      // Silently fail - don't inform the bot
      return;
    }

    // ================================================================
    // SECURITY CHECK 2: Rate limiting
    // ================================================================
    if (!SecurityHelper.checkRateLimit()) {
      document.getElementById('email-error').textContent = 'Too many submissions. Please wait a moment before trying again.';
      document.getElementById('email-error').style.display = 'block';
      return;
    }

    // Sanitize inputs before validation
    const name = SecurityHelper.sanitizeInput(nameInput.value);
    const email = SecurityHelper.sanitizeInput(emailInput.value);
    const message = SecurityHelper.sanitizeInput(messageInput.value);

    // ================================================================
    // SECURITY CHECK 3: Injection attack detection
    // ================================================================
    const nameSecurityCheck = SecurityHelper.validateInputSecurity('name', nameInput.value);
    if (!nameSecurityCheck.valid) {
      document.getElementById('name-error').textContent = `Security violation: ${nameSecurityCheck.threat}`;
      document.getElementById('name-error').style.display = 'block';
      nameInput.classList.add('form-input-error');
      console.warn(`Injection attempt blocked in name field: ${nameSecurityCheck.threat}`);
      return;
    }

    const emailSecurityCheck = SecurityHelper.validateInputSecurity('email', emailInput.value);
    if (!emailSecurityCheck.valid) {
      document.getElementById('email-error').textContent = `Security violation: ${emailSecurityCheck.threat}`;
      document.getElementById('email-error').style.display = 'block';
      emailInput.classList.add('form-input-error');
      console.warn(`Injection attempt blocked in email field: ${emailSecurityCheck.threat}`);
      return;
    }

    const messageSecurityCheck = SecurityHelper.validateInputSecurity('message', messageInput.value);
    if (!messageSecurityCheck.valid) {
      document.getElementById('message-error').textContent = `Security violation: ${messageSecurityCheck.threat}`;
      document.getElementById('message-error').style.display = 'block';
      messageInput.classList.add('form-input-error');
      console.warn(`Injection attempt blocked in message field: ${messageSecurityCheck.threat}`);
      return;
    }

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

    // Create FormData for FormSubmit service
    const formData = new FormData();

    // ================================================================
    // SECURITY: Only send sanitized data
    // ================================================================
    formData.append('name', SecurityHelper.sanitizeInput(name));
    formData.append('email', SecurityHelper.sanitizeInput(email));
    formData.append('message', SecurityHelper.sanitizeInput(message));
    formData.append('_captcha', 'false');
    // Add CSRF token for additional security
    formData.append('csrf_token', SecurityHelper.getCSRFToken());

    // Send via FormSubmit service
    fetch('https://formsubmit.co/kahlonshai1@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        console.log('FormSubmit response status:', response.status);
        if (response.ok || response.status === 200) {
          console.log('Form submitted successfully');
          // Clear all error messages on success
          document.getElementById('email-error').style.display = 'none';
          document.getElementById('email-error').textContent = '';
          document.getElementById('name-error').style.display = 'none';
          document.getElementById('message-error').style.display = 'none';
          // Show success message and reset form
          showSuccessMessage(form);
          form.reset();
          return false;
        } else {
          console.log('Form submission response not ok:', response.status);
          throw new Error('Form submission failed with status ' + response.status);
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        document.getElementById('email-error').textContent = 'Error sending message. Please try again.';
        document.getElementById('email-error').style.display = 'block';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  };

  /**
   * Display success message after form submission
   */
  const showSuccessMessage = (form) => {
    const submitBtn = form.querySelector('.form-submit');

    // Show success message on button
    submitBtn.textContent = 'Message Sent! ✓';
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = '#10b981'; // Green color
    submitBtn.style.cursor = 'default';

    // Create floating notification (fixed position - doesn't affect layout)
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ecfdf5;
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 32px;
      color: #065f46;
      z-index: 9999;
      max-width: 400px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      text-align: center;
      animation: slideIn 0.3s ease-out;
    `;

    successMessage.innerHTML = `
      <h4 style="margin: 0 0 12px 0; font-weight: 700; font-size: 20px; color: #047857;">Thank You! ✓</h4>
      <p style="margin: 0; font-size: 15px; line-height: 1.6;">
        We've received your message and we'll reach out to you shortly.
        <br>
        Looking forward to collaborating with you!
      </p>
    `;

    document.body.appendChild(successMessage);

    // Add animation keyframes if not already present
    if (!document.querySelector('style[data-toast-animation]')) {
      const style = document.createElement('style');
      style.setAttribute('data-toast-animation', 'true');
      style.textContent = `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Reset button and form after delay
    setTimeout(() => {
      // Fade out animation
      successMessage.style.animation = 'slideOut 0.3s ease-out forwards';

      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = ''; // Reset to original color
        submitBtn.style.cursor = 'pointer';
        setupFormValidation(form); // Re-enable validation

        // Remove success message from DOM
        successMessage.remove();
      }, 300); // Wait for fade out animation to complete
    }, 4000); // Display for 4 seconds as requested
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
