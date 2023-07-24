import * as Matter from 'matter-js'; // gotta import the files !!!
import * as MatterWrap from 'matter-wrap';
import createBall from './scripts/ball.js';

import * as ChartJS from 'chart.js/auto'; // import from chart.js/auto

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
    Events = Matter.Events

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
var simmy = document.querySelector('#simulator');
var render = Render.create({
    element: simmy,
    engine: engine,
    options: {
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.9,
        wireframes: false,
        background: 'white',
    }
});

// create ions
var ball1 = createBall(render);
var ball2 = createBall(render);

// create boundaries
var ground = Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width * 2, 60, { isStatic: true });
// var rightBound = Bodies.rectangle(-10, 300, 60, 610, { isStatic: true });
// var leftBound = Bodies.rectangle(810, 300, 60, 610, { isStatic: true });
// var roof = Bodies.rectangle(400, -10, 810, 60, { isStatic: true });

// add boundaries to the world
Composite.add(engine.world, [ground])

// add all of the bodies to the world
Composite.add(engine.world, [ball1, ball2]);

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
    Body.applyForce(ball1, ball1.position, {x: 1, y:0});
    Body.applyForce(ball2, ball2.position, {x: 1, y:0});
})

vButton.addEventListener("click", ()=> {
    Body.applyForce(ball1, ball1.position, {x:0, y:-1});
    Body.applyForce(ball2, ball2.position, {x: 0, y:-1});
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
    // let clickVect = {x: clickMult * (simPos.x - ball.position.x), y: clickMult * (simPos.y - ball.position.y)};
    let clickVect = function(ball){
        return {x: clickMult * (simPos.x - ball.position.x), y: clickMult * (simPos.y - ball.position.y)};
    }

    Body.applyForce(ball1, simPos, clickVect(ball1));
    Body.applyForce(ball2, simPos, clickVect(ball2));
})

let gravMult = -0.0001;

Events.on(engine, 'beforeUpdate', ()=>{ // TODO: Attraction between particles
    let gravVect = function(ball1, ball2){
        return {x: gravMult * (ball1.position.x - ball2.position.x), y: gravMult * (ball1.position.y - ball2.position.y)};
    }

    // if(ball1.charge !== ball2.charge){
        ball1.gravVect = gravVect(ball1, ball2);
        ball2.gravVect = gravVect(ball2, ball1);
        let gravver = {x: ball1.gravVect.x + ball2.gravVect.x, y: ball1.gravVect.y + ball2.gravVect.y}
        
        Body.applyForce(ball1, ball2.position, ball1.gravVect);
        Body.applyForce(ball2, ball1.position, gravVect(ball1, ball2));

        // } else {
            //     Body.applyForce(ball1, ball2.position, 0.005)
            //     Body.applyForce(ball2, ball1.position, 0.005)
            // }

})

