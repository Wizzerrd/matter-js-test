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
    Events = Matter.Events,
    Collision = Matter.Collision

// create an engine
var engine = Engine.create({gravity: {
    scale: 0,
    x: 0,
    y: 1
}});

const NUM_BALLS = 500;

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

var balls = [];

function addBalls(){
    for(let i = 0; i < NUM_BALLS; i++){
        balls.push(createBall(render, [Math.random() * render.options.width, Math.random() * render.options.height]))
    }
}

addBalls();

// create boundaries
var ground = Bodies.rectangle(render.options.width / 2, render.options.height + 2490, render.options.width * 2, 5000, { isStatic: true });
var leftBound = Bodies.rectangle(-2490, render.options.height / 2, 5000, render.options.height, { isStatic: true });
var rightBound = Bodies.rectangle(render.options.width + 2490, render.options.height / 2, 5000, render.options.height, { isStatic: true });
var roof = Bodies.rectangle(render.options.width / 2, -2490, render.options.width * 2, 5000, { isStatic: true });

var walls = [ground,leftBound,rightBound,roof];
var wallBool = true;

// add boundaries to the world
Composite.add(engine.world, walls)

// add all of the bodies to the world
Composite.add(engine.world, balls);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);


// Buttons

var pushButton = document.querySelector('#push-pull');
var hitButton = document.getElementById('hits')

var wallButton = document.getElementById('walls')

function toggleWrap(bodies){
    bodies.forEach((body)=>{
        if (wallBool){
            body.plugin.wrap.x = undefined
            body.plugin.wrap.y = undefined
        } else {
            body.plugin.wrap.x = render.options.width;
            body.plugin.wrap.y = render.options.height;
        }
    })
}

wallButton.addEventListener("click", ()=>{
    toggleWrap(balls);
    if (wallBool){
        Composite.remove(engine.world, walls)
        wallBool = false;
    }else{
        Composite.add(engine.world, walls)
        wallBool = true;
    }
})

var clickMult = (1000/NUM_BALLS);

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
    if(pushBool) {
        clickMult = -0.000005
    } else {
        clickMult = 0.000005
    }
    
    let clickVect = function(ball){
        return {x: clickMult * (simPos.x - ball.position.x), y: clickMult * (simPos.y - ball.position.y)};
    }

    balls.forEach((ball)=>{
        Body.applyForce(ball, simPos, clickVect(ball));
    })
})

//


let gravField = document.getElementById('grav-mult');
let gravMult = Number(gravField.value) * 0.005

var collisions = false;
hitButton.addEventListener("click", ()=> {
    if(collisions){
        collisions = false;
    } else {
        collisions = true;
    }
})

let gravVect = function(ball1, ball2){
    let deltX = ball2.position.x - ball1.position.x;
    let deltY = ball2.position.y - ball1.position.y;
    let distanceSq = deltX ** 2 + deltY ** 2;

    if(distanceSq === 0){
        return {x: 0, y: 0};
    }

    const forceMag = gravMult / distanceSq;
    return {x: forceMag * deltX, y: forceMag * deltY};

    // return {x: (gravMult * (ball2.position.x - ball1.position.x)), y: (gravMult * (ball2.position.y - ball1.position.y))};
}

let applyGrav = function(ball1, ball2){
    if(ball1.charge !== ball2.charge){
        ball1.gravVect = gravVect(ball1, ball2);
        ball2.gravVect = gravVect(ball2, ball1);
        Body.applyForce(ball1, ball1.position, ball1.gravVect);
        Body.applyForce(ball2, ball2.position, ball2.gravVect);
    } else {
        ball1.gravVect = gravVect(ball1, ball2);
        ball2.gravVect = gravVect(ball2, ball1);
        Body.applyForce(ball1, ball1.position, ball2.gravVect);
        Body.applyForce(ball2, ball2.position, ball1.gravVect);
    }
}

Events.on(engine, 'beforeUpdate', ()=>{

    gravMult = Number(gravField.value) * 0.005

    if(collisions){
        hitButton.innerHTML = "Interactions On"
    }else{
        hitButton.innerHTML = "Interactions Off"
    }

    
    for(let i = 0; i < balls.length; i++){
        for(let j = i + 1; j < balls.length; j++){
            if (collisions){
                let collision = Collision.collides(balls[i],balls[j])
                if(collision){
                    if(balls[i].charge !== balls[j].charge){
                        balls[i].setRemove = true;
                        balls[j].setRemove = true;
                    } else {
                        let newBall = createBall(render, [Math.random() * render.options.width, Math.random() * render.options.height]);
                        balls.push(newBall)
                        Composite.add(engine.world, newBall);
                    }
                }
            }
            applyGrav(balls[i],balls[j]);
        }
    }

    balls = balls.filter((ball)=>{
        if(ball.setRemove === true){
            Composite.remove(engine.world, ball)
            return false;
        }
        return true;
    })
    
    window.balls = balls;
    window.engine = engine;
    console.log(balls.length)
})

window.NUM_BALLS = NUM_BALLS;
window.render = render;


