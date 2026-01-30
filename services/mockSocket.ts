
import { BusLocation } from '../types';

type EventCallback = (data: any) => void;

class MockSocketService {
  private listeners: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    // If it's a driver update, we "broadcast" it as a bus location change
    if (event === 'driver-location-update') {
      this.broadcast('bus-location-changed', data);
    }
  }

  private broadcast(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  off(event: string, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
}

export const socket = new MockSocketService();
