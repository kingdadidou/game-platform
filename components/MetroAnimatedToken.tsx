'use client';
import {useEffect,useRef,useState,type HTMLAttributes} from 'react';
type Point={x:number;y:number};
export default function MetroAnimatedToken({position,movement,assets,style,...props}:HTMLAttributes<HTMLDivElement>&{position:Point;movement?:{id:number;path:string[]};assets:Record<string,Point>}){
 const [point,setPoint]=useState(position);
 const mounted=useRef(false);
 const path=JSON.stringify(movement?.path.map(id=>assets[id]).filter(Boolean)??[]);
 const id=movement?.id,x=position.x,y=position.y;
 useEffect(()=>{
  if(!mounted.current){mounted.current=true;return;}
  const points:Point[]=JSON.parse(path);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)points.length=0;
  const timers=points.map((p,i)=>setTimeout(()=>setPoint(p),i*160));
  timers.push(setTimeout(()=>setPoint({x,y}),points.length*160));
  return()=>timers.forEach(clearTimeout);
 },[id,path,x,y]);
 return <div {...props} style={{...style,left:point.x+'%',top:point.y+'%'}}/>;
}
