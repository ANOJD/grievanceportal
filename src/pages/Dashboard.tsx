import { FileText, CheckCircle, AlertTriangle, Clock, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ComplaintCard } from "@/components/ComplaintCard";
import { dashboardStats, sampleComplaints, categoryDistribution, resolutionTrend } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of grievance redressal activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total Complaints" value={dashboardStats.total.toLocaleString()} icon={FileText} variant="primary" trend={{ value: 12, positive: false }} />
        <StatCard title="Active" value={dashboardStats.active} icon={Clock} variant="warning" />
        <StatCard title="Resolved" value={dashboardStats.resolved} icon={CheckCircle} variant="success" trend={{ value: 8, positive: true }} />
        <StatCard title="Escalated" value={dashboardStats.escalated} icon={AlertTriangle} variant="critical" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold mb-4">Resolution Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={resolutionTrend} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Bar dataKey="submitted" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Submitted" />
              <Bar dataKey="resolved" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold mb-4">By Category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: cat.fill }} />
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm font-semibold">Avg. Resolution</span>
          </div>
          <p className="text-3xl font-bold">{dashboardStats.avgResolutionDays} <span className="text-sm font-normal text-muted-foreground">days</span></p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-info" />
            <span className="text-sm font-semibold">Satisfaction</span>
          </div>
          <p className="text-3xl font-bold">{dashboardStats.satisfactionRate}<span className="text-sm font-normal text-muted-foreground">%</span></p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-semibold">SLA Breaches</span>
          </div>
          <p className="text-3xl font-bold">7 <span className="text-sm font-normal text-muted-foreground">this month</span></p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">Recent Complaints</h2>
        <div className="space-y-3">
          {sampleComplaints.slice(0, 4).map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
