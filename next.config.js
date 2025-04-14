module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'; connect-src *; img-src *; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}