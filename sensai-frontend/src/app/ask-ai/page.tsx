
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { answerFAQs } from '@/ai/flows/answer-faqs';

export default function AskAIPage() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setIsLoading(true);
        setAnswer('');
        try {
            const result = await answerFAQs({ question });
            setAnswer(result.answer);
        } catch (error) {
            console.error(error);
            setAnswer("Sorry, I couldn't get an answer. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Ask the AI Mentor</h1>
        <p className="text-muted-foreground">
          Get quick answers to your questions from our AI-powered assistant.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
          <CardDescription>
            Enter your question below and the AI will do its best to provide an answer.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent>
                <Textarea
                    placeholder="e.g., What is the difference between a list and a tuple in Python?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    disabled={isLoading}
                />
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get Answer
                </Button>
            </CardFooter>
        </form>
      </Card>

        {answer && (
            <Card>
                <CardHeader>
                    <CardTitle>Answer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{answer}</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
