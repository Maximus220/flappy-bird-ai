class Ground{
  constructor(){
    this.speed=gamSpeed;
    this.x=0;
    this.y=canvas.height-5;
  }
  show(){
    fill(0,0,0);
    rect(this.x,this.y,canvas.width,5);
  }
  update(){
  }

  collide(p){
    if(p.y+p.size/2>this.y){
      return true;
    }
    return false;
  }
}
