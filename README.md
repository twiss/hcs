# HTTPS Content Signing

- [Draft specification](spec-x509-extension)
- [Example OpenSSL configuration for generating Certificate Signing Requests](openssl.cnf) (use with `-config ./openssl.cnf`)
- [Example code for user agents](example-ua-code.js)
- [Implementation as a Firefox extension](https://addons.mozilla.org/firefox/addon/hcs-checker/) ([on GitHub](https://github.com/twiss/hcs-checker-firefox))

This is a draft specification aiming to bring verification of source
code to the web. For now, the working name is HTTPS Content Signing
(HCS), although that might change.