import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import StatusBanner from './StatusBanner';

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4 13.5h6.5V20H4zM13.5 4H20v7.5h-6.5zM13.5 13.5H20V20h-6.5zM4 4h6.5v6.5H4z" />
    </svg>
  );
}

function SubjectsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5z" />
      <path d="M8 9h8M8 12.5h8M8 16h5" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M6 5.5h12A1.5 1.5 0 0 1 19.5 7v10A1.5 1.5 0 0 1 18 18.5H6A1.5 1.5 0 0 1 4.5 17V7A1.5 1.5 0 0 1 6 5.5z" />
      <path d="M8 10h8M8 13h6M8 16h4" />
    </svg>
  );
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: DashboardIcon },
  { label: 'Subjects', to: '/subjects', icon: SubjectsIcon },
  { label: 'Summary', to: '/summary', icon: SummaryIcon },
];

export default function AppShell({ title, subtitle, children, actions }) {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError('');

    try {
      await logout();
    } catch (error) {
      setLogoutError(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen">
      <aside className="mx-4 mt-4 lg:fixed lg:inset-y-4 lg:left-4 lg:mt-0 lg:w-[220px]">
        <div className="glass-card flex h-full flex-col gap-6 px-4 py-5">
          <div className="space-y-5">
            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-full bg-accent-50 px-3 py-1.5 text-sm font-semibold text-accent-700 transition hover:bg-accent-100"
              >
                AI Study Companion
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Study Space</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Focused tools for subjects, study sessions, and quick revision.
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto space-y-4">
            <div className="rounded-3xl bg-slate-900 px-4 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Signed in as</p>
              <p className="mt-2 text-sm font-medium leading-6">{user?.displayName || user?.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary w-full"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[252px]">
        <div className="lg:h-screen lg:overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10">
            <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-accent-700 shadow-sm transition hover:bg-white"
                >
                  Workspace
                </Link>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{subtitle}</p>
                  ) : null}
                </div>
              </div>

              {actions ? (
                <div className="flex flex-wrap gap-3 lg:max-w-sm lg:justify-end">{actions}</div>
              ) : null}
            </header>

            <StatusBanner kind="error" message={logoutError} onDismiss={() => setLogoutError('')} />

            <main className="page-stack">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
