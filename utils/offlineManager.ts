
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const OFFLINE_QUEUE_KEY = 'offline_queue';
const OFFLINE_DATA_KEY = 'offline_data';

interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

export class OfflineManager {
  private static queue: OfflineAction[] = [];
  private static isOnline = true;
  private static listeners: ((isOnline: boolean) => void)[] = [];

  static async initialize() {
    // Load offline queue
    try {
      const queueData = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (queueData) {
        this.queue = JSON.parse(queueData);
      }
    } catch (error) {
      console.log('Error loading offline queue:', error);
    }

    // Listen to network changes
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      if (!wasOnline && this.isOnline) {
        // Back online, process queue
        this.processQueue();
      }

      // Notify listeners
      this.listeners.forEach(listener => listener(this.isOnline));
    });
  }

  static addNetworkListener(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  static async addToQueue(type: string, data: any) {
    const action: OfflineAction = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(action);
    await this.saveQueue();

    if (this.isOnline) {
      this.processQueue();
    }
  }

  static async processQueue() {
    if (!this.isOnline || this.queue.length === 0) return;

    const actionsToProcess = [...this.queue];
    this.queue = [];

    for (const action of actionsToProcess) {
      try {
        await this.processAction(action);
      } catch (error) {
        console.log('Error processing offline action:', error);
        
        // Retry logic
        if (action.retryCount < 3) {
          action.retryCount++;
          this.queue.push(action);
        }
      }
    }

    await this.saveQueue();
  }

  private static async processAction(action: OfflineAction) {
    // Process different types of offline actions
    switch (action.type) {
      case 'send_message':
        // Implement message sending logic
        console.log('Processing offline message:', action.data);
        break;
      case 'update_profile':
        // Implement profile update logic
        console.log('Processing offline profile update:', action.data);
        break;
      case 'apply_job':
        // Implement job application logic
        console.log('Processing offline job application:', action.data);
        break;
      default:
        console.log('Unknown offline action type:', action.type);
    }
  }

  private static async saveQueue() {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.log('Error saving offline queue:', error);
    }
  }

  static async cacheData(key: string, data: any) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`${OFFLINE_DATA_KEY}_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.log('Error caching data:', error);
    }
  }

  static async getCachedData(key: string, maxAge = 5 * 60 * 1000) { // 5 minutes default
    try {
      const cachedData = await AsyncStorage.getItem(`${OFFLINE_DATA_KEY}_${key}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (Date.now() - parsed.timestamp < maxAge) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.log('Error getting cached data:', error);
    }
    return null;
  }

  static getNetworkStatus() {
    return this.isOnline;
  }
}
