
"use client";

import { useState, useEffect, useContext } from 'react';
import { Loader2 } from 'lucide-react';
import { translateText } from '@/ai/flows/translate-text';
import { LanguageContext } from '@/contexts/LanguageContext';

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

      // Don't set loading state, just translate in the background
      // and update when ready. This prevents the UI flicker.
      setError(null);
      try {
        const result = await translateText({ text: content, targetLanguage });
        setCurrentContent(result.translatedText);
      } catch (err) {
        console.error('Translation error:', err);
        setError('Failed to translate.');
        setCurrentContent(content); // Revert to original on error
      }
    };

    handleTranslation();
  }, [targetLanguage, content, originalLanguage]);


  return (
    <>
        {currentContent}
        {error && <p className="text-destructive text-xs mt-2">{error}</p>}
    </>
  );
}

