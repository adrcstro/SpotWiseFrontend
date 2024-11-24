declare module 'react-native-snap-carousel' {
    import { Component } from 'react';
    import { FlatListProps, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
  
    interface CarouselProps<T> extends FlatListProps<T> {
      itemWidth: number;
      sliderWidth: number;
      onSnapToItem?: (index: number) => void;
      activeSlideAlignment?: 'center' | 'end' | 'start';
      inactiveSlideScale?: number;
      inactiveSlideOpacity?: number;
      containerCustomStyle?: StyleProp<ViewStyle>;
      contentContainerCustomStyle?: StyleProp<ViewStyle>;
      layout?: 'default' | 'stack' | 'tinder';
      loop?: boolean;
      autoplay?: boolean;
      autoplayInterval?: number;
      autoplayDelay?: number;
      enableMomentum?: boolean;
      lockScrollWhileSnapping?: boolean;
      scrollEnabled?: boolean;
      layoutCardOffset?: number;
    }
  
    export default class Carousel<T = any> extends Component<CarouselProps<T>> {}
  }
  