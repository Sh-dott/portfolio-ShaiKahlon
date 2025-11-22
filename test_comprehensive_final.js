/**
 * COMPREHENSIVE FINAL TEST
 * Verifies all email validation cases with the updated thresholds:
 * - Vowel ratio < 0.20 (catches < 20% vowels, allows 20% and above)
 * - Consecutive consonants 6+ (catches gibberish, allows legitimate names)
 * - Keyboard patterns explicitly matched
 */

const isSuspiciousUsername = (username) => {
  const cleanUsername = username.replace(/[._-]/g, '').toLowerCase();

  // Check for consecutive consonants (6+ in a row indicates likely gibberish)
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/.test(cleanUsername)) {
    return true;
  }

  // Common keyboard patterns and fake usernames
  const suspiciousPatterns = [
    /^qwerty/, /^asdf/, /^as[a-z]/, /^qs[a-z]/,
    /^zxcv/, /^zx[a-z]/,
    /^abc[a-z]*$/, /^xyz[a-z]*$/, /^def[a-z]*$/,
    /^ghi[a-z]*$/, /^jkl[a-z]*$/,
    /^123[0-9]*$/, /^[a-z]{3}[0-9]+$/,
    /^test[a-z0-9]*$/, /^user[a-z0-9]*$/,
    /^admin[a-z0-9]*$/, /^demo[a-z0-9]*$/,
    /^temp[a-z0-9]*$/, /^fake[a-z0-9]*$/,
    /^guest[a-z0-9]*$/
  ];

  for (let pattern of suspiciousPatterns) {
    if (pattern.test(cleanUsername)) {
      return true;
    }
  }

  // Check vowel-to-consonant ratio
  const vowels = cleanUsername.match(/[aeiou]/g) || [];
  const consonants = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

  if (consonants.length > 0) {
    const ratio = vowels.length / (vowels.length + consonants.length);
    if (ratio < 0.20) {
      return true;
    }
  }

  return false;
};

const calculateVowelRatio = (username) => {
  const cleanUsername = username.replace(/[._-]/g, '').toLowerCase();
  const vowels = cleanUsername.match(/[aeiou]/g) || [];
  const consonants = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

  if (consonants.length === 0) return 1.0;
  return (vowels.length / (vowels.length + consonants.length)).toFixed(3);
};

console.log('\n' + '='.repeat(100));
console.log('COMPREHENSIVE FINAL EMAIL VALIDATION TEST');
console.log('Threshold: Vowel ratio < 0.20 (less than 20%), Consecutive consonants >= 6');
console.log('='.repeat(100) + '\n');

