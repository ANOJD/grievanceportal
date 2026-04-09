import { useState } from "react";
import { sampleComplaints, type Status } from "@/lib/data";
import { ComplaintCard } from "@/components/ComplaintCard";
import { ComplaintTimeline } from "@/components/ComplaintTimeline";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { categoryLabels, categoryIcons } from "@/lib/data";
import { useTranslation } from "@/contexts/AuthContext";

type TabFilter = "all" | "active" | "resolved" | "escalated";

const filterFn: Record<TabFilter, (s: Status) => boolean> = {
  all: () => true,
  active: (s) => ["submitted", "assigned", "in-progress"].includes(s),
  resolved: (s) => s === "resolved",
  escalated: (s) => s === "escalated",
};

export default function MyComplaints() {
  const [tab, setTab] = useState<TabFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const t = useTranslation();

  const filtered = sampleComplaints.filter((c) => filterFn[tab](c.status));
  const selected = sampleComplaints.find((c) => c.id === selectedId);

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t("myComplaintsTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("myComplaintsSub")}</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabFilter)}>
        <TabsList>
          <TabsTrigger value="all">{t("all")} ({sampleComplaints.length})</TabsTrigger>
          <TabsTrigger value="active">{t("active")}</TabsTrigger>
          <TabsTrigger value="resolved">{t("resolved")}</TabsTrigger>
          <TabsTrigger value="escalated">{t("escalated")}</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">{t("noComplaints")}</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} onClick={() => setSelectedId(c.id)} className="cursor-pointer">
                <ComplaintCard complaint={c} />
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={() => setSelectedId(null)}>
        {selected && (
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{selected.ticketId}</span>
                <PriorityBadge priority={selected.priority} />
                <StatusBadge status={selected.status} />
              </div>
              <DialogTitle className="text-base">{selected.title}</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">{selected.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">{t("categoryLabel")}</p>
                <p className="font-medium">{categoryIcons[selected.category]} {categoryLabels[selected.category]}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("departmentLabel")}</p>
                <p className="font-medium">{selected.department}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("locationLabel")}</p>
                <p className="font-medium">{selected.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("aiConfidence")}</p>
                <p className="font-medium">{Math.round(selected.confidence * 100)}%</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selected.keywords.map((kw) => (
                <span key={kw} className="px-2 py-0.5 bg-muted rounded-full text-xs">{kw}</span>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">{t("progressTimeline")}</h4>
              <ComplaintTimeline events={selected.timeline} />
            </div>

            {selected.status !== "resolved" && (
              <Button variant="destructive" size="sm" className="gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> {t("raiseEscalation")}
              </Button>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
