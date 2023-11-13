import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Color from './draw/color';
import { useEffect } from 'react';
import { useState } from 'react';
import ImageCanvas from './draw/image';

export default function Home() {
  
  const INIT = [0, 0]
  const [createFlag, setCreate] = useState(0) // 0: rect, 1: line, 2: drag
  const [startPoint, setStart] = useState(INIT) // mousedown point
  const [endPoint, setEnd] = useState(INIT) //mouseup point
  const [cache, setCache] = useState(INIT)
  const [drag, setDrag] = useState(false)


  //drawing function
  let canvas ; // canvas itself
  let canvasContent; //the graphic content inside canvas
  let bound;

 
  //for rect list
  const [graphicList, setGraphic] = useState([]) //[startPointX, startPointY, endPointX, endPointY, selected, color]
  // console.log('all render')
  //execute in every render
  useEffect(() => {
    // console.log('Effect render')
    canvas = document.querySelector('#canvas')
    canvasContent = canvas.getContext("2d")

    bound = canvas.getBoundingClientRect()
    canvas.width = 1000
    canvas.height = 600
    
    //animation of rectangle
    canvasContent.clearRect(startPoint[0], startPoint[1], cache[0]-startPoint[0], cache[1]-startPoint[1])
    graphicList.map((item)=> {
      canvasContent.fillStyle = item[5]
      canvasContent.fillRect(item[0], item[1], item[2]- item[0], item[3]- item[1])
    })
    if(cache[0] != 0){
      canvasContent.fillStyle = 'rgba(255,0,0,0.5)'
      canvasContent.fillRect(startPoint[0], startPoint[1], cache[0]-startPoint[0], cache[1]-startPoint[1])
    }
    
  })

  useEffect(() => {
    if(createFlag==0 && startPoint[0]!=endPoint[0] && startPoint[1]!=endPoint[1])
      setGraphic([...graphicList, [startPoint[0], startPoint[1], endPoint[0], endPoint[1], false, 'rgba(0, 0, 200, 0.5)', []]])
    
    console.log(graphicList)
  }, [endPoint])

  

  const set_start_point = (e) => {
    bound = canvas.getBoundingClientRect()
    const canvasX = e.clientX - bound.left
    const canvasY = e.clientY - bound.top
    setDrag(true)
    setStart([canvasX, canvasY])
  }

  const set_end_point = (e) => {
    const canvasX = e.clientX - bound.left
    const canvasY = e.clientY - bound.top
    setDrag(false)
    setCache(INIT)
    setEnd([canvasX, canvasY])
  }

  const set_drag_vector = (e) => {
    const canvasX = e.clientX - bound.left
    const canvasY = e.clientY - bound.top
    setCache([canvasX, canvasY])
    console.log(canvasX, canvasY)
  }

  /*const select_on_graphic = (e) => {
    const canvasX = e.clientX - bound.left
    const canvasY = e.clientY - bound.top
    let tmp = []
    graphicList.map((item) => {
      if(item[0] < canvasX && canvasX < item[2] && item[1] < canvasY && canvasY< item[3]){
        item[4] = !item[4]
      }else{
        item[4] = false
      }
      tmp = [...tmp, item]
    })
    setGraphic(tmp)
  }*/

  

  const remove_graphic = (e) => {
    let tmp = []
    if(graphicList.length > 0){
      graphicList.map((item) => {
        /*if(item[4] == false){
          tmp = [...tmp, item]
        }else{
  
        }*/
      })
    }
    setGraphic(tmp)
  }



  const change_state = (e) => {
    switch(createFlag){
      case 0 :
        return 'draw square'
      case 1: 
        return 'draw line'
      case 2:
        return 'drag image'
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>graphic create</title>
        <link rel="icon" href="/favicon.ico" /> 
      </Head>
      

      <h1 className={styles.title}>
          Testing Page
      </h1>
      <h3>{change_state()}</h3>
      <button onClick={() => {setCreate(1)}}>line</button>
      <button onClick={() => {setCreate(0);}}>square</button>
      <div>
        
        
        <span>
          <canvas id="canvas" resize="true" 
          onMouseDown={(e) => {if(createFlag==0)set_start_point(e)}} 
          onMouseMove={(e) => {if(drag)set_drag_vector(e)}} 
          onMouseUp={(e) => {if(createFlag==0)set_end_point(e)}}
        ></canvas>
        </span>
        
        <span>
          <ImageCanvas/>
        </span>

        
      </div>

      

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
        canvas{
          border-color : black;
          border-style : solid;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        canvas{
          border-color : black;
          border-style : solid;
        }
      `}</style>
    </div>
  );
}

