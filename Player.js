// js/entities/Player.js
class Player {
  constructor(game) {
    this.game = game;
    this.config = game.config.player;
    this.controls = game.config.controls;
    
    this.state = {
      x: this.config.initialX,
      y: this.config.initialY,
      direction: 'down',
      isMoving: false,
      keys: {
        up: false,
        down: false,
        left: false,
        right: false
      }
    };
    
    this.initElement();
    this.initControls();
  }
  
  initElement() {
    this.element = document.getElementById('player');
    this.element.style.width = `${this.config.width}px`;
    this.element.style.height = `${this.config.height}px`;
    this.element.style.backgroundImage = `url('${this.config.sprite}')`;
    
    this.updatePosition();
  }
  
  initControls() {
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      
      if (this.controls.moveUp.includes(key)) this.state.keys.up = true;
      if (this.controls.moveDown.includes(key)) this.state.keys.down = true;
      if (this.controls.moveLeft.includes(key)) this.state.keys.left = true;
      if (this.controls.moveRight.includes(key)) this.state.keys.right = true;
      
      // 交互键
      if (key === this.controls.interact.toLowerCase()) {
        this.game.events.emit('player:interact');
      }
      
      // 钓鱼键
      if (key === this.controls.fishing.toLowerCase()) {
        this.game.events.emit('player:fishing');
      }
    });
    
    document.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      
      if (this.controls.moveUp.includes(key)) this.state.keys.up = false;
      if (this.controls.moveDown.includes(key)) this.state.keys.down = false;
      if (this.controls.moveLeft.includes(key)) this.state.keys.left = false;
      if (this.controls.moveRight.includes(key)) this.state.keys.right = false;
    });
  }
  
  update(deltaTime) {
    const speed = this.game.config.game.playerSpeed;
    
    if (this.state.keys.up) {
      this.state.y -= speed;
      this.state.direction = 'up';
    }
    if (this.state.keys.down) {
      this.state.y += speed;
      this.state.direction = 'down';
    }
    if (this.state.keys.left) {
      this.state.x -= speed;
      this.state.direction = 'left';
    }
    if (this.state.keys.right) {
      this.state.x += speed;
      this.state.direction = 'right';
    }
    
    // 边界检查
    this.state.x = Math.max(0, Math.min(this.game.config.game.mapWidth, this.state.x));
    this.state.y = Math.max(0, Math.min(this.game.config.game.mapHeight, this.state.y));
    
    this.updatePosition();
  }
  
  updatePosition() {
    const cameraX = this.state.x - this.game.config.game.viewportWidth / 2;
    const cameraY = this.state.y - this.game.config.game.viewportHeight / 2;
    
    // 更新玩家元素位置
    this.element.style.left = `${this.state.x - cameraX}px`;
    this.element.style.top = `${this.state.y - cameraY}px`;
    
    // 更新地图容器位置
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.transform = `translate(${-cameraX}px, ${-cameraY}px)`;
    
    // 更新调试信息
    const debugInfo = document.getElementById('debug-info');
    debugInfo.textContent = `位置: (${Math.floor(this.state.x)}, ${Math.floor(this.state.y)})`;
    
    // 通知地图系统更新
    this.game.events.emit('player:moved', {
      x: this.state.x,
      y: this.state.y
    });
  }
}