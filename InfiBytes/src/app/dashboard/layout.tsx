'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  Globe,
  User as UserIcon,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase/config';
import { useLanguage } from '@/context/language-context';

const WelcomeFrame = ({ isVisible, userName, t }: { isVisible: boolean, userName: string, t: (key: string, params?: any) => string }) => {
    return (
      <div className={cn(
          "fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center bg-background text-center transition-opacity duration-700 ease-out",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
        <div className={cn(
          "transition-all duration-1000",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}>
          <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-7xl font-headline">
            {t('welcomeMessage', { userName })}
          </h1>
        </div>
      </div>
    );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/dashboard/application', label: t('myApplication'), icon: FileText },
    { href: '/dashboard/compliance', label: t('aiCompliance'), icon: ShieldCheck },
    { href: '/dashboard/incorporation', label: t('incorporate'), icon: Building2 },
  ];

  const [isWelcoming, setIsWelcoming] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);


  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const justLoggedIn = sessionStorage.getItem('justLoggedIn');
        if (justLoggedIn) {
          setIsWelcoming(true);
          sessionStorage.removeItem('justLoggedIn');
        }
        setAuthLoading(false);
      } else {
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [router]);

  React.useEffect(() => {
    if (isWelcoming) {
      const timer = setTimeout(() => {
        setIsWelcoming(false);
      }, 2000); // 2-second delay

      return () => clearTimeout(timer);
    }
  }, [isWelcoming]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  const currentLabel = menuItems.find((item) => pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard'))?.label || t('dashboard');

  return (
    <SidebarProvider>
        <WelcomeFrame isVisible={isWelcoming} userName={user?.displayName || user?.email?.split('@')[0] || 'User'} t={t} />
        <div className={cn(
            "flex w-full transition-opacity duration-1000",
            !isWelcoming ? "opacity-100 delay-300" : "opacity-0"
        )}>
            <Sidebar collapsible="icon" data-layout-element="sidebar">
                <SidebarHeader>
                <Logo />
                </SidebarHeader>
                <SidebarContent>
                <SidebarMenu className="gap-3">
                    {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
                        >
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <div className="p-2">
                        <Select onValueChange={setLanguage} value={language}>
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <Globe />
                                    <SelectValue placeholder="Language" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">{t('english')}</SelectItem>
                                <SelectItem value="dz">{t('dzongkha')}</SelectItem>
                                <SelectItem value="es">{t('spanish')}</SelectItem>
                                <SelectItem value="fr">{t('french')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header data-layout-element="header" className="flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />
                        <h1 className="text-xl font-semibold md:text-2xl font-headline">
                           {currentLabel}
                        </h1>
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar>
                                    <AvatarImage src={user?.photoURL || "https://placehold.co/40x40.png"} alt="@user" data-ai-hint="person avatar"/>
                                    <AvatarFallback>{user?.displayName?.substring(0,2).toUpperCase() || user?.email?.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>{t('editProfile')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push('/dashboard/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>{t('settings')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{t('logOut')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
