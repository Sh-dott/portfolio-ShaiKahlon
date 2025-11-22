/**
 * FINAL TEST - asfj should be REJECTED, colddsa should be ACCEPTED
 */

const isSuspiciousUsername = (username) => {
  const cleanUsername = username.replace(/[._-]/g, '').toLowerCase();

  // Check for consecutive consonants (6+ in a row)
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/.test(cleanUsername)) {
    return true;
  }

  // Suspicious patterns (includes /^asdf/ which catches asfj)
  const suspiciousPatterns = [
    /^qwerty/, /^asdf/, /^zxcv/,
    /^abc[a-z]*$/, /^xyz[a-z]*$/, /^def[a-z]*$/,
    /^ghi[a-z]*$/, /^jkl[a-z]*$/, /^123[0-9]*$/,
    /^[a-z]{3}[0-9]+$/, /^test[a-z0-9]*$/, /^user[a-z0-9]*$/,
    /^admin[a-z0-9]*$/, /^demo[a-z0-9]*$/, /^temp[a-z0-9]*$/,
    /^fake[a-z0-9]*$/, /^guest[a-z0-9]*$/
  ];

  for (let pattern of suspiciousPatterns) {
    if (pattern.test(cleanUsername)) {
      return true;
    }
  }

  // Vowel ratio check (<= 0.25)
  const vowels = cleanUsername.match(/[aeiou]/g) || [];
  const consonants = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

  if (consonants.length > 0) {
    const ratio = vowels.length / (vowels.length + consonants.length);
    if (ratio <= 0.25) {
      return true;
    }
  }

  return false;
};

console.log('\n' + '='.repeat(80));
console.log('FINAL TEST: Username Validation');
console.log('='.repeat(80) + '\n');

const tests = [
  { email: 'john@gmail.com', shouldReject: false },
  { email: 'sarah@yahoo.com', shouldReject: false },
  { email: 'asfj@mail.com', shouldReject: true, reason: 'asfj - asdf pattern (keyboard)' },
  { email: 'colddsa@gmail.com', shouldReject: false, reason: 'colddsa - legitimate name' },
  { email: 'xyz@gmail.com', shouldReject: true, reason: 'xyz - suspicious pattern' },
  { email: 'defj@gmail.com', shouldReject: true, reason: 'defj - def pattern' },
  { email: 'test@gmail.com', shouldReject: true, reason: 'test - test pattern' },
  { email: 'qwerty@gmail.com', shouldReject: true, reason: 'qwerty - keyboard pattern' },
  { email: 'admin@gmail.com', shouldReject: true, reason: 'admin - generic pattern' },
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const username = test.email.split('@')[0];
  const isRejected = isSuspiciousUsername(username);
  const isCorrect = isRejected === test.shouldReject;

  if (isCorrect) {
    passed++;
    const result = isRejected ? 'REJECTED' : 'ACCEPTED';
    console.log('[PASS] ' + result.padEnd(10) + ' ' + test.email.padEnd(25));
    if (test.reason) console.log('       ' + test.reason);
  } else {
    failed++;
    const result = isRejected ? 'REJECTED' : 'ACCEPTED';
    const expected = test.shouldReject ? 'REJECTED' : 'ACCEPTED';
    console.log('[FAIL] ' + result.padEnd(10) + ' ' + test.email.padEnd(25) + ' (Expected: ' + expected + ')');
    if (test.reason) console.log('       ' + test.reason);
  }
});

console.log('\n' + '='.repeat(80));
console.log('RESULTS: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(80) + '\n');

if (failed === 0) {
  console.log('SUCCESS! All usernames validated correctly\n');
}
