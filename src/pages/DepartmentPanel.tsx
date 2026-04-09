import { useState } from "react";
import { Clock, MessageSquare, AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { ComplaintTimeline } from "@/components/ComplaintTimeline";
import { sampleComplaints, categoryLabels, categoryIcons } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/AuthContext";

const slaData = [
  { id: "1", deadline: "2024-03-18T09:30:00", remaining: 65 },
  { id: "2", deadline: "2024-03-16T16:45:00", remaining: 15 },
  { id: "5", deadline: "2024-03-15T19:30:00", remaining: 0 },
];

const internalNotes = [
  { id: "1", complaintId: "1", author: "Suresh M.", date: "2024-03-16T10:00:00", text: "Cleanup crew contacted. ETA 2 hours." },
  { id: "2", complaintId: "1", author: "Priya K.", date: "2024-03-16T14:00:00", text: "Crew dispatched. Monitoring." },
  { id: "3", complaintId: "2", author: "Amit R.", date: "2024-03-15T08:30:00", text: "High-risk location. Requesting emergency repair budget." },
];

export default function DepartmentPanel() {
  const [selectedId, setSelectedId] = useState<string>("1");
  const [noteText, setNoteText] = useState("");
  const t = useTranslation();
  const assigned = sampleComplaints.filter((c) => c.status !== "resolved");
  const selected = sampleComplaints.find((c) => c.id === selectedId) || assigned[0];
  const sla = slaData.find((s) => s.id === selectedId);
  const notes = internalNotes.filter((n) => n.complaintId === selectedId);

  const handleStatusUpdate = (newStatus: string) => {
    toast.success(`${t("statusUpdated")}: "${newStatus}" — ${selected.ticketId}`);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    toast.success(t("noteAdded"));
    setNoteText("");
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("deptTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("deptSub")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <h2 className="text-sm font-semibold">{t("assignedComplaints")} ({assigned.length})</h2>
          </div>
          <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
            {assigned.map((c) => {
              const cSla = slaData.find((s) => s.id === c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left p-3 hover:bg-muted/30 transition-colors ${selectedId === c.id ? "bg-muted/50" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{c.ticketId}</span>
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <p className="text-sm font-medium truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={c.status} />
                    {cSla && cSla.remaining <= 20 && (
                      <span className="text-[10px] text-critical flex items-center gap-0.5">
                        <AlertTriangle className="h-3 w-3" /> {t("slaAtRisk")}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selected && (
            <>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{selected.ticketId}</span>
                      <PriorityBadge priority={selected.priority} />
                      <StatusBadge status={selected.status} />
                    </div>
                    <h2 className="text-base font-semibold">{selected.title}</h2>
                  </div>
                  <Select defaultValue={selected.status} onValueChange={handleStatusUpdate}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder={t("status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">{t("submitted")}</SelectItem>
                      <SelectItem value="assigned">{t("assign")}</SelectItem>
                      <SelectItem value="in-progress">{t("active")}</SelectItem>
                      <SelectItem value="resolved">{t("resolved")}</SelectItem>
                      <SelectItem value="escalated">{t("escalated")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{selected.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">{t("categoryLabel")}</p>
                    <p className="font-medium">{categoryIcons[selected.category]} {categoryLabels[selected.category]}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("locationLabel")}</p>
                    <p className="font-medium">{selected.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("departmentLabel")}</p>
                    <p className="font-medium">{selected.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("aiConfidence")}</p>
                    <p className="font-medium">{Math.round(selected.confidence * 100)}%</p>
                  </div>
                </div>
              </div>

              {sla && (
                <div className={`rounded-lg border p-4 ${sla.remaining <= 20 ? "border-critical/30 bg-critical/5" : "border-border bg-card"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold">{t("slaTracking")}</h3>
                    </div>
                    <span className={`text-xs font-medium ${sla.remaining <= 20 ? "text-critical" : sla.remaining <= 50 ? "text-warning" : "text-success"}`}>
                      {sla.remaining === 0 ? t("slaBreached") : `${sla.remaining}% ${t("timeRemaining")}`}
                    </span>
                  </div>
                  <Progress value={100 - sla.remaining} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {t("deadline")}: {new Date(sla.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-semibold mb-3">{t("progressTimeline")}</h3>
                <ComplaintTimeline events={selected.timeline} />
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">{t("internalNotes")}</h3>
                </div>

                {notes.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{note.author}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(note.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">{t("noNotes")}</p>
                )}

                <div className="flex gap-2">
                  <Textarea
                    placeholder={t("addNotePlaceholder")}
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="icon" className="shrink-0 self-end" onClick={handleAddNote}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
