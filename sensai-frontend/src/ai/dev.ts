import { config } from 'dotenv';
config();

import '@/ai/flows/auto-tag-post.ts';
import '@/ai/flows/answer-faqs.ts';
import '@/ai/flows/summarize-long-discussion.ts';
import '@/ai/flows/suggest-similar-threads.ts';
import '@/ai/flows/prevent-direct-answer.ts';
import '@/ai/flows/prevent-toxic-post.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/suggest-thread-links.ts';
