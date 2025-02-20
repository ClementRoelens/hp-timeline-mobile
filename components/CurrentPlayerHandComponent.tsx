// import { Player } from '../models/Player'
// import { Event } from '../models/Event'
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import DraggableComponent from './DraggableComponent';
// import { PanGesture } from 'react-native-gesture-handler';

// type DropZone = {
//   x: number; y: number; width: number; height: number
// };

// type Props = {
//   player: Player;
//   playEvent: (event: Event, xCoordinate: number) => void;
//   dropZone : DropZone | null;
//   gestureRef : React.MutableRefObject<PanGesture>;
// }

// const CurrentPlayerHandComponent = ({player, playEvent, dropZone, gestureRef}: Props) => {
  
//   return (
//     <View>
//       <Text style={styles.title}>Au tour de {player.name}</Text>
//       <FlatList
//         data={player.hand}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={[
//           styles.hand,
//           player.hand.length <= 4 ? styles.centeredList : {}
//         ]}
//         horizontal={true}
//         renderItem={({ item }) => 
//             <View style={styles.cardContainer}>
//               <DraggableComponent event={item} playEvent={playEvent} dropZone={dropZone} gestureRef={gestureRef}/>
//             </View> 
//         }
//         keyExtractor={item => item.id.toString()}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   // cardContainer : {
//   //   zIndex:50,
//   //   // position:'relative',
//   //   overflow : 'visible'
//   // },
//   // hand: {
//   //   flexGrow: 1
//   // },
//   // centeredList: {
//   //   justifyContent: 'center'
//   // }
// });

// export default CurrentPlayerHandComponent;