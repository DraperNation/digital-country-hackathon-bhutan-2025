'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const incorporationSchema = z.object({
  companyName: z.string().min(3, 'Company name must be at least 3 characters.'),
  companyType: z.string({ required_error: 'Please select a company type.' }),
  businessActivity: z.string().min(10, 'Please describe your business activity.'),
});

export default function IncorporationPage() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<z.infer<typeof incorporationSchema>>({
        resolver: zodResolver(incorporationSchema),
        defaultValues: {
            companyName: '',
            businessActivity: '',
        },
    });

    function onSubmit(values: z.infer<typeof incorporationSchema>) {
        setIsSubmitting(true);
        console.log(values);
        
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Incorporation Request Sent",
                description: `Your request to incorporate "${values.companyName}" has been submitted.`,
            });
            form.reset();
        }, 2000);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('incorporateBusiness')}</CardTitle>
                <CardDescription>
                    {t('incorporateBusinessDesc')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('companyName')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Druk Innovations" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t('companyNameDesc')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="companyType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('companyType')}</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('companyTypePlaceholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="private-limited">{t('privateLimited')}</SelectItem>
                                            <SelectItem value="sole-proprietorship">{t('soleProprietorship')}</SelectItem>
                                            <SelectItem value="public-limited">{t('publicLimited')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="businessActivity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('businessActivity')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Software development, consulting" {...field} />
                                    </FormControl>
                                     <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('submitForIncorporation')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
