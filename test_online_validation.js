/**
 * Test online email validation using free APIs
 * We'll check several problematic emails
 */

const https = require('https');

// Function to check email via Hunter.io free API (limited but reliable)
const checkEmailViaHunter = (email) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.hunter.io',
      path: '/v2/email-verifier?domain=' + email.split('@')[1] + '&email=' + email,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };

    // Note: Hunter.io requires API key, showing alternative below
    console.log('Note: Hunter.io requires API key');
    resolve(null);
  });
};

// Function to check email via ZeroBounce API (free tier available)
const checkEmailViaZeroBounce = (email) => {
  return new Promise((resolve) => {
    console.log('\nChecking via ZeroBounce API...');
    console.log('Email: ' + email);
    
    const domain = email.split('@')[1];
    
    // For demonstration, we'll use a simple domain validation approach
    // Real validation would use ZeroBounce's API
    
    const options = {
      hostname: 'bulkapi.zerobounce.net',
      path: '/api/v1/validate?email=' + encodeURIComponent(email) + '&apikey=test_key',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => {
      req.abort();
      resolve(null);
    });
    req.end();
  });
};

// Simple domain validity check using DNS lookups
const checkDomainMX = (domain) => {
  return new Promise((resolve) => {
    const dns = require('dns');
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        resolve({ valid: false, reason: 'No MX records found' });
      } else {
        resolve({ valid: true, reason: 'MX records found: ' + addresses.length });
      }
    });
  });
};

// Main testing function
const testEmailsOnline = async () => {
  console.log('\n' + '='.repeat(80));
  console.log('ONLINE EMAIL VALIDATION TEST');
  console.log('='.repeat(80));

  const testEmails = [
    'colddsa@gmdail.com',      // Typo (should be gmail)
    'asfj@mail.com',           // Random letters (suspicious)
    'john@gmail.com',          // Legitimate
    'sarah@yahoo.com',         // Legitimate
    'test@nonexistentdomain123456.com',  // Invalid domain
  ];

  console.log('\nPhase 1: MX Record Validation (DNS check)\n');
  
  for (let email of testEmails) {
    const domain = email.split('@')[1];
    console.log('Testing: ' + email);
    
    const result = await checkDomainMX(domain);
    console.log('  Domain: ' + domain);
    console.log('  Status: ' + (result.valid ? 'VALID' : 'INVALID'));
    console.log('  Reason: ' + result.reason);
    console.log('');
  }

  console.log('='.repeat(80));
  console.log('INTERPRETATION');
  console.log('='.repeat(80));
  console.log('\nMX Records (Mail Exchange records) tell us:');
  console.log('- If a domain CAN receive emails');
  console.log('- Does NOT verify if specific local-part exists');
  console.log('');
  console.log('Examples:');
  console.log('- asfj@mail.com: domain "mail.com" has MX → VALID DOMAIN');
  console.log('  BUT: user "asfj" may not actually exist');
  console.log('');
  console.log('- colddsa@gmdail.com: domain "gmdail.com" has NO MX → INVALID');
  console.log('  OR: exists but is not a real email provider typo');
};

testEmailsOnline().catch(console.error);
