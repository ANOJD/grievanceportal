import { Check, Circle, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { TimelineEvent, Status } from "@/lib/data";

const statusIcons: Record<Status, React.ReactNode> = {
  submitted: <Circle className="h-4 w-4" />,
  assigned: <ArrowRight className="h-4 w-4" />,
  "in-progress": <Clock className="h-4 w-4" />,
  resolved: <Check className="h-4 w-4" />,
  escalated: <AlertTriangle className="h-4 w-4" />,
};

const statusLabel: Record<Status, string> = {
  submitted: "Submitted",
  assigned: "Assigned",
  "in-progress": "In Progress",
  resolved: "Resolved",
  escalated: "Escalated",
};

export function ComplaintTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const isLast = i === events.length - 1;
        const date = new Date(event.date);
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`p-1.5 rounded-full ${
                isLast ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {statusIcons[event.status]}
              </div>
              {!isLast && <div className="w-px flex-1 bg-border min-h-[24px]" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium">{statusLabel[event.status]}</p>
              <p className="text-xs text-muted-foreground">{event.note}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at{" "}
                {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
