import { Event } from "./Event";

export interface Player{
  id:number,
  name:string,
  hand:Event[];
}