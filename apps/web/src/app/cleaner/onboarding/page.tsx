'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;

const onboardingSchema = z.object({
    businessType: z.enum(['INDIVIDUAL', 'COMPANY']),
    yearsOfExperience: z.number().min(0, 'Experience must be positive'),
    bio: z.string().min(50, 'Please write at least 50 characters about yourself'),

    // Socials (Optional)
    websiteUrl: z.string().url().optional().or(z.literal('')),
    linkedinProfile: z.string().url().optional().or(z.literal('')),
    instagramHandle: z.string().optional(),

    serviceRadius: z.number().min(5).max(50),
    availability: z.array(z.object({
        dayOfWeek: z.enum(DAYS),
        startTime: z.string(),
        endTime: z.string(),
        isActive: z.boolean()
    }))
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export default function CleanerOnboardingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, control, handleSubmit, watch: _watch, formState: { errors } } = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            businessType: 'INDIVIDUAL',
            yearsOfExperience: 0,
            serviceRadius: 25,
            availability: DAYS.map(day => ({
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '17:00',
                isActive: true
            }))
        }
    });

    const { fields } = useFieldArray({
        control,
        name: "availability"
    });

    const onSubmit = async (data: OnboardingData) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                userId: session?.user?.id,
                // In production, we would upload files here and get URLs
                // idDocumentUrl: ... 
                // insuranceDocUrl: ...
            };

            const response = await fetch('/api/cleaner/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('You must be logged in.');
                    return;
                }
                throw new Error('Failed to create profile');
            }

            // Redirect to a specific "Application Received" page instead of Dashboard?
            // Or just dashboard with "Pending Approval" state
            router.push('/cleaner/dashboard');

        } catch (error) {
            console.error(error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return <div className="p-8 text-center">Please sign in to continue application.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-xl font-bold text-white">Partner Application</h1>
                        <p className="text-blue-100 text-sm">Join the top 1% of service providers.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">

                        {/* 1. Basic Info & Bio */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Profile</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input type="radio" value="INDIVIDUAL" {...register('businessType')} />
                                            <div>
                                                <span className="block font-medium">Individual</span>
                                                <span className="text-xs text-gray-500">Sole Proprietor / Freelancer</span>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input type="radio" value="COMPANY" {...register('businessType')} />
                                            <div>
                                                <span className="block font-medium">Company</span>
                                                <span className="text-xs text-gray-500">LLC / Corp (Requires EIN)</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                                    <input
                                        type="number"
                                        {...register('yearsOfExperience', { valueAsNumber: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About You</label>
                                    <textarea
                                        {...register('bio')}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                        placeholder="Tell customers about your experience, specialty, and why they should choose you."
                                    />
                                    {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* 2. Verification & Socials */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification & Socials</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile (Optional)</label>
                                    <input
                                        {...register('linkedinProfile')}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Handle (Optional)</label>
                                    <input
                                        {...register('instagramHandle')}
                                        placeholder="@yourhandle"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                                    <input
                                        {...register('websiteUrl')}
                                        placeholder="https://yourcleaningbusiness.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h3 className="font-semibold text-yellow-800 text-sm mb-2">Required Documents</h3>
                                <p className="text-sm text-yellow-700 mb-3">
                                    To ensure quality, we require identity verification and proof of insurance.
                                    You will be asked to upload these after submitting this form.
                                </p>
                                <ul className="list-disc list-inside text-sm text-yellow-700">
                                    <li>Government ID (Driver's License / Passport)</li>
                                    <li>General Liability Insurance Certificate</li>
                                    <li>Background Check Authorization</li>
                                </ul>
                            </div>
                        </div>

                        {/* Service Radius */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Area</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Service Radius (km)
                                </label>
                                <input
                                    type="number"
                                    {...register('serviceRadius', { valueAsNumber: true })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.serviceRadius && (
                                    <p className="text-red-500 text-sm mt-1">{errors.serviceRadius.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Availability</h2>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-32">
                                            <span className="font-medium text-gray-900 capitalize">
                                                {field.dayOfWeek.toLowerCase()}
                                            </span>
                                        </div>

                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                {...register(`availability.${index}.isActive`)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-600">Available</span>
                                        </label>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="time"
                                                {...register(`availability.${index}.startTime`)}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="time"
                                                {...register(`availability.${index}.endTime`)}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
