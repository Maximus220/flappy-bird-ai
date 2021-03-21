class PipePair{
  constructor(){
    this.min_Height_Top=floor(canvas.height/6);
    this.min_Height_Bot=floor(canvas.height/6);

    this.min_Space=175;
    this.max_Space=250;

    this.max_Height_Top=canvas.height-(this.min_Space+this.min_Height_Bot);
    this.max_Height_Bot=canvas.height-(this.min_Space+this.min_Height_Bot);


    this.space = randomB(this.min_Space,this.max_Space);
    this.rdmHeight = randomB(this.min_Height_Top,this.max_Height_Top);

    this.topPipe=new Pipe(true, canvas.height-(this.rdmHeight+this.space));
    this.bottomPipe=new Pipe(false, this.rdmHeight);


    this.pointGave=[];
    this.halfPointGave=[];
  }

  show(){
    this.topPipe.show();
    this.bottomPipe.show();
  }
  update(){
    this.topPipe.update();
    this.bottomPipe.update();
  }
  offscreen(){
    return this.topPipe.offscreen() && this.bottomPipe.offscreen();
  }
  collide(p){
    return this.topPipe.collide(p) || this.bottomPipe.collide(p);
  }
  getX(){
    return this.bottomPipe.getX();
  }
  point(p){
    if(p.x+p.size/*/2*/>this.getX()/*+this.bottomPipe.width/2*/){
      for(x=0;x<this.pointGave.length;x++){
        if(this.pointGave[x]==p.index){
          return false;
        }
      }
      this.pointGave.push(p.index);
      return true;
    }
    return false;
  }

  halfPoint(p){
    if(p.x+p.size/2>this.getX()+this.bottomPipe.width/2){
      for(x=0;x<this.halfPointGave.length;x++){
        if(this.halfPointGave[x]==p.index){
          return false;
        }
      }
      this.halfPointGave.push(p.index);
      return true;
    }
    return false;
  }

  setX(x){
    this.topPipe.setX(x);
    this.bottomPipe.setX(x);
  }
}
