import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#E63946] text-white py-4 px-4 mt-4 bottom-0 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Column 1 */}
        <div>
          <h3 className="text-base font-semibold mb-2">About Us</h3>
          <p className="text-sm">
            Building responsive and impactful digital experiences.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-base font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Services</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-base font-semibold mb-2">Contact</h3>
          <ul className="text-sm space-y-1">
            <li>Email: info@example.com</li>
            <li>Phone: +91 12345 67890</li>
            <li>Patna, India</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-base font-semibold mb-2">Follow Us</h3>
          <div className="flex flex-col gap-1 text-sm">
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">Twitter</a>
            <a href="#" className="hover:underline">Instagram</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-xs border-t border-white/30 pt-2">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
