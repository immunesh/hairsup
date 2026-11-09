'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronDown,
  Phone, MapPin, LogOut, Package,
} from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore, useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import NotificationBell from '@/components/ui/NotificationBell';
import Logo from '@/components/brand/Logo';

const NAV_LINKS = [
  {
    label: 'Services',
    href: '/contact',
    mega: [
      { label: 'Hair Bonding', href: '/hair-bonding' },
      { label: 'Hair Weaving', href: '/hair-weaving' },
      { label: 'Hair Extensions', href: '/hair-extensions' },
      { label: 'Hair Replacement', href: '/hair-replacement' },
      { label: 'Hair Fixing', href: '/hair-fixing' },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    mega: [
      { label: 'Hair Wig', href: '/hair-wig' },
      { label: 'Men Hair Wig', href: '/men-hair-wig' },
      { label: 'Women Hair Wig', href: '/women-hair-wig' },
      { label: 'Hair Patch', href: '/hair-patch' },
    ],
  },
  { label: 'Virtual Try-On', href: '/try-on' },
  { label: 'Blog', href: '/blog' },
];

// Shared by every icon button in the bar: 44px target, quiet hover.
const iconBtn =
  'relative inline-flex items-center justify-center w-11 h-11 rounded-full text-ink-soft hover:text-ink hover:bg-paper-2 transition-colors';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const cartStore = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isSearchOpen, toggleSearch, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mega menus open on hover for mouse users; touch devices (including
  // tablets/landscape phones wide enough to hit the `lg` breakpoint) get no
  // mouseenter, so the chevron button below toggles them on tap instead.
  // Since there's no mouseleave on tap, close on any outside press.
  useEffect(() => {
    if (!activeMenu) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenu(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [activeMenu]);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      toggleSearch();
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUserMenuOpen(false);
    router.push('/');
  };

  const itemCount = cartStore.itemCount();

  return (
    <>
      {/* Top bar: the salon's phone and where to find it */}
      <div className="hidden md:block bg-deep text-deep-ink text-[0.8125rem]">
        <div className="container-custom flex justify-between items-center h-10">
          <div className="flex items-center gap-6">
            <a href="tel:+919027396563" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" aria-hidden /> +91 90273 96563
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" aria-hidden /> 2 Stores across Surat
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-deep-muted">Free Shipping</span>
            <Link href="/try-on" className="underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors">
              Virtual Try-On
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={cn(
          'sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b transition-shadow duration-300',
          scrolled ? 'border-rule shadow-[var(--shadow-card)]' : 'border-rule'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center min-w-0 shrink-0 rounded-sm" onClick={closeMobileMenu}>
              <Logo height={40} className="hidden sm:block" />
              <Logo height={34} className="sm:hidden" />
            </Link>

            {/* Desktop Nav */}
            <nav ref={desktopNavRef} aria-label="Main" className="hidden lg:flex items-center gap-8 ml-12 flex-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => {
                    // Touchscreens fire a synthetic mouseenter/click pair after a tap;
                    // without this guard that reopens the menu right after the chevron's
                    // onClick toggle closes it. Real mice/trackpads report `hover: hover`.
                    if (link.mega && window.matchMedia('(hover: hover)').matches) {
                      setActiveMenu(link.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (window.matchMedia('(hover: hover)').matches) {
                      setActiveMenu(null);
                    }
                  }}
                >
                  <div
                    data-active={activeMenu === link.label ? 'true' : undefined}
                    className="nav-link flex items-center gap-1 py-2"
                  >
                    <Link href={link.href}>{link.label}</Link>
                    {link.mega && (
                      <button
                        type="button"
                        className="rounded-full p-1 -m-1 text-ink-muted hover:text-ink"
                        aria-expanded={activeMenu === link.label}
                        aria-label={`${activeMenu === link.label ? 'Close' : 'Open'} ${link.label} menu`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu((prev) => (prev === link.label ? null : link.label));
                        }}
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform', activeMenu === link.label && 'rotate-180')} />
                      </button>
                    )}
                  </div>

                  {/* Mega Menu */}
                  {link.mega && activeMenu === link.label && (
                    <div className="absolute top-full left-0 pt-3 animate-fade-in">
                      <ul className="w-60 bg-white rounded-card border border-rule shadow-[var(--shadow-card)] py-2">
                        {link.mega.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveMenu(null)}
                              className="block px-4 py-2.5 text-[0.9375rem] text-ink-soft hover:text-ink hover:bg-paper-2 transition-colors"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
              <button onClick={toggleSearch} className={cn(iconBtn, 'hidden lg:inline-flex')} aria-label="Search">
                <Search className="w-5 h-5" />
              </button>

              <Link href="/wishlist" className={cn(iconBtn, 'hidden lg:inline-flex')} aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-coral-600 text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <div className="hidden lg:block">
                <NotificationBell />
              </div>

              <button onClick={cartStore.toggleCart} className={iconBtn} aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="relative hidden lg:block ml-1">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-label="Account menu"
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-paper-2 transition-colors"
                  >
                    <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user?.firstName[0]}{user?.lastName[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-ink-muted" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-card border border-rule shadow-[var(--shadow-card)] py-2 animate-fade-in z-50">
                      <div className="px-4 py-2 border-b border-rule mb-1">
                        <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[0.8125rem] text-ink-muted truncate">{user?.email}</p>
                      </div>
                      {[
                        { href: '/profile', icon: User, label: 'My Profile' },
                        { href: '/orders', icon: Package, label: 'My Orders' },
                        { href: '/wishlist', icon: Heart, label: 'Wishlist' },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink transition-colors"
                        >
                          <Icon className="w-4 h-4" /> {label}
                        </Link>
                      ))}
                      <div className="border-t border-rule mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden sm:inline-flex btn-primary ml-2 !min-h-[44px] !px-5">
                  Sign in
                </Link>
              )}

              <button
                onClick={toggleMobileMenu}
                className={cn(iconBtn, 'lg:hidden ml-1')}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {isSearchOpen && (
          <div className="border-t border-rule bg-paper py-4 animate-fade-in">
            <form onSubmit={handleSearch} className="container-custom" role="search">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted pointer-events-none" aria-hidden />
                <label htmlFor="site-search" className="visually-hidden">Search the shop</label>
                <input
                  id="site-search"
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for wigs, hair systems, styles..."
                  className="input-field !rounded-full !pl-12 !pr-12"
                />
                <button
                  type="button"
                  onClick={toggleSearch}
                  aria-label="Close search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-paper-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3 max-w-2xl mx-auto">
                <span className="text-[0.8125rem] text-ink-muted">Popular:</span>
                {['Lace Front', 'Human Hair', "Men's System", 'Curly', 'Ombre'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setSearchQuery(t); router.push(`/search?q=${encodeURIComponent(t)}`); toggleSearch(); }}
                    className="text-[0.8125rem] border border-rule bg-white hover:border-accent hover:text-accent px-3 py-1.5 rounded-full transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-paper z-40 overflow-y-auto animate-fade-in">
            <div className="container-custom py-6">
              {!isAuthenticated ? (
                <div className="flex gap-3 mb-6">
                  <Link href="/login" className="btn-primary flex-1" onClick={closeMobileMenu}>Sign in</Link>
                  <Link href="/register" className="btn-secondary flex-1" onClick={closeMobileMenu}>Register</Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-paper-2 rounded-card mb-6">
                  <span className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.firstName[0]}{user?.lastName[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[0.8125rem] text-ink-muted truncate">{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Search and Wishlist live here rather than in the bar, so the
                  menu button always has room on narrow screens. */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => { closeMobileMenu(); toggleSearch(); }}
                  className="flex items-center gap-2 px-4 min-h-[48px] rounded-card border border-rule bg-white font-medium text-ink"
                >
                  <Search className="w-5 h-5 text-ink-muted" /> Search
                </button>
                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-4 min-h-[48px] rounded-card border border-rule bg-white font-medium text-ink"
                >
                  <Heart className="w-5 h-5 text-ink-muted" /> Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-coral-600 text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              </div>

              <nav aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <div key={link.label} className="border-b border-rule py-2">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="flex items-center py-3 font-display text-2xl text-ink"
                    >
                      {link.label}
                    </Link>
                    {link.mega && (
                      <div className="grid grid-cols-2 gap-x-4 pb-2">
                        {link.mega.slice(0, 6).map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="py-2 text-[0.9375rem] text-ink-soft hover:text-accent"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {isAuthenticated && (
                <div className="mt-6">
                  <Link href="/orders" onClick={closeMobileMenu} className="flex items-center gap-3 py-3 text-ink-soft">
                    <Package className="w-5 h-5" /> My Orders
                  </Link>
                  <Link href="/profile" onClick={closeMobileMenu} className="flex items-center gap-3 py-3 text-ink-soft">
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 text-red-700">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
