// utils/event-bus.js
type EventCallback = (data?: any) => void;
type Listeners = {
  [event: string]: EventCallback[];
};

const listeners: Listeners = {};

export const on = (event: string, callback: EventCallback): void => {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);
};

export const off = (event: string, callback: EventCallback): void => {
  if (listeners[event]) {
    listeners[event] = listeners[event].filter((fn: EventCallback) => fn !== callback);
  }
};

export const emit = (event: string, data?: any): void => {
  if (listeners[event]) {
    listeners[event].forEach((callback: EventCallback) => callback(data));
  }
};