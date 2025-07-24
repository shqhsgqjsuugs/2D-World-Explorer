// js/systems/FishingSystem.js
class FishingSystem {
  constructor(game) {
    this.game = game;
    this.config = game.config.fishing;
    this.state = {
      isFishing: false,
      fishY: 50,
      sliderY: 50,
      progress: 30
    };
    this.initUI();
    this.initEvents();
  }

  initUI() {
    if (!document.getElementById('fishing-game')) {
      const html = `
        <div id="fishing-game" class="fishing-game hidden">
          <h2>钓鱼小游戏</h2>
          <div class="fishing-progress">
            <div class="progress-bar" style="width: 30%"></div>
            <span class="progress-text">30%</span>
          </div>
          <div class="fishing-pond">
            <div class="fishing-rod"></div>
            <div class="fish"></div>
            <div class="slider"></div>
          </div>
          <div class="fishing-instructions">
            <p>按住 ${this.config.controlKey.toUpperCase()} 键让浮标上升，跟随鱼的移动！</p>
          </div>
        </div>
      `;
      document.getElementById('game-container').insertAdjacentHTML('beforeend', html);
    }
  }

  initEvents() {
    this.game.events.on('player:fishing', () => {
      if (this.canFish() && !this.state.isFishing) {
        this.startGame();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === this.config.controlKey && this.state.isFishing) {
        this.state.isRaising = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === this.config.controlKey) {
        this.state.isRaising = false;
      }
    });
  }

  canFish() {
    const tile = this.game.getSystem('map').getTileUnderPlayer();
    return tile?.type === 'water';
  }

  startGame() {
    this.state = {
      isFishing: true,
      fishY: 50,
      sliderY: 50,
      progress: 30,
      isRaising: false,
      lastUpdate: performance.now()
    };
    document.getElementById('fishing-game').classList.remove('hidden');
    this.gameLoop();
  }

  gameLoop() {
    if (!this.state.isFishing) return;

    const now = performance.now();
    const deltaTime = (now - this.state.lastUpdate) / 1000;
    this.state.lastUpdate = now;

    this.updateFishPosition(deltaTime);
    this.updateSliderPosition(deltaTime);
    this.updateProgress(deltaTime);
    this.updateUI();

    if (this.state.progress >= 100) {
      this.endGame(true);
    } else if (this.state.progress <= 0) {
      this.endGame(false);
    } else {
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  updateUI() {
    const gameElement = document.getElementById('fishing-game');
    if (gameElement) {
      gameElement.querySelector('.fish').style.top = `${this.state.fishY}%`;
      gameElement.querySelector('.slider').style.top = `${this.state.sliderY}%`;
      gameElement.querySelector('.progress-bar').style.width = `${this.state.progress}%`;
      gameElement.querySelector('.progress-text').textContent = `${Math.round(this.state.progress)}%`;
    }
  }

  endGame(success) {
    this.state.isFishing = false;
    document.getElementById('fishing-game').classList.add('hidden');

    if (success) {
      this.game.getSystem('inventory').addItem(5, 1);
      this.game.showMessage("钓鱼成功！获得了一条鱼");
    } else {
      this.game.showMessage("钓鱼失败...再试一次吧");
    }
  }
}