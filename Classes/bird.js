class Bird{
  constructor(x,y,img,index){
    this.x=x;
    this.y=y;
    this.velY=0;
    this.velX=gamSpeed;
    //Use sprite
    /*loadPixels();
    this.img=img;
    this.size=img.width;
    this.height=img.height;*/

    this.height=30;
    this.size=30;
    this.midHeight=this.height/2;
    this.midSize=this.size/2;
    this.alive=true;
    this.timeScore=0;
    this.score=0;
    this.index = index;
    this.interScore=0;

  }


  show(isBest = false){
    //Use sprite
    //image(this.img, this.x,this.y);
    strokeWeight(1);
    stroke(0)

    //Represent birds as rectangles
    if(isBest){
      fill('red');
    }else{
      fill('white');
    }
    rect(this.x,this.y, this.size,this.height);

    //Hitbox visualizer
    if(visualizeHitboxes){
      fill(0);
      rect(this.x-hitboxesSize/2,this.y-hitboxesSize/2, hitboxesSize,hitboxesSize);
      rect(this.x+this.size-hitboxesSize/2,this.y-hitboxesSize/2, hitboxesSize,hitboxesSize);
      rect(this.x+this.size/2-hitboxesSize/2,this.y-hitboxesSize/2, hitboxesSize,hitboxesSize);
      rect(this.x+this.size/2-hitboxesSize/2,this.y+this.height-hitboxesSize/2, hitboxesSize,hitboxesSize);
      rect(this.x+this.size-hitboxesSize/2,this.y+this.height-hitboxesSize/2, hitboxesSize,hitboxesSize);
      rect(this.x-hitboxesSize/2,this.y+this.height-hitboxesSize/2, hitboxesSize,hitboxesSize);
    }

    //Sight visualizer
    if(visualizeSights){
      line(this.x+this.size/2,this.y+this.height/2,(this.closest().getX()+this.closest().bottomPipe.width),(this.closest().topPipe.topY+this.closest().topPipe.height));
      line(this.x+this.size/2,this.y+this.height/2,(this.closest().getX()+this.closest().bottomPipe.width),this.closest().bottomPipe.topY);
      line(this.x+this.size/2,this.y+this.height/2,this.closest().getX(),(this.closest().topPipe.topY+this.closest().topPipe.height));
      line(this.x+this.size/2,this.y+this.height/2,this.closest().getX(),this.closest().bottomPipe.topY);
    }

  }
  update(){
    if(this.alive){
      if(pipePair.point(this) || pipePair2.point(this)){
        this.score++;
      }
      if(pipePair.halfPoint(this) || pipePair2.halfPoint(this)){
        this.interScore++;
      }
      this.timeScore++;
      if(this.velY<7.5){
        this.velY+=gravity;
      }
      this.y+=this.velY;
      if(pipePair.collide(this) || ground.collide(this) || pipePair2.collide(this)){
        this.die();
      }
      /*if(this.offscreen()){
        this.die();
      }*/
    }else{
      if(canvas.height-this.y>this.size/2){
        this.velY+=gravity;
        this.y+=this.velY;
      }
    }
  }
  offscreen(){
    if(this.y<0){
      return true;
    }
    return false;
  }
  flap(){
    if(this.alive){
      this.velY=-6;//-6
      this.velY*=0.9;

      this.timeScore--;
    }
  }
  die(){
    this.alive=false;
  }

  inputss(){
    let input = [];

    input[0]=int(dist(this.x+this.size/2,this.y+this.height/2,(this.closest().getX()+this.closest().bottomPipe.width),(this.closest().topPipe.topY+this.closest().topPipe.height)));
    input[1]=int(dist(this.x+this.size/2,this.y+this.height/2,(this.closest().getX()+this.closest().bottomPipe.width),this.closest().bottomPipe.topY));
    input[2]=(this.y+this.height/2)-(this.closest().topPipe.topY+this.closest().topPipe.height);
    input[3]=this.closest().bottomPipe.topY-(this.y+this.height/2);
    /*
    input[4]=this.y;
    input[5]=this.closest().getX()-this.x;
    input[6]=int(dist(this.x+this.size/2,this.y+this.height/2,this.closest().getX(),(this.closest().topPipe.topY+this.closest().topPipe.height)));
    input[7]=int(dist(this.x+this.size/2,this.y+this.height/2,this.closest().getX(),this.closest().bottomPipe.topY));
    */

    return input;
  }
  closest(){
    if(pipePair.getX()<pipePair2.getX()){
      if(pipePair.getX()+(pipePair.bottomPipe.width)-this.x>0){
        return pipePair;
      }else{
        return pipePair2;
      }
    }else{
      if(pipePair2.getX()+(pipePair2.bottomPipe.width)-this.x>0){
        return pipePair2;
      }else{
        return pipePair;
      }
    }
  }
}
