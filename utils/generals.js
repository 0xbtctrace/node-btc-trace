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
    u4: 1, // 1 hex char = 4 bits
    u8: 2, // 2 hex chars = 8 bits
    u12: 3, // 3 hex chars = 12 bits
    u16: 4, // 4 hex chars = 16 bits
    u20: 5, // 5 hex chars = 20 bits
    u24: 6, // 6 hex chars = 24 bits
    u28: 7, // 7 hex chars = 28 bits
    u32: 8, // 8 hex chars = 32 bits
    u36: 9, // 9 hex chars = 36 bits
    u40: 10, // 10 hex chars = 40 bits
    u44: 11, // 11 hex chars = 44 bits
    u48: 12, // 12 hex chars = 48 bits
    u52: 13, // 13 hex chars = 52 bits
    u56: 14, // 14 hex chars = 56 bits
    u60: 15, // 15 hex chars = 60 bits
    u64: 16, // 16 hex chars = 64 bits
  };

  const decimals = {};

  for (const [range, len] of Object.entries(suffixLengths)) {
    const hexPart = hexHash.slice(-len); // extract last `len` hex digits
    decimals[range] = BigInt('0x' + hexPart).toString(); // convert to decimal string
  }

  return decimals;
};
