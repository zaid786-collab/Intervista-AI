import React from "react";
import "./Footer.css";

const currentYear = new Date().getFullYear();

const linkGroups = [
  {
    title: "Practice",
    links: [
      { label: "Mock Interviews", href: "/practice/mock-interviews" },
      { label: "Coding Rounds", href: "/practice/coding" },
      { label: "Behavioral Q&A", href: "/practice/behavioral" },
      { label: "Resume Review", href: "/practice/resume" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Question Bank", href: "/resources/questions" },
      { label: "Company Guides", href: "/resources/companies" },
      { label: "Blog", href: "/resources/blog" },
      { label: "FAQs", href: "/resources/faqs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "Twitter", href: "https://twitter.com", icon: "tw" },
  { label: "GitHub", href: "https://github.com", icon: "gh" },
  { label: "YouTube", href: "https://youtube.com", icon: "yt" },
];

const Footer = () => {
  return (
    <footer className="iv-footer">
      <div className="iv-footer__glow" aria-hidden="true" />

      <div className="iv-footer__container">
        <div className="iv-footer__top">
          <div className="iv-footer__brand">
            <a href="/" className="iv-footer__logo">
              <span className="iv-footer__logo-text">
                Intervista <span className="iv-footer__logo-accent">AI</span>
              </span>
              <span className="iv-footer__waveform" aria-hidden="true">
                <span className="iv-footer__bar" />
                <span className="iv-footer__bar" />
                <span className="iv-footer__bar" />
                <span className="iv-footer__bar" />
                <span className="iv-footer__bar" />
              </span>
            </a>
            <p className="iv-footer__tagline">
              Practice the conversation before it counts. AI-powered mock
              interviews that adapt to your role, your level, and your
              nerves.
            </p>

            <form
              className="iv-footer__newsletter"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="iv-footer-email" className="iv-footer__label">
                Get interview tips in your inbox
              </label>
              <div className="iv-footer__input-row">
                <input
                  id="iv-footer-email"
                  type="email"
                  placeholder="you@example.com"
                  className="iv-footer__input"
                  required
                />
                <button type="submit" className="iv-footer__submit">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          <nav className="iv-footer__links" aria-label="Footer navigation">
            {linkGroups.map((group) => (
              <div className="iv-footer__group" key={group.title}>
                <h3 className="iv-footer__group-title">{group.title}</h3>
                <ul className="iv-footer__group-list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="iv-footer__link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="iv-footer__divider" />

        <div className="iv-footer__bottom">
          <p className="iv-footer__copyright">
            © {currentYear} Intervista AI. All rights reserved.
          </p>

          <ul className="iv-footer__socials" aria-label="Social links">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  className="iv-footer__social-link"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;