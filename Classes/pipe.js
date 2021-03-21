class Pipe{
  constructor(isTop, height){
    this.isTop = isTop;
    this.height = height;
    this.width = 100;
    this.x=canvas.width+this.width;
    if(!isTop){
      //console.log(canvas.height-this.height);
      this.topY=canvas.height-this.height;
    }else{
      this.topY=0;
    }
  }
  show(){
    /*noStroke();
    fill(0,204,0);
    rect(this.x,this.topY,this.width,this.height);*/
    if(this.isTop){
      image(pipeTop,this.x,this.topY,this.width,this.height);
    }else{
      image(pipeBottom,this.x,this.topY,this.width,this.height);
    }

    //Show pipe's hitbox
    if(visualizeHitboxes){
      rect(this.x-hitboxesSize/2,this.topY-hitboxesSize/2,hitboxesSize,hitboxesSize);
      rect(this.x-hitboxesSize/2,this.topY+this.height-hitboxesSize/2,hitboxesSize,hitboxesSize);
      rect(this.x+this.width-hitboxesSize/2,this.topY-hitboxesSize/2,hitboxesSize,hitboxesSize);
      rect(this.x+this.width-hitboxesSize/2,this.topY+this.height-hitboxesSize/2,hitboxesSize,hitboxesSize);
    }
  }
  update(){
      this.x-=gamSpeed;
  }
  collide(p){
    //console.log((p.x+p.size/2) + " - "+this.x +" - "+(p.x+p.size/2)+" - "+(this.x+this.width)+" | "+floor(p.y)+" - "+this.height+" - "+this.topY);
    if((p.x>=this.x &&p.x<=this.x+this.width)|| (p.x+p.size>=this.x && p.x+p.size<=this.x+this.width)||(p.x+p.size/2>=this.x&&p.x+p.size/2<=this.x+this.width)){
      if(this.isTop){
        if(p.y<=this.topY+this.height){
          //console.log("trigTop");
          return true;
        }
      }else{
        if(p.y+p.height>=this.topY){
          //console.log("trigBot");
          return true;
        }
      }
      return false;
    }
  }
  offscreen(){
    if(this.x+this.width<0){
      return true;
    }
    return false;
  }
  getX(){ //Check if used
    return this.x;
  }
  setX(x){
    this.x=x;
  }
}
