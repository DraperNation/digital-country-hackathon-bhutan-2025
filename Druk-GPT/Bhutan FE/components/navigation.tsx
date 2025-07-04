"use client";

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { Database, Settings, MessageSquare, Bot } from 'lucide-react';
import { DragonHead } from '@/components/bhutanese-icons';

const navigation = [
  { name: 'Console', href: '/console', icon: MessageSquare },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Data Commons', href: '/data-commons', icon: Database },
  { name: 'Admin', href: '/admin', icon: Settings },
];

export const Navigation = memo(function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <DragonHead className="h-8 w-8 text-crimson-950 dark:text-crimson-400" />
              <span className="text-xl font-bold font-jomolhari">DrukGPT</span>
              <span className="text-sm dzongkha-text text-muted-foreground ml-2">འབྲུག་</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-crimson-700",
                      pathname === item.href
                        ? "text-crimson-950 dark:text-crimson-400"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
});