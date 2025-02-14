import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { Event } from '../models/Event';
import { eventsData } from '@/assets/data';

interface CsvData {
        [key: string]: string;
}

export const fetchEvents = async (): Promise<Event[]> => {
        return new Promise<Event[]>((resolve,reject) => {
                try {
                        const rawEvents = eventsData;
                        resolve(randomizeEvents(rawEvents));
                } catch (error){
                        reject(error);
                }
        })
        // try {
        //         const asset = Asset.fromModule(require('../assets/data.csv'));
        //         await asset.downloadAsync();
        //         const fileUri = asset.localUri as string;

        //         const csvContent = await FileSystem.readAsStringAsync(fileUri);
 

        //         return new Promise<Event[]>((resolve, reject) => {
        //                 Papa.parse<CsvData>(csvContent, {
        //                         header: false,
        //                         skipEmptyLines: true,
        //                         complete: (result) => {
        //                                 try {
        //                                         const events: Event[] = result.data.map(line => ({
        //                                                 id: +line[0],
        //                                                 name: line[1],
        //                                                 year: +line[2],
        //                                         }));
        //                                         resolve(randomizeEvents(events));
        //                                 } catch (error) {
        //                                         reject(error);
        //                                 }
        //                         },
        //                         error: (error: Error) => {
        //                                 reject(error);
        //                         },
        //                 });
        //         });
        // } catch (error) {
        //         console.error(error);
        //         throw new Error(`Erreur lors de la récupération du fichier CSV`);
        // }
};

const randomizeEvents = (array: Event[]): Event[] => {
        const newArray: Event[] = [];
        while (array.length > 0) {
                const randomIndex = Math.floor(Math.random() * array.length);
                newArray.push(array.splice(randomIndex, 1)[0]);
        }
        return newArray;
}
