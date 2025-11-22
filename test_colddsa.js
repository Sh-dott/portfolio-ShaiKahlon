/**
 * Analyze why colddsa@gmdail.com passes
 */

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isSuspiciousUsername = (username) => {
  const cleanUsername = username.replace(/[._-]/g, '').toLowerCase();
  console.log('Username: ' + cleanUsername);

  // Check for consecutive consonants
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/.test(cleanUsername)) {
    console.log('- Consecutive consonants (5+): YES');
    return true;
  }

  // Suspicious patterns
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
      console.log('- Pattern match: YES');
      return true;
    }
  }

  // Vowel-to-consonant ratio
  const vowels = cleanUsername.match(/[aeiou]/g) || [];
  const consonants = cleanUsername.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];
  const ratio = consonants.length > 0 ? vowels.length / (vowels.length + consonants.length) : 0;
  const percentage = (ratio * 100).toFixed(1);

  console.log('- Vowels: ' + vowels.join(',') + ' (' + vowels.length + ')');
  console.log('- Consonants: ' + consonants.join(',') + ' (' + consonants.length + ')');
  console.log('- Ratio: ' + percentage + '% (threshold: 15%)');

  if (ratio < 0.15) {
    console.log('- Result: SUSPICIOUS (too few vowels)');
    return true;
  }

  console.log('- Result: OK');
  return false;
};

console.log('\n=== ANALYZING: colddsa ===');
const isSuspicious = isSuspiciousUsername('colddsa');
console.log('SUSPICIOUS: ' + isSuspicious);

console.log('\n=== ANALYZING DOMAIN: gmdail ===');
const domain = 'gmdail';
console.log('Domain: ' + domain);
console.log('- Length: ' + domain.length + ' chars');
console.log('- This looks like "gmail" with typos (d->m misspelling)');
console.log('- Common misspellings: gmdail, gmial, gmai, gamail, etc.');

// Check for common domain misspellings/typos
const commonDomains = ['gmail', 'yahoo', 'outlook', 'hotmail', 'protonmail', 'aol'];
console.log('\n=== DOMAIN TYPO/SIMILARITY CHECK ===');
console.log('Checking if "' + domain + '" is similar to common domains...');

const isSimilar = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  if (Math.abs(len1 - len2) > 2) return false; // Too different
  
  // Simple similarity: count matching characters
  let matches = 0;
  for (let i = 0; i < Math.min(len1, len2); i++) {
    if (str1[i] === str2[i]) matches++;
  }
  
  const similarity = matches / Math.max(len1, len2);
  return similarity >= 0.6; // 60% or more characters match
};

commonDomains.forEach(common => {
  const sim = isSimilar(domain, common);
  console.log('- "' + domain + '" vs "' + common + '": ' + (sim ? 'SIMILAR' : 'different'));
});

console.log('\nREASON: "gmdail" passes because:');
console.log('1. It has reasonable vowel ratio (2/6 = 33%)');
console.log('2. It does not match any known suspicious patterns');
console.log('3. It is 6 chars long (no length issue)');
console.log('4. No current misspelling/typo detection');
console.log('\nSOLUTION NEEDED: Add domain name similarity check to catch common misspellings!');
