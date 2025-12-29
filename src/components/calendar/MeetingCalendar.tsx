import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const MeetingCalendar = ({ meetings, availability, onDateSelect }: any) => {
  const allEvents = [...meetings, ...availability];

  return (
    <div style={{ height: "600px" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        events={allEvents}
        select={onDateSelect}
        height="100%"
      />
    </div>
  );
};

export default MeetingCalendar;
