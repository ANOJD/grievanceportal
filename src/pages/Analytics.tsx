import { categoryDistribution, resolutionTrend } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const monthlyData = [
  { month: "Oct", low: 30, medium: 45, high: 35, critical: 10 },
  { month: "Nov", low: 25, medium: 40, high: 30, critical: 10 },
  { month: "Dec", low: 35, medium: 55, high: 40, critical: 15 },
  { month: "Jan", low: 30, medium: 50, high: 38, critical: 17 },
  { month: "Feb", low: 28, medium: 52, high: 45, critical: 25 },
  { month: "Mar", low: 32, medium: 60, high: 48, critical: 20 },
];

export default function Analytics() {
  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">Insights and trends from complaint data</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold mb-4">Complaints vs Resolutions</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={resolutionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Line type="monotone" dataKey="submitted" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Submitted" />
              <Line type="monotone" dataKey="resolved" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold mb-4">Priority Breakdown by Month</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Bar dataKey="low" stackId="a" fill="hsl(var(--priority-low))" name="Low" />
              <Bar dataKey="medium" stackId="a" fill="hsl(var(--priority-medium))" name="Medium" />
              <Bar dataKey="high" stackId="a" fill="hsl(var(--priority-high))" name="High" />
              <Bar dataKey="critical" stackId="a" fill="hsl(var(--priority-critical))" radius={[4, 4, 0, 0]} name="Critical" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
