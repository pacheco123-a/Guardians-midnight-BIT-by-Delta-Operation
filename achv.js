window.onload = () => {
    let file = window.localStorage.getItem("gameAchievements");
    if (file) {
        file = JSON.parse(file);

        // 创建一个以成就ID为键的对象，方便查找
        let achievementsMap = {};
        file.forEach(achievement => {
            achievementsMap[achievement.id] = achievement;
        });

        var achievementItems = document.querySelectorAll(".item");

        for (let i = 0; i < achievementItems.length; i++) {
            let achievementItem = achievementItems[i];
            let stateElement = achievementItem.querySelector(".achievement-state");

            let h1Element = achievementItem.querySelector(".frame .box.front h1");
            let h1Text = h1Element.innerText;

            // 根据成就名称找到对应的成就ID
            let achievementId = getAchievementIdByName(h1Text);
            if (achievementId && achievementsMap[achievementId]) {
                stateElement.innerHTML = achievementsMap[achievementId].unlocked ? "已达成" : "未达成";
            } else {
                stateElement.innerHTML = "未达成";
            }
        }
    }
    
    // === 根据成就名称获取成就ID ===
    function getAchievementIdByName(name) {
        const nameToIdMap = {
            "拒绝躺平": "no_layoff",            
            "光明使者": "flashlight_finder",  
            "探索者": "explorer",
            "福尔摩斯": "holmes",
            "图书馆常客": "library_visitor",
            "完美胜利": "perfect_victory",
            "背水一战": "final_battle",
            "暗夜行路": "dark_path",

        };
        return nameToIdMap[name];
    }

     // === 模态框显示成就条件 ===
    const achievementConditions = {
      // "校园守护者": "合成宝石成功驱赶丧尸病毒",
      "拒绝躺平": "走出宿舍楼",
      "光明使者": "找到手电筒",
      "探索者": "进入4个不同的建筑物",
      "福尔摩斯": "发现重要线索",
      // "结局收藏家": "达成所有不同结局。",
      // "彩蛋猎人": "找到所有隐藏彩蛋。",
      // "秘密收藏家": "收集全部隐藏物品。",
      "图书馆常客": "访问图书馆达到两次",
      // "夜行者": "暗夜行路通关",
      // "速通大师": "快速通关游戏。",
      "完美胜利": "不被感染的情况下胜利",
      "背水一战": "在被感染后25分钟内胜利",
      "暗夜行路": "无手电筒胜利"
    };

    const modal = document.getElementById("achievement-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalClose = document.querySelector(".modal .close");

    document.querySelectorAll(".item").forEach(item => {
      item.addEventListener("click", () => {
        const title = item.querySelector(".frame .box.front h1").innerText;
        modalTitle.innerText = title;
        modalDesc.innerText = achievementConditions[title] || "暂无说明";
        modal.style.display = "flex";
      });
    });

    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
};