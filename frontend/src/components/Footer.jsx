import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Newsletter from "./ContactForm"; // Import the ContactForm component

const Footer = () => {
  return (
    <footer className="container-fluid">
      <div className="footer pt-5">
        <div className="row">
          {/* Logo & Description */}
          <div className="col-lg-3 col-md-4 col-sm-4 col-12">
            <div className="footer-logo">
              <img src="../assets/logo.png" className="img-fluid" alt="Astrafin Logo" />
              <p className="mt-4 text-sm white">
                Betting Made Smarter — Powered by Data & Expertise At BetInfo.Live, we provide accurate and data-driven sports betting tips for Cricket, Football, and Tennis. Using advanced AI algorithms combined with expert analysis, we deliver real-time insights to help users make confident betting decisions.
              </p>
              {/* Social Media Icons */}
              <div className="d-flex gap-3 mt-3">
                {[
                  { href: "https://www.facebook.com/profile.php?id=61572179696663", icon: <FaFacebookF size={20} />, label: "Facebook" },
                  { href: "https://www.instagram.com/astrafin_india/", icon: <FaInstagram size={20} />, label: "Instagram" },
                  { href: "https://www.youtube.com/channel/UCHzfaOMiSLGg4YgLRBJtiTQ", icon: <FaYoutube size={20} />, label: "YouTube" },
                  { href: "https://linkedin.com/company/astrafin-india", icon: <FaLinkedinIn size={20} />, label: "LinkedIn" }
                ].map((item, index) => (
                  <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="social-icons newcolor">
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation - Quick Links */}
          <div className="col-lg-2 col-md-4 col-sm-4 col-12">
            <h3 className="font-bold text-lg mb-3 newcolor">Quick Links</h3>
            <ul className="list-unstyled2 white">
              {[
                { to: "/", text: "Home" },
                { to: "/contact", text: "Contact" },
                { to: "/account", text: "Account" },
              ].map((item, index) => (
                <li key={index} className="white">
                  <Link to={item.to} className="white text-decoration-none">
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Office Address & Contact Form */}
          <div className="col-lg-7 col-md-4 col-sm-4 col-12">
            <div className="row">
              {/* Office Address */}
              <div className="col-lg-6">
                <h3 className="font-bold text-lg mb-3 newcolor">Office Address</h3>
                <p><strong>Betinfo.live</strong></p>
                <ul className="address-list">
                  <li>
                    <FaMapMarkerAlt className="mt-1" />
                    <span className="text-sm white">UK</span>
                  </li>
                </ul>

                <h3 className="font-bold text-lg mt-3 mb-2 newcolor">Reach Us Anytime</h3>
                <p className="text-dark text-decoration-none d-block">
                  <FaEnvelope className="me-2 white" /> <a href="mailto:reachus@astrafin.org" className="white">reachus@Betinfo.live</a>
                </p>
                <p className="text-dark text-decoration-none d-block">
                  <FaPhone className="me-2 white" /> <a href="tel:+158484212154" className="white">+158484212154</a>
                </p>
              </div>

              {/* Contact Form */}
              <div className="col-lg-6">
                <Newsletter />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <hr />
        <div className="text-center">
          <p>Copyright © 2024 Betinfo.live. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
