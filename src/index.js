import * as Matter from 'matter-js'; // gotta import the files !!!
import * as MatterWrap from 'matter-wrap';
Matter.use(MatterWrap);

document.addEventListener("DOMContentLoaded", ()=>{console.log('hello world')}) 
//logs to console when the document object (provided by DOM API) is loaded

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    Events = Matter.Events;

// Matter.Bodies.prototype.onClick = function(){
//     console.log("banana")
// };

// create an engine
var engine = Engine.create({gravity: {
    scale: 0.001,
    x: 0,
    y: 1
}});
// engine default gravity params:
// scale: 0.001
// x: 0
// y: 1
// This will allow for the application of constant force on bodies

// create a renderer
// element: HTMLElement is converted into a canvas upon which the simulation is rendered
var render = Render.create({
    element: document.querySelector('#simulator'),
    engine: engine
});

// create a box and a circle
var ball = Bodies.circle(450, 50, 80, {
    plugin: {
        wrap: {
            min: {
                x: 0
            },
            max: {
                x: 800
            }
        }
    }
});

// create boundaries
var ground = Bodies.rectangle(400, 610, 2000, 60, { isStatic: true });
// var rightBound = Bodies.rectangle(-10, 300, 60, 610, { isStatic: true });
// var leftBound = Bodies.rectangle(810, 300, 60, 610, { isStatic: true });
// var roof = Bodies.rectangle(400, -10, 810, 60, { isStatic: true });

// add boundaries to the world
Composite.add(engine.world, [ground])

// add all of the bodies to the world
Composite.add(engine.world, [ball]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// Buttons

var hButton = document.querySelector('#horizontal-force');
var vButton = document.querySelector('#vertical-force');
var pushButton = document.querySelector('#push-pull');

hButton.addEventListener("click", ()=> {
    Body.applyForce(ball, ball.position, {x: 1, y:0});
})

vButton.addEventListener("click", ()=> {
    Body.applyForce(ball, ball.position, {x:0, y:-1});
})

// Mouse Input

var simulator = document.querySelector('#simulator');
var simRect = simulator.getBoundingClientRect();

let pushBool = true;

pushButton.addEventListener("click", ()=> {
    if(pushBool){
        pushBool = false;
        pushButton.innerHTML = "Pull";
    } else {
        pushBool = true;
        pushButton.innerHTML = "Push";
    }
})

simulator.addEventListener("click", (e)=> {
    let simPos = {x: e.clientX - simRect.x , y: e.clientY - simRect.y};
    let clickMult = -0.002;
    if(pushBool) {
        clickMult = -0.002
    } else {
        clickMult = 0.002
    }
    let clickVect = {x: clickMult * (simPos.x - ball.position.x), y: clickMult * (simPos.y - ball.position.y)};
    Body.applyForce(ball, simPos, clickVect);
})