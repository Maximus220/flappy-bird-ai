class Neat{
  constructor(popSize, mutationRate, nnConfig){
    this.mutationRate = mutationRate;
    this.pop = [];
    this.nnConfig = nnConfig;
    this.generation=0;
    this.popSize = popSize;
    for(let x=0;x<this.popSize;x++){
      let tWeights = [];
      for(let i=0;i<nnConfig.layer.length-1;i++){ //For each layers except output one
        let tNodes = [];
        for(let j=0;j<nnConfig.layer[i].node;j++){ //For each nodes in this layer
          let tNW = [];
          for(let k=0;k<nnConfig.layer[i+1].node;k++){ //For each node in next layer (weights)
            tNW.push(random(-1,1));
          }
          tNodes.push(tNW);
        }
        tWeights.push(tNodes);
      }
      let nn = new NeuralNetwork(this.nnConfig);
      nn.init(tWeights);
      this.pop.push(new Creature(nn, tWeights));
    }
  }

  setInputs(inputs, index){
    //console.log(this.pop[index] + " - "+index);
    this.pop[index].nn.setInputs(inputs); //ERROR
  }

  feedForward(){
    for(let x=0;x<this.pop.length;x++){
      this.pop[x].nn.feedForward();
    }
  }

  setFitness(fitness, index){
      this.pop[index].setFit(fitness);
  }

  getOutput(index){
    let output=[];
    for(let x=0;x<this.pop[index].nn.layer[this.pop[index].nn.layer.length-1].node.length;x++){
      output.push(this.pop[index].nn.layer[this.pop[index].nn.layer.length-1].node[x].value);
    }
    return output;
  }

  getBestCreature(){
    let temp = [{fit: -1},0];
    for(let x=0;x<this.pop.length;x++){
      if(this.pop[x].fit>temp[0].fit){
        temp = [this.pop[x], x];
      }
    }
    return temp; [creature, index]
  }

  makePop(){
    let newPop = [];
    //Create pool
    let pool = [];
    let bestFit = this.getBestCreature()[0].fit;
    for(let x=0;x<this.pop.length;x++){
      for(let y=0;y<floor(map(this.pop[x].fit, 0, bestFit, 0, 1000));y++){
        pool.push(this.pop[x]);
      }
    }
    for(let x=0;x<this.popSize;x++){
      newPop.push(this.crossover(pool));
    }
    this.pop = newPop;
    this.generation++;
  }

  crossover(pool){ //Return a new creature with mutated genes
    //Get 2 rdm parents
    let parents = [pool[floor(random(0, pool.length))], pool[floor(random(0, pool.length))]];
    let genes = [];
    //FINAL GENE IS MEAN OF ALL GENES FROM TWO PARENTS
    for(let x=0;x<parents[0].genes.length;x++){ //For each layers
      let tNodes = [];
      for(let y=0;y<parents[0].genes[x].length;y++){ //For each nodes
        let tWeights = [];
        for(let z=0;z<parents[0].genes[x][y].length;z++){ //For each weights
          tWeights.push((parseFloat(parents[0].genes[x][y][z])+parseFloat(parents[1].genes[x][y][z]))/2);
        }
        tNodes.push(tWeights);
      }
      genes.push(tNodes);
    }
    let nn = new NeuralNetwork(this.nnConfig);
    let mutatedGenes = this.mutate(genes);
    nn.init(mutatedGenes);
    return new Creature(nn, mutatedGenes);
  }

  mutate(genes){
    let newGenes = genes;
    let layer = floor(random(0, genes.length));
    for(let x=0;x<genes[layer].length;x++){
      if(floor(random(0,100))<this.mutationRate*100){
        for(let y=0;y<genes[layer][x];y++){ //For each weights
          let rdmChange = random(-0.1,0.1);
          newGenes[layer][x][y] +=rdmChange;
        }
      }
    }
    return newGenes;
  }

  setCreatureNum(popSize){
    this.popSize = popSize;
  }

  setMutationRate(mutationRate){
    this.mutationRate = mutationRate;
  }

  getNeuralDisplay(creatureIndex, width, height, nodeSize = 15){
    let display = createGraphics(width, height);
    let nn = this.pop[creatureIndex].nn;
    for(let x=0;x<nn.layer.length;x++){
  		display.noStroke();
  		let locX = width/nn.layer.length*x+50;
  		//line(locX, 0, locX, height);
  		for(let y=0;y<nn.layer[x].node.length;y++){
  			let locY = height/(nn.layer[x].node.length+1)*(y+1);
  			for(let z=0;z<nn.layer[x].node[y].weights.length;z++){
  				display.strokeWeight(map(nn.layer[x].node[y].weights[z], -1, 1, -5, 5)); //arbitrary values
  				if(nn.layer[x].node[y].weights[z]>0){
  					display.stroke('red');
  				}else if(nn.layer[x].node[y].weights[z]<0){
  					display.stroke('blue');
  				}else{
  					display.stroke('white');
  				}
  				display.line(locX, locY, width/nn.layer.length*(x+1)+50, height/(nn.layer[x+1].node.length+1)*(z+1));
  			}
  			display.noStroke();
  			if(x===nn.layer.length-1){
  				if(nn.layer[x].node[y].value>0.5){
  					display.fill('red');
  				}
  			}else{
          display.fill('white');
  				display.textSize(15);
  				display.text(floor(nn.layer[x].node[y].value).toString(), locX-50, locY+nodeSize/2);
  			}
  			display.ellipse(locX, locY, nodeSize);
  		}
  	}
    return display;
  }


}
