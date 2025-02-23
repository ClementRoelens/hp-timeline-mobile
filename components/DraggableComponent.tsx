import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import { Event } from '@/models/Event';
import EventCardComponent from './EventCardComponent';

type Props = {
  event: Event;
  playEvent: (event: Event, xCoordinate: number) => void;
  dropZone: { x: number; y: number; width: number; height: number } | null;
}

const DraggableComponent = ({ event, playEvent, dropZone }: Props) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((translationEvent) => {
      try {
        translateX.value = translationEvent.translationX;
        translateY.value = translationEvent.translationY;
      } catch (error) {
        console.error("Erreur dans onUpdate de DraggableComponent", error);
      }
    })
    .onEnd((translationEvent) => {
      try {
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
      } catch (error) {
        console.error("Erreur lors du onEnd de DraggableComponent", error);
      }
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    zIndex : 10
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