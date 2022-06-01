/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * NOTICE:
   * Strict Mode should be enabled as best practice, but
   * in this case is disabled because it fires some events twice,
   * so it conflicts with cookie management and 
   * product quantity updates on cart
   */
  reactStrictMode: false,
}

module.exports = nextConfig
