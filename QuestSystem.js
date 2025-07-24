// js/systems/QuestSystem.js
class QuestSystem {
  constructor(game) {
    this.game = game;
    this.state = {
      activeQuests: [],
      completedQuests: [],
      isPanelOpen: false
    };
    
    this.quests = [
      {
        id: 1,
        title: "新手渔夫",
        description: "收集3条鱼",
        requirements: { 5: 3 },
        reward: { gold: 15, items: [] },
        isCompleted: false
      },
      {
        id: 2,
        title: "农夫小试",
        description: "收集5根胡萝卜",
        requirements: { 102: 5 },
        reward: { gold: 20, items: [{ id: 3, count: 5 }] },
        isCompleted: false
      }
    ];
    
    this.initUI();
    this.setupEventListeners();
  }

  initUI() {
    this.panel = document.getElementById('quest-panel');
    this.closeButton = document.getElementById('close-quest');
    this.questList = document.getElementById('quest-list');
    
    if (!this.panel || !this.closeButton || !this.questList) {
      console.error('Quest system UI elements missing');
      return;
    }
    
    this.closeButton.addEventListener('click', () => this.togglePanel(false));
  }

  setupEventListeners() {
    this.game.events.on('inventory:changed', () => this.checkQuestProgress());
    
    document.getElementById('quest-btn').addEventListener('click', () => {
      this.togglePanel();
      this.renderQuests();
    });
  }

  togglePanel(forceState) {
    this.state.isPanelOpen = forceState !== undefined ? forceState : !this.state.isPanelOpen;
    this.panel.classList.toggle('hidden', !this.state.isPanelOpen);
    
    if (this.state.isPanelOpen) {
      this.renderQuests();
    }
  }

  renderQuests() {
    this.questList.innerHTML = '';
    
    this.quests.forEach(quest => {
      const questElement = document.createElement('div');
      questElement.className = `quest-item ${quest.isCompleted ? 'completed' : ''}`;
      
      const progress = this.getQuestProgress(quest);
      
      questElement.innerHTML = `
        <h3>${quest.title}</h3>
        <p>${quest.description}</p>
        <div class="quest-progress">
          ${this.renderRequirements(quest, progress)}
        </div>
        ${quest.isCompleted ? 
          '<button class="claim-btn" data-quest-id="${quest.id}">领取奖励</button>' : 
          '<div class="progress-bar"><span style="width: ${progress.percent}%"></span></div>'}
      `;
      
      this.questList.appendChild(questElement);
    });
    
    document.querySelectorAll('.claim-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.claimReward(parseInt(e.target.dataset.questId));
      });
    });
  }

  renderRequirements(quest, progress) {
    return Object.entries(quest.requirements)
      .map(([itemId, required]) => {
        const item = this.game.config.items.find(i => i.id === parseInt(itemId)) || 
                    this.game.config.crops.find(i => i.id === parseInt(itemId));
        const current = progress.items[itemId] || 0;
        
        return `
          <div class="requirement">
            <img src="${item.image}" alt="${item.name}" class="item-icon">
            <span>${item.name}: ${current}/${required}</span>
          </div>
        `;
      })
      .join('');
  }

  getQuestProgress(quest) {
    const progress = {
      percent: 0,
      items: {},
      isComplete: false
    };
    
    let totalComplete = 0;
    let totalRequirements = 0;
    
    for (const [itemId, required] of Object.entries(quest.requirements)) {
      const itemCount = this.game.systems.inventory.state.items[itemId]?.count || 0;
      const completed = Math.min(itemCount, required);
      
      progress.items[itemId] = completed;
      totalComplete += completed;
      totalRequirements += required;
    }
    
    progress.percent = Math.floor((totalComplete / totalRequirements) * 100);
    progress.isComplete = totalComplete >= totalRequirements;
    
    return progress;
  }

  checkQuestProgress() {
    let anyQuestCompleted = false;
    
    this.quests.forEach(quest => {
      if (!quest.isCompleted) {
        const progress = this.getQuestProgress(quest);
        if (progress.isComplete) {
          quest.isCompleted = true;
          anyQuestCompleted = true;
          this.game.showMessage(`任务 "${quest.title}" 已完成!`);
        }
      }
    });
    
    if (anyQuestCompleted) {
      this.renderQuests();
    }
  }

  claimReward(questId) {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest || !quest.isCompleted) return;
    
    if (quest.reward.gold > 0) {
      this.game.systems.inventory.addItem(999, quest.reward.gold, {
        id: 999,
        name: "金币",
        image: "assets/items/coin.png",
        price: 1,
        description: "通用货币"
      });
    }
    
    quest.reward.items.forEach(rewardItem => {
      const item = this.game.config.items.find(i => i.id === rewardItem.id) || 
                  this.game.config.crops.find(i => i.id === rewardItem.id);
      
      if (item) {
        this.game.systems.inventory.addItem(item.id, rewardItem.count, item);
      }
    });
    
    quest.isClaimed = true;
    this.state.completedQuests.push(quest);
    this.state.activeQuests = this.state.activeQuests.filter(q => q.id !== questId);
    
    this.game.showMessage(`已领取任务 "${quest.title}" 的奖励!`);
    this.renderQuests();
  }
}