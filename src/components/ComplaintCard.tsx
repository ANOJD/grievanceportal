import { MapPin, Clock, Brain } from "lucide-react";
import { Complaint, categoryIcons, categoryLabels } from "@/lib/data";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";

export function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const date = new Date(complaint.submittedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow animate-slide-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{complaint.ticketId}</span>
            <PriorityBadge priority={complaint.priority} />
          </div>
          <h3 className="font-semibold text-sm leading-snug truncate">{complaint.title}</h3>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{complaint.description}</p>

      <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          {categoryIcons[complaint.category]} {categoryLabels[complaint.category]}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {complaint.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {date}
        </span>
        <span className="inline-flex items-center gap-1 ml-auto">
          <Brain className="h-3 w-3" /> {Math.round(complaint.confidence * 100)}% AI confidence
        </span>
      </div>
    </div>
  );
}
