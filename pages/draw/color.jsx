import { useEffect } from "react";

export default function Color(prop) {
    let ctx;
    let colorBar;
    let color_matrix = []

    
    useEffect(() => {
        colorBar = document.getElementById("colorBar")
        ctx = colorBar.getContext("2d");
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
              ctx.fillStyle = `rgb(${Math.floor(255 - 42.5 * i)}, ${Math.floor(
                255 - 42.5 * j,
              )}, 0)`;
              ctx.fillRect(0 , 25*j + i*125, 25, 25);
            }
        }
      

    })
    
    
    return <canvas id="colorBar" height={prop.height} width={prop.width}/>

    
  }