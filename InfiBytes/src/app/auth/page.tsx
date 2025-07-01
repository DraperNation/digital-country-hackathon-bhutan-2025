'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/language-context';

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const FormSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <Skeleton className="h-11 w-full rounded-md" />
        </CardContent>
    </Card>
);

export default function AuthPage() {
  const [isClient, setIsClient] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
            <Logo />
        </div>
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">{t('signIn')}</TabsTrigger>
            <TabsTrigger value="sign-up">{t('signUp')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sign-in">
            {isClient ? <SignInForm /> : <FormSkeleton />}
          </TabsContent>
          <TabsContent value="sign-up">
            {isClient ? <SignUpForm /> : <FormSkeleton />}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Firebase is not properly configured. Please check your environment variables.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      const userName = user.displayName || user.email?.split('@')[0] || '';
      toast({
        title: t('signIn'),
        description: t('welcomeMessage', { userName: userName }),
      });
      sessionStorage.setItem('justLoggedIn', 'true');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'Invalid email or password.'
        : error.message;
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: errorMessage,
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('signIn')}</CardTitle>
        <CardDescription>
          {t('accessDashboard')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tashi@druknet.bt"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('signIn')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      await updateProfile(userCredential.user, {
        displayName: values.fullName,
      });

      toast({
        title: t('createAccountButton'),
        description: t('welcomeMessage', { userName: values.fullName }),
      });
      sessionStorage.setItem('justLoggedIn', 'true');
      router.push('/dashboard');
    } catch (error: any)
{
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'This email address is already in use.'
        : error.message;
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: errorMessage,
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('signUp')}</CardTitle>
        <CardDescription>
          {t('createAccount')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fullNameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Tashi Delek" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('fullNameGovDocs')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tashi@druknet.bt"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('passwordMinChars')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('createAccountButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
