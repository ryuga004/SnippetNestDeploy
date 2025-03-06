"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionWrapper from "@/hoc/sectionWrapper";
import { BarChart, Settings, Users } from "lucide-react";

export default function AdminDashboard() {

    return (
        <SectionWrapper>
            <div className="min-h-screen bg-gray-100">

                <main className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <Card>
                            <CardHeader className="flex items-center gap-2">
                                <BarChart className="h-6 w-6 text-blue-500" />
                                <CardTitle>Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">$24,580</p>
                                <p className="text-sm text-gray-500">This Month</p>
                            </CardContent>
                        </Card>

                        {/* Card 2 */}
                        <Card>
                            <CardHeader className="flex items-center gap-2">
                                <Users className="h-6 w-6 text-green-500" />
                                <CardTitle>Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">1,245</p>
                                <p className="text-sm text-gray-500">Active Users</p>
                            </CardContent>
                        </Card>

                        {/* Card 3 */}
                        <Card>
                            <CardHeader className="flex items-center gap-2">
                                <Settings className="h-6 w-6 text-yellow-500" />
                                <CardTitle>System Health</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">Operational</p>
                                <p className="text-sm text-gray-500">No Issues</p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </SectionWrapper>
    );
}
