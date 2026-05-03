import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {motion, useScroll, useMotionValueEvent} from 'framer-motion';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const {scrollY} = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();

    // Check if scrolled past threshold (50px)
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide/show based on scroll direction
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: {y: 0},
        hidden: {y: '-100%'},
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{duration: 0.35, ease: 'easeInOut'}}
      className={`flex items-center justify-between h-16 px-6 fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-white border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      {/* Desktop Nav */}
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
        isScrolled={isScrolled}
      />

      {/* Logo */}
      <NavLink prefetch="intent" to="/" end>
        <strong
          className={`text-2xl font-display tracking-tight transition-colors duration-300 ${
            isScrolled ? 'text-black' : 'text-white'
          }`}
        >
          {shop.name}
        </strong>
      </NavLink>

      {/* CTAs */}
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} isScrolled={isScrolled} />
    </motion.header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 *   isScrolled?: boolean;
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  isScrolled = false,
}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col gap-4 p-4 md:hidden" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className={({isActive}) =>
            `text-base font-display font-bold ${isActive ? 'text-amber-700 font-bold' : 'text-black'}`
          }
          to="/"
        >
          Home
        </NavLink>
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className={({isActive}) =>
                `text-base font-display font-bold ${isActive ? 'text-amber-700 font-bold' : 'text-black'}`
              }
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-8" role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            className={({isActive}) =>
              `text-md font-display font-light hover:text-amber-700 transition-colors ${
                isActive
                  ? 'text-amber-700'
                  : isScrolled
                    ? 'text-black'
                    : 'text-white'
              }`
            }
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {isScrolled: boolean}}
 */
function HeaderCtas({isLoggedIn, cart, isScrolled}) {
  return (
    <nav className="flex items-center gap-5" role="navigation">
      <HeaderMenuMobileToggle isScrolled={isScrolled} />
      <NavLink
        prefetch="intent"
        to="/account"
        className={({isActive}) =>
          `hidden md:block text-md font-display font-light hover:text-amber-700 transition-colors ${
            isActive
              ? 'text-amber-700'
              : isScrolled
                ? 'text-black'
                : 'text-white'
          }`
        }
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle isScrolled={isScrolled} />
      <CartToggle cart={cart} isScrolled={isScrolled} />
    </nav>
  );
}

function HeaderMenuMobileToggle({isScrolled}) {
  const {open} = useAside();
  return (
    <button
      className={`md:hidden text-xl leading-none transition-colors ${
        isScrolled ? 'text-black' : 'text-white'
      }`}
      onClick={() => open('mobile')}
    >
      ☰
    </button>
  );
}

function SearchToggle({isScrolled}) {
  const {open} = useAside();
  return (
    <button
      className={`text-md font-display hover:text-amber-700 transition-colors ${
        isScrolled ? 'text-black' : 'text-white'
      }`}
      onClick={() => open('search')}
    >
      Search
    </button>
  );
}

/**
 * @param {{count: number; isScrolled: boolean}}
 */
function CartBadge({count, isScrolled}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <div className="flex flex-row gap-0.5 items-center">
      <a
        href="/cart"
        className={`text-md font-display hover:text-amber-700 transition-colors ${
          isScrolled ? 'text-black' : 'text-white'
        }`}
        onClick={(e) => {
          e.preventDefault();
          open('cart');
          publish('cart_viewed', {
            cart,
            prevCart,
            shop,
            url: window.location.href || '',
          });
        }}
      >
        Cart
      </a>
      <span
        className={`pb-5 transition-colors ${
          isScrolled ? 'text-black' : 'text-white'
        }`}
        aria-label={`(items: ${count})`}
      >
        {count}
      </span>
    </div>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'> & {isScrolled: boolean}}
 */
function CartToggle({cart, isScrolled}) {
  return (
    <Suspense fallback={<CartBadge count={0} isScrolled={isScrolled} />}>
      <Await resolve={cart}>
        <CartBanner isScrolled={isScrolled} />
      </Await>
    </Suspense>
  );
}

function CartBanner({isScrolled}) {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} isScrolled={isScrolled} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'semibold' : undefined,
    color: isPending ? 'amber-700' : undefined,
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
