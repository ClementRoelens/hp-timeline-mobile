import PlayGroundComponent from "@/components/PlayGroundComponent";
import StartingComponent from "@/components/StartingComponent";
import { store } from "@/config/store";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

export default function Index() {
  const [isStarted, setIsStarted] = useState(false);

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
