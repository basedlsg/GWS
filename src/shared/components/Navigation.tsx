import { Link, useLocation } from 'react-router-dom';
import { Home, Code2, Target, MessageSquare, Trophy, Settings, Menu } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useSettings } from '@/shared/hooks/useSettings';
import { cn } from '@/shared/utils/cn';

interface NavigationProps {
  onOpenSettings: () => void;
}

export function Navigation({ onOpenSettings }: NavigationProps) {
  const location = useLocation();
  const { hasGeminiApiKey } = useSettings();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/transmute', label: 'Transmute', icon: Code2, emoji: '🔮' },
    { path: '/distillation', label: 'Distillation', icon: Target, emoji: '⚗️' },
    { path: '/projection', label: 'Projection', icon: MessageSquare, emoji: '🎯' },
    { path: '/culmination', label: 'Culmination', icon: Trophy, emoji: '✨' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              The Great Work Suite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={active ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      active && 'bg-secondary'
                    )}
                  >
                    {item.emoji ? (
                      <span className="text-base">{item.emoji}</span>
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {hasGeminiApiKey && (
              <Badge variant="secondary" className="text-xs hidden sm:flex">
                AI Enabled
              </Badge>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSettings}
              className="hidden md:flex"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link key={item.path} to={item.path}>
                      <DropdownMenuItem className={cn(active && 'bg-secondary')}>
                        {item.emoji ? (
                          <span className="mr-2 text-base">{item.emoji}</span>
                        ) : (
                          <Icon className="mr-2 h-4 w-4" />
                        )}
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    </Link>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpenSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
