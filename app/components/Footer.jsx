import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import {
  VisaIcon,
  MastercardIcon,
  AmericanExpressIcon,
  DiscoverIcon,
  JCBIcon,
} from 'react-svg-credit-card-payment-icons';
import footerBg from '~/assets/images/footer-img.webp';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="relative bg-neutral-900 min-h-screen overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={footerBg}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between px-6 h-screen">
              {/* Top row: Brand left, Quick Links right */}
              <div className="flex flex-col md:flex-row py-20 justify-between items-start gap-12">
                {/* Left - Brand & Description */}
                <div className="max-w-2xl">
                  <h2 className="text-5xl md:text-7xl font-display font-light mb-4 text-white leading-tight">
                    Illuminate Your Space with Elegance
                  </h2>
                  <p className="text-neutral-300 leading-relaxed text-sm">
                    Discover our curated collection of minimalist lighting
                    solutions. Each piece is thoughtfully designed to bring
                    warmth and sophistication to your home, blending form and
                    function seamlessly.
                  </p>
                </div>

                {/* Right - Quick Links */}
                <div className="absolute bottom-20 right-10 flex flex-col items-start md:items-end gap-2">
                  <h3 className="text-white font-light text-base tracking-widest uppercase mb-2 opacity-60">
                    Quick Links
                  </h3>
                  <FooterMenu
                    menu={null}
                    primaryDomainUrl={header.shop.primaryDomain?.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="flex flex-col h-fit md:flex-row items-center justify-between py-6 gap-4 text-sm text-white font-display">
                <p>
                  © LightLife® {new Date().getFullYear()}. All rights reserved
                </p>
                <p className="font-light">
                  Crafted with care by{' '}
                  <span className="text-amber-500 font-medium">Faiz</span>
                </p>
                {/* Payment Icons */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6">
                    <VisaIcon className="w-full h-full grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <div className="w-10 h-6">
                    <MastercardIcon className="w-full h-full grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <div className="w-10 h-6">
                    <JCBIcon className="w-full h-full grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <div className="w-10 h-6">
                    <AmericanExpressIcon className="w-full h-full grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <div className="w-10 h-6">
                    <DiscoverIcon className="w-full h-full grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <nav
      className="flex flex-col items-start md:items-end gap-2"
      role="navigation"
    >
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            href={url}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
            className="text-sm font-display font-light text-neutral-400 hover:text-amber-500 transition-colors"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            to={url}
            className={({isActive}) =>
              `text-sm font-display font-light transition-colors ${
                isActive
                  ? 'text-amber-500'
                  : 'text-neutral-400 hover:text-amber-500'
              }`
            }
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: null,
      tags: [],
      title: 'Contact',
      type: 'HTTP',
      url: '/pages/contact',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: null,
      tags: [],
      title: 'Legal',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
  ],
};

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
