import { useState } from "react";
import { useMeetings, AvailabilitySlot } from "../../context/MeetingContext";
import MeetingCalendar from "../../components/calendar/MeetingCalendar";

const CalendarPage: React.FC = () => {
  const {
    meetings,
    availability,
    requestMeeting,
    addAvailability,
    modifyAvailability,
    deleteAvailability,
  } = useMeetings();

  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [newSlot, setNewSlot] = useState<Omit<AvailabilitySlot, "id">>({
    start: "",
    end: "",
  });
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  // When a calendar slot is selected
  const handleSelect = (info: { startStr: string; endStr: string }) => {
    const isAvailable = availability.some((avail) => {
      const availStart = new Date(avail.start);
      const availEnd = new Date(avail.end);
      const selectStart = new Date(info.startStr);
      const selectEnd = new Date(info.endStr);
      return selectStart >= availStart && selectEnd <= availEnd;
    });

    if (isAvailable) {
      requestMeeting({
        id: Date.now().toString(),
        title: "New Meeting",
        start: info.startStr,
        end: info.endStr,
      });
    } else {
      alert(
        "Selected time is not available. Please select within available slots."
      );
    }
  };

  // Add new availability
  const handleAddAvailability = () => {
    if (newSlot.start && newSlot.end) {
      addAvailability({ ...newSlot });
      setNewSlot({ start: "", end: "" });
      setShowAddAvailability(false);
    }
  };

  // Edit existing availability
  const handleEditAvailability = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setNewSlot({ start: slot.start, end: slot.end });
    setShowAddAvailability(true);
  };

  const handleUpdateAvailability = () => {
    if (editingSlot && newSlot.start && newSlot.end) {
      modifyAvailability(editingSlot.id, { ...newSlot });
      setNewSlot({ start: "", end: "" });
      setEditingSlot(null);
      setShowAddAvailability(false);
    }
  };

  const handleDeleteAvailability = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this availability slot?")
    ) {
      deleteAvailability(id);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 className="text-2xl font-bold mb-4">Meeting Calendar</h2>

      <button
        onClick={() => setShowAddAvailability(!showAddAvailability)}
        className="mb-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {showAddAvailability ? "Cancel" : "Add Availability"}
      </button>

      {showAddAvailability && (
        <div style={{ marginBottom: 20 }}>
          <input
            type="datetime-local"
            value={newSlot.start}
            onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
            placeholder="Start time"
          />
          <input
            type="datetime-local"
            value={newSlot.end}
            onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
            placeholder="End time"
          />
          <button
            onClick={
              editingSlot ? handleUpdateAvailability : handleAddAvailability
            }
            className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            {editingSlot ? "Update Slot" : "Add Slot"}
          </button>
          {editingSlot && (
            <button
              onClick={() => {
                setEditingSlot(null);
                setShowAddAvailability(false);
                setNewSlot({ start: "", end: "" });
              }}
              className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <h3 className="text-xl font-semibold mb-2">Your Availability Slots</h3>
        {availability.map((slot) => (
          <div
            key={slot.id}
            style={{
              marginBottom: 10,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          >
            <p>Start: {new Date(slot.start).toLocaleString()}</p>
            <p>End: {new Date(slot.end).toLocaleString()}</p>
            <button
              onClick={() => handleEditAvailability(slot)}
              className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteAvailability(slot.id)}
              className="px-2 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <MeetingCalendar
        meetings={meetings}
        availability={availability}
        onDateSelect={handleSelect}
      />
    </div>
  );
};

export default CalendarPage;
