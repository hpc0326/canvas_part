import Head from 'next/head';
import { useEffect } from 'react';
import { useState } from 'react';


export default function ImageCanvas() {
    const [uploaded, setUploaded] = useState(false)//if file has been uploaded
    
    //background image function 
    let canvasImg;
    let canvasImgContext;
    let img;
    let lastX, lastY
    let dragStart,dragged;
    let bound 
    const [imgSource, setSource] = useState(null)
    const [gridState, setGridState] = useState([false, null])
    const scaleFactor = 1.1;

    useEffect(() => {
        canvasImg = document.getElementById('canvasImg')
        canvasImgContext = canvasImg.getContext("2d")
        trackTransforms(canvasImgContext);
        canvasImg.width = 1000
        canvasImg.height = 600
        bound = canvasImg.getBoundingClientRect()
        draw_grid()
    })

    
    const redraw = () => {
        canvasImgContext.save();
        canvasImgContext.setTransform(1,0,0,1,0,0);
        canvasImgContext.clearRect(0,0,canvasImg.width,canvasImg.height);
        canvasImgContext.restore();
        canvasImgContext.drawImage(imgSource,200,50);
    
    }
     //start
    const canvas_bg_mousedown = (evt) => {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvasImg.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvasImg.offsetTop);
        dragStart = canvasImgContext.transformedPoint(lastX,lastY);
        dragged = false;
    }
     
    const canvas_bg_mousemove = (evt) => {
        lastX = evt.offsetX || (evt.pageX - canvasImg.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvasImg.offsetTop);
        dragged = true;
        if (dragStart && uploaded){
            var pt = canvasImgContext.transformedPoint(lastX,lastY);
            canvasImgContext.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            redraw();
        }
    }
     
     const canvas_bg_mouseup = (evt) => {
       dragStart = null;
       if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
     }
     
     const canvas_bg_mousescroll = (e) => {
       handleScroll(e)
     }
     
     const canvas_bf_mousewheel = (e) => {
       handleScroll(e)
     }
     
     const handleScroll = (evt) => {
       var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
       if (delta) zoom(delta);
    //    return evt.preventDefault() && false;
     }
     
     const zoom = (e) => {
       var pt = canvasImgContext.transformedPoint(lastX,lastY);
       canvasImgContext.translate(pt.x,pt.y);
       var factor = Math.pow(scaleFactor, e);
       canvasImgContext.scale(factor,factor);
       canvasImgContext.translate(-pt.x,-pt.y);
       redraw();
     }
     
     
     // Adds ctx.getTransform() - returns an SVGMatrix
     // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
     const trackTransforms = (ctx) => {
       console.log('trackTransforms')
       var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
       var xform = svg.createSVGMatrix();
       ctx.getTransform = function(){ return xform; };
       
       var savedTransforms = [];
       var save = ctx.save;
       ctx.save = function(){
         savedTransforms.push(xform.translate(0,0));
         return save.call(ctx);
       };
       var restore = ctx.restore;
       ctx.restore = function(){
         xform = savedTransforms.pop();
         return restore.call(ctx);
       };
     
       var scale = ctx.scale;
       ctx.scale = function(sx,sy){
         xform = xform.scaleNonUniform(sx,sy);
         return scale.call(ctx,sx,sy);
       };
       var rotate = ctx.rotate;
       ctx.rotate = function(radians){
         xform = xform.rotate(radians*180/Math.PI);
         return rotate.call(ctx,radians);
       };
       var translate = ctx.translate;
       ctx.translate = function(dx,dy){
         xform = xform.translate(dx,dy);
         return translate.call(ctx,dx,dy);
       };
       var transform = ctx.transform;
       ctx.transform = function(a,b,c,d,e,f){
         var m2 = svg.createSVGMatrix();
         m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
         xform = xform.multiply(m2);
         return transform.call(ctx,a,b,c,d,e,f);
       };
       var setTransform = ctx.setTransform;
       ctx.setTransform = function(a,b,c,d,e,f){
         xform.a = a;
         xform.b = b;
         xform.c = c;
         xform.d = d;
         xform.e = e;
         xform.f = f;
         return setTransform.call(ctx,a,b,c,d,e,f);
       };
       var pt  = svg.createSVGPoint();
       ctx.transformedPoint = function(x,y){
         pt.x=x; pt.y=y;
         return pt.matrixTransform(xform.inverse());
       }
     }
     
    


    const remove_all = (e) => {
        setSource(null)
        setUploaded(false)
        setGridState([false, null])
        canvasImgContext.clearRect(0, 0, canvasImg.width, canvasImg.height);
    }

    const upload_image = (e) => {
        let bgFile = e.target.files[0]
        let reader = new FileReader();
        reader.readAsDataURL(bgFile)
        img = new Image()
        reader.onload = function (e){
            
            img.onload = function(){
                canvasImgContext.clearRect(0, 0, canvasImg.width, canvasImg.height);
                canvasImgContext.drawImage(img, 0, 0);
            }
            setSource(img)
            img.src = e.target.result
            lastX=canvasImg.width/2
            lastY=canvasImg.height/2;
        
        }
        setUploaded(true)
    }

    const draw_grid = () => {
        const gridNum = gridState[1]
        canvasImgContext.clearRect(0, 0, canvasImg.width, canvasImg.height);
        const w = canvasImg.width
        const h = canvasImg.height

        if(gridState[0]){
            canvasImgContext.lineWidth = 0.5
            canvasImgContext.beginPath();
            for (let x=0 ; x<=w ; x+=gridNum) {
                for (let y=0 ; y<=h ; y+=gridNum) {
                    
                    canvasImgContext.moveTo(x, 0);
                    canvasImgContext.lineTo(x, h);
                    canvasImgContext.moveTo(0, y);
                    canvasImgContext.lineTo(w, y);
                    
                }
            }
            canvasImgContext.stroke();
        }
        
    };
    


    return (
    <div>
        <span>
        <button id='zoomIn' onClick={(e) => {canvasImg.setZoom}}>zoom in</button>
        <button id='zoomOut'>zoom out</button>
        <input accept="image/*" type='file' id='bginput' onChange={(e)=>{upload_image(e)}}/>
        <button onClick={(e) => {remove_all(e)}}>remove all</button>
        <input type='blank' placeholder='grid size in pixel' id='gridNum'></input>
        <button onClick={(e) => {setGridState([true, parseInt(document.getElementById('gridNum').value)])}}>grid</button>
        </span>
        <canvas id='canvasImg' resize='true'
            onMouseDown={(e) => {if(uploaded)canvas_bg_mousedown(e)}} 
            onMouseMove={(e) => {canvas_bg_mousemove(e)}} 
            onMouseUp={(e) => {if(uploaded)canvas_bg_mouseup(e)}}
            onScroll={(e) => {if(uploaded)canvas_bg_mousescroll(e)}}
            onWheel={(e) => {if(uploaded)canvas_bg_mousescroll(e)}}
        />
    </div>
    
    )

}