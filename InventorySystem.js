// js/systems/InventorySystem.js
class InventorySystem {
  constructor(game) {
    this.game = game;
    this.state = {
      items: {},
      isOpen: false,
      activeCategory: 'all'
    };
    this.config = {
      maxSlots: 24
    };
    
    this.initUI();
  }
  
  initUI() {
    this.panel = document.getElementById('inventory-panel');
    this.closeButton = document.getElementById('close-inventory');
    this.tabButtons = document.querySelectorAll('.inventory-tabs button');
    
    if (!this.panel || !this.closeButton) {
      console.error('Inventory UI elements missing');
      return;
    }
    
    this.closeButton.addEventListener('click', () => this.toggle(false));
    
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeCategory = btn.dataset.category;
        this.updateUI();
        this.tabButtons.forEach(b => b.classList.remove('tab-active'));
        btn.classList.add('tab-active');
      });
    });
  }
  
  addItem(itemId, quantity = 1, itemData) {
    if (!this.state.items[itemId]) {
      this.state.items[itemId] = {
        data: itemData,
        count: 0
      };
    }
    
    this.state.items[itemId].count += quantity;
    this.updateUI();
    return true;
  }
  
  removeItem(itemId, quantity = 1) {
    if (!this.state.items[itemId] || this.state.items[itemId].count < quantity) {
      return false;
    }
    
    this.state.items[itemId].count -= quantity;
    
    if (this.state.items[itemId].count <= 0) {
      delete this.state.items[itemId];
    }
    
    this.updateUI();
    return true;
  }
  
  updateUI() {
    const panelContent = this.panel.querySelector('.panel-content');
    if (!panelContent) return;
    
    panelContent.innerHTML = `
      <div class="inventory-tabs">
        <button class="tab-active" data-category="all">全部</button>
        <button data-category="items">物品</button>
        <button data-category="crops">作物</button>
      </div>
      <table id="inventory-table">
        <thead>
          <tr>
            <th>物品</th>
            <th>数量</th>
            <th>价格</th>
            <th>描述</th>
          </tr>
        </thead>
        <tbody id="inventory-items"></tbody>
      </table>
    `;
    
    const tbody = panelContent.querySelector('#inventory-items');
    Object.values(this.state.items).forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <img src="${item.data.image}" alt="${item.data.name}" class="inventory-item-image">
          ${item.data.name}
        </td>
        <td>${item.count}</td>
        <td>${item.data.price || '-'}</td>
        <td>${item.data.description || "无描述"}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  toggle(forceState) {
    this.state.isOpen = forceState !== undefined ? forceState : !this.state.isOpen;
    this.panel.classList.toggle('hidden', !this.state.isOpen);
    
    if (this.state.isOpen) {
      this.updateUI();
    }
  }
}