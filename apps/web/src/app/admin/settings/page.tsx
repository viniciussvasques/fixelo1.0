import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Platform Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Fees & Commissions</CardTitle>
                    <CardDescription>Configure global platform fees and commissions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Platform Commission (%)</Label>
                            <Input defaultValue="30" type="number" />
                            <p className="text-xs text-muted-foreground">The percentage taken from each booking.</p>
                        </div>
                    </div>
                    <div className="pt-4">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Version</span>
                            <span>1.0.0</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 pt-2">
                            <span className="font-medium">Environment</span>
                            <span>Production</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
