"use client";
import { useState, useEffect } from "react";
import { createSocket } from "@/lib/socket";
import { ticketsApi } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { TicketForm } from "@/components/ticket-form";

export default function OperatorClient({ initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const socket = createSocket();

    socket.on("ticket:updated", (updatedTicket) => {
      setTickets((prev) => prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t)));
    });

    socket.on("ticket:deleted", ({ _id }) => {
      setTickets((prev) => prev.filter((t) => t._id !== _id));
    });

    return () => socket.disconnect();
  }, []);

  async function advance(t) {
    const next = { open: "in_progress", in_progress: "resolved" }[t.status];
    if (!next) return;
    await ticketsApi.setStatus(t._id, next);
  }

  async function remove(id) {
    if (!confirm("Delete this ticket?")) return;
    await ticketsApi.remove(id);
  }

  return (
    <>

      <main className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">My Tickets</h1>
          <button className="btn btn-primary w-full sm:w-auto" onClick={() => setFormOpen(true)}>Add Ticket</button>
        </div>

        <ul className="space-y-3">
          {tickets.map((t) => {
            const nextLabel = { open: "Start", in_progress: "Resolve" }[t.status];
            return (
              <li key={t._id} className="card bg-base-200 border border-base-300 shadow-sm">
                <div className="card-body p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <span className="font-mono text-xs bg-base-300 px-2 py-0.5 rounded">{t.ticketId}</span>
                      <span className="badge badge-sm">{t.status}</span>
                      <span className="badge badge-sm badge-outline capitalize">{t.priority}</span>
                    </div>
                    <div className="font-semibold text-lg">{t.subject}</div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {nextLabel && <button className="btn btn-sm btn-primary flex-1 sm:flex-none" onClick={() => advance(t)}>{nextLabel}</button>}
                    <button className="btn btn-sm btn-error btn-outline flex-1 sm:flex-none" onClick={() => remove(t._id)}>Delete</button>
                  </div>
                </div>
              </li>
            );
          })}
          {tickets.length === 0 && <li className="text-center py-12 text-base-content/50 bg-base-200 rounded-xl">No tickets yet.</li>}
        </ul>
      </main>

      {formOpen && (
        <TicketForm
          onClose={() => setFormOpen(false)}
          onCreated={(newTicket) => {
            setFormOpen(false);
            setTickets((prev) => [newTicket, ...prev]);
          }}
        />
      )}
    </>
  );
}