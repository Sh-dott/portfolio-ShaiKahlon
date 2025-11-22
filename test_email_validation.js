/**
 * Email Validation Test Suite
 * Tests the email validation logic in real-time
 */

// TLD Whitelist
const legitimateTLDs = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
  'io', 'co', 'uk', 'us', 'ca', 'au', 'de', 'fr', 'jp', 'ru', 'cn', 'in', 'br', 'mx',
  'info', 'biz', 'name', 'mobi', 'asia', 'tel', 'aero', 'coop', 'museum', 'pro',
  'xxx', 'cat', 'jobs', 'post', 'geo', 'travel', 'tv', 'cc', 'ws', 'app', 'dev',
  'online', 'site', 'shop', 'blog', 'cloud', 'ai', 'tech', 'digital', 'link',
  'download', 'social', 'website', 'space', 'services', 'solutions', 'systems', 'me'
]);

// Disposable domains
const disposableEmailDomains = new Set([
  'tempmail.com', 'temp-mail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'maildrop.cc', 'sharklasers.com', 'spam4.me',
  'trashmail.com', 'yopmail.com', 'throwaway.email', 'temp.email',
  'mailnesia.com', 'maileater.com', 'fakeinbox.com', 'throwawaymail.com',
  'go.cot', 'test.test', 'dev.test', 'local.test', 'localhost.test'
]);

// Email regex
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Suspicious username detector
const isSuspiciousUsername = (username) => {
  const cleanUsername = username.replace(/[._-]/g, '').toLowerCase();

  // Check for consecutive consonants
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/.test(cleanUsername)) {
    return true;
  }

  // Suspicious patterns
  const suspiciousPatterns = [
    /^qwerty/,
    /^asdf/,
    /^zxcv/,
    /^abc[a-z]*$/,
    /^xyz[a-z]*$/,
    /^def[a-z]*$/,
    /^ghi[a-z]*$/,
    /^jkl[a-z]*$/,
    /^123[0-9]*$/,
    /^[a-z]{3}[0-9]+$/,
    /^test[a-z0-9]*$/,
    /^user[a-z0-9]*$/,
    /^admin[a-z0-9]*$/,
    /^demo[a-z0-9]*$/,
    /^temp[a-z0-9]*$/,
    /^fake[a-z0-9]*$/,
    /^guest[a-z0-9]*$/
  ];

  for (let pattern of suspiciousPatterns) {
    if (pattern.test(cleanUsername)) {
      return true;
    }
  }

  // Vowel-to-consonant ratio
  const vowels = cleanUsername.match(/[aeiou]/g) || [];
  const consonants = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

  if (consonants.length > 0) {
    const ratio = vowels.length / (vowels.length + consonants.length);
    if (ratio < 0.15) {
      return true;
    }
  }

  return false;
};

// Complete validation function
const validateEmail = (email) => {
  email = email.toLowerCase().trim();
  const errors = [];

  if (!email) {
    return { valid: false, errors: ['Email is empty'] };
  }

  // Format check
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
    return { valid: false, errors };
  }

  const [localPart, domain] = email.split('@');

  // Invalid characters in local part
  if (/[^a-z0-9._-]/.test(localPart)) {
    errors.push('Email contains invalid characters');
  }

  // Invalid characters in domain
  if (/[^a-z0-9.-]/.test(domain)) {
    errors.push('Domain contains invalid characters');
  }

  // Disposable domain
  if (disposableEmailDomains.has(domain)) {
    errors.push('Domain is on disposable/temporary email list');
  }

  // Suspicious patterns
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    errors.push('Invalid email format (suspicious dots)');
  }

  if (domain.includes('..')) {
    errors.push('Invalid domain format (consecutive dots)');
  }

  // TLD validation
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];

  if (!legitimateTLDs.has(tld)) {
    errors.push('TLD ".' + tld + '" is not legitimate');
  }

  // Domain name length
  const domainNamePart = domain.split('.').slice(0, -1).join('.');
  if (domainNamePart.length < 3) {
    errors.push('Domain name is too short (< 3 characters)');
  }

  // Username length
  if (localPart.length < 4) {
    errors.push('Username is too short (< 4 characters)');
  }

  // Suspicious username
  if (isSuspiciousUsername(localPart)) {
    errors.push('Username appears to be randomly generated/suspicious');
  }

  // Email length
  if (email.length < 5) {
    errors.push('Email is too short');
  }

  if (email.length > 254) {
    errors.push('Email is too long');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : ['All checks passed']
  };
};

