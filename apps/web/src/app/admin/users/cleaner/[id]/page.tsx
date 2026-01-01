import { prisma } from "@fixelo/database";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CleanerStatus } from "@prisma/client";
import { approveCleaner, rejectCleaner } from "../../actions";

export default async function CleanerReviewPage({ params }: { params: { id: string } }) {
    const cleaner = await prisma.cleanerProfile.findUnique({
        where: { id: params.id },
        include: { user: true }
    });

    if (!cleaner) {
        notFound();
    }

    const approveAction = approveCleaner.bind(null, cleaner.id);
    const rejectAction = rejectCleaner.bind(null, cleaner.id);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Review Cleaner Application</h1>
                <div className="space-x-4">
                    <form action={rejectAction} className="inline-block">
                        <Button variant="destructive" type="submit">Reject Application</Button>
                    </form>
                    <form action={approveAction} className="inline-block">
                        <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" type="submit">Approve Cleaner</Button>
                    </form>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                            <p className="text-lg">{cleaner.user.firstName} {cleaner.user.lastName}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Email</span>
                            <p className="text-lg">{cleaner.user.email}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Phone</span>
                            <p className="text-lg">{cleaner.user.phone || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Application Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Current Status</span>
                            <div className="mt-1">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cleaner.status === CleanerStatus.ACTIVE ? "bg-green-100 text-green-800" :
                                    cleaner.status === CleanerStatus.PENDING_APPROVAL ? "bg-yellow-100 text-yellow-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                    {cleaner.status}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Service Radius</span>
                            <p className="text-lg">{cleaner.serviceRadius} km</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Preferences</span>
                            <ul className="list-disc list-inside mt-2">
                                {cleaner.acceptsStandard && <li>Standard Cleaning</li>}
                                {cleaner.acceptsDeep && <li>Deep Cleaning</li>}
                                {cleaner.acceptsAirbnb && <li>Airbnb Cleaning</li>}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Quality Score</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl font-bold">{cleaner.qualityScore.toFixed(1)}</span>
                                    <span className="text-yellow-500">★</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Jobs Completed</span>
                                <p className="text-2xl font-bold mt-1">{cleaner.totalJobsCompleted}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Acceptance Rate</span>
                                <div className="mt-1">
                                    <span className={`text-lg font-bold px-2 py-0.5 rounded ${cleaner.acceptanceRate >= 0.8 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {(cleaner.acceptanceRate * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
                                <div className="mt-1">
                                    <span className={`text-lg font-bold px-2 py-0.5 rounded ${cleaner.completionRate >= 0.9 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {(cleaner.completionRate * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <span className="text-sm font-medium text-muted-foreground">Funnel Stats</span>
                            <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
                                <div className="bg-gray-50 p-2 rounded">
                                    <div className="font-bold">{cleaner.totalJobsOffered}</div>
                                    <div className="text-gray-500">Offered</div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                    <div className="font-bold">{cleaner.totalJobsAccepted}</div>
                                    <div className="text-gray-500">Accepted</div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                    <div className="font-bold">{cleaner.totalJobsCompleted}</div>
                                    <div className="text-gray-500">Done</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
