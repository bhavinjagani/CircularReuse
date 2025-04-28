import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Recycle } from "lucide-react";

const AppFooter = () => {
  return (
    <footer className="bg-neutral-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Recycle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-header font-bold text-lg">Circular Marketplace</h3>
              </div>
            </div>
            <p className="text-sm opacity-70 mb-4">
              A platform dedicated to extending the life of products through reuse, repair, and recycling. 
              Building a sustainable future together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white opacity-70 hover:opacity-100">
                <Facebook size={16} />
              </a>
              <a href="#" className="text-white opacity-70 hover:opacity-100">
                <Twitter size={16} />
              </a>
              <a href="#" className="text-white opacity-70 hover:opacity-100">
                <Instagram size={16} />
              </a>
              <a href="#" className="text-white opacity-70 hover:opacity-100">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-header font-semibold text-lg mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link href="/"><a className="hover:text-primary">Browse All</a></Link></li>
              <li><Link href="/?condition=Ready-to-Use"><a className="hover:text-primary">Ready-to-Use</a></Link></li>
              <li><Link href="/?condition=Repairable"><a className="hover:text-primary">Repairable</a></Link></li>
              <li><Link href="/?condition=Parts Only"><a className="hover:text-primary">Parts Only</a></Link></li>
              <li><Link href="/?sort=newest"><a className="hover:text-primary">Recently Added</a></Link></li>
              <li><Link href="/list-item"><a className="hover:text-primary">List an Item</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-header font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link href="/repair-guides"><a className="hover:text-primary">Repair Guides</a></Link></li>
              <li><Link href="/sustainability-tips"><a className="hover:text-primary">Sustainability Tips</a></Link></li>
              <li><Link href="/impact-calculator"><a className="hover:text-primary">Impact Calculator</a></Link></li>
              <li><Link href="/community"><a className="hover:text-primary">Community Forum</a></Link></li>
              <li><Link href="/events"><a className="hover:text-primary">Local Events</a></Link></li>
              <li><Link href="/workshops"><a className="hover:text-primary">Repair Workshops</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-header font-semibold text-lg mb-4">Help</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link href="/faq"><a className="hover:text-primary">FAQs</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-primary">Contact Us</a></Link></li>
              <li><Link href="/privacy"><a className="hover:text-primary">Privacy Policy</a></Link></li>
              <li><Link href="/terms"><a className="hover:text-primary">Terms of Service</a></Link></li>
              <li><Link href="/about"><a className="hover:text-primary">About Us</a></Link></li>
              <li><Link href="/partners"><a className="hover:text-primary">Become a Partner</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm opacity-50 text-center">
          <p>&copy; 2023 Circular Marketplace. A project by Far Future Ventures. All rights reserved.</p>
          <p className="mt-1">Made with ♻️ for a sustainable future.</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
