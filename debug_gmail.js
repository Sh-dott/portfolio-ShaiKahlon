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

console.log('\nDEBUG: gmail.com');
const domainName = 'gmail.com'.split('.')[0];
console.log('Domain name extracted: ' + domainName);

const commonDomains = ['gmail', 'gmail.com'];

commonDomains.forEach(common => {
  const commonName = common.split('.')[0];
  const distance = levenshteinDistance(domainName, commonName);
  const maxLen = Math.max(domainName.length, commonName.length);
  const threshold = Math.ceil(maxLen * 0.4);

  console.log('\nChecking "' + domainName + '" vs "' + commonName + '"');
  console.log('Distance: ' + distance);
  console.log('MaxLen: ' + maxLen);
  console.log('Threshold (40%): ' + threshold);
  console.log('Condition 1 - distance > 0: ' + (distance > 0));
  console.log('Condition 2 - distance <= 3: ' + (distance <= 3));
  console.log('Condition 3 - distance <= threshold: ' + (distance <= threshold));
  console.log('ALL CONDITIONS MET: ' + (distance > 0 && distance <= 3 && distance <= threshold));
});
