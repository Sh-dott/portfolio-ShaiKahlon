/**
 * FINAL TEST - Domain typo detection with exact match check
 */

const levenshteinDistance = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];
  for (let i = 0; i <= len2; i++) matrix[i] = [i];
  for (let j = 0; j <= len1; j++) matrix[0][j] = j;
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

  // Check for exact matches FIRST
  for (let common of commonDomains) {
    const commonName = common.split('.')[0].toLowerCase();
    if (domainName === commonName) {
      return false; // Exact match, not suspicious
    }
  }

  // Then check for typos
  for (let common of commonDomains) {
    const commonName = common.split('.')[0].toLowerCase();
    const distance = levenshteinDistance(domainName, commonName);
    const maxLen = Math.max(domainName.length, commonName.length);
    if (distance > 0 && distance <= 3 && distance <= Math.ceil(maxLen * 0.4)) {
      return true;
    }
  }

  return false;
};

console.log('\n' + '='.repeat(80));
console.log('FINAL TEST: Domain Typo Detection');
console.log('='.repeat(80) + '\n');

const tests = [
  { email: 'colddsa@gmail.com', shouldReject: false, reason: 'Exact match - legitimate' },
  { email: 'colddsa@gmdail.com', shouldReject: true, reason: 'Typo: gmdail vs gmail' },
  { email: 'john@yahoo.com', shouldReject: false, reason: 'Exact match - legitimate' },
  { email: 'john@yahho.com', shouldReject: true, reason: 'Typo: yahho vs yahoo' },
  { email: 'user@outlook.com', shouldReject: false, reason: 'Exact match - legitimate' },
  { email: 'user@outlok.com', shouldReject: true, reason: 'Typo: outlok vs outlook' },
  { email: 'test@company.com', shouldReject: false, reason: 'Legitimate custom domain' },
  { email: 'test@gmial.com', shouldReject: true, reason: 'Typo: gmial vs gmail' },
  { email: 'test@gmai.com', shouldReject: true, reason: 'Typo: gmai vs gmail' }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const domain = test.email.split('@')[1];
  const isRejected = isSuspiciousDomain(domain);
  const isCorrect = isRejected === test.shouldReject;

  if (isCorrect) {
    passed++;
    const status = isRejected ? 'REJECTED' : 'ACCEPTED';
    console.log('[PASS] ' + status.padEnd(10) + ' ' + test.email.padEnd(25) + ' - ' + test.reason);
  } else {
    failed++;
    console.log('[FAIL] ' + test.email + ' - Expected: ' + (test.shouldReject ? 'REJECT' : 'ACCEPT') + ', Got: ' + (isRejected ? 'REJECT' : 'ACCEPT'));
  }
});

console.log('\n' + '='.repeat(80));
console.log('RESULTS: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(80) + '\n');

if (failed === 0) {
  console.log('SUCCESS! colddsa@gmdail.com is now REJECTED as a typo.\n');
}
