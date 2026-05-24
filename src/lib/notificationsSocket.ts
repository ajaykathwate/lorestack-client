import { io, type Socket } from 'socket.io-client'
import { env } from '@/config/env'
import type { NotificationPush } from '@/types/api'

type NotificationHandler = (payload: NotificationPush) => void

/** Derive the WebSocket server root from the REST API base URL.
 *  e.g. "http://localhost:3001/api/v1" → "http://localhost:3001" */
function getSocketServerUrl(): string {
  return env.VITE_API_BASE_URL.replace(/\/api\/v\d+\/?$/, '')
}

class NotificationsSocketManager {
  private socket: Socket | null = null
  private handlers: Set<NotificationHandler> = new Set()

  connect(accessToken: string): void {
    if (this.socket?.connected) return

    const url = `${getSocketServerUrl()}/notifications`

    this.socket = io(url, {
      transports: ['websocket'],
      auth: { token: accessToken },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    this.socket.on('connect', () => {
      // connected
    })

    this.socket.on('notification', (payload: NotificationPush) => {
      this.handlers.forEach((h) => h(payload))
    })

    this.socket.on('connect_error', () => {
      // silently handled — UI degrades gracefully
    })
  }

  /** Reconnect with a fresh access token (called after silent token refresh). */
  reconnect(accessToken: string): void {
    this.socket?.disconnect()
    this.socket = null
    this.connect(accessToken)
  }

  disconnect(): void {
    this.socket?.disconnect()
    this.socket = null
  }

  /** Subscribe to incoming notification events. Returns an unsubscribe function. */
  subscribe(handler: NotificationHandler): () => void {
    this.handlers.add(handler)
    return () => this.handlers.delete(handler)
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false
  }
}

// Singleton — one socket for the lifetime of the app session
export const notificationsSocket = new NotificationsSocketManager()
