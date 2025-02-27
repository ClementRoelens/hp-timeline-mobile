import { StyleSheet, View } from 'react-native'
import React from 'react'
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { Event } from '@/models/Event';
import EventCardComponent from './EventCardComponent';

type Props = {
  event: Event;
  playEvent: (event: Event, xCoordinate: number) => void;
  dropZone: { x: number; y: number; width: number; height: number } | null;
  currentDragging: SharedValue<number>;
  scroll: (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  isScrolling: boolean;
  setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}

const DraggableComponent = ({ event, playEvent, dropZone, currentDragging, scroll, isScrolling, setIsScrolling }: Props) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart((translationEvent) => {
      try {
        // Si la composante horizontale est trop faible, on est dans un scroll plus que dans un drag
        const verticalWeight = Math.abs(translationEvent.velocityY) / Math.abs(translationEvent.velocityX);
        if (verticalWeight < 1) {
          setIsScrolling(true);
        } else {
          if (Number.isNaN(currentDragging.get())) {
            currentDragging.set(event.id);
          }
        }
      } catch (error) {
        console.log("erreur de DraggableComponent.onStart", error)
      }

    })
    .onUpdate((translationEvent) => {
      try {
        if (!isScrolling) {
          if (currentDragging.get() === event.id) {
            translateX.value = translationEvent.translationX;
            translateY.value = translationEvent.translationY;
          }
        } else {
          scroll(translationEvent);
        }
      } catch (error) {
        console.log("erreur de DraggableComponent.onUpdate", error);
      }
    })
    .onEnd((translationEvent) => {
      try {
        if (!isScrolling) {
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
        } else {
          setIsScrolling(false);
        }
      } catch (error) {
        console.log("erreur de DraggableComponent.onEnd", error);
      }      
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    zIndex: 100
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