import { Player } from '../models/Player'
import { Event } from '../models/Event'
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import DraggableComponent from './DraggableComponent';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';

type DropZone = {
  x: number; y: number; width: number; height: number
};

type Props = {
  player: Player;
  playEvent: (event: Event, xCoordinate: number) => void;
  dropZone: DropZone | null;
  currentDragging: SharedValue<number>;
}

const CurrentPlayerHandComponent = ({ player, playEvent, dropZone, currentDragging }: Props) => {
  const scrollX = useSharedValue(0);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.22;
  // const maxScroll = Math.min(0, screenWidth - totalCardsWidth);
  // const minScroll = 0; 
  const totalCardsWidth = player.hand.length * cardWidth + (player.hand.length-1) * 10;
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));
  
  const gesture = Gesture.Pan()
  .onUpdate(event => {
    if (player.hand.length > 4){
        const newValue = scrollX.value + event.translationX * 1.5;
        console.log("newValue théorique : " + newValue);
        console.log("max possible : " + totalCardsWidth);
        scrollX.value = withTiming(
          newValue < 0 ? 
            Math.max(-totalCardsWidth/4, newValue) :
            Math.min(totalCardsWidth/4,newValue)
          , {duration : 25}
        );
      }
    });

  return (
    <View>
      <Text style={styles.title}>Au tour de {player.name}</Text>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.hand, animatedStyle]}>
          {player.hand.map((event: Event) =>
            <DraggableComponent
              key={event.id}
              event={event}
              playEvent={playEvent}
              dropZone={dropZone}
              currentDragging={currentDragging}
            />
            // <EventCardComponent key={event.id} event={event} isFaceUp={false} isRevealing={false} />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 0
  },
  hand: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  centeredList: {
    justifyContent: 'center'
  }
});

export default CurrentPlayerHandComponent;