/**
 * Test: colddsa@gmdail.com should now be REJECTED
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

    if (distance > 0 && distance <= 3 && distance <= Math.ceil(maxLen * 0.4)) {
      return { suspicious: true, matched: commonName, distance: distance };
    }
  }

  return { suspicious: false, matched: null, distance: null };
};

console.log('\n' + '='.repeat(80));
console.log('THE SPECIFIC CASE: colddsa@gmdail.com');
console.log('='.repeat(80) + '\n');

const result = isSuspiciousDomain('gmdail.com');
console.log('Email: colddsa@gmdail.com');
console.log('Domain: gmdail.com');
console.log('');
console.log('Analysis:');
console.log('- gmdail vs gmail');
console.log('  Letters: g m d a i l  vs  g m a i l');
console.log('  Diff: d is extra, position is wrong');
console.log('- Levenshtein distance: ' + result.distance);
console.log('- Matched common domain: ' + result.matched);
console.log('');
console.log('Result: ' + (result.suspicious ? 'REJECTED (typo detected)' : 'ACCEPTED'));
console.log('');
console.log('='.repeat(80));
console.log('COMPARISON TESTS');
console.log('='.repeat(80) + '\n');

const tests = [
  { email: 'colddsa@gmail.com', desc: 'Legitimate - exact gmail.com' },
  { email: 'colddsa@gmdail.com', desc: 'FAKE - typo gmdail instead of gmail' },
  { email: 'john@yahoo.com', desc: 'Legitimate - exact yahoo.com' },
  { email: 'john@yahho.com', desc: 'FAKE - typo yahho instead of yahoo' },
  { email: 'user@outlook.com', desc: 'Legitimate - exact outlook.com' },
  { email: 'user@outlok.com', desc: 'FAKE - typo outlok instead of outlook' }
];

tests.forEach(test => {
  const domain = test.email.split('@')[1];
  const domainResult = isSuspiciousDomain(domain);
  const status = domainResult.suspicious ? 'REJECTED' : 'ACCEPTED';
  const reason = domainResult.suspicious ? ' (typo: ' + domain + ' vs ' + domainResult.matched + ')' : '';
  console.log(status.padEnd(10) + ' ' + test.email.padEnd(25) + ' - ' + test.desc + reason);
});

console.log('\n' + '='.repeat(80) + '\n');
