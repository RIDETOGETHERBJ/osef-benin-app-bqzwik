
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

const PERFORMANCE_LOG_KEY = 'performance_logs';
const MAX_PERFORMANCE_LOGS = 50;

interface PerformanceLog {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  timestamp: number;
  metadata?: any;
}

export class PerformanceMonitor {
  private static logs: PerformanceLog[] = [];
  private static activeTimers: Map<string, number> = new Map();
  private static initialized = false;

  static async initialize() {
    if (this.initialized) return;

    try {
      const savedLogs = await AsyncStorage.getItem(PERFORMANCE_LOG_KEY);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
      this.initialized = true;
    } catch (error) {
      console.log('Error initializing performance monitor:', error);
    }
  }

  static startTimer(name: string) {
    this.activeTimers.set(name, Date.now());
  }

  static async endTimer(name: string, metadata?: any) {
    const startTime = this.activeTimers.get(name);
    if (!startTime) {
      console.log(`Timer "${name}" was not started`);
      return;
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    await this.logPerformance(name, startTime, endTime, duration, metadata);
    this.activeTimers.delete(name);

    return duration;
  }

  static async logPerformance(
    name: string,
    startTime: number,
    endTime: number,
    duration: number,
    metadata?: any
  ) {
    await this.initialize();

    const log: PerformanceLog = {
      id: Date.now().toString(),
      name,
      startTime,
      endTime,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.logs.unshift(log);

    // Keep only the latest logs
    if (this.logs.length > MAX_PERFORMANCE_LOGS) {
      this.logs = this.logs.slice(0, MAX_PERFORMANCE_LOGS);
    }

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(PERFORMANCE_LOG_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.log('Error saving performance logs:', error);
    }

    // Log slow operations in development
    if (__DEV__ && duration > 1000) {
      console.log(`🐌 Slow operation detected: ${name} took ${duration}ms`);
    }
  }

  static async measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: any): Promise<T> {
    this.startTimer(name);
    try {
      const result = await fn();
      await this.endTimer(name, metadata);
      return result;
    } catch (error) {
      await this.endTimer(name, { ...metadata, error: error.message });
      throw error;
    }
  }

  static measure<T>(name: string, fn: () => T, metadata?: any): T {
    const startTime = Date.now();
    try {
      const result = fn();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.logPerformance(name, startTime, endTime, duration, metadata);
      return result;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.logPerformance(name, startTime, endTime, duration, { 
        ...metadata, 
        error: error.message 
      });
      throw error;
    }
  }

  static async getLogs(): Promise<PerformanceLog[]> {
    await this.initialize();
    return [...this.logs];
  }

  static async clearLogs() {
    this.logs = [];
    try {
      await AsyncStorage.removeItem(PERFORMANCE_LOG_KEY);
    } catch (error) {
      console.log('Error clearing performance logs:', error);
    }
  }

  static getAverageTime(operationName: string): number {
    const operationLogs = this.logs.filter(log => log.name === operationName);
    if (operationLogs.length === 0) return 0;

    const totalTime = operationLogs.reduce((sum, log) => sum + log.duration, 0);
    return totalTime / operationLogs.length;
  }

  static getSlowOperations(threshold = 1000): PerformanceLog[] {
    return this.logs.filter(log => log.duration > threshold);
  }
}

// React hook for measuring component render times
export const usePerformanceTimer = (componentName: string) => {
  React.useEffect(() => {
    PerformanceMonitor.startTimer(`${componentName}_render`);
    return () => {
      PerformanceMonitor.endTimer(`${componentName}_render`);
    };
  }, [componentName]);
};

// HOC for measuring component performance
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name;
  
  return React.memo((props: P) => {
    usePerformanceTimer(displayName);
    return <WrappedComponent {...props} />;
  });
};
