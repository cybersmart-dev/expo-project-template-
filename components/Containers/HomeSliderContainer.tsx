import React, { useRef, useState, useEffect } from "react";
import { View, Image, Dimensions, Animated } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// This file is ready for an Expo + NativeWind project.
// Make sure you have installed nativewind and configured it (babel plugin, tailwind.config.js).
// Example: https://www.nativewind.dev/

const { width, height } = Dimensions.get("window");
const SLIDE_WIDTH = width;

const Myslides = [
  {
    key: "slide-1",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7dkMF-eudJOJdxGQenO5mQPss4cmqbgtCQA&s",
  },
  {
    key: "slide-2",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7dkMF-eudJOJdxGQenO5mQPss4cmqbgtCQA&s',
  },
  {
    key: "slide-3",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfvmwoKEivctiFq05Qpkzp5BwUvojTqLgCKA&s",
  },
];

const HomeSliderContainer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const theme = useTheme();
  const flatListRef = useRef<Animated.FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [slides, setSlides] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }) => {
    return (
      <View
        className="w-full items-center justify-center px-1"
        style={{ width: SLIDE_WIDTH }}
      >
        <Image
          key={`dot-${refreshKey}`}
          source={{uri: item.image}}
          className="w-full h-[110px] rounded-lg"
          resizeMode="stretch"
        />
      </View>
    );
  };

  const dotPosition = Animated.divide(scrollX, SLIDE_WIDTH);

  useEffect(() => {
    setRefreshKey((prev) => prev + 1);

    return () => {};
  }, [currentIndex]);

  return (
    <View
      className="h-auto"
    >
      <View className="items-center justify-center">
        <Animated.FlatList
          ref={flatListRef}
          data={Myslides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfig}
        />

        {/* Pagination */}
        <View className="flex-row items-center justify-center mt-6">
          {slides.map((_, i) => {
            const opacity = dotPosition.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            const scale = dotPosition.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [1, 1.4, 1],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={`dot-${i}`}
                style={{
                  opacity,
                  transform: [{ scale }],
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  margin: 6,
                  backgroundColor: theme.colors.primary,
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

/*
Notes & setup tips:
1. Install NativeWind and configure Babel and tailwind.config.js.
   - npm install nativewind
   - Follow setup guide: https://www.nativewind.dev

2. This component uses the `className` prop on React Native elements (NativeWind).
3. Replace slide images with local assets for offline usage (use require('../assets/slide1.png')).
4. To use this in your App.js:
   import WelcomeSlider from './components/WelcomeSlider';
   export default function App(){
     const handleFinish = ()=>{ /* navigate to auth/home 
     return <WelcomeSlider onFinish={handleFinish} />
   }
5. Tailwind utils used: spacing, font sizes, rounded, bg colors. Customize in tailwind.config.js.
*/

export default HomeSliderContainer;
