import * as Matter from 'matter-js'; // gotta import the files !!!
import * as MatterWrap from 'matter-wrap';

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    Events = Matter.Events

function randomCharge(){
    let seed = Math.random()
    if(seed > 0.5){
        return true
    } else {
        return false
    }
}

function createBall(render){
    var ball = Bodies.circle(Math.random() * render.options.width, Math.random() * render.options.height , 80, {
        plugin: {
            wrap: { //matter-wrap plugin code. Very easy to apply!
                min: {
                    x: 0
                },
                max: {
                    x: render.options.width
                }
            }
        },
        charge: randomCharge()
    });
    return ball;
}

export default createBall;