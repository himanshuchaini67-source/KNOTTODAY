import type {
  EventStatus,
  RsvpStatus,
  TaskStatus,
  TaskPriority,
  PerformanceStatus,
  Availability,
} from '@/types';

const eventStatusStyles: Record<EventStatus, string> = {
  'Upcoming': 'bg-burgundy-50 text-burgundy-700 ring-burgundy-200',
  'In Progress': 'bg-champagne-50 text-champagne-700 ring-champagne-200',
  'Completed': 'bg-green-50 text-green-700 ring-green-200',
};

const rsvpStyles: Record<RsvpStatus, string> = {
  'Confirmed': 'bg-green-50 text-green-700 ring-green-200',
  'Pending': 'bg-champagne-50 text-champagne-700 ring-champagne-200',
  'Declined': 'bg-red-50 text-red-600 ring-red-200',
};

const taskStatusStyles: Record<TaskStatus, string> = {
  'Pending': 'bg-champagne-50 text-champagne-700 ring-champagne-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Completed': 'bg-green-50 text-green-700 ring-green-200',
};

const priorityStyles: Record<TaskPriority, string> = {
  'High': 'bg-red-50 text-red-600 ring-red-200',
  'Medium': 'bg-champagne-50 text-champagne-700 ring-champagne-200',
  'Low': 'bg-gray-50 text-gray-600 ring-gray-200',
};

const performanceStyles: Record<PerformanceStatus, string> = {
  'Planned': 'bg-gray-50 text-gray-600 ring-gray-200',
  'Practicing': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Ready': 'bg-burgundy-50 text-burgundy-700 ring-burgundy-200',
  'Completed': 'bg-green-50 text-green-700 ring-green-200',
};

const availabilityStyles: Record<Availability, string> = {
  'Available': 'bg-green-50 text-green-700 ring-green-200',
  'Limited': 'bg-champagne-50 text-champagne-700 ring-champagne-200',
  'Booked': 'bg-red-50 text-red-600 ring-red-200',
};

export function StatusBadge({
  status,
  type = 'event',
}: {
  status: string;
  type?: 'event' | 'rsvp' | 'task' | 'priority' | 'performance' | 'availability';
}) {
  let styles = '';
  if (type === 'event') styles = eventStatusStyles[status as EventStatus] ?? '';
  else if (type === 'rsvp') styles = rsvpStyles[status as RsvpStatus] ?? '';
  else if (type === 'task') styles = taskStatusStyles[status as TaskStatus] ?? '';
  else if (type === 'priority') styles = priorityStyles[status as TaskPriority] ?? '';
  else if (type === 'performance')
    styles = performanceStyles[status as PerformanceStatus] ?? '';
  else if (type === 'availability')
    styles = availabilityStyles[status as Availability] ?? '';

  return (
    <span className={`badge ring-1 ${styles}`}>
      {status}
    </span>
  );
}
