/* =====================================================================
 * logic/passwordAnalyzer.js — Password strength estimate (Lesson 3)
 * Runs entirely in the browser; typed passwords are never stored or sent.
 *   1. Character-pool entropy: bits = length × log2(pool size)
 *   2. Penalties for common passwords, sequences, repeats and years
 *   3. Crack time assuming 10 billion guesses per second
 * ===================================================================== */

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', '123456789', 'qwerty', 'abc123', 'letmein', 'monkey', 'dragon',
  'football', 'baseball', 'iloveyou', 'admin', 'welcome', 'sunshine', 'princess', 'master', 'shadow',
  'superman', 'trustno1', 'login', 'starwars', 'hello', 'freedom', 'whatever', '111111', '123123',
  '000000', '654321', 'qazwsx', 'passw0rd', 'secret', 'computer', 'summer', 'winter', 'charlie'
];
const KEY_SEQUENCES = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const WORDS = [
  'anchor', 'banjo', 'cactus', 'dolphin', 'ember', 'falcon', 'galaxy', 'harbor', 'igloo', 'jigsaw',
  'kettle', 'lantern', 'meadow', 'nectar', 'orbit', 'pancake', 'quartz', 'rocket', 'saddle', 'tundra',
  'umbrella', 'violin', 'walrus', 'yodel', 'zephyr', 'acorn', 'bramble', 'canyon', 'denim', 'eclipse',
  'fjord', 'gravel', 'hammock', 'island', 'jasmine', 'koala', 'lobster', 'mango', 'nimbus', 'oyster',
  'pepper', 'quiver', 'ribbon', 'sprout', 'tornado', 'unicorn', 'velvet', 'waffle', 'yonder', 'zigzag',
  'basil', 'comet', 'dune', 'fossil', 'glacier', 'helmet', 'ivory', 'jungle', 'kayak', 'lemon',
  'marble', 'noodle', 'olive', 'puzzle', 'raven', 'sapphire', 'tulip', 'voyage', 'wizard', 'yeti'
];

export const LEVEL_LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

export function analyzePassword(pw) {
  const checks = {
    length: pw.length >= 14,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
    pattern: true
  };
  const warnings = [];

  let pool = 0;
  if (checks.lower) pool += 26;
  if (checks.upper) pool += 26;
  if (checks.digit) pool += 10;
  if (checks.symbol) pool += 33;
  let bits = pw.length * Math.log2(pool || 1);

  // Common passwords, including "l33t" swaps such as P@ssw0rd! or password123
  const lower = pw.toLowerCase();
  const trimmed = lower.replace(/^[^a-z@$]+|[^a-z0-9@$]+$/g, '').replace(/\d+$/, '');
  const unLeet = trimmed.replace(/[@4]/g, 'a').replace(/0/g, 'o').replace(/[1!|]/g, 'i')
    .replace(/3/g, 'e').replace(/[$5]/g, 's').replace(/7/g, 't');
  if ([lower, trimmed, unLeet].some(c => c && COMMON_PASSWORDS.includes(c))) {
    checks.pattern = false;
    bits = Math.min(bits, 12);
    warnings.push('This is (or is based on) one of the most common passwords. Attackers try these first.');
  }

  // Keyboard / alphabet sequences: 1234, abcd, qwer (forwards or backwards)
  const hasSequence = KEY_SEQUENCES.some(seq => {
    const rev = seq.split('').reverse().join('');
    for (let i = 0; i <= lower.length - 4; i++) {
      const part = lower.substr(i, 4);
      if (seq.includes(part) || rev.includes(part)) return true;
    }
    return false;
  });
  if (hasSequence) {
    checks.pattern = false;
    bits -= 15;
    warnings.push('Contains a predictable sequence like “1234”, “abcd” or “qwer”.');
  }

  if (/(.)\1\1/.test(pw)) {
    checks.pattern = false;
    bits -= 10;
    warnings.push('Repeated characters (like “aaa”) add very little strength.');
  }

  if (/(19|20)\d{2}/.test(pw)) {
    bits -= 8;
    warnings.push('Looks like it contains a year — birth years are easy to guess.');
  }

  if (pw.length > 0 && pw.length < 8) warnings.push('Very short passwords can be cracked almost instantly.');

  bits = Math.max(0, bits);
  const score = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
  const seconds = Math.pow(2, bits) / 2 / 1e10; // on average half the possibilities are tried

  return { score, label: LEVEL_LABELS[score], bits: Math.round(bits), crackTime: formatCrackTime(seconds), checks, warnings };
}

/** Seconds → friendly text ("about 3 hours", "centuries"). */
export function formatCrackTime(s) {
  if (s < 1) return 'instantly';
  if (s >= 31536000 * 1000) return 'centuries';
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];
  for (const [name, size] of units) {
    if (s >= size) {
      const n = Math.floor(s / size);
      return `about ${n} ${name}${n === 1 ? '' : 's'}`;
    }
  }
  return 'instantly';
}

/** Random passphrase using the browser's secure random number generator. */
export function generatePassphrase(wordCount = 4) {
  const random = new Uint32Array(wordCount);
  window.crypto.getRandomValues(random);
  return Array.from(random, n => WORDS[n % WORDS.length]).join('-');
}
