
import { useMeetings } from "../../context/MeetingContext";

const MeetingRequests = () => {
  const { meetings, acceptMeeting, declineMeeting } = useMeetings();
  const requests = meetings.filter((m: any) => m.status === "requested");

  return (
    <div>
      <h2>Meeting Requests</h2>
      {requests.map((m: any) => (
        <div key={m.id}>
          <p>{m.title}</p>
          <button onClick={() => acceptMeeting(m.id)}>Accept</button>
          <button onClick={() => declineMeeting(m.id)}>Decline</button>
        </div>
      ))}
    </div>
  );
};

export default MeetingRequests;
