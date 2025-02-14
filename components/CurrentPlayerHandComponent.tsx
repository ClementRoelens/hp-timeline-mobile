import { Player } from '../models/Player'
import { Event } from '../models/Event'
import EventCardComponent from './EventCardComponent';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';

type Props = {
  player: Player;
  playEvent: (event: Event) => void;
}

const CurrentPlayerHandComponent = (props: Props) => {

  return (
    <View>
      <Text style={styles.title}>Au tour de {props.player.name}</Text>
      {/* <View style={styles.hand}> */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.hand,
            props.player.hand.length <= 4 ? styles.centeredList : {}
          ]}
          horizontal={true}
          data={props.player.hand}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <Pressable style={styles.event} onPress={() => props.playEvent(item)}>
              <EventCardComponent event={item} isFaceUp={false} isSelection={false} isRevealing={false} />
            </Pressable>
        }
        />
      {/* </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop:0,
    marginBottom:15
  },
  hand: {
    flexGrow:1
  },
  centeredList : {
    justifyContent:'center'
  },
  event: {
    transitionProperty: 'transform',
    transitionDuration: '150'
  }
});

export default CurrentPlayerHandComponent;