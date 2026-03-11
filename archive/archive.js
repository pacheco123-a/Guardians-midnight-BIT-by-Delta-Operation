// 注意：以下代码已根据项目结构调整了重定向路径和依赖加载。

// 存档容器选择器
let archiveContainers = document.querySelectorAll(".glass");

// 显示黑屏过渡效果的函数
function showBlackout(callback) {
    const blackout = document.getElementById('blackout');
    blackout.style.opacity = 1; 
    blackout.style.pointerEvents = 'auto';
    setTimeout(callback, 1000); 
}

// 覆盖存档函数
function override(id) {
    // 检查 window.Progress 是否已定义，确保依赖已加载
    if (typeof window.Progress === 'undefined') {
        console.error("Progress class is not loaded.");
        return;
    }
    const currentUsername = window.localStorage.getItem("Sec-Sight-current-username");
    // 使用正确的存档键
    const saveFileKey = "Second_Sight_SaveFile_" + currentUsername + "_" + id;
    
    // 获取当前进度，并保存
    const progress = new Progress(id);
    const nowProgress = progress.nowProgress();
    window.localStorage.setItem(saveFileKey, nowProgress);
    
    // 显示黑屏并重定向到游戏主页
    showBlackout(() => {
        window.location.href = "../main_game/mygame.html";
    });
}

// 读档函数
function load(id) {
    // 检查 window.Progress 是否已定义
    if (typeof window.Progress === 'undefined') {
        console.error("Progress class is not loaded.");
        return;
    }
    const currentUsername = window.localStorage.getItem("Sec-Sight-current-username");
    // 使用正确的存档键
    const saveFileKey = "Second_Sight_SaveFile_" + currentUsername + "_" + id;
    
    // 从本地存储读取存档数据并存入继续游戏的键中
    const savedFile = window.localStorage.getItem(saveFileKey);
    window.localStorage.setItem("second_sight_whereToContinue", savedFile);

    // 显示黑屏并重定向到游戏主页
    showBlackout(() => {
        window.location.href = "../main_game/mygame.html";
    });
}

console.log(archiveContainers);
for (let i = 0; i < archiveContainers.length; i++) {
    console.log(i + "###" + archiveContainers[i]);

    // 实例化 Progress 类时，传入正确的存档ID
    const progress = new Progress(i);
    const archiveContainer = archiveContainers[i];
    const file = progress.getSaveFile();

    if (file) {
        // 地图名称
        let mapId = archiveContainer.querySelector(".mapId");
        mapId.innerText = file.mapId;

        // 存档时间
        let time = document.createElement("p");
        // 从存档文件中获取时间字符串
        time.innerText = file.time; 
        archiveContainer.appendChild(time);

        // 读档按钮
        let loadBtn = document.createElement("button");
        loadBtn.innerText = "读档";
        loadBtn.id = i;
        loadBtn.classList.add("load-button");
        loadBtn.onclick = function (e) {
            load(this.id);
        };
        archiveContainer.querySelector(".button-container").appendChild(loadBtn);
    }

    // 覆盖按钮
    let overrideBtn = document.createElement("button");
    overrideBtn.innerText = "覆盖该存档";
    overrideBtn.id = i;
    overrideBtn.classList.add("override-button");
    overrideBtn.onclick = function (e) {
        override(this.id);
    };
    archiveContainer.querySelector(".button-container").appendChild(overrideBtn);
}