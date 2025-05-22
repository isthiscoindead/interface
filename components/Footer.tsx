import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-200 p-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-lg font-semibold">Is This Coin Dead?</h3>
            <p className="text-sm mt-1">
              Vote that a coin is dead or alive.
            </p>
          </div>

          <div className="flex flex-row justify-center gap-8 md:gap-12 w-full md:w-auto">
            <div>
              <h4 className="font-medium mb-2 text-center md:text-left">
                Connect
              </h4>
              <ul className="text-sm">
                <li className="mb-2">
                  <a
                    href="https://twitter.com/vicpulse"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://github.com/vicpulse"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-xs mt-6 pt-4 border-t border-gray-700">
          <p>© {new Date().getFullYear()} IsThisCoinDead?. All rights reserved.</p>
          <p className="mt-1">Powered by the Base blockchain.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
