/**
 * Test that asfj is now REJECTED
 */

const isSuspiciousUsername = (username) => {
  const cleanUsername = username.replace(/[._-]/g, '').toLowerCase();

  // Check for consecutive consonants (4+ in a row)
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/.test(cleanUsername)) {
    console.log('  - Caught: 4+ consecutive consonants');
    return true;
  }

  // Suspicious patterns
  const suspiciousPatterns = [
    { pattern: /^qwerty/, name: 'qwerty' },
    { pattern: /^asdf/, name: 'asdf' },
    { pattern: /^zxcv/, name: 'zxcv' },
    { pattern: /^abc[a-z]*$/, name: 'abc...' },
    { pattern: /^xyz[a-z]*$/, name: 'xyz...' },
    { pattern: /^def[a-z]*$/, name: 'def...' },
    { pattern: /^ghi[a-z]*$/, name: 'ghi...' },
    { pattern: /^jkl[a-z]*$/, name: 'jkl...' },
    { pattern: /^123[0-9]*$/, name: '123...' },
    { pattern: /^[a-z]{3}[0-9]+$/, name: '[a-z]3[0-9]+' },
    { pattern: /^test[a-z0-9]*$/, name: 'test...' },
    { pattern: /^user[a-z0-9]*$/, name: 'user...' },
    { pattern: /^admin[a-z0-9]*$/, name: 'admin...' },
    { pattern: /^demo[a-z0-9]*$/, name: 'demo...' },
    { pattern: /^temp[a-z0-9]*$/, name: 'temp...' },
    { pattern: /^fake[a-z0-9]*$/, name: 'fake...' },
    { pattern: /^guest[a-z0-9]*$/, name: 'guest...' }
  ];

  for (let obj of suspiciousPatterns) {
    if (obj.pattern.test(cleanUsername)) {
      console.log('  - Caught: Pattern match "' + obj.name + '"');
      return true;
    }
  }

  // Vowel ratio check (25% threshold)
  const vowels = cleanUsername.match(/[aeiou]/g) || [];
  const consonants = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

  if (consonants.length > 0) {
    const ratio = vowels.length / (vowels.length + consonants.length);
    const percentage = (ratio * 100).toFixed(1);
    console.log('  - Vowel ratio: ' + percentage + '% (threshold: 25%)');

    if (ratio < 0.25) {
      console.log('  - Caught: Too few vowels');
      return true;
    }
  }

  console.log('  - No suspicious patterns detected');
  return false;
};

console.log('\n' + '='.repeat(80));
console.log('TEST: asfj@mail.com should now be REJECTED');
console.log('='.repeat(80) + '\n');

const tests = [
  { username: 'john', expected: false },
  { username: 'sarah', expected: false },
  { username: 'asfj', expected: true },
  { username: 'xyz', expected: true },
  { username: 'defj', expected: true },
  { username: 'asdfgh', expected: true },
  { username: 'qwerty', expected: true },
  { username: 'test', expected: true },
  { username: 'colddsa', expected: false },
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  console.log('Testing: ' + test.username);
  const isSuspicious = isSuspiciousUsername(test.username);
  const isCorrect = isSuspicious === test.expected;

  if (isCorrect) {
    passed++;
    const result = isSuspicious ? 'REJECTED' : 'ACCEPTED';
    console.log('Result: ' + result + ' ✓\n');
  } else {
    failed++;
    console.log('Result: ' + (isSuspicious ? 'REJECTED' : 'ACCEPTED') + ' ✗ (Expected ' + (test.expected ? 'REJECTED' : 'ACCEPTED') + ')\n');
  }
});

console.log('='.repeat(80));
console.log('RESULTS: ' + passed + ' passed, ' + failed + ' failed out of ' + tests.length);
console.log('='.repeat(80) + '\n');

if (failed === 0) {
  console.log('SUCCESS! asfj@mail.com is now REJECTED\n');
}
