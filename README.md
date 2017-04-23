# HTTPS Content Signing

- [Draft specification](spec-x509-extension)
- [Example OpenSSL configuration for generating Certificate Signing
  Requests](openssl.cnf) (use with `-config ./openssl.cnf`)
- [Example code for user agents](example-ua-code.js)
- [Implementation as a Firefox
  extension](https://addons.mozilla.org/firefox/addon/hcs-checker/) ([on
  GitHub](https://github.com/twiss/hcs-checker-firefox))

This is a draft specification aiming to bring verification of source
code to the web. For now, the working name is HTTPS Content Signing
(HCS), although that might change.

## Why?

More and more people are making, or want to make, web applications that
try to protect the privacy of their users against the server, for
example by adding client-side encryption. However, this does not
materially increase security, since the web application maker can just
change their mind and change the code of the web application to upload
the user's keys (something like that [has happened
before](https://bitcointalk.org/index.php?topic=186051.0)), with no
practical way for users to notice. The web application maker may also
want to protect against the server being compromised, or a reverse-proxy
CDN being compromised or going rogue.

## What?

HTTPS Content Signing lets you put hashes of certain resources on your
server (e.g. the contents of `/`, `/index.js`, and `/index.css`) in your
TLS Certificate. Thanks to [Certificate Transparency][CT], that
certificate then ends up in a public log. This way, users of your web
app can be sure they're getting the same code as everyone else, and can
be notified when that code changes. (And verify that they still trust
the code, for example.)

## What's the difference with Subresource Integrity?

[Subresource Integrity][SRI] (SRI) only lets you verify the integrity of
scripts and other subresources on an HTML page, but not the HTML itself.
So the server can change the HTML and include different scripts, or
remove the Subresource Integrity metadata entirely, for example. So the
server is still completely trusted. With HTTPS Content Signing, if the
server wants to change the HTML, it has to request a new certificate,
thereby notifying the public (through Certificate Transparency).

On the other hand, with HTTPS Content Signing, you can only protect the
integrity of resources on your own server, so you still have to use
Subresource Integrity if you want to protect a script on a third-party
CDN on a different domain, for example (which is what SRI was designed
to do). You might also choose to use SRI instead of HTTPS Content
Signing when possible for performance or other reasons (TLS Certificates
are not currently compressed).

[CT]: https://www.certificate-transparency.org/
[SRI]: https://www.w3.org/TR/SRI/