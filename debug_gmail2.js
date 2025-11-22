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

console.log('\nDEBUG: gmail.com vs gmail');
const domainName = 'gmail';
const commonName = 'gmail';
const distance = levenshteinDistance(domainName, commonName);
console.log('domainName: "' + domainName + '"');
console.log('commonName: "' + commonName + '"');
console.log('distance: ' + distance);
console.log('distance > 0: ' + (distance > 0));
console.log('distance <= 3: ' + (distance <= 3));
console.log('distance <= 2: ' + (distance <= 2));

if (!(distance > 0 && distance <= 3 && distance <= 2)) {
  console.log('\nCondition failed - should NOT be suspicious');
}

// Now test what the real function returns
const isSuspiciousDomain = (domain) => {
  const commonDomains = [
    'gmail', 'gmail.com'
  ];

  const domainName = domain.split('.')[0].toLowerCase();
  console.log('\n\nTesting domain: ' + domain);
  console.log('Extracted domain name: ' + domainName);

  for (let common of commonDomains) {
    const commonName = common.split('.')[0].toLowerCase();
    const distance = levenshteinDistance(domainName, commonName);
    const maxLen = Math.max(domainName.length, commonName.length);
    const threshold = Math.ceil(maxLen * 0.4);

    console.log('\nChecking vs "' + commonName + '" (from "' + common + '")');
    console.log('  distance: ' + distance);
    console.log('  maxLen: ' + maxLen);
    console.log('  threshold: ' + threshold);
    console.log('  distance > 0: ' + (distance > 0));
    console.log('  distance <= 3: ' + (distance <= 3));
    console.log('  distance <= threshold: ' + (distance <= threshold));
    console.log('  ALL: ' + (distance > 0 && distance <= 3 && distance <= threshold));

    if (distance > 0 && distance <= 3 && distance <= threshold) {
      console.log('  RETURN TRUE HERE');
      return { suspicious: true, matched: commonName, distance: distance };
    }
  }

  return { suspicious: false, matched: null, distance: null };
};

const result = isSuspiciousDomain('gmail.com');
console.log('\n\nFinal result for gmail.com: ' + JSON.stringify(result));
