'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Download, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function SettingsPage() {
    const { toast } = useToast();
    const { t } = useLanguage();

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
        console.log(values);
        toast({
            title: t('passwordUpdated'),
            description: t('passwordUpdatedDesc'),
        });
        form.reset();
    }
    
    const handleThemeToggle = (checked: boolean) => {
        const theme = checked ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', checked);
        toast({
            title: t('themeChanged', { theme }),
        });
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{t('appearance')}</CardTitle>
                    <CardDescription>{t('appearanceDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="dark-mode-switch">{t('darkMode')}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t('darkModeDesc')}
                            </p>
                        </div>
                        <Switch
                            id="dark-mode-switch"
                            onCheckedChange={handleThemeToggle}
                            defaultChecked={true}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('notificationPrefs')}</CardTitle>
                    <CardDescription>{t('notificationPrefsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="app-updates-switch">{t('appUpdates')}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t('appUpdatesDesc')}
                            </p>
                        </div>
                        <Switch id="app-updates-switch" defaultChecked={true} />
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="promo-emails-switch">{t('promoEmails')}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t('promoEmailsDesc')}
                            </p>
                        </div>
                        <Switch id="promo-emails-switch" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('security')}</CardTitle>
                    <CardDescription>{t('securityDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label>{t('twoFactorAuth')}</Label>
                             <p className="text-sm text-muted-foreground">
                                {t('twoFactorAuthDesc')}
                            </p>
                        </div>
                        <Button>{t('setup2FA')}</Button>
                    </div>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t('changePassword')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('currentPassword')}</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('newPassword')}</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('confirmNewPassword')}</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">{t('updatePassword')}</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('dataPrivacy')}</CardTitle>
                    <CardDescription>{t('dataPrivacyDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label>{t('downloadData')}</Label>
                             <p className="text-sm text-muted-foreground">
                                {t('downloadDataDesc')}
                            </p>
                        </div>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> {t('download')}</Button>
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50">
                        <div className="space-y-0.5">
                            <Label className="text-destructive">{t('deleteAccount')}</Label>
                             <p className="text-sm text-muted-foreground">
                                {t('deleteAccountDesc')}
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/> {t('delete')}</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('areYouSureDesc')}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction>{t('continue')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
