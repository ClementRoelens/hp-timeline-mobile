import { View, Text, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Event } from '@/models/Event';

type Props = {
  event: Event
  isFaceUp: boolean;
  isSelection: boolean;
  isRevealing: boolean;
  onLayout? : (event : LayoutChangeEvent) => void;
}

const EventCardComponent = ({ event, isFaceUp, isSelection, isRevealing, onLayout }: Props) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.22;

  useEffect(() => {
    if (isRevealing) {
      setTimeout(() => {
        setIsRevealed(true);
      }, 50);
    }
  }, []);

  return (
    <View style={[
      styles.card,
      isSelection ? styles.selection : "",
      isFaceUp ? {zIndex:200} : {zIndex : 1},
      { width: cardWidth }
    ]}
    onLayout={onLayout}>
      <Text style={styles.name}>{event.name}</Text>
      {isFaceUp &&
        <Text style={[
          styles.year,
          isRevealing ? styles.toBeRevealed : "",
          isRevealed ? styles.revealing : ""
        ]}>
          {event.year}
        </Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    // position:'absolute',
    height: 120,
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'rgb(160,160,160)',
    padding: 5,
    margin: 5,
    fontSize: 14,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  name: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 100,
    marginHorizontal: 0,
    marginVertical: 10
  },
  year: {
    color: 'white',
    textAlign: 'center',
    // margin: 0,
    fontSize: 15
  },
  selection: {
    opacity: 0.5
  },
  toBeRevealed: {
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '1500'
  },
  revealing: {
    opacity: 1
  }
});

export default EventCardComponent