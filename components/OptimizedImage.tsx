
import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import { ImageCache } from '../utils/imageCache';
import { colors } from '../styles/commonStyles';

interface OptimizedImageProps {
  source: { uri: string } | number;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export default function OptimizedImage({
  source,
  style,
  containerStyle,
  placeholder,
  fallback,
  resizeMode = 'cover',
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cachedUri, setCachedUri] = useState<string | null>(null);

  useEffect(() => {
    if (typeof source === 'object' && source.uri) {
      loadImage(source.uri);
    } else {
      setLoading(false);
    }
  }, [source]);

  const loadImage = async (uri: string) => {
    try {
      setLoading(true);
      setError(false);

      // Check cache first
      const cached = await ImageCache.getCachedImage(uri);
      if (cached) {
        setCachedUri(cached);
        setLoading(false);
        return;
      }

      // Load image and cache it
      setCachedUri(uri);
      setLoading(false);
    } catch (err) {
      console.log('Error loading image:', err);
      setError(true);
      setLoading(false);
    }
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  if (error && fallback) {
    return <View style={containerStyle}>{fallback}</View>;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {typeof source === 'number' ? (
        <Image
          source={source}
          style={style}
          resizeMode={resizeMode}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      ) : (
        <Image
          source={{ uri: cachedUri || source.uri }}
          style={style}
          resizeMode={resizeMode}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      )}
      
      {loading && (
        <View style={styles.loadingContainer}>
          {placeholder || (
            <ActivityIndicator size="small" color={colors.light.primary} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
