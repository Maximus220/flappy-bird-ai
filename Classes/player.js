class Player{
  constructor(x,y,img){
    this.x=x;
    this.y=floor(y);
    this.img=img;
    this.velY=0;
    this.velX=gamSpeed;
    loadPixels();
    this.size=img.width;
    this.height=img.height;
    this.alive=true;
    this.timeScore=0;
    this.score=0;

    //this.fallRotation=0;
  }
  show(){
    /*noStroke();
    if(this.alive){
      fill(255,255,0);
    }else{
      fill(255,0,0);
    }
    ellipse(this.x,this.y,this.size);*/
    /*push();
    translate(this.x-this.size/2-8+this.img.width/2,this.y-this.size/2+this.img.height/2);
    if(this.velY<0){
      rotate(-PI/6);
      this.fallRotation = -PI/6;
    }else if(this.velY <=5){
      this.fallRotation += PI/8.0;
      this.fallRotation = constrain(this.fallRotation, -PI/6,PI/2);
      rotate(this.fallRotation);
    }else{
      rotate(PI/2);
    }*/
    /*rect(this.x,this.y, 5,5);
    rect(this.x+this.size,this.y, 5,5);
    rect(this.x+this.size/2,this.y, 5,5);

    rect(this.x+this.size/2,this.y+this.height, 5,5);
    rect(this.x+this.size,this.y+this.height, 5,5);
    rect(this.x,this.y+this.height, 5,5);
    push();
    translate(this.width/2-200,this.height/2);
    rotate(-PI/6);*/
    image(this.img, this.x,this.y);

    rect(this.x,this.y, 5,5);
    rect(this.x+this.size,this.y, 5,5);
    rect(this.x+this.size/2,this.y, 5,5);

    rect(this.x+this.size/2,this.y+this.height, 5,5);
    rect(this.x+this.size,this.y+this.height, 5,5);
    rect(this.x,this.y+this.height, 5,5);

    //pop();
  }
  update(){
    if(this.alive){
      //console.log(this.velY);
      if(pipePair.point(this) || pipePair2.point(this)){
        this.score++;
        //console.log("got a point, be proud of me dad");
      }
      this.timeScore++;
      if(this.velY<7.5){
        this.velY+=gravity;
      }
      this.y+=this.velY;
      if(pipePair.collide(this) || ground.collide(this) || pipePair2.collide(this)){
        this.die();
      }
    }else{
      if(canvas.height-this.y>this.size/2){
        this.velY+=gravity;
        this.y+=this.velY;
      }
    }
  }
  flap(){
    if(this.alive){
      this.velY=-6;
      this.velY*=0.9;
    }
  }
  die(){
    this.alive=false;
    console.log("Final time score : " +this.timeScore + " - Final global score : "+this.score);
  }
}
