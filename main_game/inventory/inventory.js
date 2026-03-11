// 初始化背包
if (!localStorage.getItem("RuiXue_Inventory")) {
  localStorage.setItem("RuiXue_Inventory", JSON.stringify({ inventory: {} }));
}

// 读取背包数据
function getInventory() {
  return JSON.parse(localStorage.getItem("RuiXue_Inventory")).inventory;
}

// 保存背包数据
function saveInventory(inv) {
  localStorage.setItem("RuiXue_Inventory", JSON.stringify({ inventory: inv }));
}

// 添加物品
function addItem(name, count = 1) {
  let inv = getInventory();
  inv[name] = (inv[name] || 0) + count;
  saveInventory(inv);
  renderInventory();
}

// 清空背包（比如玩家死亡时调用）
function clearInventory() {
  saveInventory({});
  renderInventory();
}

// 渲染背包界面
function renderInventory() {
  const inv = getInventory();
  const list = document.querySelector("#inventory ul");
  list.innerHTML = "";

  const keys = Object.keys(inv);
  if (keys.length === 0) {
    list.innerHTML = `<li class="empty">空空如也</li>`;
  } else {
    keys.forEach(item => {
      let li = document.createElement("li");
      li.textContent = `${item} × ${inv[item]}`;
      list.appendChild(li);
    });
  }
}

// 绑定键盘事件：B键开关背包
document.addEventListener("keydown", (e) => {
  if (e.key === "b" || e.key === "B") {
    const invUI = document.getElementById("inventory");
    if (invUI.style.display === "flex") {
      invUI.style.display = "none";
    } else {
      renderInventory();
      invUI.style.display = "flex";
    }
  }
});

// ===== 示例：在代码其他地方调用这些函数 =====
// addItem("宝石", 1);
// addItem("钥匙", 1);
// clearInventory();  // 玩家死亡时调用
