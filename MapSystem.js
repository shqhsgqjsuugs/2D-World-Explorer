// js/systems/MapSystem.js
class PerlinNoise {
  constructor(seed) {
    this.seed = seed;
  }
  
  get(x, y) {
    const s = x + y * 10000 + this.seed;
    return (Math.sin(s) * 43758.5453123) % 1;
  }
}

class MapSystem {
  constructor(game) {
    this.game = game;
    this.container = document.getElementById('map-container');
    this.renderedTiles = new Set();
    this.noise = new PerlinNoise(Math.random() * 1000);
    
    game.events.on('player:move', (pos) => {
      this.updateVisibleTiles(pos.x, pos.y);
    });
  }
  
  updateVisibleTiles(playerX, playerY) {
    const tileSize = this.game.config.game.tileSize;
    const px = Math.floor(playerX / tileSize);
    const py = Math.floor(playerY / tileSize);
    
    this.update(px, py);
  }
  
  update(px, py) {
    const tileSize = this.game.config.game.tileSize;
    const dist = this.game.config.game.renderDistance;
    
    const startX = px - dist;
    const endX = px + dist;
    const startY = py - dist;
    const endY = py + dist;
    
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const key = `${x},${y}`;
        if (this.renderedTiles.has(key)) continue;
        
        const noiseVal = (this.noise.get(x * 0.1, y * 0.1) + 1) / 2;
        let type = 'grass';
        if (noiseVal > 0.6) type = 'water';
        if (noiseVal > 0.8) type = 'forest';
        
        this.createTile(x, y, type);
        this.renderedTiles.add(key);
      }
    }
  }
  
  createTile(x, y, type) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.left = `${x * this.game.config.game.tileSize}px`;
    tile.style.top = `${y * this.game.config.game.tileSize}px`;
    tile.style.backgroundImage = `url('${this.game.config.terrain[type].image}')`;
    tile.dataset.type = type;
    this.container.appendChild(tile);
  }
}