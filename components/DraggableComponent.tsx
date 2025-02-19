import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Event } from '@/models/Event';
import EventCardComponent from './EventCardComponent';

type Props = {
  event: Event;
  playEvent: (event: Event, xCoordinate: number) => void;
  dropZone: { x: number; y: number; width: number; height: number } | null;
}

const DraggableComponent = ({ event, playEvent, dropZone }: Props) => {
  const [canDrag, setCanDrag] = useState(false);
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
          console.log("Gesture.Pan() : carte jouée");
          playEvent(event, finalX);
        } else {
          console.log("Gesture.Pan() : carte non jouée");
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          setCanDrag(false);
        }
      } catch (error) {
        console.error("Erreur lors du onEnd de DraggableComponent", error);
      }
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    zIndex: 100,
    // position: isDragging.value ? 'absolute' : 'relative'
  }));

  return (
    <View onTouchStart={() => setCanDrag(true)}>
      <GestureDetector gesture={gesture}>
        {canDrag ?
          <Animated.View style={animatedStyle}>
            <EventCardComponent event={event} isFaceUp={false} isSelection={false} isRevealing={false} />
          </Animated.View>
          :
          <View>
            <EventCardComponent event={event} isFaceUp={false} isSelection={false} isRevealing={false} />
          </View>
        }
      </GestureDetector>
    </View>
  )
}

export default DraggableComponent

const styles = StyleSheet.create({})