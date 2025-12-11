import { Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold italic text-gray-900 dark:text-white">
              Vilayattu<span className="text-primary-light">.</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Premium sports equipment for the modern athlete. 
              Elevate your game with gear that matches your passion.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com/SSHareesh/" className="text-gray-400 hover:text-primary-light transition-colors"><Github className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/hareesh-s-s-7478b1257" className="text-gray-400 hover:text-primary-light transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="mailto:hareeshseenu95@gmail.com" className="text-gray-400 hover:text-primary-light transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/products?category=Cricket" className="hover:text-primary-light transition-colors">Cricket</Link></li>
              <li><Link to="/products?category=Football" className="hover:text-primary-light transition-colors">Football</Link></li>
              <li><Link to="/products?category=Badminton" className="fhover:text-primary-light transition-colors">Badminton</Link></li>
              <li><Link to="/products" className="hover:text-primary-light transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/profile" className="hover:text-primary-light transition-colors">Track Order</Link></li>
              <li><Link to="/profile" className="hover:text-primary-light transition-colors">Returns & Exchanges </Link></li>
              {/* <li><a href="" className="hover:text-primary-light transition-colors">Shipping Info</a></li> */}
              <li><a href="mailto:vilayattushop@gmail.com" className="hover:text-primary-light transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-light shrink-0" />
                <span>123 Sports Hub, Anna Nagar,<br />Chennai, TN 600040</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-light shrink-0" />
                <span>+91 86102 36842</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-light shrink-0" />
                <span>vilayattushop@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Vilayattu Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;