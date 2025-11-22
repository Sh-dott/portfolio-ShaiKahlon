/**
 * Test domain misspelling/typo detection - FIXED VERSION
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

const isSuspiciousDomain = (domain) => {
  const commonDomains = [
    'gmail', 'gmail.com', 'yahoo', 'yahoo.com', 'outlook', 'outlook.com',
    'hotmail', 'hotmail.com', 'protonmail', 'protonmail.com',
    'aol', 'aol.com', 'icloud', 'icloud.com', 'mail', 'mail.com',
    'google', 'google.com', 'facebook', 'facebook.com'
  ];

  const domainName = domain.split('.')[0].toLowerCase();

  for (let common of commonDomains) {
    const commonName = common.split('.')[0].toLowerCase();
    const distance = levenshteinDistance(domainName, commonName);
    const maxLen = Math.max(domainName.length, commonName.length);

    // FIXED: Check distance > 0 FIRST to exclude exact matches
    if (distance > 0 && distance <= 3 && distance <= Math.ceil(maxLen * 0.4)) {
      return { suspicious: true, matched: commonName, distance: distance };
    }
  }

  return { suspicious: false, matched: null, distance: null };
};

console.log('\n' + '='.repeat(80));
console.log('DOMAIN MISSPELLING DETECTION TEST (FIXED)');
console.log('='.repeat(80) + '\n');

const testDomains = [
  // Should ALLOW (legitimate)
  { domain: 'gmail.com', label: 'Exact match - legitimate', shouldCatch: false },
  { domain: 'yahoo.com', label: 'Exact match - legitimate', shouldCatch: false },
  { domain: 'outlook.com', label: 'Exact match - legitimate', shouldCatch: false },
  { domain: 'company.com', label: 'Legitimate domain', shouldCatch: false },
  { domain: 'example.org', label: 'Legitimate domain', shouldCatch: false },
  { domain: 'custom-mail.com', label: 'Legitimate custom domain', shouldCatch: false },
  { domain: 'github.com', label: 'Legitimate tech company', shouldCatch: false },
  { domain: 'icloud.net', label: 'Different TLD but name OK', shouldCatch: false },

  // Should CATCH (typos/misspellings)
  { domain: 'gmdail.com', label: 'typo: gmail -> gmdail (distance 1)', shouldCatch: true },
  { domain: 'gmial.com', label: 'typo: gmail -> gmial (distance 2)', shouldCatch: true },
  { domain: 'gmai.com', label: 'typo: gmail -> gmai (distance 1)', shouldCatch: true },
  { domain: 'gamail.com', label: 'typo: gmail -> gamail (distance 1)', shouldCatch: true },
  { domain: 'yahho.com', label: 'typo: yahoo -> yahho (distance 1)', shouldCatch: true },
  { domain: 'yaho.com', label: 'typo: yahoo -> yaho (distance 1)', shouldCatch: true },
  { domain: 'outlok.com', label: 'typo: outlook -> outlok (distance 1)', shouldCatch: true },
  { domain: 'hotmial.com', label: 'typo: hotmail -> hotmial (distance 2)', shouldCatch: true },
  { domain: 'protonmial.com', label: 'typo: protonmail -> protonmial (distance 2)', shouldCatch: true }
];

let passed = 0;
let failed = 0;

testDomains.forEach(test => {
  const result = isSuspiciousDomain(test.domain);
  const isCorrect = result.suspicious === test.shouldCatch;

  if (isCorrect) {
    passed++;
    const status = result.suspicious ? 'CAUGHT' : 'ALLOWED';
    console.log('[PASS] ' + test.domain.padEnd(20) + ' ' + status);
    if (result.matched) {
      console.log('       Matched "' + result.matched + '" with distance ' + result.distance);
    }
  } else {
    failed++;
    console.log('[FAIL] ' + test.domain.padEnd(20) + ' Expected: ' + test.shouldCatch + ', Got: ' + result.suspicious);
  }
  console.log('       ' + test.label);
  console.log('');
});

console.log('='.repeat(80));
console.log('RESULTS: ' + passed + ' passed, ' + failed + ' failed out of ' + testDomains.length + ' tests');
console.log('='.repeat(80) + '\n');

if (failed === 0) {
  console.log('SUCCESS! All domain typo detection tests passed.\n');
}
