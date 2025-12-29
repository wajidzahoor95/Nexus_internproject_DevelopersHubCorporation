import FullCalendar, { EventInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Meeting, AvailabilitySlot } from "../../context/MeetingContext";

type Props = {
  meetings: Meeting[];
  availability: AvailabilitySlot[];
  onDateSelect: (info: { startStr: string; endStr: string }) => void;
};

const MeetingCalendar: React.FC<Props> = ({
  meetings,
  availability,
  onDateSelect,
}) => {
  const events: EventInput[] = [
    ...meetings.map((m) => ({
      id: m.id,
      title: m.status === "confirmed" ? m.title || "Meeting" : "Pending",
      start: m.start || m.date,
      end: m.end || m.date,
      color: m.status === "confirmed" ? "#28a745" : "#ffc107",
    })),
    ...availability.map((a) => ({
      id: a.id,
      start: a.start,
      end: a.end,
      display: "background",
      backgroundColor: "#d4edda",
    })),
  ];

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      selectable={true}
      select={onDateSelect}
      events={events}
      height="auto"
    />
  );
};

export default MeetingCalendar;
