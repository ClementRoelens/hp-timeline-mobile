import { Player } from '../models/Player'
import { Event } from '../models/Event'
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import DraggableComponent from './DraggableComponent';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withDecay, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { useState } from 'react';

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
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollX = useSharedValue(0);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.22;
  const totalCardsWidth = player.hand.length * cardWidth + (player.hand.length - 1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
    zIndex:90
  }));

  const scroll = (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    try {
      setIsScrolling(true);
      const newValue = scrollX.value + event.velocityX * 0.25;
      scrollX.value = withSpring(
        newValue < 0 ?
          Math.max(-totalCardsWidth / 4 + 25, newValue) :
          Math.min(totalCardsWidth / 4 - 25, newValue)
        , { damping: 100 }
      );
    } catch (error) {
      console.log("erreur dans CurrentPlayerHandComponent.scroll", error);
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      try {
        if (player.hand.length > 4) {
          scroll(event);
        }
      } catch (error){
        console.log("erreur dans CurrentPlayerHandComponent.onUpdate", error);
      }
    })
    .onEnd(() => {
      try {
        setIsScrolling(false);
      } catch (error) {
        console.log("erreur dans CurrentPlayerHandComponent.onEnd", error);
      }
    })
    .runOnJS(true);

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
              scroll={scroll}
              isScrolling={isScrolling}
              setIsScrolling={setIsScrolling}
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
    marginTop: 0,
    marginBottom: 20
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