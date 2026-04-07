import { Priority, priorityColors } from "@/lib/data";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`status-badge ${priorityColors[priority]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        priority === "critical" ? "bg-critical animate-pulse-dot" :
        priority === "high" ? "bg-priority-high" :
        priority === "medium" ? "bg-warning" : "bg-success"
      }`} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
