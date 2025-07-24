// js/core/GameEngine.js
class GameEngine {
  constructor(config) {
    this.config = config;
    this.systems = {};
    this.state = {
      isPaused: false,
      gameTime: 0,
      lastUpdate: 0
    };
    
    // 初始化事件系统
    this.events = new EventSystem();
    
    // 初始化核心系统
    this.initCoreSystems();
    
    // 启动游戏
    this.start();
  }
  
  // 确保registerSystem方法正确定义
  registerSystem(name, system) {
    this.systems[name] = system;
    system.game = this; // 将游戏实例传递给系统
    return this; // 支持链式调用
  }
  
  initCoreSystems() {
    // 注册地图系统
    this.registerSystem('map', new MapSystem(this));
    // 注册任务系统
    this.registerSystem('quests', new QuestSystem(this));
    // 注册钓鱼系统
    this.registerSystem('fishing', new FishingSystem(this));
    // 注册玩家
    this.player = new Player(this);
    
    // 初始化UI事件
    this.initUIEvents();
    // 注册背包系统
    this.registerSystem('inventory', new InventorySystem(this));
  }
  
  initUIEvents() {
    // 背包按钮
    document.getElementById('inventory-btn').addEventListener('click', () => {
      this.getSystem('inventory').toggle();
    });
    
    // 任务按钮
    document.getElementById('quest-btn').addEventListener('click', () => {
      this.getSystem('quests').togglePanel();
    });
  }
  
  getSystem(name) {
    return this.systems[name];
  }
  
  start() {
    this.lastUpdate = performance.now();
    this.gameLoop();
  }
  
  gameLoop() {
    const now = performance.now();
    const deltaTime = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;
    
    if (!this.state.isPaused) {
      this.update(deltaTime);
      this.render();
    }
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  update(deltaTime) {
    this.state.gameTime += deltaTime;
    
    // 更新所有系统
    Object.values(this.systems).forEach(system => {
      if (system.update) system.update(deltaTime);
    });
    
    // 更新玩家
    if (this.player && this.player.update) {
      this.player.update(deltaTime);
    }
  }
  
  render() {
    // 渲染所有系统
    Object.values(this.systems).forEach(system => {
      if (system.render) system.render();
    });
  }
  
  showMessage(text, duration = 3000) {
    const msgElement = document.createElement('div');
    msgElement.className = 'game-message';
    msgElement.textContent = text;
    
    const container = document.getElementById('message-container');
    container.appendChild(msgElement);
    
    setTimeout(() => {
      msgElement.remove();
    }, duration);
  }
}