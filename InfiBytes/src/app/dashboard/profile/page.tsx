'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, UploadCloud } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/language-context';

const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  profilePicture: z.any().optional(),
});

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      profilePicture: null,
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        form.reset({
          fullName: currentUser.displayName || '',
          email: currentUser.email || '',
        });
        setImagePreview(currentUser.photoURL);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('profilePicture', event.target.files);
    }
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user || !auth.currentUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update your profile.' });
        return;
    }
    
    setIsSaving(true);
    
    const { fullName, profilePicture } = values;
    const currentUser = auth.currentUser;
    const originalPhotoURL = user.photoURL; // Keep original URL for reversion

    try {
        // --- Part 1: Update display name immediately (fast) ---
        if (currentUser.displayName !== fullName) {
            await updateProfile(currentUser, {
              displayName: fullName,
            });
        }
        
        // --- Part 2: Handle profile picture upload in the background ---
        const file = profilePicture?.[0];
        if (file) {
            // This is a fire-and-forget function for the upload
            const uploadTask = async () => {
                try {
                    const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
                    await uploadBytes(storageRef, file);
                    const photoURL = await getDownloadURL(storageRef);
                    await updateProfile(currentUser, { photoURL });
                } catch (uploadError: any) {
                     toast({
                        variant: 'destructive',
                        title: 'Photo Upload Failed',
                        description: 'Your name was saved, but the photo could not be uploaded.',
                    });
                    // Revert image preview if upload fails
                    setImagePreview(originalPhotoURL);
                }
            };
            uploadTask();
        }

        // --- Part 3: Update local state and show success toast ---
        setUser({ ...auth.currentUser, displayName: fullName }); // Optimistic name update for UI
        toast({
            title: 'Profile Updated',
            description: 'Your changes have been saved.',
        });

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error.message,
        });
    } finally {
        // --- Part 4: Stop loading spinner immediately ---
        setIsSaving(false);
    }
  }
  
  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                      <Skeleton className="h-24 w-24 rounded-full" />
                      <div className="space-y-2">
                          <Skeleton className="h-10 w-48" />
                          <Skeleton className="h-4 w-40" />
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                  </div>
                  <Skeleton className="h-11 w-32" />
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('editProfileTitle')}</CardTitle>
        <CardDescription>
          {t('editProfileDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profilePicture"
              render={() => (
                <FormItem>
                  <FormLabel>{t('profilePhoto')}</FormLabel>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={imagePreview || 'https://placehold.co/100x100.png'} alt="User profile" data-ai-hint="person avatar"/>
                      <AvatarFallback>
                        {user?.displayName?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <FormControl>
                        <Button asChild variant="outline">
                            <label htmlFor="picture-upload" className="cursor-pointer">
                                <UploadCloud className="mr-2" />
                                {t('uploadPhoto')}
                                <input id="picture-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </Button>
                    </FormControl>
                  </div>
                  <FormDescription>{t('squareImageRecommended')}</FormDescription>
                   <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input type="email" {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    {t('emailChangeDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('saveChanges')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
