import { useState } from "react";
import { Search, Filter, Users, Clock, CheckCircle, AlertTriangle, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/StatCard";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { sampleComplaints, categoryLabels, type Priority } from "@/lib/data";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/AuthContext";

const departments = ["BBMP Waste Management", "NHAI Road Maintenance", "BMTC Operations", "UIDAI Technical", "Noida Authority Electrical", "Agriculture Department"];

export default function AdminDashboard() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"priority" | "date">("priority");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [search, setSearch] = useState("");
  const t = useTranslation();

  const priorityOrder: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  let complaints = [...sampleComplaints];
  if (filterPriority !== "all") complaints = complaints.filter((c) => c.priority === filterPriority);
  if (search) complaints = complaints.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.ticketId.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === "priority") complaints.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  else complaints.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    setSelected(selected.size === complaints.length ? new Set() : new Set(complaints.map((c) => c.id)));
  };

  const bulkAction = (action: string) => {
    toast.success(`${action} → ${selected.size} ${t("selected")}`);
    setSelected(new Set());
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("adminTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("adminSub")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title={t("pendingReview")} value={23} icon={Clock} variant="warning" />
        <StatCard title={t("assignedToday")} value={18} icon={Users} variant="primary" />
        <StatCard title={t("resolvedToday")} value={12} icon={CheckCircle} variant="success" />
        <StatCard title={t("slaBreaches")} value={3} icon={AlertTriangle} variant="critical" />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("searchPlaceholder")} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder={t("priority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allPriorities")}</SelectItem>
                <SelectItem value="critical">{t("critical")}</SelectItem>
                <SelectItem value="high">{t("high")}</SelectItem>
                <SelectItem value="medium">{t("medium")}</SelectItem>
                <SelectItem value="low">{t("low")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setSortBy(sortBy === "priority" ? "date" : "priority")} className="gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5" /> {sortBy === "priority" ? t("priority") : t("submitted")}
            </Button>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="px-4 py-2 bg-primary/5 border-b border-border flex items-center gap-3 animate-slide-in">
            <span className="text-sm font-medium">{selected.size} {t("selected")}</span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline" onClick={() => bulkAction(t("assign"))}>{t("assign")}</Button>
              <Button size="sm" variant="outline" onClick={() => bulkAction(t("escalate"))}>{t("escalate")}</Button>
              <Button size="sm" variant="outline" onClick={() => bulkAction(t("close"))}>{t("close")}</Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="p-3 w-10">
                  <Checkbox checked={selected.size === complaints.length && complaints.length > 0} onCheckedChange={toggleAll} />
                </th>
                <th className="p-3">{t("ticket")}</th>
                <th className="p-3 hidden md:table-cell">{t("category")}</th>
                <th className="p-3">{t("priority")}</th>
                <th className="p-3 hidden lg:table-cell">{t("status")}</th>
                <th className="p-3 hidden lg:table-cell">{t("location")}</th>
                <th className="p-3 hidden xl:table-cell">{t("departmentLabel")}</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggleSelect(c.id)} />
                  </td>
                  <td className="p-3">
                    <p className="text-xs font-mono text-muted-foreground">{c.ticketId}</p>
                    <p className="font-medium truncate max-w-[200px]">{c.title}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs">{categoryLabels[c.category]}</td>
                  <td className="p-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="p-3 hidden lg:table-cell"><StatusBadge status={c.status} /></td>
                  <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{c.location}</td>
                  <td className="p-3 hidden xl:table-cell">
                    <Select defaultValue={c.department}>
                      <SelectTrigger className="h-7 text-xs w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("viewDetails")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("assign")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("escalate")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-critical">{t("close")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
