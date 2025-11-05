import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/theme';
import { FlowerIcon } from '../icons/FlowerIcon';
import { useAppStore } from '../../app/store/useAppStore';

const navItems = [
  { path: '/', label: 'Home', icon: FlowerIcon },
  { path: '/compose', label: 'Compose', icon: FlowerIcon },
  { path: '/calendar', label: 'Calendar', icon: FlowerIcon },
  { path: '/wallet', label: 'Wallet', icon: FlowerIcon },
];

export const Navigation = () => {
  const location = useLocation();
  const currentUser = useAppStore((state) => state.getCurrentUser());

  const getProfilePath = () => {
    return currentUser ? `/profile/${currentUser.id}` : '/';
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors flex-1',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive
                  ? 'text-primary bg-accent'
                  : 'text-gray-600 hover:text-primary'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon size={20} color={isActive ? '#FFB347' : '#666'} aria-hidden="true" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        {currentUser && (
          <Link
            to={getProfilePath()}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors flex-1',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              location.pathname.startsWith('/profile')
                ? 'text-primary bg-accent'
                : 'text-gray-600 hover:text-primary'
            )}
            aria-current={location.pathname.startsWith('/profile') ? 'page' : undefined}
            aria-label="プロフィール"
          >
            <FlowerIcon
              size={20}
              color={location.pathname.startsWith('/profile') ? '#FFB347' : '#666'}
              aria-hidden="true"
            />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

