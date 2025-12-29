
import { useMeetings } from "../../context/MeetingContext";

const UpcomingMeetings = () => {
  const { meetings } = useMeetings();
  const confirmed = meetings.filter((m: any) => m.status === "confirmed");

  return (
    <div>
      <h3>Upcoming Meetings</h3>
      {confirmed.map((m: any) => (
        <div key={m.id}>
          <p>{m.title}</p>
          <small>{m.start}</small>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMeetings;
