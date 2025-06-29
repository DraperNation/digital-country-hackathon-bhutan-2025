"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Languages, Volume2, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { dzongkhaNLP } from '@/lib/dzongkha-nlp';
import { culturalKnowledge } from '@/lib/cultural-knowledge';

interface DzongkhaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showAnalysis?: boolean;
  enableTransliteration?: boolean;
}

export function DzongkhaInput({
  value,
  onChange,
  placeholder = "དུས་ཐོག་དུ་གང་ཞིག་ཞུ་འདོད་ཡོད།",
  className,
  showAnalysis = true,
  enableTransliteration = true
}: DzongkhaInputProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showTransliterationHelp, setShowTransliterationHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Transliteration mappings (simplified Wylie to Tibetan)
  const transliterationMap: Record<string, string> = {
    'ka': 'ཀ', 'kha': 'ཁ', 'ga': 'ག', 'nga': 'ང',
    'ca': 'ཅ', 'cha': 'ཆ', 'ja': 'ཇ', 'nya': 'ཉ',
    'ta': 'ཏ', 'tha': 'ཐ', 'da': 'ད', 'na': 'ན',
    'pa': 'པ', 'pha': 'ཕ', 'ba': 'བ', 'ma': 'མ',
    'tsa': 'ཙ', 'tsha': 'ཚ', 'dza': 'ཛ', 'wa': 'ཝ',
    'zha': 'ཞ', 'za': 'ཟ', "'a": 'འ', 'ya': 'ཡ',
    'ra': 'ར', 'la': 'ལ', 'sha': 'ཤ', 'sa': 'ས',
    'ha': 'ཧ', 'a': 'ཨ'
  };

  useEffect(() => {
    if (value && showAnalysis) {
      // Simulate analysis for demo purposes
      const simulateAnalysis = async () => {
        setIsAnalyzing(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAnalysis({
          tokens: [{ text: value, pos: 'UNKNOWN', lemma: value, syllables: [value] }],
          sentiment: { polarity: 0.1, confidence: 0.8, cultural_context: 'general' },
          entities: [],
          complexity: 0.3,
          formality: 'formal' as const,
          validation: { isValid: true, errors: [], suggestions: [] },
          culturalValidation: { isAppropriate: true, warnings: [], suggestions: [] }
        });
        
        setIsAnalyzing(false);
      };
      
      simulateAnalysis();
    }
  }, [value]);

  const handleTransliteration = (inputText: string) => {
    if (!enableTransliteration) return inputText;

    let result = inputText;
    
    // Simple transliteration - replace latin characters with Tibetan
    Object.entries(transliterationMap).forEach(([latin, tibetan]) => {
      const regex = new RegExp(latin, 'g');
      result = result.replace(regex, tibetan);
    });

    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const transliterated = handleTransliteration(inputValue);
    onChange(transliterated);
  };

  const speakText = () => {
    if ('speechSynthesis' in window && value) {
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = 'bo'; // Tibetan language code
      speechSynthesis.speak(utterance);
    }
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity < 0.3) return 'text-green-600';
    if (complexity < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFormalityBadgeVariant = (formality: string) => {
    switch (formality) {
      case 'sacred': return 'default';
      case 'formal': return 'secondary';
      case 'informal': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`font-tibetan text-lg leading-relaxed pr-20 ${className}`}
          style={{ fontFamily: 'Jomolhari, "Noto Sans Tibetan", serif' }}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={speakText}
              className="h-8 w-8 p-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
          
          {enableTransliteration && (
            <Popover open={showTransliterationHelp} onOpenChange={setShowTransliterationHelp}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Languages className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Transliteration Help</h4>
                  <p className="text-sm text-muted-foreground">
                    Type in English and get Dzongkha characters:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>ka → ཀ</div>
                    <div>kha → ཁ</div>
                    <div>ga → ག</div>
                    <div>nga → ང</div>
                    <div>pa → པ</div>
                    <div>ba → བ</div>
                    <div>ma → མ</div>
                    <div>tashi → ཏཤི</div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {showAnalysis && analysis && (
        <Card>
          <CardContent className="p-4 space-y-4">
            
            {/* Analysis Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Complexity:</span>
                  <span className={`text-sm font-medium ${getComplexityColor(analysis.complexity)}`}>
                    {(analysis.complexity * 100).toFixed(0)}%
                  </span>
                </div>
                
                <Badge variant={getFormalityBadgeVariant(analysis.formality)}>
                  {analysis.formality}
                </Badge>
                
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Sentiment:</span>
                  <div className={`w-3 h-3 rounded-full ${
                    analysis.sentiment.polarity > 0.2 ? 'bg-green-500' :
                    analysis.sentiment.polarity < -0.2 ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                </div>
              </div>
              
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </div>
              )}
            </div>

            {/* Cultural Entities */}
            {analysis.entities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Cultural References</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.entities.map((entity: any, index: number) => (
                    <Popover key={index}>
                      <PopoverTrigger asChild>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                        >
                          {entity.text}
                          <HelpCircle className="ml-1 h-3 w-3" />
                        </Badge>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <div className="font-medium">{entity.text}</div>
                          {entity.meaning && (
                            <div className="text-sm">{entity.meaning}</div>
                          )}
                          {entity.cultural_significance && (
                            <div className="text-sm text-muted-foreground">
                              <strong>Cultural Significance:</strong> {entity.cultural_significance}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Results */}
            <div className="space-y-2">
              {analysis.validation && !analysis.validation.isValid && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-700">Text Validation Issues:</div>
                    <ul className="text-sm text-red-600 list-disc list-inside">
                      {analysis.validation.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {analysis.culturalValidation && !analysis.culturalValidation.isAppropriate && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-yellow-700">Cultural Considerations:</div>
                    <ul className="text-sm text-yellow-600 list-disc list-inside">
                      {analysis.culturalValidation.warnings.map((warning: string, index: number) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-700">Suggestions:</div>
                    <ul className="text-sm text-blue-600 list-disc list-inside">
                      {suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Cultural Context */}
            {analysis.sentiment.cultural_context && (
              <div className="p-2 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">
                  <strong>Cultural Context:</strong> {analysis.sentiment.cultural_context}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}