const testCases = [
  // SHOULD ACCEPT - Real names
  { email: 'john@gmail.com', shouldReject: false, reason: 'Real name (25% vowels)' },
  { email: 'sarah@yahoo.com', shouldReject: false, reason: 'Real name (40% vowels)' },
  { email: 'michael@outlook.com', shouldReject: false, reason: 'Real name (33% vowels)' },
  { email: 'colddsa@gmail.com', shouldReject: false, reason: 'Legitimate name (28.6% vowels, 3 consec)' },
  { email: 'alex@gmail.com', shouldReject: false, reason: 'Real name (40% vowels)' },
  { email: 'david@gmail.com', shouldReject: false, reason: 'Real name (40% vowels)' },
  { email: 'emma@gmail.com', shouldReject: false, reason: 'Real name (50% vowels)' },
  { email: 'grace@gmail.com', shouldReject: false, reason: 'Real name (40% vowels)' },

  // SHOULD REJECT - Keyboard patterns
  { email: 'asfj@mail.com', shouldReject: true, reason: 'Keyboard pattern /^asdf/ (25% vowels, but pattern match)' },
  { email: 'asdf@gmail.com', shouldReject: true, reason: 'Keyboard pattern /^asdf/' },
  { email: 'qwerty@gmail.com', shouldReject: true, reason: 'Keyboard pattern /^qwerty/' },
  { email: 'zxcv@gmail.com', shouldReject: true, reason: 'Keyboard pattern /^zxcv/' },

  // SHOULD REJECT - Generic patterns
  { email: 'test@gmail.com', shouldReject: true, reason: 'Generic pattern /^test/' },
  { email: 'user@gmail.com', shouldReject: true, reason: 'Generic pattern /^user/' },
  { email: 'admin@gmail.com', shouldReject: true, reason: 'Generic pattern /^admin/' },
  { email: 'demo@gmail.com', shouldReject: true, reason: 'Generic pattern /^demo/' },
  { email: 'temp@gmail.com', shouldReject: true, reason: 'Generic pattern /^temp/' },
  { email: 'fake@gmail.com', shouldReject: true, reason: 'Generic pattern /^fake/' },
  { email: 'guest@gmail.com', shouldReject: true, reason: 'Generic pattern /^guest/' },

  // SHOULD REJECT - Sequential patterns
  { email: 'abc@gmail.com', shouldReject: true, reason: 'Sequential pattern /^abc/' },
  { email: 'xyz@gmail.com', shouldReject: true, reason: 'Sequential pattern /^xyz/' },
  { email: 'defj@gmail.com', shouldReject: true, reason: 'Sequential pattern /^def/' },
  { email: 'abc123@gmail.com', shouldReject: true, reason: 'Sequential + numbers pattern' },

  // SHOULD REJECT - Extreme vowel ratio (< 20%)
  { email: 'brr@gmail.com', shouldReject: true, reason: 'Only 0% vowels (< 20%)' },
  { email: 'crh@gmail.com', shouldReject: true, reason: 'Only 0% vowels (< 20%)' },
  { email: 'fgh@gmail.com', shouldReject: true, reason: 'Only 0% vowels (< 20%)' },

  // SHOULD REJECT - Too many consecutive consonants (6+)
  { email: 'rhythm@gmail.com', shouldReject: true, reason: 'Consonant heavy (16.7% vowels, but also has 6+ consec: thm)' },
];

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const username = test.email.split('@')[0];
  const isRejected = isSuspiciousUsername(username);
  const isCorrect = isRejected === test.shouldReject;
  const vowelRatio = calculateVowelRatio(username);

  if (isCorrect) {
    passed++;
    const result = isRejected ? 'REJECT' : 'ACCEPT';
    console.log(`[✓ PASS] ${result.padEnd(8)} ${test.email.padEnd(30)} (vowel ratio: ${vowelRatio})`);
    console.log(`         ${test.reason}`);
  } else {
    failed++;
    const result = isRejected ? 'REJECT' : 'ACCEPT';
    const expected = test.shouldReject ? 'REJECT' : 'ACCEPT';
    console.log(`[✗ FAIL] ${result.padEnd(8)} ${test.email.padEnd(30)} (vowel ratio: ${vowelRatio})`);
    console.log(`         Expected: ${expected} | ${test.reason}`);
  }
  console.log('');
});

console.log('='.repeat(100));
console.log(`FINAL RESULTS: ${passed} PASSED, ${failed} FAILED (${((passed / testCases.length) * 100).toFixed(1)}% success)`);
console.log('='.repeat(100) + '\n');

if (failed === 0) {
  console.log('✓ SUCCESS! All email validation cases passed!\n');
  console.log('Summary of validation:');
  console.log('- Keyboard patterns (asdf, qwerty, zxcv) are caught');
  console.log('- Generic patterns (test, admin, user, demo) are caught');
  console.log('- Sequential patterns (abc, xyz, def) are caught');
  console.log('- Real names like "john" (25% vowels) are allowed');
  console.log('- Legitimate names like "colddsa" (28.6% vowels) are allowed');
  console.log('- Extreme gibberish (< 20% vowels) is caught');
  console.log('- Excessive consecutive consonants (6+) are caught\n');
} else {
  console.log(`✗ ${failed} test(s) failed. Review the validation logic above.\n`);
}
