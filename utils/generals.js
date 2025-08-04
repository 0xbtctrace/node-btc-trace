/**
 * Check if a string is a valid host address with optional protocol and port
 * Supports domain names, localhost, IPv4, and IPv6
 * @param host string input to validate
 * @returns true if valid, false otherwise
 */
export const isHostSyntaxValid = (host) => {
  const hostRegex = new RegExp(
    '^https?:\\/\\/' + // http or https
      '(' +
      'localhost' + // localhost
      '|([a-z0-9]+([-.][a-z0-9]+)*\\.[a-z]{2,})' + // domain like example.com
      '|(\\d{1,3}(\\.\\d{1,3}){3})' + // IPv4
      '|(\\[[0-9a-fA-F:]+\\])' + // IPv6 in brackets
      ')' +
      '(\\:\\d{1,5})?$', // optional port
    'i'
  );

  return hostRegex.test(host);
};

/**
 * Converts the suffix of a hexadecimal hash string into decimal values
 * for various bit ranges from 4 bits (0–15) up to 64 bits (0–18,446,744,073,709,551,615).
 *
 * @param {string} hexHash - A hexadecimal string (without `0x` prefix).
 *                           Should be at least 16 characters long to support 64-bit conversion.
 * @returns {Object} A dictionary where keys are value ranges and values are
 *                   decimal string equivalents of the last N hex characters.
 *
 * @example
 * const hexHash = 'abcdef1234567890fedcba9876543210abcdef1234567890';
 * const decimals = getHexSuffixDecimals(hexHash);
 * console.log(decimals['0_255']); // e.g. "144"
 * console.log(decimals['0_4294967295']); // e.g. "305419896"
 */
export const getHexSuffixDecimals = (hexHash) => {
  const suffixLengths = {
    '0_15': 1, // 4 bits
    '0_255': 2, // 8 bits
    '0_4095': 3, // 12 bits
    '0_65535': 4, // 16 bits
    '0_1048575': 5, // 20 bits
    '0_16777215': 6, // 24 bits
    '0_268435455': 7, // 28 bits
    '0_4294967295': 8, // 32 bits
    '0_68719476735': 9, // 36 bits
    '0_1099511627775': 10, // 40 bits
    '0_17592186044415': 11, // 44 bits
    '0_281474976710655': 12, // 48 bits
    '0_4503599627370495': 13, // 52 bits
    '0_72057594037927935': 14, // 56 bits
    '0_1152921504606846975': 15, // 60 bits
    '0_18446744073709551615': 16, // 64 bits
  };

  const decimals = {};

  for (const [range, len] of Object.entries(suffixLengths)) {
    const hexPart = hexHash.slice(-len); // extract last `len` hex digits
    decimals[range] = BigInt('0x' + hexPart).toString(); // convert to decimal string
  }

  return decimals;
};
