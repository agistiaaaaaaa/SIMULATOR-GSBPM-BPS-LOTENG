import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Category,
  Add,
  Setting2,
  MagicStar,
  Book1,
  InfoCircle,
  PresentionChart,
  SearchNormal1,
} from 'iconsax-react'
import type { Icon } from 'iconsax-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BrandLockup } from '@/components/branding/BrandLockup'
import { OnboardingOverlay } from '@/features/onboarding/OnboardingOverlay'
import { ShareImportBanner } from '@/features/share/ShareImportBanner'
import { ToastHost } from '@/components/ui/ToastHost'
import { isOnboardingDone } from '@/demo/seed'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const nav: { to: string; label: string; icon: Icon; end?: boolean }[] = [
  { to: '/app', label: 'Beranda', icon: Category, end: true },
  { to: '/app/search', label: 'Cari', icon: SearchNormal1 },
  { to: '/app/new', label: 'Proyek baru', icon: Add },
  { to: '/app/assistant', label: 'Asisten', icon: MagicStar },
  { to: '/app/presentation', label: 'Presentasi', icon: PresentionChart },
  { to: '/app/help', label: 'Bantuan', icon: InfoCircle },
  { to: '/app/settings', label: 'Pengaturan', icon: Setting2 },
]

const mobileNav: {
  to: string
  label: string
  icon: Icon
  end?: boolean
  primary?: boolean
}[] = [
  { to: '/app', label: 'Beranda', icon: Category, end: true },
  { to: '/app/search', label: 'Cari', icon: SearchNormal1 },
  { to: '/app/new', label: 'Proyek', icon: Add, primary: true },
  { to: '/app/presentation', label: 'Presentasi', icon: PresentionChart },
  { to: '/app/settings', label: 'Atur', icon: Setting2 },
]

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboardingDone())

  return (
    <div className="min-h-dvh">
      {showOnboarding ? <OnboardingOverlay onDone={() => setShowOnboarding(false)} /> : null}
      <ToastHost />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-ink-900/6 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-bps-blue/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-bps-orange/8 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/50 bg-white/85 pt-[env(safe-area-inset-top)] shadow-[0_1px_0_rgb(0_147_221/0.08)] backdrop-blur-2xl">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-2 px-3 sm:h-[4.25rem] sm:gap-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="focus-ring min-h-11 min-w-0 shrink rounded-xl px-0.5 transition-opacity duration-200 active:opacity-80"
            aria-label="Beranda StatPlan"
          >
            <BrandLockup size="sm" compact className="sm:gap-2.5" />
          </button>

          <nav className="hidden items-center gap-0.5 rounded-2xl bg-ink-50/80 p-1 ring-1 ring-border/80 xl:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'focus-ring inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-ink-900 text-white'
                      : 'text-ink-700 hover:bg-white hover:text-ink-950',
                  )
                }
              >
                <item.icon size={16} variant="Bold" color="currentColor" aria-hidden />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-950 active:bg-ink-100 xl:hidden"
              aria-label="Bantuan"
              onClick={() => navigate('/app/help')}
            >
              <InfoCircle size={20} variant="Bold" color="currentColor" aria-hidden />
            </button>
            <button
              type="button"
              className="focus-ring hidden h-10 items-center rounded-xl px-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-950 active:bg-ink-100 sm:inline-flex"
              onClick={() => navigate('/app/about')}
            >
              Tentang
            </button>
            <Button
              size="sm"
              className="landing-btn-blue hidden h-10 min-h-10 px-3 text-sm sm:inline-flex xl:min-h-11"
              leftIcon={<Add size={16} variant="Bold" color="currentColor" aria-hidden />}
              onClick={() => navigate('/app/new')}
            >
              Proyek
            </Button>
          </div>
        </div>
        <div
          className="h-px bg-gradient-to-r from-transparent via-bps-blue/35 to-transparent"
          aria-hidden
        />
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 xl:pb-10">
        <ShareImportBanner />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 4 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-white/94 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_32px_rgb(7_24_36/0.07)] backdrop-blur-xl xl:hidden"
        aria-label="Navigasi utama"
      >
        <div
          className="mx-auto h-px max-w-md bg-gradient-to-r from-transparent via-bps-blue/30 to-transparent"
          aria-hidden
        />
        <div className="grid grid-cols-5 items-end gap-0.5 px-1.5 pb-1.5 pt-1.5">
          {mobileNav.map((item) => {
            if (item.primary) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="focus-ring group relative flex min-h-14 flex-col items-center justify-end gap-1 rounded-xl px-1 pb-1 text-[10px] font-semibold text-ink-700"
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          'absolute -top-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_10px_24px_rgb(0_147_221/0.35)] transition-transform active:scale-95',
                          isActive
                            ? 'bg-bps-blue ring-4 ring-bps-blue/20'
                            : 'bg-ink-900 group-hover:bg-ink-800',
                        )}
                      >
                        <item.icon size={24} variant="Bold" color="currentColor" aria-hidden />
                      </span>
                      <span
                        className={cn(
                          'mt-8 leading-none',
                          isActive ? 'text-bps-blue' : 'text-ink-600',
                        )}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition-colors active:bg-ink-50',
                    isActive ? 'text-bps-blue' : 'text-ink-600',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                        isActive ? 'bg-bps-blue/12 text-bps-blue' : 'text-ink-600',
                      )}
                    >
                      <item.icon size={20} variant="Bold" color="currentColor" aria-hidden />
                    </span>
                    <span className="leading-none">{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <footer className="mx-auto hidden max-w-7xl px-6 pb-10 pt-2 text-xs text-ink-600/60 xl:block">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/50 px-3 py-2 ring-1 ring-border/60">
          <span className="inline-flex items-center gap-2">
            <Book1 size={14} variant="Bold" color="currentColor" aria-hidden />
            Kerangka proses: GSBPM 5.2 · Modul Proses Bisnis Statistik BPS · BPS Kabupaten Lombok
            Tengah
          </span>
          <button
            type="button"
            className="focus-ring rounded-md font-medium text-ink-700 hover:text-ink-950"
            onClick={() => navigate('/app/about')}
          >
            Tentang StatPlan
          </button>
        </div>
      </footer>
    </div>
  )
}
