"use client";
import { io } from "socket.io-client";

export function createSocket() {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL, { withCredentials: true });
}