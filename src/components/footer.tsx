import { Atom } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const footerSections = [
    {
      title: "Research",
      links: [
        { href: "/", label: "Browse Projects" },
        { href: "/submit", label: "Submit Paper" },
        { href: "/review", label: "Review Process" },
      ],
    },
    {
      title: "Community",
      links: [
        { href: "#", label: "Discord" },
        { href: "#", label: "Twitter" },
        { href: "#", label: "GitHub" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/docs", label: "Documentation" },
        { href: "/help", label: "Help Center" },
        { href: "/contact", label: "Contact" },
      ],
    },
  ];

  return (
    <footer className="glass-effect border-t border-white/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Atom className="neon-cyan text-xl" />
              <h3 className="text-lg font-mono font-bold neon-cyan">
                PaperFans
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              Democratizing scientific research through decentralized funding and Web3 technology.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-3">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-neon-cyan transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 PaperFans. All rights reserved. Built on the future of science.</p>
        </div>
      </div>
    </footer>
  );
}
