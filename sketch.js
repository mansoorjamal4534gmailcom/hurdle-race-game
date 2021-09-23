var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, hurdle1, hurdle4, hurdle2, hurdle3, hurdle5, hurdle6;

var score=0;

var gameOver, restart;

var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running =   loadAnimation("boy1.png","newboy2.png","newboy3.png");
  trex_collided = loadAnimation("boycollided.png");
  
  //groundImage = loadImage("ground.png");
  //groundImage = loadImage("groundbig-1.png");
  //groundImage = loadImage("race.png");
  groundImage = loadImage("groundhuge.png");
  
  //groundImage.resize(2377,12);
  
  cloudImage = loadImage("clouds3-removebg-preview.png");
  
  hurdle1 = loadImage("hurdle1.png");
  hurdle2 = loadImage("hurdle2.png");
  hurdle3 = loadImage("hurdle3.png");
  hurdle4 = loadImage("hurdle4.png");
  hurdle5 = loadImage("hurdle5.png");
  hurdle6 = loadImage("hurdle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
   jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 
  ground = createSprite(width-100,height-20,width,10);
  ground.addImage("ground",groundImage);
  //ground.scale=0.5
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
   
  trex = createSprite(50,height-70,20,50);  
  trex.setCollider("rectangle",0,0,20,50)
 // trex.debug=true;
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.75;
  
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2 +40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("lightblue");
  console.log(trex.y)
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length>0 || keyDown("space")) && trex.y >= 150) {
      trex.velocityY = -14;
      touches=[];
      jumpSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || mousePressedOver(restart)) {
      reset();
      touches=[];
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width,height-80,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.25;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-35,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(hurdle1);
              break;
      case 2: obstacle.addImage(hurdle2);
              break;
      case 3: obstacle.addImage(hurdle3);
              break;
      case 4: obstacle.addImage(hurdle4);
              break;
      case 5: obstacle.addImage(hurdle5);
              break;
      case 6: obstacle.addImage(hurdle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.25;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}