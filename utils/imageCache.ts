
import AsyncStorage from '@react-native-async-storage/async-storage';

const IMAGE_CACHE_KEY = 'image_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedImage {
  uri: string;
  timestamp: number;
}

export class ImageCache {
  private static cache: Map<string, CachedImage> = new Map();
  private static initialized = false;

  static async initialize() {
    if (this.initialized) return;

    try {
      const cachedData = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        this.cache = new Map(Object.entries(parsed));
        
        // Clean expired entries
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
          if (now - value.timestamp > CACHE_EXPIRY) {
            this.cache.delete(key);
          }
        }
      }
      this.initialized = true;
    } catch (error) {
      console.log('Error initializing image cache:', error);
    }
  }

  static async getCachedImage(url: string): Promise<string | null> {
    await this.initialize();
    
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.uri;
    }
    
    return null;
  }

  static async cacheImage(url: string, localUri: string) {
    await this.initialize();
    
    this.cache.set(url, {
      uri: localUri,
      timestamp: Date.now(),
    });

    // Persist to AsyncStorage
    try {
      const cacheObject = Object.fromEntries(this.cache.entries());
      await AsyncStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      console.log('Error persisting image cache:', error);
    }
  }

  static async clearCache() {
    this.cache.clear();
    try {
      await AsyncStorage.removeItem(IMAGE_CACHE_KEY);
    } catch (error) {
      console.log('Error clearing image cache:', error);
    }
  }
}
