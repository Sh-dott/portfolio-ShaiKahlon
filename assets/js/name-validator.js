/**
 * Semantic Name Validator
 * ============================================================================
 * Analyzes whether input looks like a real human name by examining:
 * - Phonetic patterns (vowel-consonant balance)
 * - Natural language characteristics
 * - Common name patterns and structures
 * - Cultural naming conventions
 *
 * This validator works independently from the database, so unrecognized
 * names that LOOK like real names are still accepted.
 * Updated: November 2025
 */

const SemanticNameValidator = (() => {
  // Common name prefixes (first 2-3 letters of names)
  const NAME_PREFIXES = new Set([
    'john', 'james', 'mary', 'robert', 'michael', 'william', 'david', 'richard',
    'joseph', 'charles', 'thomas', 'daniel', 'matthew', 'anthony', 'mark',
    'donald', 'steven', 'paul', 'andrew', 'kenneth', 'jose', 'carlos', 'juan',
    'luis', 'maria', 'carmen', 'rosa', 'ana', 'maria', 'jean', 'pierre', 'marie',
    'jacques', 'philippe', 'anna', 'anna', 'giovanni', 'antonio', 'marco',
    'giuseppe', 'franco', 'patricia', 'barbara', 'elizabeth', 'susan', 'jessica',
    'sarah', 'karen', 'nancy', 'betty', 'margaret', 'sandra', 'ashley',
    'kimberly', 'emily', 'donna', 'michelle', 'dorothy', 'carol', 'amanda',
    'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura', 'cynthia',
    'ivan', 'sergei', 'nikolai', 'alexei', 'vladimir', 'takeshi', 'toshiro',
    'kenji', 'hiroshi', 'alexand', 'alexei', 'oleg', 'dmitri', 'boris',
    'mohammad', 'abdul', 'ahmed', 'hassan', 'hussein', 'ibrahim', 'fatima',
    'aisha', 'ali', 'amin', 'karim', 'malik', 'nasser'
  ]);

  // Common name suffixes (last 2-3 letters of names)
  const NAME_SUFFIXES = new Set([
    'ia', 'na', 'ak', 'ov', 'ska', 'indo', 'sso', 'el', 'an', 'en', 'on',
    'er', 'ar', 'ur', 'or', 'ir', 'la', 'lo', 'li', 'le', 'a', 'o', 'e',
    'h', 't', 'd', 'n', 's', 'x', 'z', 'o', 'a', 'i', 'ch', 'sh', 'th',
    'ina', 'enko', 'enko', 'ina', 'eva', 'ova', 'ova', 'enko', 'vich',
    'zer', 'sen', 'son', 'ten', 'man', 'men', 'berg', 'stein', 'baum',
    'ski', 'ska', 'czyk', 'wicz', 'sky', 'enko', 'dze', 'dze'
  ]);

  /**
   * Calculate vowel percentage in a string
   */
  const getVowelRatio = (str) => {
    const vowels = (str.match(/[aeiou]/gi) || []).length;
    const consonants = (str.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
    const total = vowels + consonants;

    if (total === 0) return 0;
    return vowels / total;
  };

  /**
   * Check for consonant clusters (max 3 consecutive consonants is normal)
   */
  const hasExcessiveConsonantClusters = (str) => {
    // More than 3 consonants in a row is unusual for human names
    return /[bcdfghjklmnpqrstvwxyz]{4,}/i.test(str);
  };

  /**
   * Check for excessive vowel clusters
   */
  const hasExcessiveVowelClusters = (str) => {
    // More than 3 vowels in a row is unusual (like "aeiou")
    return /[aeiou]{4,}/i.test(str);
  };

  /**
   * Check if name has common name patterns
   */
  const hasCommonNamePatterns = (str) => {
    const lower = str.toLowerCase();

    // Check for common prefixes
    for (let prefix of NAME_PREFIXES) {
      if (lower.startsWith(prefix.substring(0, 3))) return true;
    }

    // Check for common suffixes
    for (let suffix of NAME_SUFFIXES) {
      if (lower.endsWith(suffix)) return true;
    }

    // Check for vowel-consonant alternation pattern
    const pattern = str
      .toLowerCase()
      .replace(/[aeiou]/g, 'v')
      .replace(/[bcdfghjklmnpqrstvwxyz]/g, 'c');

    // Good names have alternating patterns like: cvccvc, cvcvc, vcvcv, etc.
    if (/cv|vc/.test(pattern)) return true;

    return false;
  };

  /**
   * Check if all letters are the same
   */
  const hasRepeatedLetters = (str) => {
    return /(.)\1{2,}/i.test(str); // aaaa, xxxx, etc.
  };

  /**
   * Analyze if input looks like a human name
   */
  const looksLikeHumanName = (str) => {
    if (!str || str.length < 3) return false;

    const lower = str.toLowerCase();

    // Check basic criteria
    if (hasRepeatedLetters(lower)) return false; // "aaaa" is not a name
    if (hasExcessiveConsonantClusters(lower)) return false; // "vfsd" has 4 consonants
    if (hasExcessiveVowelClusters(lower)) return false; // "aeiou" is not a name

    // Check vowel ratio (names typically have 20-50% vowels)
    const vowelRatio = getVowelRatio(lower);
    if (vowelRatio < 0.15 || vowelRatio > 0.60) return false;

    // For single-name (no spaces), require 4+ characters
    if (!lower.includes(' ') && lower.length < 4) return false;

    // Check if it has common name patterns
    if (hasCommonNamePatterns(lower)) return true;

    // Even if no common patterns, if vowels are balanced and length is reasonable, might be valid
    if (lower.length >= 4 && vowelRatio >= 0.25) return true;

    return false;
  };

  /**
   * Get confidence score (0-100) for whether input is a name
   */
  const getNameConfidenceScore = (str) => {
    if (!str || str.length < 3) return 0;

    let score = 50; // Base score
    const lower = str.toLowerCase();

    // Length bonus/penalty
    if (lower.length < 4) score -= 20;
    else if (lower.length >= 6) score += 5;

    // Vowel ratio check
    const vowelRatio = getVowelRatio(lower);
    if (vowelRatio >= 0.25 && vowelRatio <= 0.45) {
      score += 15; // Perfect vowel ratio
    } else if (vowelRatio >= 0.15 && vowelRatio <= 0.50) {
      score += 5; // Acceptable vowel ratio
    } else {
      score -= 30; // Bad vowel ratio
    }

    // Consonant cluster penalty
    if (hasExcessiveConsonantClusters(lower)) score -= 40;

    // Vowel cluster penalty
    if (hasExcessiveVowelClusters(lower)) score -= 40;

    // Repeated letters penalty
    if (hasRepeatedLetters(lower)) score -= 30;

    // Common pattern bonus
    if (hasCommonNamePatterns(lower)) score += 20;

    // Multi-part name bonus
    if (lower.includes(' ')) score += 10;

    return Math.max(0, Math.min(100, score));
  };

  /**
   * Validate name with comprehensive analysis
   */
  const validateName = (str) => {
    if (!str || str.length < 3) {
      return {
        valid: false,
        confidence: 0,
        reason: 'Name too short (minimum 3 characters)',
        looksLikeName: false
      };
    }

    const lower = str.toLowerCase();
    const confidenceScore = getNameConfidenceScore(str);
    const looksLike = looksLikeHumanName(str);

    // Analyze why it might not be a name
    const issues = [];
    if (hasRepeatedLetters(lower)) {
      issues.push('Contains repeated characters (aaaa, xxxx, etc.)');
    }
    if (hasExcessiveConsonantClusters(lower)) {
      issues.push('Too many consonants in a row (like "vfsd")');
    }
    if (hasExcessiveVowelClusters(lower)) {
      issues.push('Too many vowels in a row');
    }

    const vowelRatio = getVowelRatio(lower);
    if (vowelRatio < 0.15) {
      issues.push(`Not enough vowels (${Math.round(vowelRatio * 100)}% - names usually have 20-50%)`);
    }
    if (vowelRatio > 0.60) {
      issues.push(`Too many vowels (${Math.round(vowelRatio * 100)}% - names usually have 20-50%)`);
    }

    if (!lower.includes(' ') && lower.length < 4) {
      issues.push('Single names must be at least 4 characters');
    }

    return {
      valid: looksLike || confidenceScore >= 70,
      confidence: confidenceScore,
      looksLikeName: looksLike,
      issues: issues.length > 0 ? issues : null,
      vowelRatio: Math.round(vowelRatio * 100),
      length: lower.length
    };
  };

  return {
    validateName,
    looksLikeHumanName,
    getNameConfidenceScore,
    getVowelRatio,
    hasExcessiveConsonantClusters,
    hasExcessiveVowelClusters,
    hasCommonNamePatterns,
    hasRepeatedLetters
  };
})();
