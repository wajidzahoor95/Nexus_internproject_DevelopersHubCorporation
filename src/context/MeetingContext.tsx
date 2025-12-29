import { createContext, useContext, useState, ReactNode } from "react";
import {
  meetings as initialMeetings,
  availability as initialAvailability,
} from "../data/meetings";

/* ================= TYPES ================= */

export type MeetingStatus = "requested" | "confirmed" | "declined";

export type Meeting = {
  id: string;
  title?: string;
  description?: string;
  start: string;
  end: string;
  status: MeetingStatus;
};

export type AvailabilitySlot = {
  id: string;
  start: string;
  end: string;
  display?: string;
  backgroundColor?: string;
};

type MeetingContextType = {
  meetings: Meeting[];
  availability: AvailabilitySlot[];
  requestMeeting: (meeting: Omit<Meeting, "status">) => void;
  acceptMeeting: (id: string) => void;
  declineMeeting: (id: string) => void;
  addAvailability: (slot: Omit<AvailabilitySlot, "id">) => void;
  modifyAvailability: (id: string, slot: Partial<AvailabilitySlot>) => void;
  deleteAvailability: (id: string) => void;
};

/* ================= CONTEXT ================= */

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [availability, setAvailability] =
    useState<AvailabilitySlot[]>(initialAvailability);

  const requestMeeting = (meeting: Omit<Meeting, "status">) => {
    setMeetings((prev) => [...prev, { ...meeting, status: "requested" }]);
  };

  const acceptMeeting = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "confirmed" } : m))
    );
  };

  const declineMeeting = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "declined" } : m))
    );
  };

  const addAvailability = (slot: Omit<AvailabilitySlot, "id">) => {
    setAvailability((prev) => [
      ...prev,
      {
        ...slot,
        id: Date.now().toString(),
        display: "background",
        backgroundColor: "#d4edda",
      },
    ]);
  };

  const modifyAvailability = (id: string, slot: Partial<AvailabilitySlot>) => {
    setAvailability((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...slot } : a))
    );
  };

  const deleteAvailability = (id: string) => {
    setAvailability((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        availability,
        requestMeeting,
        acceptMeeting,
        declineMeeting,
        addAvailability,
        modifyAvailability,
        deleteAvailability,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useMeetings = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error("useMeetings must be used within a MeetingProvider");
  }
  return context;
};
