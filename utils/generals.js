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
