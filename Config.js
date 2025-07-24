// 移除 export 重生之我在写注释
// Config.js
const Config = {
  // 基础游戏配置
  game: {
    tileSize: 64,
    mapWidth: 10000,
    mapHeight: 10000,
    viewportWidth: 800,
    viewportHeight: 600,
    playerSpeed: 5,
    renderDistance: 5
  },

  // 地形配置
  terrain: {
    grass: { 
      image: 'assets/terrain/grass.png',
      threshold: 0.3,
      walkable: true 
    },
    water: { 
      image: 'assets/terrain/water.png',
      threshold: 0.6,
      walkable: false 
    },
    forest: { 
      image: 'assets/terrain/forest.png',
      threshold: 0.8,
      walkable: true 
    }
  },

  // 玩家配置
  player: {
    sprite: 'assets/terrain/character.png',
    width: 64,
    height: 64,
    initialX: 5000,
    initialY: 5000
  },

  // 控制键位
  controls: {
    moveUp: ['w', 'ArrowUp'],
    moveDown: ['s', 'ArrowDown'],
    moveLeft: ['a', 'ArrowLeft'],
    moveRight: ['d', 'ArrowRight'],
    openInventory: 'b',
    interact: 'r',
    fishing: 'f'
  },
  
  // 钓鱼系统配置
  fishing: {
    triggerKey: 'f',
    controlKey: 'i',
    fishImage: 'assets/items/fish.png',
    gameDuration: 30, // 秒
    difficulty: {
      fishSpeed: 1.2,
      sliderSpeed: 2.5,
      gravity: 0.4,
      progressIncrement: 6,
      progressDecrement: 2,
      collisionRange: 15
    }
  },

  // 物品配置
  items: [
    { id: 1, name: "苹果", price: 5, description: "新鲜的红苹果，恢复10点生命值", image: "assets/items/apple.png" },
    { id: 2, name: "药水", price: 20, description: "治疗药水，恢复50点生命值", image: "assets/items/potion.png" },
    { id: 3, name: "木材", price: 2, description: "可用于建造或制作物品", image: "assets/items/wood.png" },
    { id: 4, name: "石头", price: 3, description: "坚固的石头，可用于建造", image: "assets/items/stone.png" },
    { id: 5, name: "鱼", price: 15, description: "新鲜的鱼，可以出售或烹饪", image: "assets/items/fish.png" },
    { id: 999, name: "金币", price: 1, description: "通用货币", image: "assets/items/coin.png" }
  ],
  
  crops: [
    { id: 101, name: "小麦", price: 8, description: "新鲜收获的小麦", image: "assets/items/wheat.png" },
    { id: 102, name: "胡萝卜", price: 12, description: "新鲜的胡萝卜", image: "assets/items/carrot.png" },
    { id: 103, name: "土豆", price: 10, description: "新鲜的土豆", image: "assets/items/potato.png" },
    { id: 104, name: "玉米", price: 15, description: "金黄的玉米", image: "assets/items/corn.png" }
  ]
};