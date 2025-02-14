import { useEffect, useState } from 'react'
import { fetchEvents } from '../service/DataService';
import { Event } from '../models/Event';
import { useAppDispatch, useAppSelector } from '../config/hook';
import { drawCard, setEvents } from './eventSlice';
import { addCardToHand, endTurn, removeCardFromHand } from './playerSlice';
import EventCardComponent from './EventCardComponent';
import { View, StyleSheet, Text, Pressable, FlatList } from 'react-native';
import { transform } from '@babel/core';
import CurrentPlayerHandComponent from './CurrentPlayerHandComponent';

const PlayGroundComponent = () => {
    const [playedEvents, setPlayedEvents] = useState<Event[]>([]);
    const [isTryMode, setIsTryMode] = useState(false);
    const [revealingEvent, setRevealingEvent] = useState<Event | null>(null);
    const [resultMessage, setResultMessage] = useState("");

    const stock = useAppSelector(state => state.event.eventsStock);
    const players = useAppSelector(state => state.player.players);
    const currentPlayerIndex = useAppSelector(state => state.player.currentPlayerIndex);
    const dispatch = useAppDispatch();


    useEffect(() => {
        fetchEvents()
            .then((res: Event[]) => {
                for (let i = 0; i < 7; i++) {
                    for (let j = 0; j < players.length; j++) {
                        const drawnEvent = res.splice(0, 1)[0];
                        dispatch(addCardToHand({ playerIndex: j, event: drawnEvent }));
                    }
                }
                // to do : remettre première ligne
                // setPlayedEvents([...res.splice(0, 10)]);
                setPlayedEvents([...playedEvents, res.splice(0, 1)[0]]);
                dispatch(setEvents(res));
            });
    }, []);

    const triggerTryMode = (event: Event): void => {
        if (!isTryMode){
            const newEvents = [];
            for (const playedEvent of playedEvents) {
                newEvents.push(event);
                newEvents.push(playedEvent);
            }
            newEvents.push(event);
            setIsTryMode(true);
            setPlayedEvents(newEvents);
        }
    }

    const tryEvent = (index: number): void => {
        let newEvents: Event[] = [];
        let isCorrect = false;

        setRevealingEvent(playedEvents[index]);
        setTimeout(() => setRevealingEvent(null), 2000);

        if (index == 0) {
            isCorrect = playedEvents[index].year <= playedEvents[index + 1].year;
        } else if (index == playedEvents.length - 1) {
            isCorrect = playedEvents[index - 1].year <= playedEvents[index].year;
        } else {
            isCorrect = (playedEvents[index - 1].year <= playedEvents[index].year)
                &&
                (playedEvents[index].year <= playedEvents[index + 1].year);
        }

        setTimeout(() => setResultMessage(isCorrect ? "Bien joué" : "Raté"), 1800);
        // setTimeout(() => setResultMessage(""), 2800);

        if (isCorrect) {
            newEvents = playedEvents.filter((event: Event, indexBis: number) => {
                if (indexBis % 2 != 0 || indexBis == index) {
                    return event;
                }
            });
        } else {
            newEvents = playedEvents.filter((event: Event, indexBis: number) => {
                if (indexBis % 2 != 0) {
                    return event;
                }
                if (playedEvents[indexBis - 1].year <= playedEvents[indexBis].year
                    &&
                    playedEvents[indexBis].year <= playedEvents[indexBis + 1].year
                ) {
                    return event;
                }
            });
        }

        setIsTryMode(false);

        if (!isCorrect) {
            dispatch(addCardToHand({ playerIndex: currentPlayerIndex, event: stock[0] }));
            dispatch(drawCard());
        }
        dispatch(removeCardFromHand({ id: playedEvents[index].id }));

        setPlayedEvents(newEvents);
        dispatch(endTurn());
    };

    return (
        <View style={styles.playground}>
            <CurrentPlayerHandComponent player={players[currentPlayerIndex]} playEvent={triggerTryMode} />
            {/* <View> */}
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.list,
                        playedEvents.length <= 4 ? styles.centeredList : {}
                    ]}
                    data={playedEvents}
                    horizontal={true}
                    renderItem={({ item, index }) =>
                        isTryMode ?
                            (index % 2 == 0 ?
                                <Pressable onPress={() => tryEvent(index)}>
                                    <EventCardComponent event={item} isFaceUp={false} isSelection={true} isRevealing={false} />
                                </Pressable>
                                :
                                <Pressable>
                                    <EventCardComponent event={item} isFaceUp={true} isSelection={false} isRevealing={false} />
                                </Pressable>
                            )
                            :
                            <Pressable>
                                <EventCardComponent event={item} isFaceUp={true} isSelection={false} isRevealing={false} />
                            </Pressable>
                    }
                    keyExtractor={(_,index) => index.toString()}
                />
                {revealingEvent &&
                    <View style={styles.revealing}>
                        <View style={styles.revealingElement}>
                            <EventCardComponent event={revealingEvent} isFaceUp={true} isSelection={false} isRevealing={true} />
                        </View>
                        {/* <Text style={styles.result}>{
                            // resultMessage.length > 0 && 
                            resultMessage}</Text> */}
                    </View>
                }
            {/* </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    playground : {
        margin:0,
        padding:0,
        flex:1,
        width:'100%'
        // backgroundColor:'red'
    },
    list: {
        flexGrow:1,
        marginTop:20
    },
    centeredList : {
        justifyContent:'center'
      },
    revealing: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    revealingElement: {
        position: 'relative',
        top: '75%',
        transform: [{ scale: 2 }]
    },
    result: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: 50
    }
});

export default PlayGroundComponent;