"use client";
import { useForm } from "react-hook-form";
import { ticketsApi } from "@/lib/api";
import { useState } from "react";

export function TicketForm({ onClose, onCreated }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { priority: "medium" },
  });
  const [createdTicket, setCreatedTicket] = useState(null);

  async function submit(values) {
    try {
      const t = await ticketsApi.create(values);
      setCreatedTicket(t);
    } catch (error) {
      console.error(error);
      alert("Failed to create ticket");
    }
  }

  if (createdTicket) {
    return (
      <dialog className="modal modal-open">
        <div className="modal-box text-center">
          <h3 className="font-bold text-lg mb-2">Ticket Created!</h3>
          <p className="text-sm text-base-content/60 mb-4">Your Ticket ID is:</p>
          <div className="text-3xl font-mono font-bold text-primary mb-6">
            {createdTicket.ticketId}
          </div>
          <button onClick={() => { onCreated(createdTicket); onClose(); }} className="btn btn-primary w-full">
            Done
          </button>
        </div>
      </dialog>
    );
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add Ticket</h3>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="form-control w-full">
            <input {...register("subject", { required: true })} placeholder="Subject" className="input input-bordered w-full" />
          </div>
          <div className="form-control w-full">
            <textarea {...register("description", { required: true })} placeholder="Description" className="textarea textarea-bordered w-full h-24" />
          </div>
          <div className="form-control w-full">
            <select {...register("priority")} className="select select-bordered w-full">
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}