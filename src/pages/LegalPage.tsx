import React from 'react';
import { useLocation } from 'react-router-dom';

const LegalPage: React.FC = () => {
  const location = useLocation();
  const page = location.pathname.substring(1); // Remove leading slash

  const getPageContent = () => {
    switch (page) {
      case 'about':
        return {
          title: 'About Us',
          content: (
            <div className="space-y-6">
              <p>
                Everwear was founded with a simple mission: to create timeless, essential clothing 
                that combines comfort, quality, and style. We believe in the power of basics done right.
              </p>
              <p>
                Our carefully curated collection focuses on premium materials and classic fits that 
                work for every body and every lifestyle. From our essential t-shirts to our cozy 
                sweatshirts, every piece is designed to be a staple in your wardrobe.
              </p>
              <p>
                Based in San Jose, California, we're committed to sustainable practices and ethical 
                manufacturing. We work with trusted partners who share our values of quality and 
                responsibility.
              </p>
            </div>
          )
        };
      case 'contact':
        return {
          title: 'Contact Information',
          content: (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Headquarters</h3>
                <p>Everwear<br />123 Market Street<br />San Jose, CA 95113</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Service</h3>
                <p>Email: support@everwear.co<br />Phone: (408) 555-0126</p>
                <p>Hours: Monday–Friday 9:00 AM – 6:00 PM PT</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Press Inquiries</h3>
                <p>Email: press@everwear.co</p>
              </div>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          content: (
            <div className="space-y-6">
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
              <div>
                <h3 className="text-lg font-semibold mb-2">Use License</h3>
                <p>
                  Permission is granted to temporarily download one copy of the materials on 
                  Everwear's website for personal, non-commercial transitory viewing only.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Disclaimer</h3>
                <p>
                  The materials on Everwear's website are provided on an 'as is' basis. Everwear 
                  makes no warranties, expressed or implied, and hereby disclaims and negates all 
                  other warranties including without limitation, implied warranties or conditions 
                  of merchantability, fitness for a particular purpose, or non-infringement of 
                  intellectual property or other violation of rights.
                </p>
              </div>
            </div>
          )
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: (
            <div className="space-y-6">
              <p>
                Your privacy is important to us. This privacy statement explains the personal data 
                Everwear processes, how we process it, and for what purposes.
              </p>
              <div>
                <h3 className="text-lg font-semibold mb-2">Information We Collect</h3>
                <p>
                  We collect information you provide directly to us, such as when you create an 
                  account, make a purchase, or contact us for support.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How We Use Your Information</h3>
                <p>
                  We use the information we collect to provide, maintain, and improve our services, 
                  process transactions, and communicate with you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Information Sharing</h3>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third 
                  parties without your consent, except as described in this policy.
                </p>
              </div>
            </div>
          )
        };
      case 'shipping':
        return {
          title: 'Shipping Policy',
          content: (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Shipping Options</h3>
                <p>We offer several shipping options to meet your needs:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Standard Shipping (5-7 business days) - Free on orders over $75</li>
                  <li>Express Shipping (2-3 business days) - $9.99</li>
                  <li>Overnight Shipping (1 business day) - $19.99</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Processing Time</h3>
                <p>
                  Orders are typically processed within 1-2 business days. You will receive a 
                  tracking number once your order ships.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">International Shipping</h3>
                <p>
                  We currently ship to the United States and Canada. International shipping 
                  rates and delivery times vary by location.
                </p>
              </div>
            </div>
          )
        };
      default:
        return {
          title: 'Page Not Found',
          content: <p>The requested page could not be found.</p>
        };
    }
  };

  const { title, content } = getPageContent();

  return (
    <div className="min-h-screen bg-white">
      <div className="container-minimal py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-8">
            {title}
          </h1>
          <div className="prose prose-lg max-w-none text-neutral-700">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
