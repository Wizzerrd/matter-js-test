import * as Matter from 'matter-js'; // gotta import the files !!!

document.addEventListener("DOMContentLoaded", ()=>{console.log('hello world')}) 
//logs to console when the document object (provided by DOM API) is loaded

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create({gravity: {
    scale: 0.001,
    x: 0,
    y: 0
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
    engine: engine,
    background: '#ff0000' 
});

// create a box and a circle
var boxA = Bodies.rectangle(400, 200, 80, 80);
var ball = Bodies.circle(450, 50, 80);

// create boundaries
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var rightBound = Bodies.rectangle(-10, 300, 60, 610, { isStatic: true });
var leftBound = Bodies.rectangle(810, 300, 60, 610, { isStatic: true });
var roof = Bodies.rectangle(400, -10, 810, 60, { isStatic: true });
Bodies.rectangle()

// add boundaries to the world
Composite.add(engine.world, [ground,rightBound,leftBound,roof])

// add all of the bodies to the world
Composite.add(engine.world, [boxA, ball]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);