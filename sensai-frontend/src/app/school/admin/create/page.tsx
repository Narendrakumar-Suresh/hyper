// src/app/school/admin/create/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/auth"; // Your useAuth hook
import { useSchools } from "@/lib/api";
import { motion } from "framer-motion";
import { X } from "lucide-react";


export default function CreateSchool() {
    const router = useRouter();
    const { user, isLoading: isLoadingUser } = useAuth(); // <-- Get user and its loading state
    const { schools, isLoading: isLoadingSchools } = useSchools();

    // State for form fields
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [slug, setSlug] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slugError, setSlugError] = useState<string | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [newSchoolId, setNewSchoolId] = useState<string | null>(null);

    // Combine loading states to show a single spinner
    const isLoading = isLoadingUser || isLoadingSchools;

    // Check if user already has a school and redirect if they do
    useEffect(() => {
        if (!isLoading && schools && schools.length > 0) { // <-- Check for isLoading
            const ownedSchool = schools.find(school => school.role === 'owner');
            if (ownedSchool) {
                router.push(`/school/admin/${ownedSchool.id}`);
            }
        }
    }, [schools, router, isLoading]);

    // Base URL for the school
    const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/school/`;

    // Play success sound effect
    const playSuccessSound = () => {
        if (typeof window !== 'undefined') {
            const audio = new Audio('/sounds/success.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!user?.id) {
            console.error("User not authenticated or ID not available.");
            setSlugError("User not authenticated. Please log in again.");
            return;
        }
    
        if (!schoolName.trim() || !slug.trim()) {
            setSlugError("Please fill in all required fields.");
            return;
        }
    
        setIsSubmitting(true);
        setSlugError(null);
    
        if (!user?.email) {
            setSlugError("User email not found. Please ensure you're logged in with a valid email.");
            return;
        }

        const payload = {
            name: schoolName.trim(),
            slug: slug.trim().toLowerCase(),
            user_id: user.id,
            user_email: user.email  // Adding user_email to the payload
        };

        console.log("Submitting payload:", JSON.stringify(payload, null, 2));
        console.log("Backend URL:", `${process.env.NEXT_PUBLIC_BACKEND_URL}/organizations/`);
    
        try {
            // First, check if we can reach the backend
            try {
                const pingResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`, { method: 'HEAD' });
                console.log("Backend reachable, status:", pingResponse.status);
            } catch (pingError) {
                console.error("Cannot reach backend:", pingError);
                throw new Error(`Cannot connect to backend: ${pingError.message}`);
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/organizations/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
                signal: controller.signal,
                mode: 'cors',
                cache: 'no-cache',
            }).finally(() => clearTimeout(timeoutId));
    
            console.log("Response status:", response.status);
            console.log("Response headers:", Object.fromEntries(response.headers.entries()));
            
            const responseText = await response.text();
            console.log("Response text:", responseText);
            
            let data = {};
            try {
                data = responseText ? JSON.parse(responseText) : {};
                console.log("Parsed response data:", data);
            } catch (e) {
                console.error("Failed to parse response as JSON. Response text:", responseText);
                throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
            }
    
            if (!response.ok) {
                console.error("Backend error response:", {
                    status: response.status,
                    statusText: response.statusText,
                    data: data
                });
                
                if (response.status === 401 || response.status === 403) {
                    setSlugError("Authentication failed. Please log in again.");
                } else if (response.status === 400 && data.detail) {
                    if (typeof data.detail === "string") {
                        setSlugError(data.detail);
                    } else if (Array.isArray(data.detail)) {
                        setSlugError(data.detail.map((d: any) => d.msg || d).join(", "));
                    } else {
                        setSlugError(JSON.stringify(data.detail));
                    }
                } else {
                    setSlugError(`Error: ${response.status} - ${response.statusText || 'Something went wrong'}`);
                }
                return;
            }
    
            setNewSchoolId(data.id);
            setShowSuccessDialog(true);
            playSuccessSound();
        } catch (error) {
            console.error("Error creating school:", error);
            setSlugError("Network or server error.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    

    const navigateToSchool = () => {
        if (newSchoolId) {
            router.push(`/school/admin/${newSchoolId}`);
        }
    };

    useEffect(() => {
        if (user?.name) {
            // Split full name into parts
            const nameParts = user.name.trim().split(' ');
            
            // Set first name (always exists)
            setFirstName(nameParts[0]);
            
            // Set last name if exists
            if (nameParts.length > 1) {
                setLastName(nameParts[nameParts.length - 1]);
            }
            
            // Set middle name if exists
            if (nameParts.length > 2) {
                setMiddleName(nameParts.slice(1, -1).join(' '));
            }
        }
    }, [user]);

    

    // Animation variants
    const shootingStarVariants = {
        initial: { opacity: 0, x: '100%', y: '-100%' },
        animate: { 
            opacity: [0, 1, 0],
            x: ['100%', '-100%'],
            y: ['-100%', '100%'],
            transition: { 
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear'
            }
        }
    };

    const orbVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { 
            scale: 1, 
            opacity: 1,
            transition: { 
                duration: 0.5,
                ease: 'easeOut'
            }
        },
        hover: { 
            scale: 1.05,
            transition: { 
                duration: 0.3,
                ease: 'easeInOut'
            }
        }
    };

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <>
            <div className="flex min-h-screen flex-col bg-black text-white">
                <div className="absolute top-5 right-4 sm:right-6 md:right-8 lg:right-12 z-10">
                    <button
                        onClick={handleGoBack}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors focus:outline-none focus:ring-0 focus:border-0 cursor-pointer"
                        aria-label="Close and return to home"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                </div>

                <main className="container mt-10 sm:mt-20 mx-auto px-4 sm:px-6 py-8 max-w-3xl">
                    {isLoading ? ( // <-- Use the combined loading state
                        <div className="flex justify-center items-center py-12">
                            <div className="w-12 h-12 border-t-2 border-b-2 border-white rounded-full animate-spin" data-testid="loading-spinner"></div>
                        </div>
                    ) : (
                        <>
                            {/* The rest of your form and UI here */}
                            <h1 className="text-3xl font-light mb-6 sm:mb-8 text-center">Create Your School</h1>

                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                {/* ... (your form inputs remain the same) */}
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-light mb-2">School Name</h2>
                                    <p className="text-gray-400 text-sm mb-2">This is usually your name or the name of your organization.</p>
                                    <input
                                        id="schoolName"
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-3 rounded-md bg-[#161925] border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                        required
                                        maxLength={40}
                                    />
                                    <div className="text-right text-sm text-gray-400 mt-1">
                                        {schoolName.length}/40
                                    </div>
                                </div>

                                {/* School URL */}
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-light mb-2">School Link</h2>
                                    <p className="text-gray-400 text-sm mb-2">This is how your school will be accessed online by your learners</p>
                                    <div className="flex flex-col sm:flex-row">
                                        <div className={`bg-[#161925] px-3 sm:px-4 py-3 rounded-t-md sm:rounded-l-md sm:rounded-tr-none text-gray-300 border border-gray-800 sm:text-sm md:text-base overflow-x-auto whitespace-nowrap ${slugError ? 'border-red-500' : ''}`}>
                                            {baseUrl}
                                        </div>
                                        <input
                                        id="slug"
                                            type="text"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            className={`flex-1 px-3 sm:px-4 py-3 rounded-b-md sm:rounded-r-md sm:rounded-bl-none bg-[#161925] border border-gray-800 sm:border-l-0 border-t-0 sm:border-t text-white focus:outline-none focus:ring-1 focus:ring-white ${slugError ? 'border-red-500' : ''}`}
                                            required
                                            pattern="^[a-z0-9\-]+$"
                                            title="Only lowercase letters, numbers, and hyphens are allowed"
                                            maxLength={121}
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between text-sm mt-1">
                                        {slugError && (
                                            <p className="text-red-500 mb-1 sm:mb-0">{slugError}</p>
                                        )}
                                        <div className={`text-gray-400 ${slugError ? 'sm:ml-auto' : 'w-full text-right'}`}>
                                            {slug.length}/121
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4 sm:pt-6 flex justify-center">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-black text-sm font-medium rounded-full hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create School'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </main>
            </div>

            {/* Success Dialog with Framer Motion animations */}
            {showSuccessDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center overflow-hidden px-4">
                    {/* ... (Your existing success dialog code remains the same) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-lg max-w-md w-full mx-auto relative z-60"
                    >
                        <div className="bg-black rounded-lg p-6 sm:p-8 flex flex-col items-center text-center">
                            <h2 className="text-3xl sm:text-4xl font-light text-white mb-3 sm:mb-4">Your School is Ready!</h2>
                            <p className="text-lg sm:text-xl font-light text-white mb-6 sm:mb-8">An epic journey begins now</p>

                            <button
                                onClick={navigateToSchool}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-black text-sm font-medium rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Open My School
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}