"use client";

"use client";

import React, { lazy, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { EndlessKnot, Lotus, DharmaWheel } from '@/components/bhutanese-icons';
import { Shield, Globe, Cpu, ArrowRight, Zap, Lock, Languages } from 'lucide-react';

// Lazy load heavy components
const ThunderDragon = lazy(() => import('@/components/thunder-dragon').then(m => ({ default: m.ThunderDragon })));
const AnimatedBackground = lazy(() => import('@/components/animated-background').then(m => ({ default: m.AnimatedBackground })));

const features = [
  {
    icon: DharmaWheel,
    title: 'Sovereign AI',
    description: 'Fully controlled and operated within Bhutan, ensuring complete data sovereignty and national security.',
    color: 'text-crimson-700 dark:text-crimson-400',
  },
  {
    icon: Lotus,
    title: 'Dzongkha-First',
    description: 'Native support for Dzongkha language with advanced NLP capabilities tailored for Bhutanese culture.',
    color: 'text-gold-700 dark:text-gold-400',
  },
  {
    icon: EndlessKnot,
    title: 'Ethical AI',
    description: 'Built with Buddhist principles of compassion and wisdom, ensuring responsible AI development.',
    color: 'text-crimson-700 dark:text-crimson-400',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 text-center overflow-hidden">
        <Suspense fallback={null}>
          <AnimatedBackground className="absolute inset-0 opacity-40" particleCount={40} />
          <ThunderDragon className="absolute top-1/4 right-1/4 w-96 h-96 opacity-60" />
        </Suspense>
        
        <div className="container mx-auto relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight font-jomolhari">
              <span className="text-crimson-950 dark:text-crimson-400">Druk</span>
              <span className="text-gold-950 dark:text-gold-400">GPT</span>
            </h1>
            
            {/* Dzongkha subtitle */}
            <div className="text-2xl md:text-3xl mb-4 dzongkha-text text-muted-foreground">
              འབྲུག་གི་བློ་རིག་ཐབས་ལམ་
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Sovereign AI for Bhutan — secure, ethical, Dzongkha-first
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-crimson-950 hover:bg-crimson-800 text-white px-8 py-6 text-lg"
              >
                <Link href="/console" className="flex items-center gap-2">
                  Launch Console
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gold-950 text-gold-950 hover:bg-gold-50 dark:border-gold-400 dark:text-gold-400 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
            
            {/* Traditional divider */}
            <div className="endless-knot-divider mt-12"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-jomolhari">Empowering Bhutan's Digital Future</h2>
            <div className="text-xl mb-4 dzongkha-text text-muted-foreground">
              འབྲུག་གི་ཨང་རྟགས་མ་འོངས་པ་
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              DrukGPT represents the convergence of cutting-edge AI technology with Bhutanese values and sovereignty.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="feature-card border-2 hover:border-crimson-200 dark:hover:border-crimson-800"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl font-jomolhari">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-crimson-950 dark:text-crimson-400 mb-2">500M+</div>
              <div className="text-muted-foreground">Dzongkha Tokens</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-950 dark:text-gold-400 mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-crimson-950 dark:text-crimson-400 mb-2">100%</div>
              <div className="text-muted-foreground">Data Sovereignty</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-950 dark:text-gold-400 mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-crimson-950 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 font-jomolhari">Ready to Experience Sovereign AI?</h2>
          <div className="text-xl mb-4 dzongkha-text text-crimson-100">
            རང་དབང་བློ་རིག་ལ་ཞུགས་པར་ཁེད་རང་གི་གྲ་སྒྲིག་ཡོད་དམ།
          </div>
          <p className="text-xl mb-8 text-crimson-100 max-w-2xl mx-auto">
            Join researchers, developers, and government officials in building Bhutan's AI future.
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="bg-gold-950 hover:bg-gold-800 text-white px-8 py-6 text-lg"
          >
            <Link href="/console" className="flex items-center gap-2">
              Start Building
              <Zap className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}