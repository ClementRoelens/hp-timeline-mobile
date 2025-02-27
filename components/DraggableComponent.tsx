import { StyleSheet, View } from 'react-native'
import React from 'react'
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Event } from '@/models/Event';
import EventCardComponent from './EventCardComponent';

type Props = {
  event: Event;
  playEvent: (event: Event, xCoordinate: number) => void;
  dropZone: { x: number; y: number; width: number; height: number } | null;
  currentDragging: SharedValue<number>;
}

const DraggableComponent = ({ event, playEvent, dropZone, currentDragging }: Props) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      if (Number.isNaN(currentDragging.get())) {
        currentDragging.set(event.id);
      }
    })
    .onUpdate((translationEvent) => {
      try {
        if (currentDragging.get() === event.id) {
          translateX.value = translationEvent.translationX;
          translateY.value = translationEvent.translationY;
          // move(translationEvent.absoluteX, translationEvent.absoluteY);
        }
      } catch (error) {
        console.error("Erreur dans onUpdate de DraggableComponent", error);
      }
    })
    .onEnd((translationEvent) => {
      try {
        if (currentDragging.get() === event.id) {
          const finalX = translationEvent.absoluteX;
          const finalY = translationEvent.absoluteY;

          const isInsideDropZone = dropZone &&
            finalX > dropZone.x &&
            finalX < dropZone.x + dropZone.width &&
            finalY > dropZone.y &&
            finalY < dropZone.y + dropZone.height;

          if (isInsideDropZone) {
            playEvent(event, finalX);
          } else {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
          }
          currentDragging.set(NaN);
        }
      } catch (error) {
        console.error("Erreur lors du onEnd de DraggableComponent", error);
      }
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    zIndex: 10
  }));

  return (
    <View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <EventCardComponent event={event} isFaceUp={false} isRevealing={false} />
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

export default DraggableComponent

const styles = StyleSheet.create({})