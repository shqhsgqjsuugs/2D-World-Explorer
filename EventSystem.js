// 移除 export
// js/core/EventSystem.js
class EventSystem {
  constructor() {
    this.listeners = {};
  }
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
  
  emit(event, data = {}) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error(`Error in event handler for ${event}:`, e);
        }
      });
    }
  }
  
  once(event, callback) {
    const onceHandler = (data) => {
      this.off(event, onceHandler);
      callback(data);
    };
    this.on(event, onceHandler);
  }
}