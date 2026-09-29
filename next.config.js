module.exports = {
  async redirects() {
    return [
      {
        source: "/articles/axate-integration",
        destination: "https://wallet.axate.io/install.html",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    // Every image in this fixture is local (public/*.webp) and served through
    // next/image, which already negotiates AVIF then WebP from its defaults.
    // The previous `source.unsplash.com` remotePatterns entry was inherited
    // from create-next-app and was never reachable from any page.
    //
    // If you point next/image at a remote host, add a remotePatterns entry for
    // it here or the optimizer will reject the URL.
  },
};
