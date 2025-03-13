"use client";

import SectionWrapper from "@/hoc/sectionWrapper";
import { GET_DASHBOARD_DATA } from "@/lib/services";
import { useQuery } from "@apollo/client";

import {
    BarChart3,
    Brain,
    ChevronDown,
    ChevronUp,
    Code2,
    FileCode2,
    LineChart as LineChartIcon,
    LucideIcon,
    PieChart,
    TrendingUp,
    Users
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart as RechartPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: "up" | "down";
    percentage?: string;
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ title, value, icon: Icon, trend, percentage }: StatCardProps) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
                {trend && (
                    <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {trend === 'up' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        <span className="text-sm">{percentage}%</span>
                    </div>
                )}
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
                <Icon size={24} className="text-blue-500" />
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const { data, loading, error } = useQuery(GET_DASHBOARD_DATA);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading dashboard data.</div>;

    const stats = data?.getDashboardData?.result?.stats || {};
    const monthlyStats = data?.getDashboardData?.result?.monthlyStats || {};
    const weeklyStats = data?.getDashboardData?.result?.weeklyStats || {};
    const tagDistribution = data?.getDashboardData?.result?.tagDistribution || [];

    return (
        <SectionWrapper>
            <div className="min-h-screen bg-gray-100">
                <main className="p-6">
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Users"
                            value={stats.totalUser || 0}
                            icon={Users}
                            trend="up"
                            percentage="12"
                        />
                        <StatCard
                            title="Total Problems"
                            value={stats.totalProblem || 0}
                            icon={Code2}
                            trend="up"
                            percentage="8"
                        />
                        <StatCard
                            title="Total Snippets"
                            value={stats.totalSnippet || 0}
                            icon={FileCode2}
                            trend="up"
                            percentage="15"
                        />
                        <StatCard
                            title="Today's Submissions"
                            value={stats.todayTotalSubmission || 0}
                            icon={Brain}
                            trend="up"
                            percentage="24"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* User Growth Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="text-blue-500" />
                                <h3 className="font-semibold">User Growth</h3>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyStats.monthlyRegisteredUser || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="count" stroke="#0088FE" fill="#0088FE" fillOpacity={0.1} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Tag Distribution Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <PieChart className="text-blue-500" />
                                <h3 className="font-semibold">Tag Distribution</h3>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartPieChart>
                                        <Pie
                                            data={tagDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="count"
                                        >
                                            {tagDistribution.map((entry: string, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RechartPieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Daily Submissions Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 className="text-blue-500" />
                                <h3 className="font-semibold">Daily Submissions</h3>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyStats.weeklySubmissions || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#0088FE" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Monthly Activity Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <LineChartIcon className="text-blue-500" />
                                <h3 className="font-semibold">Monthly Activity</h3>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyStats.monthlyCreatedProblem || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="count" stroke="#0088FE" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </SectionWrapper>
    );
}
