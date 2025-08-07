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
 * for the last 1 to 12 hex characters.
 *
 * @param {string} hexHash - A hexadecimal string (without `0x` prefix).
 * @returns {Object} An object with keys like `last_1_hex` to `last_12_hex`,
 *                   each containing { hex, decimal }.
 *
 * @example
 * const result = getHexSuffixDecimals('...hash...');
 * console.log(result.last_6_hex); // { hex: "d7c8f4", decimal: "14121300" }
 */
export const getHexSuffixDecimals = (hexHash) => {
  const output = {};
  const maxLength = Math.min(12, hexHash.length);

  for (let i = 1; i <= maxLength; i++) {
    const hexPart = hexHash.slice(-i);
    const decimal = BigInt('0x' + hexPart).toString();
    output[`last_${i}_hex`] = {
      hex: hexPart,
      decimal,
    };
  }

  return output;
};
