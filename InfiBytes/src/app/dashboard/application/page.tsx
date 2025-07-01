'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
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
import { Upload, PenSquare, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { auth } from '@/lib/firebase/config';
import { cn } from '@/lib/utils';

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  country: z.string().min(2, 'Country is required.'),
  passportFile: z.any().refine((files) => files?.length >= 1, 'Passport scan is required.'),
  signature: z.string().min(2, 'Signature is required.'),
});

export default function ApplicationPage() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const form = useForm<z.infer<typeof applicationSchema>>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            fullName: '',
            email: '',
            country: '',
            signature: '',
            passportFile: null,
        },
    });
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const savedData = localStorage.getItem(`applicationData_${user.uid}`);
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    form.reset(parsedData);
                    if (parsedData.passportFileName) {
                        setFileName(parsedData.passportFileName);
                    }
                } catch (e) {
                    console.error("Failed to parse saved application data", e);
                }
            }
        }
    }, [user, form]);

    const watchedValues = form.watch();
    
    useEffect(() => {
        if (user) {
            const values = form.getValues();
            const totalFields = Object.keys(applicationSchema.shape).length;
            let filledFields = 0;
            
            if (values.fullName && values.fullName.length > 1) filledFields++;
            if (values.email && z.string().email().safeParse(values.email).success) filledFields++;
            if (values.country && values.country.length > 1) filledFields++;
            if (values.passportFile && values.passportFile.length > 0) filledFields++;
            if (values.signature && values.signature.length > 1) filledFields++;
            
            const progress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
            
            localStorage.setItem(`applicationProgress_${user.uid}`, progress.toString());

            const persistedData = { ...values, passportFile: null, passportFileName: fileName };
            localStorage.setItem(`applicationData_${user.uid}`, JSON.stringify(persistedData));

            const currentStatus = localStorage.getItem(`applicationStatusKey_${user.uid}`);
            if (currentStatus !== 'submittedForReview') {
                if (progress > 0 && progress < 100) {
                     localStorage.setItem(`applicationStatusKey_${user.uid}`, 'inProgress');
                } else if (progress === 0) {
                     localStorage.setItem(`applicationStatusKey_${user.uid}`, 'pendingSubmission');
                }
            }
        }
    }, [watchedValues, user, form, fileName]);


    function onSubmit(values: z.infer<typeof applicationSchema>) {
        if (!user) return;
        console.log(values);
        
        localStorage.setItem(`applicationProgress_${user.uid}`, '100');
        localStorage.setItem(`applicationStatusKey_${user.uid}`, 'submittedForReview');

        toast({
            title: t('applicationSubmitted'),
            description: t('applicationSubmittedDesc'),
        });
        router.push('/dashboard');
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            setFileName(files[0].name);
            form.setValue('passportFile', files, { shouldValidate: true });
        } else {
            setFileName(null);
            form.setValue('passportFile', null, { shouldValidate: true });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('personalInfo')}</CardTitle>
                        <CardDescription>{t('personalInfoDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('fullNameLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tashi Delek" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('emailAddressLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="tashi@druknet.bt" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('countryOfCitizenship')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Bhutan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('documentUpload')}</CardTitle>
                        <CardDescription>{t('documentUploadDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <FormField
                            control={form.control}
                            name="passportFile"
                            render={() => (
                                <FormItem>
                                    <FormLabel>{t('passportScan')}</FormLabel>
                                    <FormControl>
                                        <div className="relative flex items-center justify-center w-full">
                                            <label htmlFor="passport-upload" className={cn("flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted", { 'border-green-500': !!fileName })}>
                                                {fileName ? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-green-500">
                                                        <CheckCircle className="w-12 h-12 mb-3" />
                                                        <p className="font-semibold">{t('fileUploaded')}</p>
                                                        <p className="text-xs">{fileName}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">{t('clickToUpload')}</span> {t('dragAndDrop')}</p>
                                                        <p className="text-xs text-muted-foreground">{t('fileTypes')}</p>
                                                    </div>
                                                )}
                                                <Input id="passport-upload" type="file" className="hidden" onChange={handleFileChange} accept="application/pdf,image/png,image/jpeg" />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>{t('digitalSignature')}</CardTitle>
                        <CardDescription>{t('digitalSignatureDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <FormField
                            control={form.control}
                            name="signature"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('agreementSignature')}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder={t('fullNameLabel')} {...field} className="pl-10 text-2xl h-14 font-headline" />
                                            <PenSquare className="absolute w-6 h-6 text-muted-foreground left-2 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full md:w-auto">{t('submitApplication')}</Button>
            </form>
        </Form>
    );
}
