import { Facebook, Instagram } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-center pt-10 ">
      {/* Branding Section */}
      <h1 className="text-4xl font-bold mb-4">Great Way Studio</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Great Way Studio is India's Oldest Retailer. Established in 1998, it has
        been a destination for excellence in Men’s Bespoke Tailoring &
        Celebration Wear for over 143 years. We are proud that the who’s who of
        India, including Prime Ministers, Presidents, Chief Justices,
        Cricketers, Olympic Medalists, and Movie Stars have trusted them with
        their special apparel needs.
      </p>

      {/* Store Details Section */}
      <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 my-8 text-center">
        <p className="text-lg font-semibold">
          BRINGING EXPERIENCE OF OVER 143 YEARS
        </p>
        <p className="text-lg font-semibold">35+ STORES</p>
        <img
          src="https://cdn.shopify.com/s/files/1/0579/7930/6151/files/Made_In_India_mls_logo.png?v=1720007622"
          alt="Made in India"
          className="w-12"
        />
        <p className="text-lg font-semibold">4,50,000 HAPPY CUSTOMERS</p>
      </div>

      {/* Awards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {[
          {
            title: "Awarded Best Tailor",
            description: "By Master Tailors Association in 1979",
          },
          {
            title: "Fashion & Lifestyle Award",
            description:
              "For contribution towards uplifting the Indian garments & lifestyle industry",
          },
          {
            title: "Best Showroom Award",
            description: "By New Delhi Traders Association in 1996",
          },
        ].map((award, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 mx-auto mb-2">
              <img
                src="https://cdn.shopify.com/s/files/1/0579/7930/6151/files/leaf.svg?v=1683608367"
                alt="Award Icon"
              />
            </div>
            <h3 className="text-xl font-semibold">{award.title}</h3>
            <p className="text-gray-600">{award.description}</p>
          </div>
        ))}
      </div>

      {/* Services Section */}
      <div className="flex flex-wrap justify-center gap-8 border-t pt-8">
        {[
          {
            img: "https://cdn.shopify.com/s/files/1/0579/7930/6151/files/truck.svg?v=1683740610",
            title: "Free Shipping",
            description: "Prepaid orders, above ₹499",
          },
          {
            img: "https://cdn.shopify.com/s/files/1/0579/7930/6151/files/Cash-On-Delivery.svg?v=1683608367",
            title: "Cash On Delivery",
            description: "Select pincodes, above ₹499",
          },
          {
            img: "https://cdn.shopify.com/s/files/1/0579/7930/6151/files/secured-payment.svg?v=1683608367",
            title: "Secured Payment",
            description: "EMI, Wallets, Cards and more",
          },
        ].map((service, index) => (
          <div key={index} className="text-center">
            <img
              src={service.img}
              alt={service.title}
              className="w-8 mx-auto mb-2"
            />
            <p className="font-semibold">{service.title}</p>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-[#e2dede] py-8 px-4 mt-8">
        <div className="container mx-auto flex flex-col md:flex-row gap-8 md:gap-x-16">
          {/* Footer Links Section */}
          <div className="flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Shop",
                  links: ["Men", "Kids", "Collection", "Accessories"],
                },
                {
                  title: "Quick Links",
                  links: [
                    "Our story",
                    "Contact Us",
                    "Bulk Enquiry",
                    "FAQs",
                    "Sitemap",
                    "About Us",
                  ],
                },
                {
                  title: "Customer Service",
                  links: ["Exchange Policy", "Privacy Policy", "Terms Of Use"],
                },
                {
                  title: "My Profile",
                  links: ["My Account", "Track Order", "My Cart", "Wishlist"],
                },
              ].map((section, index) => (
                <div key={index} className="space-y-1">
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <ul className="space-y-1">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <a href="#" className="text-gray-600 hover:text-black">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex-shrink-0 flex justify-center items-center">
            <div className="text-center">
              <a href="/">
                <h1 className="text-3xl font-serif tracking-wide uppercase">
                  Great Way Studio
                </h1>
                <div className="text-gray-500">
                  <span className="block text-[13px] uppercase tracking-wider">
                    Since 1998
                  </span>
                  <span className="block text-xl tracking-widest mt-0.5">
                    India's Oldest Retailer
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t pt-6 md:flex-row md:justify-between">
          {/* Social Media Icons */}
          <div className="flex gap-4">
            <a href="#" className="text-2xl text-blue-600">
              <Facebook />
            </a>
            <a href="#" className="text-2xl text-pink-500">
              <Instagram />
            </a>
          </div>

          {/* Copyright Text */}
          <p className="text-center text-sm text-gray-500 md:text-right">
            ©1881 Great Way Studio | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
