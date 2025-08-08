
"use client";

import { useState, useEffect, useContext } from 'react';
import { Loader2 } from 'lucide-react';
import { translateText } from '@/ai/flows/translate-text';
import { LanguageContext } from '@/contexts/LanguageContext';
import { Button } from './ui/button';

export function TranslatedContent({ content, originalLanguage = "English" }: { content: string; originalLanguage?: string }) {
  const { targetLanguage } = useContext(LanguageContext);
  const [currentContent, setCurrentContent] = useState(content);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleTranslation = async () => {
      if (!targetLanguage || targetLanguage === originalLanguage) {
        setCurrentContent(content);
        return;
      }

      setIsTranslating(true);
      setError(null);
      try {
        const result = await translateText({ text: content, targetLanguage });
        setCurrentContent(result.translatedText);
      } catch (err) {
        console.error('Translation error:', err);
        setError('Failed to translate.');
        setCurrentContent(content); 
      } finally {
        setIsTranslating(false);
      }
    };

    handleTranslation();
  }, [targetLanguage, content, originalLanguage]);

  if (isTranslating) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Translating...</span>
      </div>
    );
  }

  return (
    <div>
        <p>{currentContent}</p>
        {error && <p className="text-destructive text-xs mt-2">{error}</p>}
    </div>
  );
}
