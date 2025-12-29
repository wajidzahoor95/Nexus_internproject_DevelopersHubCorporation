import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Bell,
  Calendar,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { CollaborationRequestCard } from "../../components/collaboration/CollaborationRequestCard";
import { InvestorCard } from "../../components/investor/InvestorCard";

import { useAuth } from "../../context/AuthContext";
import { useMeetings } from "../../context/MeetingContext";

import { CollaborationRequest } from "../../types";
import { getRequestsForEntrepreneur } from "../../data/collaborationRequests";
import { investors } from "../../data/users";

import FullCalendar, { EventInput, DateSelectArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import WalletBalance from "../../components/payment/WalletBalance";
import TransactionTable from "../../components/payment/TransactionTable";

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const { meetings = [], requestMeeting } = useMeetings();

  const [collaborationRequests, setCollaborationRequests] = useState<
    CollaborationRequest[]
  >([]);
  const recommendedInvestors = investors.slice(0, 3);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [newlyAddedMeetingId, setNewlyAddedMeetingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
  }, [user]);

  const handleRequestStatusUpdate = (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    setCollaborationRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req))
    );
  };

  if (!user) return null;

  const pendingRequests = useMemo(
    () => collaborationRequests.filter((req) => req.status === "pending"),
    [collaborationRequests]
  );
  const acceptedRequestsCount = useMemo(
    () =>
      collaborationRequests.filter((req) => req.status === "accepted").length,
    [collaborationRequests]
  );
  const confirmedMeetingsCount = useMemo(
    () => meetings.filter((m) => m.status === "confirmed").length,
    [meetings]
  );

  // Calendar events
  const calendarEvents: EventInput[] = useMemo(
    () =>
      meetings.map((m) => ({
        id: m.id,
        title: m.title || "Meeting",
        start: m.start,
        end: m.end,
        color: m.status === "confirmed" ? "#28a745" : "#ffc107",
      })),
    [meetings]
  );

  // Handle selecting a time slot
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setCalendarOpen(false); // close full calendar if open
    setSelectedSlot({ start: selectInfo.startStr, end: selectInfo.endStr });
    setMeetingTitle("");
    setMeetingDescription("");
    setModalOpen(true); // open modal
  };

  const handleSaveMeeting = () => {
    if (selectedSlot && meetingTitle) {
      const newMeeting = {
        id: Date.now().toString(),
        title: meetingTitle,
        description: meetingDescription,
        start: selectedSlot.start,
        end: selectedSlot.end,
        status: "requested",
      };
      requestMeeting(newMeeting); // add to context
      setNewlyAddedMeetingId(newMeeting.id); // mark for highlight
      setModalOpen(false);
      setSelectedSlot(null);
    } else {
      alert("Please enter a meeting title");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your startup today
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            leftIcon={<Calendar size={18} />}
            onClick={() => setCalendarOpen(true)}
          >
            Calendar
          </Button>
          <Link to="/investors">
            <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
          </Link>
        </div>
      </div>
      <div className="space-y-6 animate-fade-in">
        {/* Wallet Section (Entrepreneur – Read Only) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WalletBalance />
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium">Funding History</h2>
              </CardHeader>
              <CardBody>
                <TransactionTable />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-full mr-4">
              <Bell size={20} />
            </div>
            <div>
              <p className="text-sm text-primary-700">Pending Requests</p>
              <h3 className="text-xl font-semibold">
                {pendingRequests.length}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-full mr-4">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-secondary-700">Total Connections</p>
              <h3 className="text-xl font-semibold">{acceptedRequestsCount}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody className="flex items-center">
            <div className="p-3 bg-accent-100 rounded-full mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-accent-700">Upcoming Meetings</p>
              <h3 className="text-xl font-semibold">
                {confirmedMeetingsCount}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success-50 border border-success-100">
          <CardBody className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm text-success-700">Profile Views</p>
              <h3 className="text-xl font-semibold">24</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map((request) => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle size={28} className="mx-auto text-gray-400" />
                  <p className="text-gray-600 mt-2">
                    No collaboration requests yet
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Recommended Investors</h2>
              <Link
                to="/investors"
                className="text-sm text-primary-600 hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardBody className="space-y-4">
              {recommendedInvestors.map((investor) => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  showActions={false}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal for Adding Meeting */}
      {modalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Request New Meeting</h3>
            <p className="mb-2">
              <strong>Start:</strong>{" "}
              {new Date(selectedSlot.start).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>End:</strong>{" "}
              {new Date(selectedSlot.end).toLocaleString()}
            </p>
            <input
              type="text"
              placeholder="Meeting Title"
              className="border w-full p-2 mb-2 rounded"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
            <textarea
              placeholder="Description (optional)"
              className="border w-full p-2 mb-2 rounded"
              value={meetingDescription}
              onChange={(e) => setMeetingDescription(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded"
                onClick={handleSaveMeeting}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Calendar Modal */}
      {calendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-5xl h-[80%] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Calendar</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setCalendarOpen(false)}
              >
                Close
              </button>
            </div>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              selectable={true}
              select={handleDateSelect}
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};
