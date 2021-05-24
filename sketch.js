//Game variables
var gamSpeed = 3;//3
var gravity = 0.2;//0.2
var globalSpeed;
var player;
var pipePair;
var pipePair2;
var ground;
var scores = [];

//Neat parameters
var birds = [];
let numGen=20;
var mutationRate = 0.05;
let config = {
  layer: [
    {
      node: 4
    },
    {
      node: 1,
      actFunction: 'SIGMOID'
    }
  ]
}
let neat;

//Game parameters
var visualizeSights=false;
var visualizeHitboxes=false;

//Design & HUD
var bird;
var pipeBottom;
var pipeTop;
var speedSlider;
var creatureSlide;
var cBox1;
var hitboxesSlider;
var hitboxesSize=3;
var mutationRateSlider;
//NN Display
var nnDS = [300,250];//nnDisplaySize
var nnMove = [550,520];
const nodeSize = 15;

//Chart
var ctx;
var scoreChart;
var chartData = {datasets:[{
	data:[],
	label:['Score'],
	fill: false,
	borderColor: ['#3669cf']
}], labels:[]};

function addScore(data) { //Chart update function
    scoreChart.data.labels.push(neat.generation);
		scoreChart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    scoreChart.update();
}
function randomB(min, max) { //Random function
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function preload(){
  bird = loadImage("https://media.discordapp.net/attachments/350662896839294977/818878642481922118/bird3.png?width=84&height=45");
  pipeBottom = loadImage("https://media.discordapp.net/attachments/350662896839294977/819162352301244426/HugePipeBottom.png?width=101&height=676");
  pipeTop = loadImage("https://media.discordapp.net/attachments/350662896839294977/819162817453097031/HugePipeTop.png?width=101&height=676");
}

function setup(){
		//Main canvas
    window.canvas = createCanvas(800, 800)/*.position(windowWidth/2-canvas.width/2, 20)*/;
		window.canvas.parent('mainCanvas');
		//Sliders
		speedSlider = createSlider(0, 30, 1);
		speedSlider.parent('speedSlider');

		creatureSlider = createSlider(1, 1000, numGen);
		creatureSlider.parent('creatureSlider');

		hitboxesSlider = createSlider(1, 15, 3);
		hitboxesSlider.parent('hitboxesSizeSlider');

		mutationRateSlider = createSlider(0.01, 1, mutationRate, 0.01);
		mutationRateSlider.parent('mutationRateSlider');

		//Chart
		ctx = document.getElementById('scoreChart').getContext('2d');
		scoreChart=new Chart(ctx, {type:'line', data: chartData, options: {}});

		//Main components
    ground = new Ground();
    neat = new Neat(numGen, mutationRate, config); //////////////////////////////////////////////////


    pipePair = new PipePair();
    pipePair2 = new PipePair();
    pipePair.setX(canvas.width);
    pipePair2.setX(canvas.width*1.5+pipePair2.topPipe.width);

  	//addScore(scores[neat.generation]);

    for(x=0; x<numGen;x++){
      birds[x] = new Bird(canvas.width/4, canvas.height/2+1*x, bird,x);
    }
		nnDS = createVector(nnDS[0], nnDS[1]);
		nnMove = createVector(nnMove[0], nnMove[1]);

}
function draw(){
	globalSpeed=speedSlider.value();
	document.getElementById('speedDisplay').innerHTML = globalSpeed;
	document.getElementById('creatureDisplay').innerHTML = creatureSlider.value();
	document.getElementById('mutationRateDisplay').innerHTML = mutationRateSlider.value();

	visualizeSights = document.getElementById('boxSights').checked;
	visualizeHitboxes = document.getElementById('boxHitboxes').checked;

	if(visualizeHitboxes){
		document.getElementById('hitBoxesSizeDisplay').style.display = "block";
		hitboxesSlider.show();
		hitboxesSize=hitboxesSlider.value();
		document.getElementById('hitBoxesSizeDisplay').innerHTML = hitboxesSize;
	}else{
		hitboxesSlider.hide();
		document.getElementById('hitBoxesSizeDisplay').style.display = "none";
	}

	document.getElementById('mutationDisplay').innerHTML= ("Mutation rate : " + mutationRate);
	document.getElementById('populationDisplay').innerHTML= ("Population size : "+numGen);

  background(135,206,250);

	if(globalSpeed!=0){
		for (let n = 0; n < globalSpeed; n++) {
			//BG and components display
			ground.show();
		   pipePair.show();
		   pipePair2.show();
		   if(pipePair.offscreen()){
		     pipePair = new PipePair();
		   }else{
		     pipePair.update();
		   }
		   if(pipePair2.offscreen()){
		     pipePair2 = new PipePair();
		   }else{
		     pipePair2.update();
		   }
		   ground.update();
			//Creatures display and neat implementation
		   for(i=0;i<numGen;i++){
		     neat.setInputs(birds[i].inputss(),i);
				 neat.setFitness(birds[i].timeScore/2+birds[i].score*1000+birds[i].interScore*50,i);
		   }
		   neat.feedForward();
			 let tempBest = neat.getBestCreature();
			 document.getElementById('bestFitDisplay').innerHTML=("Best fitness : "+tempBest[0].fit);
		   for(i=0;i<numGen;i++){
				if(birds[i].alive){
			     birds[i].update();
					 if(tempBest[1]!=i){
						 birds[i].show();
					 }
			     if(neat.getOutput(i)[0]>=0.5){
			       birds[i].flap();
			     }
				}
		   }
			 if(tempBest[1]>=0&&tempBest[1]<numGen){
				 if(birds[tempBest[1]].alive){
				 	birds[tempBest[1]].show(true);
					}
				}
		   if(allDead()){
		     start();
		   }
		}
	}else{
		ground.show();
		pipePair.show();
		pipePair2.show();
		for(i=0;i<numGen;i++){
			if(birds[i].alive){
				birds[i].show();
			}
		}
		allDead(); //Show score
	}


	//Display network
	let bestI = neat.getBestCreature()[1];
	image(neat.getNeuralDisplay(bestI, nnDS.x, nnDS.y, nodeSize) ,nnMove.x,nnMove.y);
}

function killAll(){
	for(i=0;i<numGen;i++){
	 if(birds[i].alive){
		 birds[i].die();
	 }
 }
}

function restart(){
	for(i=0;i<numGen;i++){
	 if(birds[i].alive){
		 birds[i].die();
	 }
 	}
	neat = new Neat(numGen, mutationRate, config);
	start(false);
}



//Text displays
function actuScore(bird){
	scores[neat.generation]=bird.score;

	fill(255,255,255);
	textAlign(CENTER);
	textSize(50);
	text(scores[neat.generation], canvas.width/2, canvas.height/6);

	document.getElementById('generation').innerHTML=("Generation : "+neat.generation);
	document.getElementById('bestScore').innerHTML=("Best score : "+(Math.max(...scores)));
	let alive=0;
	for(x=0;x<numGen;x++){
		if(birds[x].alive){
			alive++;
		}
	}
	document.getElementById('alive').innerHTML=("Alive : "+alive+" / "+numGen);
	document.getElementById('previousScore').innerHTML=("Previous score : "+scores[scores.length-2]);
}

//Test if every birds are dead
function allDead(){
  for(i=0;i<numGen;i++){
    if(birds[i].alive){
			actuScore(birds[i]);
      return false;
    }
  }
  return true;
}

//Launch a run
function start(addValue=true){

	numGen=creatureSlider.value();
	neat.setCreatureNum(numGen);

	mutationRate= mutationRateSlider.value();
	neat.setMutationRate(mutationRate);

	pipePair = new PipePair();
  pipePair2 = new PipePair();
  pipePair.setX(canvas.width);
  pipePair2.setX(canvas.width*1.5+pipePair2.topPipe.width);

	addScore(scores[neat.generation]);

  for(x=0; x<numGen;x++){
    birds[x] = new Bird(canvas.width/4, canvas.height/2+1*x, bird,x);
  }
	if(addValue){
		neat.makePop();
	}
}
