class Play{
  createWorld() {
    this.walls = this.physics.add.staticGroup()

    this.walls.create(10, 170, 'wallV')
    this.walls.create(490, 170, 'wallV')
    
    this.walls.create(50, 10, 'wallH')
    this.walls.create(420, 10, 'wallH')
    this.walls.create(50, 330, 'wallH')
    this.walls.create(420, 330, 'wallH')

    this.walls.create(0, 170, 'wallH')
    this.walls.create(450, 170, 'wallH')
    this.walls.create(250, 90, 'wallH')
    this.walls.create(250, 250, 'wallH')
  }

  create (){
    this.jumpSound = this.sound.add('jump')
    this.coinSound = this.sound.add('coin')
    this.deadSound = this.sound.add('dead')
    // this.music = this.load.audio('music')
    // this.music.loop = true;
    // this.music.play()

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {frames: [1,2]}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {frames: [3,4]}),
      frameRate: 8,
      repeat: -1
    })

    this.player = this.physics.add.sprite(250, 170, 'player')
    this.player.body.gravity.y = 500
    
    this.coin = this.physics.add.sprite(60, 130, 'coin')

    this.scoreLabel = this.add.text(30, 25, 'score: 0', {
      font: '18px arial', fill: '#fff'
    })

    this.enemies = this.physics.add.group()

    this.time.addEvent({
      delay: 1000,
      callback: () => this.addEnemy(),
      loop: true,
    })


    this.score = 0;

    this.arrow = this.input.keyboard.createCursorKeys();
    this.createWorld()
  }

  movePlayer() {  
    if(this.arrow.left.isDown){
      this.player.body.velocity.x = -200;
      this.player.anims.play('left', true)
    }
    else if(this.arrow.right.isDown) {
      this.player.body.velocity.x = 200;
      this.player.anims.play('right', true)
    }
    else{
      this.player.body.velocity.x = 0;
      this.player.setFrame(0)
    }

    if(this.arrow.up.isDown && this.player.body.onFloor()){
      this.player.body.velocity.y = -320;
      this.jumpSound.play()
    }

    if(this.arrow.space.isDown && this.player.body.onFloor()){
      this.player.body.velocity.y = -320;
      this.jumpSound.play()
    }
  }


  addEnemy () {
    let enemy = this.enemies.create(250, 30, 'enemy')
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = Phaser.Math.RND.pick([-100, 100])
    enemy.body.bounce.x = 1;

    this.time.addEvent({
      delay: 10000,
      callback: () => enemy.destroy()
    })
  }

  playerDie(){
    if(this.physics.overlap(this.player, this.enemies)){
      this.playerDie()
    }

    if(this.player.y > 340 || this.player.y < 0){
      this.playerDie()
    }

    if(this.physics.overlap(this.player, this.coin)){
      this.takeCoin()
    }
  }

  update() {
    this.physics.collide(this.player, this.walls)  
    this.physics.collide(this.enemies, this.walls)

    if(!this.player.active){
      return
    }
    this.movePlayer()

    if(this.physics.overlap(this.player, this.enemies)){
      this.playerDie()
      this.deadSound.play()
    }

    if(this.player.y > 340 || this.player.y < 0){
      this.playerDie()
      this.deadSound.play()
    }

    if(this.physics.overlap(this.player, this.coin)){
      this.takeCoin()
      this.coinSound.play()
    }
  
  }

  updateCoinPosition(){
    let positions = [
      {x: 140, y:60},
      {x: 360, y:60},
      {x: 60, y:60},
      {x: 440, y:140},
      {x: 130, y:300},
      {x: 370, y:300},
    ]

    positions = positions.filter(coin => coin.x !== this.coin.x)

    let newPosition = Phaser.Math.RND.pick(positions)

    this.coin.setPosition(newPosition.x, newPosition.y)
  }

  takeCoin() {
    this.updateCoinPosition()

    this.score += 5
    this.scoreLabel.setText('score:' + this.score)
  }

  playerDie() {
    this.writeScore(this.score)
    this.scene.start('menu', {score: this.score})
  }

  writeScore (score){
    const scoreBoard = document.getElementById('score_board')
    if(scoreBoard.children.length > 4 ) scoreBoard.removeChild(scoreBoard.children[scoreBoard.children.length - 1])
    const $score = document.createElement('p')
    $score.textContent = score
    scoreBoard.prepend($score)
  }
}