'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Building2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useLanguage } from '@/context/language-context';


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [statusKey, setStatusKey] = useState('pendingSubmission');

  useEffect(() => {
    const updateUserStatus = () => {
        if (user) {
            const savedProgress = localStorage.getItem(`applicationProgress_${user.uid}`);
            const savedStatusKey = localStorage.getItem(`applicationStatusKey_${user.uid}`);
            
            setApplicationProgress(savedProgress ? parseInt(savedProgress, 10) : 0);
            setStatusKey(savedStatusKey || 'pendingSubmission');
        }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    updateUserStatus();
    
    window.addEventListener('storage', updateUserStatus);
    document.addEventListener('visibilitychange', updateUserStatus)

    return () => {
        unsubscribe();
        window.removeEventListener('storage', updateUserStatus);
        document.removeEventListener('visibilitychange', updateUserStatus);
    };
  }, [user]);

  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <>
        <div className="flex flex-col gap-8">
            <Card>
            <CardHeader>
                <CardTitle>{t('welcomeMessage', { userName })}</CardTitle>
                <CardDescription>
                {t('welcomeTitle')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{t('applicationProgress')}</p>
                    <p className="text-sm text-muted-foreground">{t('applicationStatus')} <span className="font-semibold text-primary">{t(statusKey)}</span>.</p>
                </div>
                <Progress value={applicationProgress} className="w-full" animated={applicationProgress < 100} />
                <p className="text-sm text-muted-foreground">{t('percentComplete', { progress: applicationProgress })}</p>
                </div>
            </CardContent>
            {applicationProgress < 100 && (
                <CardFooter>
                    <Button asChild>
                        <Link href="/dashboard/application">
                        {t('continueApplication')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            )}
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
            <Card className="flex flex-col">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <CardTitle>{t('aiComplianceCheck')}</CardTitle>
                </div>
                <CardDescription>
                    {t('aiComplianceCheckDesc')}
                </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                <p>{t('aiComplianceCheckContent')}</p>
                </CardContent>
                <CardFooter>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/compliance">
                        {t('runCheck')}
                    </Link>
                </Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <Building2 className="h-8 w-8 text-primary" />
                    <CardTitle>{t('businessIncorporation')}</CardTitle>
                </div>
                <CardDescription>
                    {t('businessIncorporationDesc')}
                </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                <p>{t('businessIncorporationContent')}</p>
                </CardContent>
                <CardFooter>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/incorporation">
                        {t('learnMore')}
                    </Link>
                </Button>
                </CardFooter>
            </Card>
            </div>
        </div>
    </>
  );
}
