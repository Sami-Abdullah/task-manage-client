"use client";
import { useState, useEffect } from "react";
import { createSocket } from "@/lib/socket";
import { ticketsApi } from "@/lib/api";

export default function SupervisorClient({ initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);

  useEffect(() => {
    const socket = createSocket();
    const refresh = async () => {
      const res = await ticketsApi.list(1, 100);
      setTickets(res.data);
    };

    socket.on("ticket:created", refresh);
    socket.on("ticket:updated", refresh);
    socket.on("ticket:deleted", refresh);

    return () => socket.disconnect();
  }, []);

  async function changeStatus(id, status) {
    await ticketsApi.setStatus(id, status);
  }

  return (
    <>

      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Supervisor Dashboard</h1>
        <div className="overflow-x-auto bg-base-200 rounded-box border border-base-300 shadow-md">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Subject</th>
                <th>Operator</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td className="font-mono text-xs">{t.ticketId}</td>
                  <td className="font-medium">{t.subject}</td>
                  <td>{t.operatorName}</td>
                  <td>
                    <select className="select select-sm select-bordered" value={t.status} onChange={(e) => changeStatus(t._id, e.target.value)}>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-base-content/50">No tickets have been created yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
