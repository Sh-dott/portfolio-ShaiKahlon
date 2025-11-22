/**
 * Deep dive into why defj fails but john passes
 */

const isSuspiciousUsername = (username) => {
  const cleanUsername = username.replace(/[._-]/g, '').toLowerCase();
  console.log('  Analyzing: ' + cleanUsername);

  // Check for consecutive consonants
  const consonantMatch = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]{5,}/);
  if (consonantMatch) {
    console.log('  - Consecutive consonants (5+): YES - ' + consonantMatch[0]);
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
    { pattern: /^[a-z]{3}[0-9]+$/, name: '[a-z]{3}[0-9]+' },
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
      console.log('  - Pattern match: YES - ' + obj.name);
      return true;
    }
  }

  // Vowel-to-consonant ratio
  const vowels = cleanUsername.match(/[aeiou]/g) || [];
  const consonants = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

  const ratio = consonants.length > 0 ? vowels.length / (vowels.length + consonants.length) : 0;
  const percentage = (ratio * 100).toFixed(1);

  console.log('  - Vowels: ' + vowels.join(',') + ' (' + vowels.length + ')');
  console.log('  - Consonants: ' + consonants.join(',') + ' (' + consonants.length + ')');
  console.log('  - Ratio: ' + percentage + '% (threshold: 15%)');

  if (ratio < 0.15) {
    console.log('  - Result: SUSPICIOUS (vowel % too low)');
    return true;
  }

  console.log('  - Result: OK');
  return false;
};

console.log('\n=== ANALYZING: defj ===');
const defj = isSuspiciousUsername('defj');
console.log('SUSPICIOUS: ' + defj + '\n');

console.log('=== ANALYZING: john ===');
const john = isSuspiciousUsername('john');
console.log('SUSPICIOUS: ' + john + '\n');

console.log('=== ANALYZING: abc ===');
const abc = isSuspiciousUsername('abc');
console.log('SUSPICIOUS: ' + abc + '\n');

console.log('=== ANALYZING: test ===');
const test = isSuspiciousUsername('test');
console.log('SUSPICIOUS: ' + test + '\n');
