
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { router } from 'expo-router';
import Button from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../styles/commonStyles';
import { useAuthStore } from '../../store/userStore';

const { width: screenWidth } = Dimensions.get('window');

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: 'OSEF BENIN',
    subtitle: 'Votre partenaire emploi au Bénin',
    description: 'Trouvez l\'emploi de vos rêves ou les meilleurs talents pour votre entreprise.',
    image: 'https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/126b9447-c2cb-4ac2-9b12-ade714bb1d17/assets/images/323cceae-8a4b-4dbf-839f-316b051f9510.jpeg?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=5kNY8mOcoPh6ruG4%2F8ASIaQwelk%3D&Expires=1759481251',
  },
  {
    id: 2,
    title: 'Recherche d\'emploi facile',
    subtitle: 'Simplifiez votre recherche',
    description: 'Parcourez des milliers d\'offres d\'emploi adaptées à votre profil et postulez en un clic.',
    image: 'https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/126b9447-c2cb-4ac2-9b12-ade714bb1d17/assets/images/de21ab3a-f337-42b6-ab64-6d1152fe6acc.jpeg?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=WK4l18ydQ2GjqKV%2F7jN%2B%2BkumpD4%3D&Expires=1759481251',
  },
  {
    id: 3,
    title: 'Formations professionnelles',
    subtitle: 'Développez vos compétences',
    description: 'Accédez à des formations de qualité pour booster votre carrière et rester compétitif.',
    image: 'https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/126b9447-c2cb-4ac2-9b12-ade714bb1d17/assets/images/4238ddb6-4437-49d8-bf61-707dd75cbab2.jpeg?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=kuOaWC%2BoeM0eQTq1qYvzD5%2BKZp0%3D&Expires=1759481251',
  },
  {
    id: 4,
    title: 'Mise en relation',
    subtitle: 'Connectez-vous avec les bons profils',
    description: 'Candidats, employeurs et formateurs se rencontrent sur une plateforme unique et moderne.',
    image: 'https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/126b9447-c2cb-4ac2-9b12-ade714bb1d17/assets/images/0c42ba79-8b32-48a3-a1a4-a1005e5fcda6.jpeg?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=UlQNM2jmzQHPS64NSXLJ%2B4UnOGQ%3D&Expires=1759481251',
  },
];

export default function OnboardingScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<Carousel<SlideData>>(null);
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { setHasSeenOnboarding } = useAuthStore();

  const renderSlide = ({ item }: { item: SlideData }) => (
    <View style={[styles.slide, { backgroundColor: themeColors.background }]}>
      <View style={styles.imageContainer}>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.primary }]}>
          {item.subtitle}
        </Text>
        <Text style={[styles.description, { color: themeColors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  const handleGetStarted = () => {
    console.log('Onboarding completed, navigating to login');
    setHasSeenOnboarding(true);
    router.replace('/auth/login');
  };

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      carouselRef.current?.snapToNext();
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Button
          title="Passer"
          onPress={handleSkip}
          variant="ghost"
          size="small"
        />
      </View>

      <Carousel
        ref={carouselRef}
        data={slides}
        renderItem={renderSlide}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onSnapToItem={setActiveSlide}
        autoplay={false}
        loop={false}
      />

      <View style={styles.footer}>
        <Pagination
          dotsLength={slides.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.pagination}
          dotStyle={[styles.paginationDot, { backgroundColor: themeColors.primary }]}
          inactiveDotStyle={[styles.paginationDotInactive, { backgroundColor: themeColors.border }]}
          inactiveDotOpacity={1}
          inactiveDotScale={0.8}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={activeSlide === slides.length - 1 ? 'Commencer' : 'Suivant'}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  slide: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  image: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderRadius: borderRadius.lg,
  },
  content: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  pagination: {
    paddingVertical: spacing.md,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paginationDotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
  },
  nextButton: {
    marginTop: spacing.md,
  },
});
