import { Player } from '../models/Player'
import { Event } from '../models/Event'
import { View, Text, StyleSheet, FlatList } from 'react-native';
import DraggableComponent from './DraggableComponent';
import { PanGesture } from 'react-native-gesture-handler';

type DropZone = {
  x: number; y: number; width: number; height: number
};

type Props = {
  player: Player;
  playEvent: (event: Event, xCoordinate: number) => void;
  dropZone : DropZone | null;
}

const CurrentPlayerHandComponent = ({player, playEvent, dropZone}: Props) => {
  
  return (
    <View>
      <Text style={styles.title}>Au tour de {player.name}</Text>
      {/* <FlatList
        data={player.hand}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.hand,
          player.hand.length <= 4 ? styles.centeredList : {}
        ]}
        horizontal={true}
        renderItem={({ item }) => 
            <View style={styles.cardContainer}>
              <DraggableComponent event={item} playEvent={playEvent} dropZone={dropZone}/>
            </View> 
        }
        keyExtractor={item => item.id.toString()}
      /> */}
      <View style={styles.hand}>
        {player.hand.map((event:Event) => 
          <DraggableComponent key={event.id} event={event} playEvent={playEvent} dropZone={dropZone}/>
        )}
      </View> 
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer : {
    zIndex:50,
    // position:'relative',
    overflow : 'visible'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 15
  },
  hand: {
    flexGrow: 1,
    flexDirection:'row',
    justifyContent:'space-around'
  },
  centeredList: {
    justifyContent: 'center'
  }
});

export default CurrentPlayerHandComponent;