async function loadItems() {
  const res = await fetch('data/items.json');
  const items = await res.json();
  const container = document.getElementById('item-container');
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <h2>${item.name}</h2>
      <p>${item.description}</p>
      <select id="stat-${item.id}" onchange="updateValue('${item.id}')">
        ${item.stats.map(s => `<option value="${s.type}">${s.type}</option>`).join('')}
      </select>
      <div>Stacks: <button onclick="changeStack('${item.id}', -1)">-</button>
      <span id="stack-${item.id}">0</span>
      <button onclick="changeStack('${item.id}', 1)">+</button></div>
      <div id="value-${item.id}"></div>
    `;
    container.appendChild(card);

    // Initialize value on load
    updateValue(item.id);
  });
}

const stackCounts = {};

function changeStack(id, delta) {
  stackCounts[id] = (stackCounts[id] || 0) + delta;
  if (stackCounts[id] < 0) stackCounts[id] = 0;
  document.getElementById('stack-' + id).textContent = stackCounts[id];
  updateValue(id);
}

function updateValue(id) {
  fetch('data/items.json')
    .then(res => res.json())
    .then(items => {
      const item = items.find(i => i.id === id);
      const selectedStat = document.getElementById('stat-' + id).value;
      const stat = item.stats.find(s => s.type === selectedStat);
      const stacks = stackCounts[id] || 0;
      let value = 0;
      if (stat.scaling === 'linear') {
        value = stat.base * stacks;
      } else if (stat.scaling === 'hyperbolic') {
        value = stat.base * (1 - 1 / (1 + stacks));
      }
      document.getElementById('value-' + id).textContent = selectedStat + ': ' + value.toFixed(2);
    });
}

window.onload = loadItems;