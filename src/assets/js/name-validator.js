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

  // Blacklist of common words, slang, abbreviations, and non-names
  // These should NEVER pass validation even if they look phonetically valid
  // This includes common English words that are NOT names
  const BLACKLIST = new Set([
    // Internet slang & abbreviations
    'nerd', 'geek', 'dork', 'lol', 'omg', 'wtf', 'btw', 'fyi', 'asap', 'aka',
    'lmao', 'rofl', 'smh', 'fml', 'wtf', 'omg', 'lol', 'lololol',

    // Tech/Programming
    'test', 'admin', 'user', 'guest', 'root', 'temp', 'demo', 'fake',
    'noname', 'nobody', 'unknown', 'anon', 'spam', 'bot', 'robot', 'script',
    'code', 'html', 'java', 'python', 'css', 'json', 'xml', 'api', 'sql',
    'hack', 'virus', 'trojan', 'malware', 'worm', 'exploit', 'payload',
    'sudo', 'pass', 'password', 'login', 'default', 'system', 'kernel', 'driver', 'config', 'debug',
    'null', 'void', 'error', 'fail', 'crash', 'bug', 'glitch', 'lag',

    // Placeholders & test names
    'test1', 'test2', 'test123', 'user1', 'admin1', 'test456',
    'dummyname', 'dummy', 'example', 'sample', 'placeholder',
    'firstname', 'lastname', 'middlename', 'fullname',
    'asdf', 'qwerty', 'qwer', 'zxcv', 'abcd', 'abcdef',

    // Repeated letters
    'aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj',
    'kkk', 'lll', 'mmm', 'nnn', 'ooo', 'ppp', 'qqq', 'rrr', 'sss', 'ttt',
    'uuu', 'vvv', 'www', 'xxx', 'yyy', 'zzz',

    // Common English words (NOT names)
    'able', 'about', 'above', 'ache', 'acid', 'aged', 'aide', 'aide', 'also', 'arch',
    'area', 'arts', 'atom', 'bank', 'bare', 'barn', 'base', 'bath', 'bean', 'bear',
    'beat', 'been', 'bell', 'belt', 'bend', 'bent', 'best', 'bike', 'bird', 'bite',
    'blow', 'blue', 'boat', 'body', 'bone', 'book', 'boom', 'boot', 'born', 'boss',
    'both', 'bowl', 'bulk', 'burn', 'bush', 'busy', 'buzz', 'call', 'calm', 'came',
    'camp', 'card', 'care', 'cart', 'case', 'cast', 'cell', 'cent', 'cent', 'chin',
    'chip', 'chop', 'cite', 'city', 'clap', 'clay', 'clip', 'club', 'coal', 'coat',
    'code', 'cold', 'come', 'cone', 'cook', 'cool', 'cord', 'core', 'corn', 'cost',
    'crab', 'crew', 'crop', 'curl', 'cute', 'dare', 'dark', 'darn', 'dash', 'date',
    'dawn', 'dead', 'deaf', 'deal', 'dear', 'debt', 'deck', 'deep', 'deer', 'desk',
    'dial', 'died', 'diet', 'dime', 'dine', 'disk', 'dive', 'dock', 'doll', 'dome',
    'done', 'door', 'dove', 'down', 'drag', 'draw', 'drew', 'drop', 'drug', 'drum',
    'dual', 'duck', 'dull', 'dump', 'dust', 'duty', 'dwell', 'each', 'earl', 'earn',
    'ease', 'east', 'easy', 'echo', 'edge', 'edit', 'else', 'emit', 'ends', 'epic',
    'even', 'ever', 'evil', 'exam', 'exit', 'face', 'fact', 'fail', 'fair', 'fake',
    'fall', 'fame', 'fare', 'farm', 'fast', 'fate', 'fear', 'feel', 'feet', 'fell',
    'felt', 'fern', 'fest', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm',
    'fish', 'fist', 'five', 'flag', 'flat', 'fled', 'flee', 'flew', 'flip', 'flip',
    'flow', 'foam', 'fold', 'folk', 'fond', 'food', 'fool', 'foot', 'fore', 'fork',
    'form', 'fort', 'foul', 'four', 'fowl', 'free', 'from', 'fuel', 'full', 'fume',
    'fund', 'fung', 'fury', 'fuse', 'gain', 'game', 'gang', 'gate', 'gave', 'gaze',
    'gear', 'gene', 'germ', 'gift', 'gild', 'gill', 'girl', 'give', 'glad', 'glen',
    'glow', 'glue', 'goat', 'goes', 'gold', 'golf', 'gone', 'good', 'grab', 'grad',
    'gram', 'gray', 'grew', 'grid', 'grim', 'grin', 'grip', 'grit', 'grow', 'gulf',
    'gust', 'hack', 'hail', 'hair', 'half', 'hall', 'halo', 'halt', 'hand', 'hang',
    'hare', 'harm', 'harp', 'hash', 'hate', 'haul', 'have', 'hawk', 'haze', 'head',
    'heal', 'heap', 'hear', 'heat', 'heck', 'heel', 'heir', 'held', 'hell', 'helm',
    'help', 'hemp', 'herb', 'herd', 'here', 'hero', 'hide', 'high', 'hike', 'hill',
    'hilt', 'hind', 'hint', 'hire', 'hive', 'hold', 'hole', 'holy', 'home', 'hood',
    'hoof', 'hook', 'hoop', 'hoot', 'hope', 'horn', 'hose', 'host', 'hour', 'howl',
    'huge', 'hulk', 'hump', 'hung', 'hunt', 'hurl', 'hurt', 'hush', 'icon', 'idea',
    'idle', 'inch', 'info', 'into', 'iron', 'isle', 'itch', 'item', 'jail', 'joke',
    'jolt', 'jump', 'junk', 'jury', 'just', 'jute', 'keen', 'keep', 'kept', 'kick',
    'kill', 'kilt', 'kind', 'king', 'kiss', 'kite', 'knew', 'knit', 'knot', 'know',
    'lace', 'lack', 'lacy', 'lady', 'laid', 'lake', 'lamb', 'lame', 'lamp', 'land',
    'lane', 'lard', 'lark', 'lash', 'lass', 'last', 'late', 'lath', 'laud', 'lava',
    'lawn', 'lazy', 'lead', 'leaf', 'leak', 'lean', 'leap', 'left', 'lend', 'lens',
    'lent', 'less', 'liar', 'lice', 'lick', 'life', 'lift', 'like', 'limb', 'lime',
    'limp', 'line', 'link', 'lint', 'lion', 'list', 'lite', 'live', 'load', 'loaf',
    'loam', 'loan', 'lock', 'loft', 'lone', 'long', 'look', 'loom', 'loop', 'lord',
    'lore', 'lose', 'loss', 'loud', 'love', 'luck', 'lump', 'lung', 'lure', 'lurk',
    'mace', 'made', 'maid', 'mail', 'maim', 'main', 'make', 'male', 'mall', 'malt',
    'mane', 'many', 'mare', 'mark', 'mars', 'mart', 'mash', 'mask', 'mass', 'mast',
    'mate', 'math', 'maze', 'mead', 'meal', 'mean', 'meat', 'meek', 'meet', 'meld',
    'melt', 'memo', 'mend', 'menu', 'meow', 'mere', 'mesh', 'mess', 'mice', 'mild',
    'mile', 'milk', 'mill', 'mime', 'mind', 'mine', 'mint', 'mire', 'miss', 'mist',
    'mite', 'mitt', 'moan', 'moat', 'mock', 'mode', 'mold', 'mole', 'molt', 'monk',
    'mood', 'moon', 'moor', 'mope', 'more', 'moss', 'most', 'moth', 'move', 'much',
    'mule', 'mull', 'muse', 'mush', 'must', 'mute', 'myth', 'nail', 'name', 'nape',
    'navy', 'near', 'neat', 'neck', 'need', 'nest', 'news', 'next', 'nice', 'nick',
    'noun', 'nose', 'note', 'noun', 'nude', 'null', 'numb', 'oath', 'obey', 'odor',
    'okay', 'once', 'only', 'onto', 'ooze', 'open', 'oral', 'orca', 'ores', 'ours',
    'oust', 'oven', 'over', 'oval', 'pace', 'pack', 'page', 'paid', 'pail', 'pain',
    'pair', 'pale', 'palm', 'pane', 'pang', 'park', 'part', 'pass', 'path', 'pave',
    'peak', 'peal', 'pear', 'peck', 'peel', 'peer', 'pelt', 'pent', 'pest', 'pick',
    'pier', 'pike', 'pile', 'pill', 'pine', 'pink', 'pint', 'pipe', 'pith', 'pity',
    'plan', 'play', 'plea', 'plod', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus',
    'poem', 'poet', 'poke', 'pole', 'poll', 'pond', 'pony', 'pool', 'poor', 'pope',
    'pore', 'pork', 'port', 'pose', 'post', 'pour', 'pout', 'pray', 'prim', 'prod',
    'prom', 'prop', 'prow', 'pull', 'pulp', 'pump', 'punk', 'punt', 'puny', 'pupa',
    'pure', 'purr', 'push', 'race', 'rack', 'raft', 'rage', 'raid', 'rail', 'rain',
    'rake', 'ramp', 'rang', 'rank', 'rare', 'rash', 'rasp', 'rate', 'rave', 'raze',
    'read', 'real', 'ream', 'reap', 'rear', 'reck', 'reel', 'rely', 'rend', 'rent',
    'rest', 'rice', 'rich', 'ride', 'rife', 'rift', 'ring', 'rink', 'riot', 'ripe',
    'rise', 'risk', 'rite', 'road', 'roam', 'roar', 'robe', 'rock', 'rode', 'role',
    'roll', 'romp', 'roof', 'room', 'root', 'rope', 'rose', 'rosy', 'rote', 'rout',
    'rove', 'rude', 'ruin', 'rule', 'rung', 'runt', 'ruse', 'rush', 'rust', 'sack',
    'safe', 'saga', 'sage', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand',
    'sane', 'sang', 'sank', 'sash', 'save', 'sawn', 'seal', 'seam', 'sear', 'seas',
    'seat', 'sect', 'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent',
    'shed', 'shim', 'shin', 'ship', 'shod', 'shoe', 'shoo', 'shop', 'shot', 'show',
    'shun', 'shut', 'sick', 'side', 'sigh', 'sign', 'silk', 'sill', 'silt', 'sing',
    'sink', 'site', 'size', 'skew', 'skip', 'skit', 'slab', 'slag', 'slam', 'slap',
    'slat', 'slaw', 'sled', 'slew', 'slid', 'slim', 'slip', 'slit', 'slob', 'sloe',
    'slog', 'slop', 'slot', 'slow', 'slug', 'slum', 'smog', 'snap', 'snip', 'snit',
    'snob', 'snow', 'snub', 'snug', 'soak', 'soap', 'soar', 'sock', 'soda', 'soft',
    'soil', 'sold', 'sole', 'solo', 'some', 'song', 'soon', 'soot', 'sore', 'sort',
    'soul', 'soup', 'sour', 'span', 'spar', 'spec', 'sped', 'spin', 'spit', 'spot',
    'stem', 'step', 'stew', 'stir', 'stop', 'stud', 'stun', 'such', 'suit', 'sulk',
    'sunk', 'sure', 'surf', 'swab', 'swag', 'swam', 'swan', 'swap', 'sway', 'swim',
    'swum', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tang', 'tank', 'tape',
    'tare', 'tarn', 'tarp', 'tart', 'task', 'taut', 'taxi', 'team', 'tear', 'teas',
    'teat', 'teen', 'tell', 'tend', 'tent', 'term', 'tern', 'text', 'than', 'that',
    'thaw', 'thee', 'them', 'then', 'they', 'thin', 'this', 'thou', 'thud', 'thug',
    'tick', 'tide', 'tidy', 'tied', 'tier', 'ties', 'tile', 'till', 'tilt', 'time',
    'tine', 'tint', 'tiny', 'tire', 'toad', 'toes', 'toil', 'told', 'toll', 'tomb',
    'tone', 'took', 'tool', 'toot', 'tops', 'tore', 'torn', 'toss', 'tour', 'tout',
    'town', 'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trod', 'trot',
    'troy', 'true', 'tuba', 'tube', 'tuck', 'tuft', 'tuna', 'tune', 'turf', 'turn',
    'tusk', 'tutu', 'twig', 'twin', 'twit', 'type', 'unit', 'upon', 'urge', 'used',
    'user', 'vain', 'vale', 'vamp', 'vane', 'vape', 'vary', 'vase', 'vast', 'veal',
    'veil', 'vein', 'vend', 'vent', 'verb', 'very', 'vest', 'veto', 'vial', 'vice',
    'view', 'vile', 'vine', 'vinyl', 'visa', 'vise', 'void', 'volt', 'vote', 'vow',
    'wade', 'wage', 'wail', 'wait', 'wake', 'walk', 'wall', 'wand', 'want', 'ward',
    'ware', 'warm', 'warn', 'warp', 'wars', 'wart', 'wash', 'wasp', 'wave', 'wavy',
    'waxy', 'weak', 'wear', 'weary', 'weed', 'week', 'weep', 'weir', 'weld', 'well',
    'welt', 'went', 'were', 'werf', 'west', 'wets', 'whack', 'whale', 'what', 'wheat',
    'wheel', 'when', 'where', 'which', 'while', 'whim', 'whine', 'whip', 'whirl', 'whisk',
    'white', 'who', 'whole', 'whom', 'wick', 'wide', 'wife', 'wild', 'will', 'wilt',
    'wind', 'wine', 'wing', 'wink', 'wins', 'wipe', 'wire', 'wise', 'wish', 'wisp',
    'with', 'woke', 'wolf', 'womb', 'women', 'won', 'wont', 'wood', 'wool', 'word',
    'wore', 'work', 'worm', 'worn', 'worth', 'wrap', 'wren', 'writ', 'yard', 'yarn',
    'yawn', 'yeah', 'year', 'yeast', 'yell', 'yelp', 'yield', 'yolk', 'young', 'your',
    'youth', 'zeal', 'zero', 'zest', 'zinc', 'zone', 'zoom'
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
   * STRICT: Minimum 3 characters - no exceptions for 2-letter inputs
   */
  const looksLikeHumanName = (str) => {
    // CRITICAL: Reject ALL 2-letter inputs - they cannot be real names
    if (!str || str.length < 3) return false;

    const lower = str.toLowerCase();

    // FIRST: Check blacklist of non-names (slang, abbreviations, keywords)
    if (BLACKLIST.has(lower)) return false;

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
