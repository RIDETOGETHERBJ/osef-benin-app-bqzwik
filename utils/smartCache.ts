
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PerformanceMonitor } from './performanceMonitor';

const CACHE_PREFIX = 'smart_cache_';
const CACHE_METADATA_KEY = 'cache_metadata';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50; // Maximum number of cached items

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheMetadata {
  [key: string]: {
    size: number;
    timestamp: number;
    accessCount: number;
    lastAccessed: number;
  };
}

export class SmartCache {
  private static metadata: CacheMetadata = {};
  private static initialized = false;

  static async initialize() {
    if (this.initialized) return;

    try {
      const metadataStr = await AsyncStorage.getItem(CACHE_METADATA_KEY);
      if (metadataStr) {
        this.metadata = JSON.parse(metadataStr);
      }
      this.initialized = true;
    } catch (error) {
      console.log('Error initializing smart cache:', error);
    }
  }

  static async set<T>(
    key: string,
    data: T,
    ttl: number = DEFAULT_TTL
  ): Promise<void> {
    await this.initialize();

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const serializedData = JSON.stringify(cacheItem);
      
      await AsyncStorage.setItem(cacheKey, serializedData);
      
      // Update metadata
      this.metadata[key] = {
        size: serializedData.length,
        timestamp: cacheItem.timestamp,
        accessCount: 0,
        lastAccessed: cacheItem.lastAccessed,
      };

      await this.saveMetadata();
      await this.cleanup();
    } catch (error) {
      console.log('Error setting cache item:', error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    await this.initialize();

    return PerformanceMonitor.measureAsync(`cache_get_${key}`, async () => {
      try {
        const cacheKey = `${CACHE_PREFIX}${key}`;
        const serializedData = await AsyncStorage.getItem(cacheKey);
        
        if (!serializedData) {
          return null;
        }

        const cacheItem: CacheItem<T> = JSON.parse(serializedData);
        const now = Date.now();

        // Check if expired
        if (now - cacheItem.timestamp > cacheItem.ttl) {
          await this.remove(key);
          return null;
        }

        // Update access statistics
        cacheItem.accessCount++;
        cacheItem.lastAccessed = now;

        // Update metadata
        if (this.metadata[key]) {
          this.metadata[key].accessCount = cacheItem.accessCount;
          this.metadata[key].lastAccessed = cacheItem.lastAccessed;
        }

        // Save updated item back to cache
        await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
        await this.saveMetadata();

        return cacheItem.data;
      } catch (error) {
        console.log('Error getting cache item:', error);
        return null;
      }
    });
  }

  static async remove(key: string): Promise<void> {
    await this.initialize();

    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      await AsyncStorage.removeItem(cacheKey);
      
      delete this.metadata[key];
      await this.saveMetadata();
    } catch (error) {
      console.log('Error removing cache item:', error);
    }
  }

  static async clear(): Promise<void> {
    await this.initialize();

    try {
      const keys = Object.keys(this.metadata);
      const cacheKeys = keys.map(key => `${CACHE_PREFIX}${key}`);
      
      await AsyncStorage.multiRemove([...cacheKeys, CACHE_METADATA_KEY]);
      this.metadata = {};
    } catch (error) {
      console.log('Error clearing cache:', error);
    }
  }

  static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = DEFAULT_TTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    await this.set(key, data, ttl);
    return data;
  }

  private static async cleanup(): Promise<void> {
    const keys = Object.keys(this.metadata);
    
    if (keys.length <= MAX_CACHE_SIZE) {
      return;
    }

    // Sort by access frequency and recency (LFU + LRU)
    const sortedKeys = keys.sort((a, b) => {
      const metaA = this.metadata[a];
      const metaB = this.metadata[b];
      
      // First sort by access count (less accessed first)
      if (metaA.accessCount !== metaB.accessCount) {
        return metaA.accessCount - metaB.accessCount;
      }
      
      // Then by last accessed time (older first)
      return metaA.lastAccessed - metaB.lastAccessed;
    });

    // Remove oldest/least accessed items
    const itemsToRemove = sortedKeys.slice(0, keys.length - MAX_CACHE_SIZE);
    
    for (const key of itemsToRemove) {
      await this.remove(key);
    }
  }

  private static async saveMetadata(): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(this.metadata));
    } catch (error) {
      console.log('Error saving cache metadata:', error);
    }
  }

  static async getStats(): Promise<{
    totalItems: number;
    totalSize: number;
    hitRate: number;
    oldestItem: string | null;
    mostAccessed: string | null;
  }> {
    await this.initialize();

    const keys = Object.keys(this.metadata);
    const totalItems = keys.length;
    const totalSize = Object.values(this.metadata).reduce((sum, meta) => sum + meta.size, 0);
    
    let oldestItem: string | null = null;
    let mostAccessed: string | null = null;
    let oldestTime = Date.now();
    let maxAccess = 0;

    for (const [key, meta] of Object.entries(this.metadata)) {
      if (meta.timestamp < oldestTime) {
        oldestTime = meta.timestamp;
        oldestItem = key;
      }
      
      if (meta.accessCount > maxAccess) {
        maxAccess = meta.accessCount;
        mostAccessed = key;
      }
    }

    // Calculate hit rate (simplified)
    const totalAccesses = Object.values(this.metadata).reduce((sum, meta) => sum + meta.accessCount, 0);
    const hitRate = totalAccesses > 0 ? (totalAccesses / (totalAccesses + keys.length)) * 100 : 0;

    return {
      totalItems,
      totalSize,
      hitRate,
      oldestItem,
      mostAccessed,
    };
  }
}

// React hook for cached data fetching
export const useCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number,
  dependencies: any[] = []
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await SmartCache.getOrSet(key, fetcher, ttl);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [key, ttl, ...dependencies]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = React.useCallback(async () => {
    await SmartCache.remove(key);
    await fetchData();
  }, [key, fetchData]);

  return { data, loading, error, refetch };
};
