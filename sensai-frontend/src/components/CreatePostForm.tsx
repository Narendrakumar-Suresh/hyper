
"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Wand2, Loader2, ShieldCheck, Link2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCurrentUser, mockHubs } from "@/lib/data";
import { autoTagPost } from "@/ai/flows/auto-tag-post";
import { preventDirectAnswer } from "@/ai/flows/prevent-direct-answer";
import { preventToxicPost } from "@/ai/flows/prevent-toxic-post";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { suggestThreadLinks } from "@/ai/flows/suggest-thread-links";
import { DialogFooter } from "./ui/dialog";

const formSchema = z.object({
  hub: z.string().min(1, "Please select a hub."),
  type: z.string(),
  title: z.string().min(5, "Title must be be at least 5 characters long."),
  content: z.string().min(20, "Content must be at least 20 characters long."),
  tags: z.string(),
  linkedTask: z.string().optional(),
  linkedSkill: z.string().optional(),
});

export function CreatePostForm() {
    const { toast } = useToast();
    const [isTagging, setIsTagging] = useState(false);
    const [isLinking, setIsLinking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { hub: "", type: "Question", title: "", content: "", tags: "", linkedTask: "", linkedSkill: "" },
    });

    const checkContentLength = () => {
        const content = form.getValues("content");
        if (content.length < 20) {
            toast({
                variant: "destructive",
                title: "Content too short",
                description: "Please write at least 20 characters for AI suggestions.",
            });
            return false;
        }
        return true;
    }

    const handleAutoTag = async () => {
        if (!checkContentLength()) return;
        setIsTagging(true);
        try {
            const result = await autoTagPost({ postContent: form.getValues("content") });
            form.setValue("tags", result.tags.join(", "));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error generating tags",
                description: "Could not generate tags. Please try again.",
            });
        } finally {
            setIsTagging(false);
        }
    };

    const handleSuggestLinks = async () => {
        const title = form.getValues("title");
        const content = form.getValues("content");
        if (title.length < 5 || content.length < 20) {
             toast({
                variant: "destructive",
                title: "Content too short",
                description: "Please provide a title (min 5 chars) and content (min 20 chars) for link suggestions.",
            });
            return;
        }
        setIsLinking(true);
        try {
            const result = await suggestThreadLinks({ title, content });
            form.setValue("linkedTask", result.linkedTask);
            form.setValue("linkedSkill", result.linkedSkill);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error suggesting links",
                description: "Could not suggest links. Please try again.",
            });
        } finally {
            setIsLinking(false);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setSubmissionError(null);
        try {
            const toxicCheck = await preventToxicPost({
                title: values.title,
                content: values.content,
            });
            if (toxicCheck.isToxic) {
                setSubmissionError(toxicCheck.reason);
                setIsSubmitting(false);
                return;
            }

            if (values.type === "Question") {
                const protectionResult = await preventDirectAnswer({
                    title: values.title,
                    content: values.content,
                });
                if (protectionResult.isDirectAnswer) {
                    setSubmissionError(protectionResult.reason);
                    setIsSubmitting(false);
                    return;
                }
            }
            
            console.log(values);
            toast({
                title: "Post Created!",
                description: "Your post has been successfully created.",
            });
        } catch (error) {
            console.error("Submission error", error);
            setSubmissionError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 {submissionError && (
                    <Alert variant="destructive">
                        <ShieldCheck className="h-4 w-4" />
                        <AlertTitle>Suggestion from AI Moderator</AlertTitle>
                        <AlertDescription>{submissionError}</AlertDescription>
                    </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="hub"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hub</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select a hub" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {mockHubs.map(hub => <SelectItem key={hub.id} value={hub.id}>{hub.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Post Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Question">Question</SelectItem>
                                        <SelectItem value="Note">Note</SelectItem>
                                        <SelectItem value="Poll">Poll</SelectItem>
                                        <SelectItem value="Thread">Thread</SelectItem>
                                        {(mockCurrentUser.role === 'mentor' || mockCurrentUser.role === 'staff') && (
                                            <SelectItem value="AMA">Mentor AMA</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input placeholder="e.g., How to implement a binary search tree?" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl><Textarea placeholder="Explain your question or share your notes in detail..." rows={6} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <div className="flex gap-2">
                                <FormControl><Input placeholder="e.g., react, typescript, sorting" {...field} /></FormControl>
                                <Button type="button" variant="outline" onClick={handleAutoTag} disabled={isTagging}>
                                    {isTagging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                    <span className="ml-2 hidden sm:inline">Auto-tag</span>
                                </Button>
                            </div>
                            <FormDescription>Separate tags with commas. Use the magic wand for AI suggestions!</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="space-y-4 rounded-lg border p-4">
                     <div className="flex justify-between items-center">
                        <div>
                             <h3 className="font-medium">Smart Links</h3>
                             <p className="text-sm text-muted-foreground">Automatically link this post to course content.</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={handleSuggestLinks} disabled={isLinking}>
                           {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                            <span className="ml-2">Suggest Links</span>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="linkedTask"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Linked Task</FormLabel>
                                    <FormControl><Input placeholder="e.g., Lesson: Intro to SQL" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="linkedSkill"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Linked Skill</FormLabel>
                                    <FormControl><Input placeholder="e.g., SQL" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Post
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
