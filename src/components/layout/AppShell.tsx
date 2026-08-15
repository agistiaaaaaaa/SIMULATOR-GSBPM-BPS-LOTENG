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
import { AnimatePresence, motion } from 'framer-motion'
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

const mobileNav = nav.filter((n) =>
  ['/app', '/app/search', '/app/new', '/app/presentation', '/app/settings'].includes(n.to),
)

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboardingDone())

  return (
    <div className="min-h-screen">
      {showOnboarding ? <OnboardingOverlay onDone={() => setShowOnboarding(false)} /> : null}
      <ToastHost />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-ink-900/6 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-gold-500/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-ink-500/5 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/75 shadow-sm backdrop-blur-2xl">
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="focus-ring rounded-xl transition-transform duration-300 hover:scale-[1.01]"
            aria-label="Beranda StatPlan"
          >
            <BrandLockup size="sm" />
          </button>

          <nav className="hidden items-center gap-0.5 rounded-2xl bg-ink-50/80 p-1 ring-1 ring-border/80 xl:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-ink-900 text-white shadow-md'
                      : 'text-ink-700 hover:bg-white hover:text-ink-950 hover:shadow-sm',
                  )
                }
              >
                <item.icon size={16} variant="Bold" color="currentColor" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="xl:hidden"
              aria-label="Bantuan"
              tooltip="Bantuan"
              onClick={() => navigate('/app/help')}
            >
              <InfoCircle size={16} variant="Bold" color="currentColor" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="hidden sm:inline-flex"
              onClick={() => navigate('/app/about')}
            >
              Tentang
            </Button>
            <Button
              size="sm"
              variant="gold"
              leftIcon={<Add size={16} variant="Bold" color="currentColor" />}
              onClick={() => navigate('/app/new')}
            >
              Proyek
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <ShareImportBanner />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-white/90 backdrop-blur-xl xl:hidden">
        <div className="grid grid-cols-5 gap-0.5 px-1 py-2">
          {mobileNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors',
                  isActive ? 'bg-ink-100 text-ink-900' : 'text-ink-600',
                )
              }
            >
              <item.icon size={18} variant="Bold" color="currentColor" />
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
        </div>
      </nav>

      <footer className="mx-auto hidden max-w-7xl px-6 pb-10 pt-2 text-xs text-ink-600/60 xl:block">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/50 px-3 py-2 ring-1 ring-border/60">
          <span className="inline-flex items-center gap-2">
            <Book1 size={14} variant="Bold" color="currentColor" />
            Kerangka proses: GSBPM 5.2 · Modul Proses Bisnis Statistik BPS · BPS Kabupaten Lombok
            Tengah
          </span>
          <button
            type="button"
            className="font-medium text-ink-700 hover:text-ink-950"
            onClick={() => navigate('/app/about')}
          >
            Tentang StatPlan
          </button>
        </div>
      </footer>
    </div>
  )
}
