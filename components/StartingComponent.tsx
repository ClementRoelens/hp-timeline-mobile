import { useAppDispatch } from "@/config/hook";
import { Player } from "@/models/Player";
import { useState } from "react";
import { initiatePlayers } from "./playerSlice";
import { View, Text, Pressable, NativeSyntheticEvent, TextInputChangeEventData, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type Props = {
  start: React.Dispatch<React.SetStateAction<boolean>>
};

const StartingComponent = (props: Props) => {
  const dispatch = useAppDispatch();
  const [players, setPlayers] = useState<Player[]>([{ id: 0, name: "", hand: [] }]);

  const updatePlayersNames = (value: string, index: number) => {
    const updatedPlayers = players.map((player: Player) =>
      player.id === index ?
        { id: index, name: value, hand: [] } :
        player
    );
    setPlayers(updatedPlayers);
  };

  const addPlayer = (index: number) => {
    setPlayers([...players, { id: index, name: "", hand: [] }]);
  };

  const startGame = (): void => {
    dispatch(initiatePlayers(players));
    props.start(true);
  };

  return (
    <View>
      <Text>Placez les différents événements sur la frise chronologique</Text>
      <Text>Qui sont les joueurs ?</Text>
      {players.map((_player: Player, index: number) =>
        <View key={index}>
          <Text>Nom du joueur {index + 1}</Text>
          <TextInput style={styles.input} onChangeText={e => updatePlayersNames(e, index)} value="Clément" />
          {index == players.length - 1 &&
            <Pressable style={styles.button} onPress={() => addPlayer(index + 1)}>
              <Text>+</Text>
              </Pressable>}
        </View>
      )}
      <Pressable style={styles.button} onPress={startGame}>
        <Text>Commencer la partie</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'black'
  },
  button: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'grey',
    height:40
  }
});

export default StartingComponent;