// Test cases
const testEmails = [
  // Should PASS
  { email: 'john@gmail.com', expected: true, category: 'VALID' },
  { email: 'sarah.smith@gmail.com', expected: true, category: 'VALID' },
  { email: 'contact@company.org', expected: true, category: 'VALID' },
  { email: 'support@example.co.uk', expected: true, category: 'VALID' },
  { email: 'mike_johnson@yahoo.com', expected: true, category: 'VALID' },
  { email: 'alex-brown@protonmail.com', expected: true, category: 'VALID' },
  { email: 'david.johnson@github.io', expected: true, category: 'VALID' },

  // Should FAIL - Fake usernames
  { email: 'defj@gmail.com', expected: false, category: 'FAKE USERNAME' },
  { email: 'dej@gmail.com', expected: false, category: 'FAKE USERNAME' },
  { email: 'abc@gmail.com', expected: false, category: 'FAKE USERNAME' },
  { email: 'xyz@gmail.com', expected: false, category: 'FAKE USERNAME' },
  { email: 'prst@gmail.com', expected: false, category: 'FAKE USERNAME' },

  // Should FAIL - Suspicious patterns
  { email: 'qwerty@gmail.com', expected: false, category: 'KEYBOARD PATTERN' },
  { email: 'asdf@gmail.com', expected: false, category: 'KEYBOARD PATTERN' },
  { email: 'test123@example.com', expected: false, category: 'GENERIC PATTERN' },
  { email: 'user@example.com', expected: false, category: 'GENERIC PATTERN' },
  { email: 'admin@company.com', expected: false, category: 'GENERIC PATTERN' },

  // Should FAIL - Short domains
  { email: 'gf@r.com', expected: false, category: 'SHORT DOMAIN' },
  { email: 'contact@a.io', expected: false, category: 'SHORT DOMAIN' },
  { email: 'test@xy.com', expected: false, category: 'SHORT DOMAIN' },

  // Should FAIL - Short usernames
  { email: 'ab@gmail.com', expected: false, category: 'SHORT USERNAME' },

  // Should FAIL - Invalid TLDs
  { email: 'user@example.cot', expected: false, category: 'INVALID TLD' },
  { email: 'contact@domain.test', expected: false, category: 'INVALID TLD' },
  { email: 'test@site.xyz', expected: false, category: 'INVALID TLD' },

  // Should FAIL - Disposable domains
  { email: 'test@tempmail.com', expected: false, category: 'DISPOSABLE DOMAIN' },
  { email: 'user@mailinator.com', expected: false, category: 'DISPOSABLE DOMAIN' },
  { email: 'contact@go.cot', expected: false, category: 'DISPOSABLE DOMAIN' },

  // Should FAIL - Format issues
  { email: 'user..name@gmail.com', expected: false, category: 'INVALID FORMAT' },
  { email: 'user@domain..com', expected: false, category: 'INVALID FORMAT' },
  { email: '.user@gmail.com', expected: false, category: 'INVALID FORMAT' }
];

console.log('\n' + '='.repeat(80));
console.log('EMAIL VALIDATION TEST SUITE');
console.log('='.repeat(80) + '\n');

let passed = 0;
let failed = 0;

// Group by category
const byCategory = {};
testEmails.forEach(test => {
  if (!byCategory[test.category]) {
    byCategory[test.category] = [];
  }
  byCategory[test.category].push(test);
});

// Run tests
Object.keys(byCategory).forEach(category => {
  console.log('\n' + category);
  console.log('-'.repeat(80));

  byCategory[category].forEach(test => {
    const result = validateEmail(test.email);
    const isCorrect = result.valid === test.expected;

    if (isCorrect) {
      passed++;
      const status = result.valid ? 'VALID' : 'INVALID';
      console.log('[PASS] ' + test.email + ' -> ' + status);
    } else {
      failed++;
      console.log('[FAIL] ' + test.email + ' -> Expected: ' + test.expected + ', Got: ' + result.valid);
    }

    if (!result.valid && result.errors[0] !== 'All checks passed') {
      console.log('       Reason: ' + result.errors[0]);
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log('RESULTS: ' + passed + ' passed, ' + failed + ' failed out of ' + testEmails.length + ' tests');
console.log('='.repeat(80) + '\n');

if (failed === 0) {
  console.log('ALL TESTS PASSED! Email validation is working perfectly.');
} else {
  console.log(failed + ' test(s) failed. Review the results above.');
}
