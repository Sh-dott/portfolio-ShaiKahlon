/**
 * Intelligent Message Content Analyzer
 * ============================================================================
 * Analyzes message content for real, meaningful communication
 * Detects spam, gibberish, repetitive text, and low-quality messages
 * Uses natural language processing patterns and heuristics
 * Updated: November 2025
 */

const MessageAnalyzer = (() => {
  // Common spam words and patterns
  const SPAM_KEYWORDS = new Set([
    'viagra', 'cialis', 'poker', 'casino', 'lottery', 'prize', 'winner',
    'click here', 'buy now', 'limited offer', 'act now', 'call now', 'visit',
    'free money', 'easy money', 'make money', 'earn cash', 'work from home',
    'bitcoin', 'cryptocurrency', 'forex', 'trading', 'stock tips',
    'weight loss', 'diet pills', 'supplements', 'skincare',
    'free trial', 'no credit card', 'unsubscribe', 'click below',
    'nigerian prince', 'inheritance', 'transfer funds', 'bank account',
    'confirm password', 'update payment', 'verify account', 'click link',
  ]);

  // Common gibberish patterns
  const GIBBERISH_PATTERNS = [
    /([a-z])\1{3,}/gi, // Repeated characters: aaaa
    /[^aeiou\s]{7,}/gi, // Long consonant strings
    /[0-9]{5,}/g, // Long number sequences
    /[!@#$%^&*]{3,}/g, // Multiple special chars
  ];

  /**
   * Check if text is spam
   */
  const isSpam = (text) => {
    const lower = text.toLowerCase();

    // Check for spam keywords
    for (let keyword of SPAM_KEYWORDS) {
      if (lower.includes(keyword)) {
        return true;
      }
    }

    // Check for excessive links
    const urlCount = (text.match(/https?:\/\/|www\./gi) || []).length;
    if (urlCount > 1) return true;

    // Check for email harvesting patterns
    if ((text.match(/@/g) || []).length > 2) return true;

    return false;
  };

  /**
   * Check for gibberish text
   */
  const isGibberish = (text) => {
    // Check repeated characters
    if (/([a-z])\1{3,}/i.test(text)) return true;

    // Check long consonant strings
    const consonantMatch = text.match(/[bcdfghjklmnpqrstvwxyz]{7,}/i);
    if (consonantMatch) return true;

    // Check vowel ratio (should have ~40% vowels)
    const vowels = (text.match(/[aeiou]/gi) || []).length;
    const consonants = (text.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
    const total = vowels + consonants;

    if (total > 0) {
      const vowelRatio = vowels / total;
      if (vowelRatio < 0.2 || vowelRatio > 0.8) {
        return true; // Too few or too many vowels
      }
    }

    return false;
  };

  /**
   * Detect repetitive/copied text
   */
  const isRepetitive = (text) => {
    const words = text.toLowerCase().split(/\s+/);

    // Check if same word repeated too many times
    const wordCount = {};
    for (let word of words) {
      if (word.length > 2) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }

    // If one word appears more than 30% of text
    for (let word in wordCount) {
      if (wordCount[word] / words.length > 0.3) {
        return true;
      }
    }

    // Check for repeated phrases
    const phrases = text.toLowerCase().split(/[.!?]+/);
    if (phrases.length > 2) {
      const phraseCounts = {};
      for (let phrase of phrases) {
        const trimmed = phrase.trim();
        if (trimmed.length > 10) {
          phraseCounts[trimmed] = (phraseCounts[trimmed] || 0) + 1;
        }
      }

      for (let phrase in phraseCounts) {
        if (phraseCounts[phrase] > 1) {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * Check if message has real conversational content
   */
  const hasRealContent = (text) => {
    if (!text || text.length < 20) return false;

    // Must have at least 5 words
    const words = text.trim().split(/\s+/);
    if (words.length < 5) return false;

    // Must have at least one complete sentence (. ! or ?)
    if (!/[.!?]/.test(text)) return false;

    // Check for capitalization (real messages have proper capitalization)
    const hasCapital = /[A-Z]/.test(text);
    if (!hasCapital) return false;

    // Check for minimum word length (avoid single letters)
    const avgWordLength = text.replace(/\s/g, '').length / words.length;
    if (avgWordLength < 2) return false;

    return true;
  };

  /**
   * Calculate message quality score (0-100)
   */
  const calculateQuality = (text) => {
    let score = 50; // Base score

    // Length bonus (more detailed = better)
    const words = text.trim().split(/\s+/);
    if (words.length < 5) score -= 20;
    else if (words.length < 10) score -= 10;
    else if (words.length > 50) score += 10;

    // Sentence structure bonus
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2) score -= 10;
    else if (sentences.length >= 3) score += 10;

    // Punctuation bonus (proper writing)
    if (/[.!?]$/.test(text)) score += 5;
    if (/[,]/.test(text)) score += 5;

    // Vocabulary bonus (varied word usage)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const uniqueRatio = uniqueWords.size / words.length;
    if (uniqueRatio > 0.6) score += 10;
    if (uniqueRatio < 0.4) score -= 10;

    // Spelling/grammar indicators
    if (/u r |ur |ur |yr |yur |4 |2day |2nite |c u |thru |plz |pls /i.test(text)) {
      score -= 15; // Text speak
    }

    // Excessive caps
    const caps = (text.match(/[A-Z]/g) || []).length;
    const capRatio = caps / words.length;
    if (capRatio > 0.5) score -= 15;

    // Spam penalty
    if (isSpam(text)) score -= 30;

    // Gibberish penalty
    if (isGibberish(text)) score -= 30;

    // Repetitive penalty
    if (isRepetitive(text)) score -= 25;

    return Math.max(0, Math.min(100, score));
  };

  /**
   * Get message quality feedback
   */
  const getQualityFeedback = (text) => {
    const quality = calculateQuality(text);
    const words = text.trim().split(/\s+/).length;

    if (quality < 30) {
      return {
        valid: false,
        reason: 'Message appears to be spam or gibberish',
        suggestion: 'Please write a genuine, thoughtful message'
      };
    }

    if (quality < 50) {
      return {
        valid: false,
        reason: 'Message seems low quality or unclear',
        suggestion: 'Please provide more details about your inquiry'
      };
    }

    if (quality < 70) {
      return {
        valid: true,
        warning: 'Message could be more detailed',
        suggestion: 'Consider adding more information'
      };
    }

    return {
      valid: true,
      feedback: 'Good message quality',
      suggestion: null
    };
  };

  /**
   * Comprehensive message validation
   */
  const validateMessage = (text) => {
    const issues = [];

    // Length check
    if (!text || text.length < 20) {
      issues.push('Message is too short (minimum 20 characters)');
    }

    // Word count
    const words = text.trim().split(/\s+/);
    if (words.length < 5) {
      issues.push('Message must contain at least 5 words');
    }

    // Spam check
    if (isSpam(text)) {
      issues.push('Message appears to be spam');
    }

    // Gibberish check
    if (isGibberish(text)) {
      issues.push('Message contains nonsensical content');
    }

    // Repetitive check
    if (isRepetitive(text)) {
      issues.push('Message has excessive repetition');
    }

    // Content quality check
    if (!hasRealContent(text)) {
      issues.push('Message lacks meaningful content');
    }

    // Sentence structure
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) {
      issues.push('Message must contain at least one complete sentence');
    }

    return {
      valid: issues.length === 0,
      issues,
      quality: calculateQuality(text),
      feedback: getQualityFeedback(text)
    };
  };

  /**
   * Get message improvement suggestions
   */
  const getSuggestions = (text) => {
    const suggestions = [];

    if (text.length < 50) {
      suggestions.push('Add more detail to your message');
    }

    if (!/[.!?]$/.test(text)) {
      suggestions.push('End your message with proper punctuation');
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 1) {
      suggestions.push('Consider adding multiple sentences for clarity');
    }

    if (/u r |ur |ur |yr |yur |4 |2day |2nite |c u |thru |plz |pls /i.test(text)) {
      suggestions.push('Use proper spelling instead of text speak');
    }

    const caps = (text.match(/[A-Z]/g) || []).length;
    const capRatio = caps / text.split(/\s+/).length;
    if (capRatio > 0.5) {
      suggestions.push('Use proper capitalization (avoid excessive caps)');
    }

    return suggestions;
  };

  return {
    validateMessage,
    calculateQuality,
    getQualityFeedback,
    getSuggestions,
    isSpam,
    isGibberish,
    isRepetitive,
    hasRealContent
  };
})();
