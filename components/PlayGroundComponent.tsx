import { useEffect, useState } from 'react'
import { fetchEvents } from '../service/DataService';
import { Event } from '../models/Event';
import { useAppDispatch, useAppSelector } from '../config/hook';
import { drawCard, setEvents } from './eventSlice';
import { addCardToHand, endTurn, removeCardFromHand } from './playerSlice';
import EventCardComponent from './EventCardComponent';
import { View, StyleSheet, FlatList, LayoutChangeEvent, Dimensions } from 'react-native';
import CurrentPlayerHandComponent from './CurrentPlayerHandComponent';
import { useSharedValue } from 'react-native-reanimated';

type EventPosition = {
    id: number,
    x: number
};

type DropZone = {
    x: number;
    y: number;
    width: number;
    height: number
};

const PlayGroundComponent = () => {
    const [playedEvents, setPlayedEvents] = useState<Event[]>([]);
    // const [revealingEvent, setRevealingEvent] = useState<Event | null>(null);
    // const [resultMessage, setResultMessage] = useState("");
    const [eventPositions, setEventPositions] = useState<EventPosition[]>([]);
    const [dropZone, setDropZone] = useState<DropZone | null>(null);

    const stock = useAppSelector(state => state.event.eventsStock);
    const players = useAppSelector(state => state.player.players);
    const currentPlayerIndex = useAppSelector(state => state.player.currentPlayerIndex);
    const dispatch = useAppDispatch();

    const currentDragging = useSharedValue(NaN);

    const screenWidth = Dimensions.get("window").width;
    const cardWidth = screenWidth * 0.22;

    useEffect(() => {
        fetchEvents()
            .then((res: Event[]) => {
                for (let i = 0; i < 7; i++) {
                    for (let j = 0; j < players.length; j++) {
                        const drawnEvent = res.splice(0, 1)[0];
                        dispatch(addCardToHand({ playerIndex: j, event: drawnEvent }));
                    }
                }
                // Pour les tests
                // const events: Event[] = [];
                // for (let i = 0; i < 5; i++) {
                //     events.push(res.splice(0, 1)[0])
                // }
                // events.sort((a, b) => a.year - b.year);
                // setPlayedEvents(events);

                // Vraie règle
                setPlayedEvents([...playedEvents, res.splice(0, 1)[0]]);
                dispatch(setEvents(res));
            });
    }, []);

    const getAroundEvents = (x: number): { beforeEvent: Event | null, afterEvent: Event | null, insertedIndex: number } => {
        let insertedIndex = eventPositions.length;

        if (x < eventPositions[0].x) {
            insertedIndex = 0;
        }
        for (let i = 0; i < eventPositions.length - 1; i++) {
            if (x > eventPositions[i].x && x < eventPositions[i + 1].x) {
                insertedIndex = i + 1;
                break;
            }
        }

        const beforeEvent = insertedIndex > 0 ? playedEvents[insertedIndex - 1] : null;
        const afterEvent = insertedIndex < playedEvents.length ? playedEvents[insertedIndex] : null;

        return { beforeEvent, afterEvent, insertedIndex };
    };

    const tryEvent = (insertedEvent: Event, dropX: number) => {
        try {
            const { beforeEvent, afterEvent, insertedIndex } = getAroundEvents(dropX);

            // setRevealingEvent(playedEvents[insertedIndex]);
            // setTimeout(() => setRevealingEvent(null), 2000);

            let isCorrect = false;

            if (beforeEvent == null && afterEvent != null) {
                isCorrect = insertedEvent.year <= afterEvent.year;
            } else if (beforeEvent != null && afterEvent != null) {
                isCorrect = (beforeEvent.year <= insertedEvent.year && insertedEvent.year <= afterEvent.year);
            } else if (beforeEvent != null && afterEvent == null) {
                isCorrect = beforeEvent.year <= insertedEvent.year;
            }

            // setTimeout(() => setResultMessage(isCorrect ? "Bien joué" : "Raté"), 1800);
            // setTimeout(() => setResultMessage(""), 2800);

            if (isCorrect) {
                const beforeEvents = [...playedEvents].slice(0, insertedIndex);
                const afterEvents = [...playedEvents].slice(insertedIndex);
                beforeEvents.push(insertedEvent);
                const newEvents = beforeEvents.concat(afterEvents);
                setPlayedEvents(newEvents);
            } else {
                dispatch(addCardToHand({ playerIndex: currentPlayerIndex, event: stock[0] }));
                dispatch(drawCard());
            }

            dispatch(removeCardFromHand({ id: insertedEvent.id }));
            dispatch(endTurn());
        } catch (error) {
            console.error("Erreur lors de PlaygroundComponent.tryEvent : ", error)
        }
    };

    const addPosition = (event: LayoutChangeEvent, id: number) => {
        event.currentTarget.measureInWindow(x => {
            setEventPositions(prevState => {
                let isPresent = false;

                const newPositions = prevState.map(e => {
                    if (e.id === id) {
                        isPresent = true;
                        e.x = x + cardWidth/2;
                        return e;
                    }
                    return e;
                });

                if (!isPresent) {
                    newPositions.push({ id, x });
                }

                // Ne pas oublier de trier le tableau des positions, pour qu'il soit synchronisé avec le tableau des events
                return newPositions.sort((a,b) => a.x - b.x);
            });
        });
    }

    const setDropZoneLayout = (event: LayoutChangeEvent) => {
        event.currentTarget.measureInWindow((x, y, width, height) => {
            const dropZone = { x, y, width, height };
            // On rajoute une petite marge pour que le joueur ne joue pas une carte par erreur
            dropZone.y += 25;
            setDropZone(dropZone);
        });
    };


    return (
        <View style={styles.playground}>
            <CurrentPlayerHandComponent
                player={players[currentPlayerIndex]}
                playEvent={tryEvent} dropZone={dropZone}
                currentDragging={currentDragging}
            />
            <FlatList
                data={playedEvents}
                onLayout={setDropZoneLayout}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.list,
                    playedEvents.length <= 4 ? styles.centeredList : {}
                ]}
                horizontal={true}
                renderItem={({ item }) =>
                    <View onLayout={e => addPosition(e, item.id)}>
                        <EventCardComponent onLayout={e => addPosition(e, item.id)} event={item} isFaceUp={true} isRevealing={false} />
                    </View>
                }
                keyExtractor={item => item.id.toString()}
            />
            {/* {revealingEvent &&
                <View style={styles.revealing}>
                    <View style={styles.revealingElement}>
                        <EventCardComponent event={revealingEvent} isFaceUp={true} isSelection={false} isRevealing={true} />
                    </View>
                    <Text style={styles.result}>
                        {resultMessage.length > 0 && resultMessage}
                    </Text>
                </View>
            } */}
        </View>
    )
}

const styles = StyleSheet.create({
    playground: {
        margin: 0,
        padding: 0,
        flex: 1
    },
    list: {
        marginTop: 20,
        paddingHorizontal: 25,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        gap:7,
        zIndex : 0
    },
    centeredList: {
        justifyContent: 'center'
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
        marginTop: 10,
        textAlign: 'center',
        fontSize: 50
    }
});

export default PlayGroundComponent;