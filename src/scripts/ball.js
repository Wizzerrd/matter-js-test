import * as Matter from 'matter-js'; // gotta import the files !!!
import * as MatterWrap from 'matter-wrap';

var Bodies = Matter.Bodies;

function randomCharge(){
    let seed = Math.random()
    if(seed > 0.5){
        return true
    } else {
        return false
    }
}

function returnColor(charge){
    if(charge){
        return "red"
    } else {
        return "blue"
    }
}

function createBall(render, pos){
    var charge = randomCharge();
    var ball = Bodies.circle(pos[0], pos[1] , 5, {
        plugin: {
            wrap: { //matter-wrap plugin code. Very easy to apply!
                min: {
                    x: 0,
                    y: 0
                },
                max: {
                    x: render.options.width,
                    y: render.options.height
                }
            }
        },
        charge: charge,
        render: {
            fillStyle: returnColor(charge)
        },
        frictionAir: 0.001,
        friction: 0
    });
    return ball;
}

export default createBall;