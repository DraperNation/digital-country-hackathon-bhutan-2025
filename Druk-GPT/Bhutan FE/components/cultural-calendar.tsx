"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react';
import { culturalKnowledge } from '@/lib/cultural-knowledge';

interface CulturalCalendarProps {
  className?: string;
  showUpcoming?: number;
  compact?: boolean;
}

export function CulturalCalendar({ className, showUpcoming = 3, compact = false }: CulturalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [upcomingFestivals, setUpcomingFestivals] = useState<any[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<any>(null);

  useEffect(() => {
    // Simulate getting festivals - replace with actual API call
    setUpcomingFestivals(mockUpcomingEvents.slice(0, showUpcoming));
  }, [currentDate, showUpcoming]);

  const getLunarDateInfo = (lunarDate: string) => {
    // Convert lunar calendar info to readable format
    return lunarDate;
  };

  const getFestivalTypeColor = (festivalName: string) => {
    if (festivalName.includes('Tshechu')) return 'bg-crimson-100 text-crimson-800 dark:bg-crimson-900 dark:text-crimson-200';
    if (festivalName.includes('Buddha')) return 'bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const mockUpcomingEvents = [
    {
      id: 'buddha_purnima_2024',
      name: 'Buddha Purnima',
      nameInDzongkha: 'སངས་རྒྱས་འཁྲུངས་སྐར་',
      date: { lunar: '15th day of 4th lunar month', gregorian: 'May 23, 2024' },
      location: ['All Monasteries', 'Temples across Bhutan'],
      description: 'Celebration of Buddha\'s birth, enlightenment, and parinirvana',
      significance: 'Most sacred Buddhist holiday, merit accumulation',
      type: 'religious',
      activities: ['Temple visits', 'Butter lamp offerings', 'Merit-making activities', 'Meditation sessions']
    },
    {
      id: 'royal_birthday_2024',
      name: 'Royal Birthday Celebration',
      nameInDzongkha: 'རྒྱལ་པོའི་འཁྲུངས་སྐར་',
      date: { lunar: '', gregorian: 'February 21, 2024' },
      location: ['Thimphu', 'Nationwide'],
      description: 'Celebration of His Majesty the King\'s birthday',
      significance: 'National holiday honoring the monarchy',
      type: 'national',
      activities: ['Cultural performances', 'Traditional sports', 'Community gatherings', 'Flag ceremonies']
    },
    {
      id: 'monsoon_blessing_2024',
      name: 'Monsoon Blessing Ceremony',
      nameInDzongkha: 'དབྱར་ཆའི་བྱིན་རླབས་',
      date: { lunar: '4th day of 6th lunar month', gregorian: 'June 15, 2024' },
      location: ['Agricultural regions', 'Rural communities'],
      description: 'Traditional ceremony to ensure good monsoon for crops',
      significance: 'Agricultural blessing, food security prayers',
      type: 'agricultural',
      activities: ['Field blessings', 'Rain prayers', 'Community feasts', 'Traditional dances']
    }
  ];

  // Compact version for sidebar
  if (compact || className?.includes('compact')) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="space-y-2">
          {mockUpcomingEvents.slice(0, showUpcoming).map((event) => (
            <Dialog key={event.id}>
              <DialogTrigger asChild>
                <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{event.name}</h4>
                      <div className="text-xs dzongkha-text text-muted-foreground mb-1">
                        {event.nameInDzongkha}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="truncate">
                          {event.date.gregorian || getLunarDateInfo(event.date.lunar)}
                        </span>
                      </div>
                    </div>
                    <Badge className={`ml-2 text-xs ${getFestivalTypeColor(event.name)}`}>
                      {event.type}
                    </Badge>
                  </div>
                </div>
              </DialogTrigger>
              
              {/* Same detailed dialog content */}
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-gold-600" />
                    {event.name}
                  </DialogTitle>
                  <DialogDescription>
                    <span className="dzongkha-text text-lg">{event.nameInDzongkha}</span>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Event Details */}
                  <div>
                    <h3 className="font-medium mb-2">Event Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <div>{event.date.gregorian || event.date.lunar}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <Badge className={`ml-2 ${getFestivalTypeColor(event.name)}`}>
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>

                  {/* Cultural Significance */}
                  <div>
                    <h3 className="font-medium mb-2">Cultural Significance</h3>
                    <p className="text-sm text-muted-foreground">{event.significance}</p>
                  </div>

                  {/* Locations */}
                  <div>
                    <h3 className="font-medium mb-2">Locations</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.location.map((loc, index) => (
                        <Badge key={index} variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <h3 className="font-medium mb-2">Traditional Activities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {event.activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-crimson-600 rounded-full" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cultural Context */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-crimson-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Community Participation</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          This event brings together communities across Bhutan, reinforcing cultural bonds and traditional values. 
                          Participation in such celebrations is considered meritorious and strengthens the cultural fabric of society.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Compact Lunar Info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
            <span className="text-sm font-medium">Lunar Calendar</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>3rd Month (Spring) - དཔྱིད་ཀ</div>
            <div>Auspicious: 1st, 15th</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-crimson-700" />
            Bhutanese Cultural Calendar
            <span className="text-sm dzongkha-text text-muted-foreground ml-2">
              རིག་གཞུང་ལོ་ཐོ།
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mockUpcomingEvents.map((event) => (
              <Dialog key={event.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <h3 className="font-medium">{event.name}</h3>
                              <div className="text-sm dzongkha-text text-muted-foreground mb-2">
                                {event.nameInDzongkha}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {event.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.date.gregorian || getLunarDateInfo(event.date.lunar)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location[0]}
                              {event.location.length > 1 && (
                                <span className="text-muted-foreground">
                                  +{event.location.length - 1} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={getFestivalTypeColor(event.name)}>
                          {event.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-gold-600" />
                      {event.name}
                    </DialogTitle>
                    <DialogDescription>
                      <span className="dzongkha-text text-lg">{event.nameInDzongkha}</span>
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Event Details */}
                    <div>
                      <h3 className="font-medium mb-2">Event Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <div>{event.date.gregorian || event.date.lunar}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <Badge className={`ml-2 ${getFestivalTypeColor(event.name)}`}>
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>

                    {/* Cultural Significance */}
                    <div>
                      <h3 className="font-medium mb-2">Cultural Significance</h3>
                      <p className="text-sm text-muted-foreground">{event.significance}</p>
                    </div>

                    {/* Locations */}
                    <div>
                      <h3 className="font-medium mb-2">Locations</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.location.map((loc, index) => (
                          <Badge key={index} variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <h3 className="font-medium mb-2">Traditional Activities</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {event.activities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-crimson-600 rounded-full" />
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cultural Context */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-crimson-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Community Participation</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            This event brings together communities across Bhutan, reinforcing cultural bonds and traditional values. 
                            Participation in such celebrations is considered meritorious and strengthens the cultural fabric of society.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lunar Calendar Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
            Lunar Calendar Context
            <span className="text-sm dzongkha-text text-muted-foreground ml-2">
              ཟླ་བའི་ལོ་ཐོ།
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Lunar Month:</span>
              <span className="font-medium">3rd Month (Spring)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Auspicious Days:</span>
              <div className="flex gap-2">
                <Badge variant="outline">New Moon (1st)</Badge>
                <Badge variant="outline">Full Moon (15th)</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Season:</span>
              <span className="font-medium dzongkha-text">དཔྱིད་ཀ (Spring)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}