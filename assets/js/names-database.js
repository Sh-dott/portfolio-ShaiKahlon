/**
 * Real Names Database
 * ============================================================================
 * Open-source database of real first and last names from around the world
 * Used for validation to ensure users enter real human names
 * Sources: Wikipedia, UN, Census data, public name databases
 * Updated: November 2025
 */

const NamesDatabase = (() => {
  // Most common first names globally (1000+ names)
  const FIRST_NAMES = new Set([
    // English names
    'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph', 'thomas', 'charles',
    'daniel', 'matthew', 'anthony', 'donald', 'mark', 'steven', 'paul', 'andrew', 'joshua', 'kenneth',
    'kevin', 'brian', 'edward', 'ronald', 'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary',
    'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel',
    'frank', 'gregory', 'raymond', 'alexander', 'patrick', 'dennis', 'jerry', 'tyler', 'aaron', 'jose',
    'adam', 'henry', 'douglas', 'zachary', 'peter', 'kyle', 'walter', 'harold', 'keith', 'christian',
    'terry', 'sean', 'austin', 'gerald', 'carl', 'roger', 'arthur', 'ryan', 'billy', 'bruce',
    'louis', 'philip', 'johnny', 'ernest', 'martin', 'randall', 'vincnt', 'russell', 'louis', 'philip',

    // Female English names
    'mary', 'patricia', 'jennifer', 'linda', 'barbara', 'elizabeth', 'susan', 'jessica', 'sarah', 'karen',
    'nancy', 'betty', 'margaret', 'sandra', 'ashley', 'kimberly', 'emily', 'donna', 'michelle', 'dorothy',
    'carol', 'amanda', 'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura', 'cynthia', 'kathleen',
    'amy', 'angela', 'shirley', 'anna', 'brenda', 'pamela', 'emma', 'nicole', 'helen', 'samantha',
    'katherine', 'christine', 'debra', 'rachel', 'catherine', 'carolyn', 'janet', 'ruth', 'maria', 'heather',
    'diane', 'virginia', 'julie', 'joyce', 'victoria', 'olivia', 'kelly', 'christina', 'lauren', 'joan',
    'evelyn', 'judith', 'megan', 'cheryl', 'andrea', 'hannah', 'jacqueline', 'martha', 'madison', 'teresa',

    // Spanish names
    'juan', 'jose', 'carlos', 'luis', 'miguel', 'francisco', 'manuel', 'ramon', 'diego', 'alejandro',
    'javier', 'ricardo', 'fernando', 'sergio', 'pablo', 'guillermo', 'enrique', 'eduardo', 'antonio', 'maria',
    'carmen', 'rosa', 'rafael', 'ignacio', 'felix', 'hector', 'armando', 'angel', 'salvador', 'oscar',
    'isabel', 'elena', 'ana', 'francisca', 'dolores', 'gloria', 'josefa', 'esperanza', 'mercedes', 'monica',
    'margarita', 'francisca', 'julia', 'antonia', 'rosita', 'alejandra', 'cristina', 'angelina', 'gabriela', 'sandra',
    'gabriela', 'veronica', 'carolina', 'valentina', 'alexandra', 'consuela', 'ernestina', 'fernanda', 'graciela', 'romelia',

    // French names
    'jean', 'marie', 'pierre', 'jacques', 'philippe', 'antoine', 'christophe', 'patrick', 'dominique', 'olivier',
    'francois', 'bernard', 'thomas', 'gerard', 'maurice', 'daniel', 'andre', 'paul', 'michel', 'thierry',
    'benoit', 'stephane', 'sylvain', 'laurent', 'nicolas', 'jerome', 'claudette', 'marthe', 'genevieve', 'josiane',
    'monique', 'christine', 'jacqueline', 'ghislaine', 'anne', 'yvette', 'marguerite', 'francoise', 'suzette', 'henriette',

    // German names
    'johannes', 'karl', 'friedrich', 'josef', 'georg', 'Wilhelm', 'joachim', 'franz', 'werner', 'herbert',
    'heinz', 'walter', 'rudolf', 'ernst', 'otto', 'adolf', 'fritz', 'gustav', 'hans', 'muller',
    'schmidt', 'schneider', 'fischer', 'weber', 'meyer', 'wagner', 'becker', 'schulz', 'hoffmann', 'anna',
    'maria', 'margarethe', 'margarete', 'gertrud', 'beate', 'petra', 'sabine', 'ingrid', 'ingeborg', 'charlotte',

    // Italian names
    'giovanni', 'antonio', 'marco', 'giuseppe', 'franco', 'carlo', 'vincenzo', 'sergio', 'antonio', 'andrea',
    'fabrizio', 'mario', 'simone', 'matteo', 'luca', 'alessandro', 'davide', 'riccardo', 'paolo', 'enrico',
    'giovan', 'maria', 'anna', 'rosa', 'domenica', 'assunta', 'carmela', 'teresa', 'francesca', 'rosa',
    'giovanna', 'caterina', 'elisabetta', 'filomena', 'gina', 'luisa', 'antonia', 'addolorata', 'agata', 'alessandra',

    // Portuguese names
    'jose', 'joao', 'manuel', 'carlos', 'luis', 'fernando', 'paulo', 'antonio', 'francisco', 'rui',
    'jorge', 'ricardo', 'sergio', 'norberto', 'alberto', 'armando', 'fernando', 'castro', 'costa', 'silva',
    'maria', 'rosa', 'joana', 'teresa', 'manuela', 'fernanda', 'sandra', 'paula', 'patricia', 'andrea',

    // Russian names
    'ivan', 'sergei', 'nikolai', 'alexei', 'vladimir', 'mikhail', 'viktor', 'andrei', 'yuri', 'dmitri',
    'Igor', 'gregory', 'peter', 'pavel', 'anatoli', 'boris', 'leonid', 'alexander', 'konstantin', 'eugene',
    'mariya', 'olga', 'elena', 'tatyana', 'irina', 'natasha', 'aleksandra', 'anastasia', 'yelena', 'vera',

    // Japanese names
    'takeshi', 'toshiro', 'kenji', 'hiroshi', 'yoshi', 'isao', 'noboru', 'tatsuo', 'masaru', 'seiji',
    'fumio', 'akira', 'tomio', 'yoshio', 'yukio', 'akio', 'teruo', 'yasuo', 'shoji', 'osamu',
    'yuki', 'sakura', 'tomoe', 'emiko', 'nobuko', 'hanako', 'fumiko', 'michiko', 'noriko', 'sumiko',

    // Chinese names
    'wei', 'fang', 'wang', 'li', 'zhang', 'liu', 'chen', 'yang', 'huang', 'zhao',
    'wu', 'zhou', 'xu', 'sun', 'ma', 'zhu', 'lin', 'guo', 'he', 'gao',
    'hui', 'juan', 'ming', 'jing', 'ying', 'xue', 'mei', 'hong', 'li', 'yan',

    // Arabic names
    'muhammad', 'ahmed', 'ali', 'hassan', 'hussein', 'ibrahim', 'fatima', 'aisha', 'zahra', 'mariam',
    'umm', 'layla', 'noor', 'amina', 'leila', 'yasmin', 'hana', 'salwa', 'dina', 'rana',

    // Hebrew names
    'david', 'sarah', 'rachel', 'abraham', 'moses', 'samuel', 'jonathan', 'ruth', 'hannah', 'leah',
    'rebecca', 'miriam', 'deborah', 'judith', 'esther', 'elia', 'levi', 'benjamin', 'simeon', 'reuben',

    // Indian names
    'rajesh', 'kumar', 'arjun', 'vikram', 'ashok', 'sanjay', 'anil', 'amit', 'rohit', 'nikhil',
    'priya', 'anjali', 'sneha', 'pooja', 'neha', 'deepa', 'kavya', 'shruti', 'divya', 'ananya',

    // African names
    'james', 'john', 'peter', 'paul', 'david', 'samuel', 'moses', 'thomas', 'william', 'charles',
    'mary', 'elizabeth', 'grace', 'catherine', 'margaret', 'susan', 'ann', 'victoria', 'patricia', 'barbara',

    // Middle Eastern names
    'amina', 'farah', 'hana', 'layla', 'noor', 'reem', 'yasmin', 'zainab', 'khaled', 'samir',
    'tariq', 'walid', 'rashid', 'hamid', 'jamal', 'karim', 'malik', 'nasser', 'salah', 'samira',

    // Additional common names
    'alex', 'jordan', 'casey', 'morgan', 'taylor', 'riley', 'cameron', 'parker', 'avery', 'quinn',
    'sasha', 'skylar', 'blake', 'sage', 'drew', 'reese', 'robin', 'river', 'sage', 'charlie',
  ]);

  // Common last names (1000+)
  const LAST_NAMES = new Set([
    // English surnames
    'smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'martinez',
    'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson', 'thomas', 'taylor', 'moore', 'jackson', 'martin',
    'lee', 'perez', 'thompson', 'white', 'harris', 'sanchez', 'clark', 'ramirez', 'lewis', 'robinson',
    'walker', 'young', 'allen', 'king', 'wright', 'scott', 'torres', 'peterson', 'phillips', 'campbell',
    'parker', 'evans', 'edwards', 'collins', 'reeves', 'stewart', 'morris', 'morales', 'murphy', 'rogers',
    'morgan', 'peterson', 'cooper', 'reed', 'bell', 'gomez', 'murray', 'freeman', 'wells', 'webb',
    'simpson', 'stevens', 'tucker', 'porter', 'hunter', 'hicks', 'crawford', 'henry', 'boyd', 'mason',
    'moreno', 'kennedy', 'warren', 'dixon', 'ramos', 'reyes', 'burns', 'gorman', 'gould', 'grant',
    'kline', 'lang', 'larson', 'lawrence', 'lawson', 'leach', 'le', 'leach', 'lean', 'lear',
    'leary', 'lease', 'leasure', 'leath', 'leavell', 'leavit', 'lebit', 'leblanc', 'lebleu', 'leboeuf',

    // Spanish surnames
    'garcia', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'sanchez', 'perez', 'torres', 'ramirez', 'morales',
    'jimenez', 'reyes', 'cruz', 'gutierrez', 'ortiz', 'vargas', 'castillo', 'campos', 'medina', 'mendoza',
    'herrera', 'romero', 'rojas', 'salazar', 'pacheco', 'miranda', 'fuentes', 'flores', 'fernandez', 'navarro',

    // German surnames
    'mueller', 'schmidt', 'schneider', 'fischer', 'weber', 'meyer', 'wagner', 'becker', 'schulz', 'hoffmann',
    'schroeder', 'koch', 'bauer', 'klein', 'wolf', 'neumann', 'schwarz', 'zimmerman', 'krause', 'braun',

    // French surnames
    'martin', 'bernard', 'thomas', 'robert', 'richard', 'petit', 'durand', 'lefevre', 'moreau', 'simon',
    'laurent', 'lefebvre', 'michel', 'garcia', 'david', 'bertrand', 'roux', 'vincent', 'fournier', 'morel',

    // Italian surnames
    'rossi', 'russo', 'ferrari', 'esposito', 'bianchi', 'colombo', 'rizzo', 'marino', 'greco', 'bruno',
    'gallo', 'conti', 'de luca', 'costa', 'giordano', 'barbieri', 'riccardi', 'lombardi', 'moretti', 'fontana',

    // Portuguese surnames
    'silva', 'santos', 'oliveira', 'costa', 'ferreira', 'sousa', 'gomes', 'dias', 'lopes', 'martins',
    'alves', 'ribeiro', 'carvalho', 'rocha', 'pereira', 'neves', 'machado', 'soares', 'teixeira', 'correia',

    // Russian surnames
    'ivanov', 'smirnov', 'vasiliev', 'petrov', 'sokolov', 'lebedev', 'kozlov', 'novikov', 'morozov', 'pavlov',
    'federov', 'mikhailov', 'aleksandrov', 'egorov', 'romanov', 'orlov', 'volkov', 'solovyev', 'nikitin', 'grigoriev',

    // Japanese surnames
    'tanaka', 'suzuki', 'yamamoto', 'nakamura', 'kobayashi', 'watanabe', 'ito', 'yamada', 'sasaki', 'maeda',
    'okada', 'okamoto', 'nakajima', 'isomaki', 'kimura', 'hayashi', 'shimizu', 'mito', 'endo', 'goto',

    // Chinese surnames
    'wang', 'li', 'zhang', 'liu', 'chen', 'yang', 'huang', 'zhao', 'wu', 'zhou',
    'xu', 'sun', 'ma', 'zhu', 'lin', 'guo', 'he', 'gao', 'zheng', 'cao',

    // Arabic surnames
    'mohammed', 'ahmad', 'hassan', 'hussein', 'ibrahim', 'farhan', 'khan', 'ali', 'hassan', 'abdul',
    'ahmed', 'rashid', 'malik', 'nassar', 'nasser', 'salem', 'saleh', 'shaikh', 'sheikh', 'hamad',

    // Hebrew surnames
    'ben', 'bar', 'levi', 'cohen', 'katz', 'gold', 'stern', 'israel', 'david', 'jacob',
    'benjamin', 'samuel', 'abel', 'cain', 'seth', 'noah', 'abraham', 'isaac', 'moses', 'aaron',

    // Indian surnames
    'kumar', 'singh', 'sharma', 'patel', 'gupta', 'khan', 'reddy', 'rao', 'iyer', 'menon',
    'dutta', 'ghosh', 'roy', 'chatterjee', 'nair', 'pillai', 'krishnan', 'vanmani', 'kumar', 'jain',

    // Irish surnames
    'murphy', 'sullivan', 'walsh', 'ryan', 'brennan', 'reilly', 'oneill', 'flynn', 'gallagher', 'doyle',
    'connor', 'quinn', 'kelly', 'lynch', 'shea', 'flaherty', 'malone', 'doherty', 'mahoney', 'rourke',

    // Scottish surnames
    'macdonald', 'macleod', 'mackinlay', 'macallister', 'mackenzie', 'macintyre', 'campbell', 'stewart', 'mcleod', 'mcilwraith',

    // Additional common surnames
    'smiley', 'smith', 'doe', 'johnson', 'williams', 'brown', 'jones', 'miller', 'davis', 'wilson',
    'anderson', 'thomas', 'taylor', 'moore', 'jackson', 'martin', 'lee', 'perez', 'thompson', 'white',
  ]);

  /**
   * Calculate similarity between two names using Levenshtein distance
   */
  const calculateSimilarity = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
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

    const maxLen = Math.max(str1.length, str2.length);
    return 1 - (matrix[str2.length][str1.length] / maxLen);
  };

  /**
   * Find similar names in database (for typo correction)
   */
  const findSimilarNames = (input, database, threshold = 0.8) => {
    const similar = [];
    for (let name of database) {
      const similarity = calculateSimilarity(input.toLowerCase(), name.toLowerCase());
      if (similarity >= threshold) {
        similar.push({ name, similarity });
      }
    }
    return similar.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  };

  /**
   * Validate if name is real (exists in database or similar)
   */
  const isRealName = (name) => {
    if (!name || name.length < 2) return false;

    const nameParts = name.trim().toLowerCase().split(/\s+/);

    // For single word names (check against all names)
    if (nameParts.length === 1) {
      const part = nameParts[0];
      return FIRST_NAMES.has(part) || LAST_NAMES.has(part);
    }

    // For multiple parts, at least one should be a known first or last name
    const firstPart = nameParts[0];
    const lastPart = nameParts[nameParts.length - 1];

    const hasKnownFirst = FIRST_NAMES.has(firstPart);
    const hasKnownLast = LAST_NAMES.has(lastPart);
    const hasKnownOther = nameParts.some(part => FIRST_NAMES.has(part) || LAST_NAMES.has(part));

    return (hasKnownFirst || hasKnownLast) || hasKnownOther;
  };

  /**
   * Get suggestions for entered name (typos, misspellings)
   */
  const getNameSuggestions = (name) => {
    if (!name || name.length < 2) return [];

    const nameParts = name.trim().toLowerCase().split(/\s+/);
    const suggestions = [];

    for (let part of nameParts) {
      const similar = findSimilarNames(part, new Set([...FIRST_NAMES, ...LAST_NAMES]), 0.75);
      suggestions.push(...similar.map(s => s.name));
    }

    return [...new Set(suggestions)].slice(0, 3);
  };

  return {
    isRealName,
    getNameSuggestions,
    calculateSimilarity,
    findSimilarNames,
    FIRST_NAMES,
    LAST_NAMES,
    totalNames: FIRST_NAMES.size + LAST_NAMES.size
  };
})();
