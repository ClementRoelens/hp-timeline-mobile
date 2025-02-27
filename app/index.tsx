import PlayGroundComponent from "@/components/PlayGroundComponent";
import StartingComponent from "@/components/StartingComponent";
import { store } from "@/config/store";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import * as NavigationBar from 'expo-navigation-bar';

export default function Index() {
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden'); // Cache la barre de navigation
    }
  },[]);

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        {!isStarted ?
          <StartingComponent start={setIsStarted} />
          :
          <PlayGroundComponent />
        }
      </Provider>
    </GestureHandlerRootView>
  );
}
