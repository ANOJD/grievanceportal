import { Status, statusColors } from "@/lib/data";

const labels: Record<Status, string> = {
  submitted: "Submitted",
  assigned: "Assigned",
  "in-progress": "In Progress",
  resolved: "Resolved",
  escalated: "Escalated",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status-badge ${statusColors[status]}`}>
      {labels[status]}
    </span>
  );
}
