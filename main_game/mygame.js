//控制菜单的暂停
window.menu_paused=false;
    document.addEventListener('DOMContentLoaded', () => {
            // 在 DOMContentLoaded 后
    document.addEventListener('click', initAudioOnce);
    document.addEventListener('keydown', initAudioOnce);

    function initAudioOnce() {
        // 背景音
        if (ambientAudio.paused) {
            ambientAudio.play();
        }
        // 提前加载其它音效
        walkingAudio.load();
        pickupAudio.load();
        dieAudio.load();
        biteAudio.load();
        diamondAudio.load();
        surprisingAudio.load();
        victoryAudio.load();

        // 移除监听器避免重复
        document.removeEventListener('click', initAudioOnce);
        document.removeEventListener('keydown', initAudioOnce);
    }

        // ====== 音效初始化 ======
    const ambientAudio = document.getElementById('ambientAudio');
    const walkingAudio = document.getElementById('walkingAudio');
    const pickupAudio = document.getElementById('pickupAudio');
    const dieAudio = document.getElementById('dieAudio');
    const biteAudio = document.getElementById('biteAudio');
    const diamondAudio = document.getElementById('diamondAudio');
    const surprisingAudio = document.getElementById('surprisingAudio');
    const victoryAudio = document.getElementById('victoryAudio');
    // 保存基础音量
    const baseVolumes = {
        ambientAudio: 0.01,
        walkingAudio: 1.0,
        pickupAudio: 1.0,
        dieAudio: 1.0,
        biteAudio: 1.0,
        diamondAudio: 1.0,
        surprisingAudio: 0.2,
        victoryAudio: 1.0
    };

    // 全局音量因子（0.0 ~ 1.0）
    window.masterVolume = 1.0; // 默认全音量

    // 更新所有音效音量
    window.updateAllVolumes = function() {
        ambientAudio.volume = baseVolumes.ambientAudio * masterVolume;
        walkingAudio.volume = baseVolumes.walkingAudio * masterVolume;
        pickupAudio.volume = baseVolumes.pickupAudio * masterVolume;
        dieAudio.volume = baseVolumes.dieAudio * masterVolume;
        biteAudio.volume = baseVolumes.biteAudio * masterVolume;
        diamondAudio.volume = baseVolumes.diamondAudio * masterVolume;
        surprisingAudio.volume = baseVolumes.surprisingAudio * masterVolume;
        victoryAudio.volume = baseVolumes.victoryAudio * masterVolume;
    };

    // 初始化一次
    updateAllVolumes();


    // 启动背景音
    ambientAudio.play().catch(()=>{}); // 自动播放失败时用户需要点一下页面
    // 获取元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');

    // 游戏画布尺寸
    const W = canvas.width;
    const H = canvas.height;
    
    // 背景缩放倍数
    const BACKGROUND_SCALE = 3;
    
    // 手电筒效果参数
    const LIGHT_RADIUS = 1400;
    const LIGHT_ANGLE = Math.PI * 0.5;
    
    // 小地图设置
    const MINIMAP_SIZE = 150;
    const MINIMAP_POS_X = W - MINIMAP_SIZE/2 - 10;
    const MINIMAP_POS_Y = MINIMAP_SIZE/2 + 10;
    const PLAYER_MARKER_SIZE = 4;
    
    const playerImg = new Image();
    playerImg.src = "player.png";

    // 1.加入背景图片
    const backgroundImage = new Image();
    backgroundImage.src = '../images/main map dark.jpg';
    
    const jingyuanAImage = new Image();
    jingyuanAImage.src = '../images/dormitory pics/hall.jpg';

    const jingyuanAImage1 = new Image();
    jingyuanAImage1.src = '../images/dormitory pics/corridor.png';

    const jingyuanAImage2 = new Image();
    jingyuanAImage2.src = '../images/dormitory pics/dormitory1.jpg';

    const jingyuanAImage3 = new Image();
    jingyuanAImage3.src = '../images/dormitory pics/storage.jpg';
    
    const libraryImage = new Image();
    libraryImage.src = '../images/library1.png'; // 图书馆一楼
    
    const libraryImage2 = new Image();
    libraryImage2.src = '../images/library2.jpg'; // 图书馆二楼
    
    const securityRoomImage = new Image();
    securityRoomImage.src = '../images/security room.jpg';

    const TeachingBuildingImage = new Image();
    TeachingBuildingImage.src = '../images/teaching building pics/corridor1.jpg';

    const TeachingBuildingImage2 = new Image();
    TeachingBuildingImage2.src = '../images/teaching building pics/stairs.jpg';

    const TeachingBuildingImage3 = new Image();
    TeachingBuildingImage3.src = '../images/teaching building pics/corridor2.jpg';

    const TeachingBuildingImage4 = new Image();
    TeachingBuildingImage4.src = '../images/teaching building pics/classroom.png';

    const HospitalImage = new Image();
    HospitalImage.src = '../images/hospital pics/hospital.jpg';

    const paper_cnImg = new Image();
    paper_cnImg.src = '../images/hospital pics/paper_cn.png';

    const paper_enImg = new Image();
    paper_enImg.src = '../images/hospital pics/paper_en.png';

    const piecesImg = new Image();
    piecesImg.src = '../images/pieces.png';  

    // 加载玩家不同方向的图片
    const playerUp = new Image();
    playerUp.src = 'player_up.png';

    const playerDown = new Image();
    playerDown.src = 'player_down.png';

    const playerLeft = new Image();
    playerLeft.src = 'player_left.png';

    const playerRight = new Image();
    playerRight.src = 'player_right.png';

    const playerUpLeft = new Image();
    playerUpLeft.src = 'player_up_left.png';

    const playerUpRight = new Image();
    playerUpRight.src = 'player_up_right.png';

    const playerDownLeft = new Image();
    playerDownLeft.src = 'player_down_left.png';

    const playerDownRight = new Image();
    playerDownRight.src = 'player_down_right.png';

    const imgEn = document.createElement('img');
    imgEn.src = '../images/note en.png';
    const imgCn = document.createElement('img');
    imgCn.src = '../images/note cn.png';

    let win = false;
    
    // 游戏变量
    let player = {
        worldX: 0,
        worldY: 0,
        width: 10,
        height: 10,
        speed: 2.5,
        dx: 0,
        dy: 0,
        direction: 0
    };
    
    let interiorPlayer = {
        x: 0,
        y: 0,
        width: 60,
        height: 50,
        speed: 4,
        dx: 0,
        dy: 0,
        direction: 'down'
    };
    
    // 2.加入场景交互状态
    let libraryInteraction = {
        nearStairs: false,    // 一楼：靠近楼梯
        nearDoor: false,      // 一楼：靠近大门
        nearDownStairs: false, // 二楼：靠近下楼楼梯
        nearBookshelf: false,
        nearBookshelf1: false,
        nearBookshelf2: false,
        nearDesk1: false,
        nearDesk2: false,
        nearDesk3: false,
        nearDesk4: false,
        nearLab: false
    };
    
    let jingyuanAInteraction = {
        nearUpStairs: false,    // 一楼：靠近楼梯
        nearDoor: false,      // 一楼：靠近大门
        nearStorage: false, 
        nearRoom: false,    
        nearAunt: false,
        nearDownStairs: false, // 二楼：靠近下楼楼梯
        nearLockedDoor: false,
        nearBox: false,
        nearBed: false,
        nearRoomExit: false,
        nearStorageExit: false
    };

    let TeachingBuildingInteraction = {
        nearDoor: false,      
        nearLockedDoor1: false,
        nearLockedDoor2: false,
        nearLockedDoor3: false,
        nearCorridorDoor1: false,

        nearCorridorDoor2: false,
        nearStudent: false,
        nearCorridorDoor3: false,

        nearCorridorDoor4: false,
        nearLockedDoor4: false,
        nearRoom: false,
        nearLockedDoor5: false,

        nearRoomExit: false
    };

    let securityRoomInteraction = {
        nearDoor: false,      // 一楼：靠近大门
        nearKeys: false,
        nearGuard: false
    };

    let HospitalInteraction = {
        nearDoor: false,      // 一楼：靠近大门
        nearNeedleTubing: false,
        nearPaper: false,
        nearWorkTop: false,
    };

    let interiorColliders = [];
    let interiorInteractors = [];
    let obstacles = [];
    let buildings = [];
    let stones = 0;
    let gameLoop;
    let isGameRunning = false;
    let obstacleInterval;
    let backgroundLoaded = false;
    let scaledBackgroundWidth = 0;
    let scaledBackgroundHeight = 0;
    let sceneImagesLoaded = false;
    let Flashlight;
    let keys;    
    let isPaused = false;

    let isInfected = false;
    let infectionTime = 0;
    let infectionStartTime = 0;
    const INFECTION_DURATION = 25 * 60 * 1000; //倒计时（毫秒）
    // let pauseInfectionStartTime = 0;

    let readpieces = false;

    let readpaper = false;
    let antibody = false;
    let elementA = false;
    let elementB = false;
    let formula = false;
    let needletubing = false;

    // 场景状态（包含图书馆二楼）
    let currentScene = 'jingyuanA2'; 
    let nearBuilding = null;

    // ===== 成就系统 =====
    const achievements = [
        { id: 'no_layoff', name: '拒绝躺平', description: '走出宿舍楼', unlocked: false },        
        { id: 'flashlight_finder', name: '光明使者', description: '找到手电筒', unlocked: false },
        { id: 'explorer', name: '探索者', description: '进入4个不同的建筑物', unlocked: false, progress: 0, target: 4 },
        { id: 'holmes', name: '福尔摩斯', description: '发现重要线索', unlocked: false },
        { id: 'library_visitor', name: '图书馆常客', description: '访问图书馆达到两次', unlocked: false, progress: 0, target: 2 },
        { id: 'perfect_victory', name: '完美胜利', description: '不被感染的情况下胜利', unlocked: false },
        { id: 'final_battle', name: '背水一战', description: '在被感染后25分钟内胜利', unlocked: false },
        { id: 'dark_path', name: '暗夜行路', description: '无手电筒胜利', unlocked: false },
    ];
    
    // 追踪已进入的建筑物
    let enteredBuildings = new Set();
    
    // 追踪访问图书馆的次数
    let libraryVisits = 0;
    
    // 追踪是否感染
    let wasInfected = false;

    // 感染函数
    function infect() {
        if (!isInfected) {
            isInfected = true;
            wasInfected = true; // 记录被感染状态
            infectionStartTime = Date.now();
            biteAudio.currentTime = 0;
            biteAudio.play();
        }
    }
    // 成就解锁函数
    function unlockAchievement(id) {
        const achievement = achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            showAchievementNotification(achievement);
            saveAchievements(); // 保存成就状态
        }
    }
    
    // 显示成就解锁通知
    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <div class="achievement-title">成就解锁!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '-400px',
            width: '350px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '10px',
            padding: '15px',
            display: 'flex',
            alignItems: 'center',
            zIndex: '10000',
            transition: 'right 0.5s ease-in-out',
            border: '2px solid gold',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
        });
        
        const iconStyle = {
            fontSize: '40px',
            marginRight: '15px'
        };
        
        const contentStyle = {
            flex: '1'
        };
        
        const titleStyle = {
            fontWeight: 'bold',
            fontSize: '16px',
            color: 'gold'
        };
        
        const nameStyle = {
            fontWeight: 'bold',
            fontSize: '18px',
            marginBottom: '5px'
        };
        
        // 应用样式到子元素
        notification.querySelector('.achievement-icon').style.fontSize = iconStyle.fontSize;
        notification.querySelector('.achievement-icon').style.marginRight = iconStyle.marginRight;
        
        Object.assign(notification.querySelector('.achievement-content').style, contentStyle);
        Object.assign(notification.querySelector('.achievement-title').style, titleStyle);
        Object.assign(notification.querySelector('.achievement-name').style, nameStyle);
        
        document.body.appendChild(notification);
        
        // 动画显示
        setTimeout(() => {
            notification.style.right = '20px';
        }, 100);
        
        // 5秒后移除通知
        setTimeout(() => {
            notification.style.right = '-400px';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }
    
    // 更新成就进度
    function updateAchievementProgress(id, increment = 1) {
        const achievement = achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.progress = (achievement.progress || 0) + increment;
            if (achievement.progress >= achievement.target) {
                unlockAchievement(id);
            }
            saveAchievements(); // 保存成就状态
        }
    }
    
    // 初始化成就系统
    function initAchievements() {
        // 从本地存储加载成就
        loadAchievements();
        
        // 创建成就面板按钮
        const achievementsButton = document.createElement('button');
        achievementsButton.id = 'achievements-button';
        achievementsButton.textContent = '🏆';
        achievementsButton.title = '查看成就';
        
        Object.assign(achievementsButton.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: '2px solid gold',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: '9999',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        achievementsButton.addEventListener('mouseover', () => {
            achievementsButton.style.backgroundColor = 'rgba(50, 50, 50, 0.9)';
            achievementsButton.style.transform = 'scale(1.1)';
        });
        
        achievementsButton.addEventListener('mouseout', () => {
            achievementsButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            achievementsButton.style.transform = 'scale(1)';
        });
        
        achievementsButton.addEventListener('click', showAchievementsPanel);
        
        document.body.appendChild(achievementsButton);
    }
    
    // 显示成就面板
    function showAchievementsPanel() {
        // 创建成就面板
        const panel = document.createElement('div');
        panel.id = 'achievements-panel';
        panel.innerHTML = `
            <div class="achievements-header">
                <h2>🏆 成就系统</h2>
                <button class="close-button">&times;</button>
            </div>
            <div class="achievements-list">
                ${achievements.map(achievement => `
                    <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-description">${achievement.description}</div>
                            ${achievement.progress !== undefined ? 
                              `<div class="achievement-progress">
                                 进度: ${achievement.progress}/${achievement.target}
                                 <div class="progress-bar">
                                     <div class="progress-fill" style="width: ${(achievement.progress/achievement.target)*100}%"></div>
                                 </div>
                               </div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // 添加样式
        Object.assign(panel.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '600px',
            maxHeight: '80%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '15px',
            padding: '20px',
            zIndex: '10001',
            color: 'white',
            border: '2px solid gold',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            overflowY: 'auto'
        });
        
        const headerStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #444',
            paddingBottom: '10px'
        };
        
        const closeButtonStyle = {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '30px',
            cursor: 'pointer',
            padding: '0',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };
        
        const itemStyle = {
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '10px',
            backgroundColor: 'rgba(50, 50, 50, 0.5)'
        };
        
        const unlockedItemStyle = {
            backgroundColor: 'rgba(70, 70, 0, 0.5)',
            border: '1px solid gold'
        };
        
        const iconStyle = {
            fontSize: '30px',
            marginRight: '15px',
            width: '40px',
            textAlign: 'center'
        };
        
        const infoStyle = {
            flex: '1'
        };
        
        const nameStyle = {
            fontWeight: 'bold',
            fontSize: '18px',
            marginBottom: '5px'
        };
        
        const descriptionStyle = {
            color: '#aaa',
            marginBottom: '10px'
        };
        
        const progressStyle = {
            color: '#ddd'
        };
        
        const progressBarStyle = {
            width: '100%',
            height: '10px',
            backgroundColor: '#333',
            borderRadius: '5px',
            overflow: 'hidden',
            marginTop: '5px'
        };
        
        const progressFillStyle = {
            height: '100%',
            backgroundColor: 'gold',
            transition: 'width 0.3s ease'
        };
        
        // 应用样式
        Object.assign(panel.querySelector('.achievements-header').style, headerStyle);
        Object.assign(panel.querySelector('.close-button').style, closeButtonStyle);
        
        const items = panel.querySelectorAll('.achievement-item');
        items.forEach(item => {
            Object.assign(item.style, itemStyle);
            
            if (item.classList.contains('unlocked')) {
                Object.assign(item.style, unlockedItemStyle);
            }
            
            Object.assign(item.querySelector('.achievement-icon').style, iconStyle);
            Object.assign(item.querySelector('.achievement-info').style, infoStyle);
            Object.assign(item.querySelector('.achievement-name').style, nameStyle);
            Object.assign(item.querySelector('.achievement-description').style, descriptionStyle);
            
            const progress = item.querySelector('.achievement-progress');
            if (progress) {
                Object.assign(progress.style, progressStyle);
                Object.assign(progress.querySelector('.progress-bar').style, progressBarStyle);
                Object.assign(progress.querySelector('.progress-fill').style, progressFillStyle);
            }
        });
        
        // 添加关闭功能
        panel.querySelector('.close-button').addEventListener('click', () => {
            document.body.removeChild(panel);
        });
        
        // 点击面板外部关闭
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                document.body.removeChild(panel);
            }
        });
        
        document.body.appendChild(panel);
    }
    
    // 保存成就到本地存储
    function saveAchievements() {
        const achievementsData = achievements.map(a => ({
            id: a.id,
            unlocked: a.unlocked,
            progress: a.progress
        }));
        localStorage.setItem('gameAchievements', JSON.stringify(achievementsData));
    }
    
    // 从本地存储加载成就
    function loadAchievements() {
        const saved = localStorage.getItem('gameAchievements');
        if (saved) {
            try {
                const savedAchievements = JSON.parse(saved);
                savedAchievements.forEach(saved => {
                    const achievement = achievements.find(a => a.id === saved.id);
                    if (achievement) {
                        achievement.unlocked = saved.unlocked;
                        if (saved.progress !== undefined) {
                            achievement.progress = saved.progress;
                        }
                    }
                });
            } catch (e) {
                console.error('加载成就时出错:', e);
            }
        }
    }
    
    
    // 建筑物类
    class Building {
        constructor(name, points, sceneName, entrance) {
            this.name = name;
            this.sceneName = sceneName;
            this.points = points.map(p => ({
                x: p.x * BACKGROUND_SCALE,
                y: p.y * BACKGROUND_SCALE
            }));
            this.minX = Math.min(...this.points.map(p => p.x));
            this.maxX = Math.max(...this.points.map(p => p.x));
            this.minY = Math.min(...this.points.map(p => p.y));
            this.maxY = Math.max(...this.points.map(p => p.y));
            
            this.entrance = entrance;
        }
        
        draw() {
            ctx.beginPath();
            const startX = this.points[0].x - player.worldX + W / 2;
            const startY = this.points[0].y - player.worldY + H / 2;
            ctx.moveTo(startX, startY);
            
            for (let i = 1; i < this.points.length; i++) {
                const pointX = this.points[i].x - player.worldX + W / 2;
                const pointY = this.points[i].y - player.worldY + H / 2;
                ctx.lineTo(pointX, pointY);
            }
            
            ctx.closePath();
            ctx.fillStyle = 'rgba(246, 246, 246, 0.09)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        drawEntrance() {
            const canvasX = this.entrance.x - player.worldX + W / 2;
            const canvasY = this.entrance.y - player.worldY + H / 2;
            
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        containsPoint(x, y) {
            if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
                return false;
            }
            
            let inside = false;
            for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
                const xi = this.points[i].x, yi = this.points[i].y;
                const xj = this.points[j].x, yj = this.points[j].y;
                
                const intersect = ((yi > y) !== (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            
            return inside;
        }
        
        intersectsRect(x, y, width, height) {
            if (this.containsPoint(x, y) ||
                this.containsPoint(x + width, y) ||
                this.containsPoint(x, y + height) ||
                this.containsPoint(x + width, y + height)) {
                return true;
            }
            
            const rectLines = [
                {x1: x, y1: y, x2: x + width, y2: y},
                {x1: x + width, y1: y, x2: x + width, y2: y + height},
                {x1: x, y1: y + height, x2: x + width, y2: y + height},
                {x1: x, y1: y, x2: x, y2: y + height}
            ];
            
            for (const rectLine of rectLines) {
                for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
                    const buildX1 = this.points[j].x, buildY1 = this.points[j].y;
                    const buildX2 = this.points[i].x, buildY2 = this.points[i].y;
                    
                    if (this.lineIntersect(
                        rectLine.x1, rectLine.y1, rectLine.x2, rectLine.y2,
                        buildX1, buildY1, buildX2, buildY2
                    )) {
                        return true;
                    }
                }
            }
            
            return false;
        }
        
        lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
            const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
            if (denom === 0) return false;
            
            const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
            const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
            
            return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
        }
        
        isPlayerNearEntrance() {
            const playerCenterX = player.worldX + player.width / 2;
            const playerCenterY = player.worldY + player.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(playerCenterX - this.entrance.x, 2) +
                Math.pow(playerCenterY - this.entrance.y, 2)
            );
            
            return distance < 200;
        }
    }
    
    // 初始化建筑物
    function initBuildings() {
        buildings = [
            new Building('静园A', [
                {x:304,y:4187},
                {x:353,y:4204},
                {x:359,y:4193},
                {x:457,y:4223},
                {x:469,y:4230},
                {x:505,y:4235},
                {x:820,y:4235},
                {x:820,y:4220},
                {x:930,y:4220},
                {x:930,y:4234},
                {x:983,y:4234},
                {x:983,y:4300},
                {x:955,y:4300},
                {x:955,y:4335},
                {x:505,y:4335},
                {x:498,y:4350},
                {x:276,y:4282}
            ], 'jingyuanA', {
                x: 640 * BACKGROUND_SCALE ,
                y: 4380 * BACKGROUND_SCALE 
            }),
            
            new Building('图书馆', [
                {x:2054, y:3772},
                {x:3133, y:3772},
                {x:3133, y:3893},
                {x:3069, y:3893},
                {x:3069, y:3977},
                {x:3133, y:3977},
                {x:3133, y:4089},
                {x:3069, y:4089},
                {x:3069, y:4174},
                {x:3133, y:4174},
                {x:3133, y:4293},
                {x:2054, y:4293},
            ], 'library', {x:2572 * BACKGROUND_SCALE , y:4300 * BACKGROUND_SCALE }),
            
            new Building('保安室', [
                {x:2063, y:4460},
                {x:2168, y:4460},
                {x:2168, y:4530},
                {x:2063, y:4530}
            ], 'securityRoom', {
                x: 2058 * BACKGROUND_SCALE, y: 4470 * BACKGROUND_SCALE
            }),

            new Building('综合教学楼', [
                {x:2100, y:2600},
                {x:2356, y:2600},
                {x:2360, y:2845},
                {x:2990, y:2845},
                {x:2982, y:2650},
                {x:3045, y:2650},
                {x:3045, y:2665},
                {x:3290, y:2772},
                {x:3308, y:2960},
                {x:3323, y:2960},
                {x:3323, y:3030},
                {x:3112, y:3030},
                {x:3112, y:3075},
                {x:2031, y:3075},
                {x:2031, y:2934},
                {x:2017, y:2934},
                {x:2024, y:2845},
                {x:2104, y:2845}

            ], 'TeachingBuilding', {
                x: 2030 * BACKGROUND_SCALE, y: 3000 * BACKGROUND_SCALE
            }),
        
            new Building('校医院', [
                {x:1360, y:2477},
                {x:1523, y:2477},
                {x:1524, y:2468},
                {x:1603, y:2468},
                {x:1603, y:2527},
                {x:1814, y:2527},
                {x:1814, y:2630},
                {x:1603, y:2630},
                {x:1603, y:2702},
                {x:1655, y:2702},
                {x:1655, y:2723},
                {x:1814, y:2723},
                {x:1814, y:2880},
                {x:1360, y:2880},
                {x:1360, y:2672},
                {x:1516, y:2672},
                {x:1516, y:2579},
                {x:1360, y:2579}
            ], 'Hospital', {
                x: 1406 * BACKGROUND_SCALE, y: 2890 * BACKGROUND_SCALE
            }),

            new Building('静园B', [
                {x:304, y:3860},
                {x:353, y:3877},
                {x:359, y:3866},
                {x:457, y:3896},
                {x:469, y:3903},
                {x:505, y:3908},
                {x:820, y:3908},
                {x:820, y:3893},
                {x:930, y:3893},
                {x:930, y:3907},
                {x:983, y:3907},
                {x:983, y:3973},
                {x:955, y:3973},
                {x:955, y:4008},
                {x:505, y:4008},
                {x:498, y:4023},
                {x:276, y:3955}
            ], 'jingyuanB', {
                x: 877 * BACKGROUND_SCALE ,
                y: 3893 * BACKGROUND_SCALE 
            }),

            new Building('静园C', [
                {x:298, y:3046},
                {x:270, y:2951},                
                {x:347, y:2925},
                {x:345, y:2918},
                {x:446, y:2886},
                {x:451, y:2895},
                {x:496, y:2882},
                {x:503, y:2895},
                {x:818, y:2895},
                {x:818, y:2886},                              
                {x:924, y:2895},
                {x:977, y:2895},
                {x:977, y:2954},
                {x:952, y:2954},
                {x:952, y:2996},
                {x:465, y:2996}
            ], 'jingyuanC', {x: 870 * BACKGROUND_SCALE ,y: 2885 * BACKGROUND_SCALE }
            ),

            new Building('静园D', [
                {x:298, y:2713},
                {x:270, y:2618},
                {x:347, y:2592},
                {x:345, y:2585},
                {x:446, y:2553},
                {x:451, y:2562},
                {x:496, y:2549},
                {x:503, y:2562},
                {x:818, y:2562},
                {x:818, y:2553},
                {x:924, y:2553},
                {x:924, y:2562},
                {x:977, y:2562},
                {x:977, y:2621},
                {x:952, y:2621},
                {x:952, y:2663},
                {x:465, y:2663}
            ], 'jingyuanD', 
            {x: 870 * BACKGROUND_SCALE ,y: 2545 * BACKGROUND_SCALE }
            ),

            new Building('北食堂', [
                {x:1215, y:4292},
                {x:1215, y:3903},
                {x:1339, y:3903},
                {x:1339, y:3954},
                {x:1490, y:3954},
                {x:1490, y:3863},
                {x:1796, y:3863},
                {x:1796, y:4298},
                {x:1778, y:4298},
                {x:1778, y:4365},
                {x:1687, y:4365},
                {x:1687, y:4292},
                {x:1487, y:4292},
                {x:1487, y:4018},
                {x:1337, y:4018},
                {x:1339, y:4292} 
            ], 'DiningHall', 
            {x: 1796 * BACKGROUND_SCALE ,y: 4244 * BACKGROUND_SCALE}
            ),

            new Building('行政楼', [
                {x:2792, y:3159},
                {x:2792, y:3738},
                {x:3208, y:3738},
                {x:3208, y:3576},
                {x:3098, y:3576},
                {x:3098, y:3321},
                {x:3208, y:3321},
                {x:3208, y:3159},
            ], 'AdministrativeBuilding', 
            {x: 1796 * BACKGROUND_SCALE ,y: 4244 * BACKGROUND_SCALE}
            ),

        ];
    }
    
    function GetKeys() {
        if (!keys) {
            keys = true;
            pickupAudio.currentTime = 0;
            pickupAudio.play();
            addItem("钥匙", 1);   // 背包增加钥匙
        }
    }

    function GetFlashlight() {
        if (!Flashlight) {
            Flashlight = true;
            pickupAudio.currentTime = 0;
            pickupAudio.play();
            addItem("手电筒", 1);   // 背包增加手电筒

            unlockAchievement('flashlight_finder');
        }
    }

    function GetNeedleTubing() {
        if (!needletubing) {
            needletubing = true;
            if (!antibody) {
                pickupAudio.currentTime = 0;
                pickupAudio.play();
                addItem("针管", 1);   // 背包增加针管

            diamondAudio.currentTime = 0;
            diamondAudio.play();            
        }
        }
    }

    function GetAntibody() {
        if (!antibody) {
            antibody = true;
            pickupAudio.currentTime = 0;
            pickupAudio.play();
            addItem("抗体血液", 1);   // 背包增加抗体
            diamondAudio.currentTime = 0;
            diamondAudio.play();
        }
    }

    function GetElementA() {
        if (!elementA) {
            elementA = true;
            pickupAudio.currentTime = 0;
            pickupAudio.play();
            addItem("化合物 β-31", 1); 
            diamondAudio.currentTime = 0;
            diamondAudio.play();  // 背包增加元素A
        }
    }

    function GetElementB() {
        if (!elementB) {
            elementB = true;
            pickupAudio.currentTime = 0;
            pickupAudio.play();
            addItem("化合物 γ-5fe", 1);   // 背包增加元素B
            diamondAudio.currentTime = 0;
            diamondAudio.play();
        }
    }

    function GetFormula() {
        if (!formula) {
            formula = true;
            pickupAudio.currentTime = 0;
            pickupAudio.play();
            addItem("合成配方", 1);   // 背包增加配方
            diamondAudio.currentTime = 0;
            diamondAudio.play();
        }
    }

        function ReadPaper() {
        if (!readpaper) {
            readpaper = true;
        }

        // 1. 创建全屏遮罩
        const overlay = document.createElement('div');
        overlay.id = 'paper-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.cursor = 'pointer'; // 添加手型光标提示

        // 2. 图片容器（横向排列）
        const imgContainer = document.createElement('div');
        imgContainer.style.display = 'flex';
        imgContainer.style.gap = '20px';

        // 3. 中文图片
        const imgCn = document.createElement('img');
        imgCn.src = paper_cnImg.src;
        imgCn.style.maxWidth = '45%';
        imgCn.style.maxHeight = '90vh';

        // 4. 英文图片
        const imgEn = document.createElement('img');
        imgEn.src = paper_enImg.src;
        imgEn.style.maxWidth = '45%';
        imgEn.style.maxHeight = '90vh';

        imgContainer.appendChild(imgCn);
        imgContainer.appendChild(imgEn);
        overlay.appendChild(imgContainer);

        // 5. 关闭功能：点击或按空格关闭
        const closeOverlay = () => {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleKeyDown);
            overlay.removeEventListener('click', closeOverlay);
        };

        const handleKeyDown = (e) => {
            if (e.key === ' ') {
                closeOverlay();
            }
        };

        // 添加事件监听器
        document.addEventListener('keydown', handleKeyDown);
        overlay.addEventListener('click', closeOverlay);

        document.body.appendChild(overlay);
    }

    // 3.初始化内部场景碰撞箱
    function initInteriorColliders(sceneName) {
        interiorColliders = [];
        let sceneImage;
        switch(sceneName) {
            case 'jingyuanA': sceneImage = jingyuanAImage; break;
            case 'jingyuanA1': sceneImage = jingyuanAImage1; break;
            case 'jingyuanA2': sceneImage = jingyuanAImage2; break;
            case 'jingyuanA3': sceneImage = jingyuanAImage3; break;
            case 'library': sceneImage = libraryImage; break;
            case 'library2': sceneImage = libraryImage2; break;
            case 'securityRoom': sceneImage = securityRoomImage; break;
            case 'TeachingBuilding': sceneImage = TeachingBuildingImage; break;
            case 'TeachingBuilding2': sceneImage = TeachingBuildingImage2; break;
            case 'TeachingBuilding3': sceneImage = TeachingBuildingImage3; break;
            case 'TeachingBuilding4': sceneImage = TeachingBuildingImage4; break;
            case 'Hospital': sceneImage = HospitalImage; break;
        }
        const scale = sceneImage.complete ? Math.min(W / sceneImage.width, H / sceneImage.height) : 1;
        
        // 静园A hall碰撞箱
        if (sceneName === 'jingyuanA') {
            interiorColliders.push(
                {x: W*0.45, y: H*0.45, width: W*0.1, height: H*0.003,type:'door'},
                {x: W*0.2, y: H*0.08, width: W*0.8, height: H*0.37},
                {x: W*0.73, y: H*0.58, width: W*0.12, height: H*0.25,type: 'aunt'},
                {x: 0, y: H*0.08, width: W*0.2, height: H*0.37,type: 'upstairs'},
                {x: W*0.85, y: H*0.4, width: W*0.15, height: H*0.6},
            );
        }
        
        if (sceneName === 'jingyuanA1') {
            interiorColliders.push(
                {x: 0, y: H*0.08, width: W*0.25, height: H*0.6,type:'storage'},
                {x: 0, y: H*0.68, width: W*0.2, height: H*0.4,typp:'downstairs'}, 
                {x: W*0.8, y: 0, width: W*0.25, height: H},
                {x: W*0.6, y: 0, width: W*0.2, height: H*0.42},
                {x: W*0.25, y: 0, width: W*0.08, height: H*0.42},
                {x: W*0.33, y: 0, width: W*0.09, height: H*0.42,type:'lockedroom'},
                {x: W*0.42, y: 0, width: W*0.1, height: H*0.42},
                {x: W*0.52, y: 0, width: W*0.09, height: H*0.42,type:'room'},
            );
        }

        if (sceneName === 'jingyuanA2') {
            interiorColliders.push(
                
                {x: W*0.95, y: 0, width: W*0.05, height: H},
                {x: 0, y: 0, width: W*0.05, height: H},
                {x: W*0.63, y: 0, width: W*0.37, height: H*0.36},
                {x: W*0.05, y: 0, width: W*0.3, height: H*0.36},
            );
        }

        // 仓库碰撞块位置
        if (sceneName === 'jingyuanA3') {
            interiorColliders.push(
                {x: W*0.95, y: 0, width: W*0.05, height: H},
                {x: 0, y: 0, width: W*0.05, height: H},
                {x: W*0.05, y: H*0.1, width: W, height: H*0.36},
                {x: W*0.07, y: H*0.75, width: W*0.14, height: H*0.1}
            );
        }

        // 图书馆一楼碰撞箱（包含楼梯和大门标记）
        if (sceneName === 'library') {
            interiorColliders.push(
                {x: canvas.width*0.18, y: H*0.21, width: W*0.6, height: H*0.1}, // 楼梯旁边区域
                {x: 0, y: H*0.21, width: W*0.18, height: H*0.1, type: 'stairs'}, // 楼梯
                {x: 450 * scale, y: 460 * scale, width: 200 * scale, height: 210 * scale}, // 中间书架
                {x: 720 * scale, y: 400 * scale, width: 200 * scale, height: 280 * scale}, // 右侧书架
                {x: 200 * scale, y: 400 * scale, width: 180 * scale, height: 280 * scale}, // 左侧书桌
                {x: 1430 * scale, y: 300 * scale, width: 40 * scale, height: 800 * scale}, // 大门
                {x: 0, y: H*0.9, width: W*0.8, height: H*0.1}
            );
        }

        // 图书馆二楼碰撞箱
        if (sceneName === 'library2') {
            interiorColliders.push(
                {x: 0, y: H*0.13, width: W, height: H*0.1}, // 楼梯旁边区域
                {x: 0, y: 800 * scale, width: 180 * scale, height: 300 * scale, type: 'downStairs'}, // 下楼楼梯
                {x: 600 * scale, y: 480 * scale, width: 220 * scale, height: 210 * scale}, // 中间书桌
                {x: 550 * scale, y: 900 * scale, width: 240 * scale, height: 100 * scale}, // 左下书桌
                {x: 870 * scale, y: 900 * scale, width: 200 * scale, height: 100 * scale}, // 右下书桌
                {x: 230 * scale, y: 400 * scale, width: 240 * scale, height: 300 * scale}, // 左侧书桌
                {x: 1200 * scale, y: 500 * scale, width: 430 * scale, height: 220 * scale}, // 研讨室上墙
                {x: 1190 * scale, y: 470 * scale, width: 20 * scale, height: 550 * scale}, // 研讨室左墙
                {x: 1650 * scale, y: 500 * scale, width: 20 * scale, height: 520 * scale}, // 研讨室右墙
                {x: 1200 * scale, y: 930 * scale, width: 80 * scale, height: 100 * scale}, // 研讨室下墙
                {x: 1390 * scale, y: 930 * scale, width: 250 * scale, height: 100 * scale}, // 研讨室右下墙
                {x: 0, y: H*0.95, width: W, height: H*0.1},
                {x: W*0.83, y: H*0.2, width: W*0.01, height: H*0.8},
            
            );
        }

        if (sceneName === 'securityRoom') {
            interiorColliders.push(
                {x: 0, y: H*0.05, width: W, height: H*0.33},
                {x: 0, y: H*0.85, width: W, height: H*0.03},
                {x: W*0.25, y: H*0.3, width: W*0.26, height: H*0.2},
                {x: W*0.51, y: H*0.3, width: W*0.07, height: H*0.2,type:'keys'},
                {x: W*0.58, y: H*0.3, width: W*0.04, height: H*0.2},
                {x: 1150 * scale, y: 700 * scale, width: 160 * scale, height: 250 * scale},
                {x: 740 * scale, y: 550 * scale, width: 20 * scale, height: 500 * scale},
                {x: 2000 * scale, y: 550 * scale, width: 20 * scale, height: 800 * scale},
                {x: 740 * scale, y: 1050 * scale, width: 20 * scale, height: 300 * scale},
            );
        }

        if (sceneName === 'TeachingBuilding') {
            interiorColliders.push(
                {x: 0, y: H*0.37, width: W, height: H*0.1},
                {x: 0, y: H*0.8, width: W, height: H*0.1},
                {x: 0, y: H*0.4, width: W*0.08, height: H*0.6},
                {x: W*0.9, y: H*0.4, width: W*0.08, height: H*0.6},
            );
        }

        if (sceneName === 'TeachingBuilding2') {
            interiorColliders.push(
                {x: 0, y: 0, width: W*0.35, height: H*0.7},
                {x: 0, y: H*0.37, width: W, height: H*0.1},
                {x: 0, y: H*0.9, width: W, height: H*0.1},
                {x: W*0.68, y: 0, width: W*0.35, height: H*0.7},
                {x: W*0.9, y: H*0.4, width: W*0.08, height: H*0.6},
                {x: 0, y: H*0.4, width: W*0.08, height: H*0.6},
            );
        }

        if (sceneName === 'TeachingBuilding3') {
            interiorColliders.push(
                {x: 0, y: H*0.37, width: W, height: H*0.1},
                {x: 0, y: H*0.8, width: W, height: H*0.1},
                {x: 0, y: H*0.4, width: W*0.08, height: H*0.6},
                {x: W*0.9, y: H*0.4, width: W*0.08, height: H*0.6},
            );
        }

        if (sceneName === 'TeachingBuilding4') {
            interiorColliders.push(
                {x: 0, y: H*0.37, width: W, height: H*0.1},
                {x: 0, y: H*0.4, width: W*0.06, height: H*0.6},
                {x: W*0.95, y: H*0.4, width: W*0.06, height: H*0.6},
                {x: W*0.45, y: H*0.55, width: W*0.13, height: H*0.25},
                {x: W*0.18, y: H*0.55, width: W*0.13, height: H*0.25},
                {x: W*0.75, y: H*0.55, width: W*0.13, height: H*0.25}
            );
        }

        if (sceneName === 'Hospital') {
            interiorColliders.push(
                {x: 0, y: H*0.05, width: W*0.47, height: H*0.35},
                {x: W*0.71, y: H*0.05, width: W*0.3, height: H*0.32},
                {x: W*0.78, y: H*0.3, width: W*0.02, height: H*0.02,type: 'needletubing'},
                {x: 0, y: H*0.93, width: W, height: H*0.03},
                {x: 0, y: H*0.62, width: W*0.47, height: H*0.35},
                {x: W*0.58, y: H*0.63, width: W*0.33, height: H*0.2},
                {x: W*0.9, y: H*0.63, width: W*0.1, height: H*0.05},
                {x: W*0.45, y: 0, width: W*0.4, height: H*0.25},
            );
        }
    }

    // 4.初始化内部场景交互箱
    function initInteriorInteractors(sceneName) {
        interiorInteractors = [];
        // 重置交互状态
        libraryInteraction.nearStairs = false;
        libraryInteraction.nearDoor = false;
        libraryInteraction.nearDownStairs = false;
        libraryInteraction.nearBookshelf = false;
        libraryInteraction.nearLab = false;
        libraryInteraction.nearBookshelf1 = false;
        libraryInteraction.nearBookshelf2 = false;
        libraryInteraction.nearDesk1 = false;
        libraryInteraction.nearDesk2 = false;
        libraryInteraction.nearDesk3 = false;
        libraryInteraction.nearDesk4 = false;

        jingyuanAInteraction.nearUpStairs = false;
        jingyuanAInteraction.nearDoor = false;
        jingyuanAInteraction.nearDownStairs = false;
        jingyuanAInteraction.nearAunt = false;
        jingyuanAInteraction.nearStorage = false;
        jingyuanAInteraction.nearRoom = false;

        TeachingBuildingInteraction.nearDoor = false;
        TeachingBuildingInteraction.nearCorridorDoor1 = false;
        TeachingBuildingInteraction.nearCorridorDoor2 = false;
        TeachingBuildingInteraction.nearCorridorDoor3 = false;
        TeachingBuildingInteraction.nearCorridorDoor4 = false;
        TeachingBuildingInteraction.nearLockedDoor1 = false;
        TeachingBuildingInteraction.nearLockedDoor2 = false;
        TeachingBuildingInteraction.nearLockedDoor3 = false;
        TeachingBuildingInteraction.nearLockedDoor4 = false;
        TeachingBuildingInteraction.nearLockedDoor5 = false;
        TeachingBuildingInteraction.nearRoom = false;
        TeachingBuildingInteraction.nearRoomExit = false;
        TeachingBuildingInteraction.nearStudent = false;
        TeachingBuildingInteraction.nearStorage = false;


        securityRoomInteraction.nearDoor = false;
        securityRoomInteraction.nearKeys = false;

        HospitalInteraction.nearDoor = false;
        HospitalInteraction.nearNeedleTubing = false;
        HospitalInteraction.nearPaper = false;
        HospitalInteraction.nearWorkTop = false;
        
        if (sceneName === 'jingyuanA') {
            interiorInteractors.push(
                {x: W*0.45, y: H*0.45, width: W*0.1, height: H*0.05,type:'door'},
                {x: W*0.7, y: H*0.58, width: W*0.2, height: H*0.32,type: 'aunt'},
                {x: 0, y: H*0.08, width: W*0.2, height: H*0.45,type: 'upstairs'},
            );
        }

        if (sceneName === 'jingyuanA1') {
            interiorInteractors.push(
                {x: 0, y: H*0.08, width: W*0.3, height: H*0.6,type:'storage'},
                {x: 0, y: H*0.68, width: W*0.25, height: H*0.4,type:'downstairs'}, 
                {x: W*0.33, y: 0, width: W*0.09, height: H*0.48,type:'lockedroom'},
                {x: W*0.52, y: 0, width: W*0.09, height: H*0.48,type:'room'},
                // {x: 400 * scale, y: 300 * scale, width: 200 * scale, height: 100 * scale},
                // {x: 700 * scale, y: 500 * scale, width: 150 * scale, height: 80 * scale},
                // {x: 150 * scale, y: 200 * scale, width: 150 * scale, height: 80 * scale}
            );
        }

        if (sceneName === 'jingyuanA2') {
            interiorInteractors.push(
                {x: W*0.4, y: H*0.8, width: W*0.2, height: H*0.2,type:'roomexit'},
                {x: 0, y: H*0.05, width: W*0.38, height: H*0.35,type:'bed'},
                // {x: 0, y: H*0.68, width: W*0.25, height: H*0.4,type:'downstairs'}, 
            );
        }

        // 仓库交互
        if (sceneName === 'jingyuanA3') {
            interiorInteractors.push(
                {x: W*0.9, y: H*0.47, width: W*0.05, height: H*0.15,type:'storageexit'},
                {x: W*0.04, y: H*0.65, width: W*0.2, height: H*0.25,type:'box'}
            );
        }

        if (sceneName === 'securityRoom') {
            interiorInteractors.push(
                {x: W*0.27, y: H*0.7, width: W*0.02, height: H*0.15,type:'door'},
                {x: W*0.51, y: H*0.3, width: W*0.07, height: H*0.22,type:'keys'},
                {x: W*0.27, y: H*0.45, width: W*0.1, height: H*0.15,type:'guard'},
            );
        }
        // zzj:图书馆一楼交互箱
        if (sceneName === 'library') {
            interiorInteractors.push(
                {x: W*0.08, y: H*0.21, width: W*0.1, height: H*0.13, type: 'stairs'}, // 楼梯
                {x: W*0.75, y: H*0.5, width: W*0.05, height: H*0.2,type:'door'},
                {x: W*0.38, y: H*0.38, width: W*0.14, height: H*0.33, type: 'bookshelf'},
                {x: W*0.08, y: H*0.4, width: W*0.14, height: H*0.33, type: 'bookshelf1'},
                {x: W*0.25, y: H*0.4, width: W*0.1, height: H*0.28, type: 'desk1'},
            );
        }
        // zzj:图书馆二楼交互箱
        if (sceneName === 'library2') {
            interiorInteractors.push(
                {x: 0, y: H*0.65, width: W*0.1, height: H*0.2, type: 'downStairs'}, 
                {x: W* 0.6, y: H*0.55, width: W*0.1, height: H*0.15, type: 'lab'}, 
                {x: W*0.26, y: H*0.38, width: W*0.1, height: H*0.2, type: 'desk2'},
                {x: W*0.23, y: H*0.68, width: W*0.1, height: H*0.08, type: 'desk3'},
                {x: W*0.38, y: H*0.68, width: W*0.1, height: H*0.08, type: 'desk4'},
                {x: W*0.09, y: H*0.3, width: W*0.14, height: H*0.27, type: 'bookshelf2'},
            );
        }

        // zzj:教学楼交互箱
        if (sceneName === 'TeachingBuilding') {
            interiorInteractors.push(
                {x: 0, y: H*0.4, width: W*0.12, height: H*0.4,type:'door'},
                {x: W*0.15, y: H*0.21, width: W*0.1, height: H*0.3,type:'lockeddoor1'},
                {x: W*0.3, y: H*0.21, width: W*0.1, height: H*0.3,type:'lockeddoor2'},
                {x: W*0.45, y: H*0.21, width: W*0.1, height: H*0.3,type:'lockeddoor3'},
                {x: W*0.87, y: H*0.4, width: W*0.14, height: H*0.4,type:'corridordoor1'},
            );
        }

        if (sceneName === 'TeachingBuilding2') {
            interiorInteractors.push(
                {x: W*0.05, y: H*0.6, width: W*0.1, height: H*0.3,type:'corridordoor2'},
                {x: W*0.85, y: H*0.6, width: W*0.1, height: H*0.3,type:'corridordoor3'},
                {x: W*0.4, y: H*0.65, width: W*0.05, height: H*0.05,type:'student'},
            );
        }

        if (sceneName === 'TeachingBuilding3') {
            interiorInteractors.push(
                {x: W*0.15, y: H*0.21, width: W*0.1, height: H*0.3,type:'lockeddoor4'},
                {x: W*0.3, y: H*0.21, width: W*0.1, height: H*0.3,type:'room'},
                {x: W*0.45, y: H*0.21, width: W*0.1, height: H*0.3,type:'lockeddoor5'},
                {x: W*0.87, y: H*0.4, width: W*0.1, height: H*0.4,type:'corridordoor4'},
            );
        }

        if (sceneName === 'TeachingBuilding4') {
            interiorInteractors.push(
                {x: W*0.42, y: H*0.9, width: W*0.16, height: H*0.1,type:'roomexit'},
                {x: W*0.15, y: H*0.47, width: W*0.06, height: H*0.04,type:'storage'},
            );
        }

        if (sceneName === 'Hospital') {
            interiorInteractors.push(
                {x: W*0.59, y: H*0.2, width: W*0.1, height: H*0.1,type:'door'},
                {x: W*0.7, y: H*0.83, width: W*0.1, height: H*0.1, type: 'worktop'},
                {x: W*0.75, y: H*0.37, width: W*0.08, height: H*0.07, type: 'needletubing'},
                {x: W*0.55, y: H*0.74, width: W*0.05, height: H*0.1, type: 'paper'}
            );
        }

    }

    // 监听图片加载完成事件
    backgroundImage.onload = () => {
        backgroundLoaded = true;
        scaledBackgroundWidth = backgroundImage.width * BACKGROUND_SCALE;
        scaledBackgroundHeight = backgroundImage.height * BACKGROUND_SCALE;

        initBuildings();
    };
    
    // 5.检查场景图片是否加载完成
    function checkSceneImagesLoaded() {
        sceneImagesLoaded = true;
    }
    
    jingyuanAImage.onload = checkSceneImagesLoaded;
    jingyuanAImage1.onload = checkSceneImagesLoaded;
    jingyuanAImage2.onload = checkSceneImagesLoaded;
    jingyuanAImage3.onload = checkSceneImagesLoaded;
    TeachingBuildingImage.onload = checkSceneImagesLoaded;    
    TeachingBuildingImage2.onload = checkSceneImagesLoaded;
    TeachingBuildingImage3.onload = checkSceneImagesLoaded;
    TeachingBuildingImage4.onload = checkSceneImagesLoaded;
    libraryImage.onload = checkSceneImagesLoaded;
    libraryImage2.onload = checkSceneImagesLoaded;
    securityRoomImage.onload = checkSceneImagesLoaded;
    HospitalImage.onload = checkSceneImagesLoaded;
    
    // 绘制背景
    function drawBackground() {
        ctx.fillStyle = '#16213e';
        ctx.fillRect(0, 0, W, H);
        
        if (!backgroundLoaded) {
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('资源加载中...', W / 2, H / 2);
            return;
        }
        
        const backgroundX = W / 2 - player.worldX;
        const backgroundY = H / 2 - player.worldY;
        
        ctx.drawImage(
            backgroundImage,
            0, 0, 
            backgroundImage.width, backgroundImage.height,
            backgroundX, backgroundY,
            scaledBackgroundWidth, scaledBackgroundHeight
        );
    }
    
    // 6.绘制建筑物内部场景（包含图书馆二楼）
    function drawInteriorScene() {
        ctx.fillStyle = '#16213e';
        ctx.fillRect(0, 0, W, H);
        
        let sceneImage;
        let sceneNameText;
        switch (currentScene) {
            case 'jingyuanA':
                sceneImage = jingyuanAImage;
                sceneNameText = '静园A';
                break;
            case 'jingyuanA1':
                sceneImage = jingyuanAImage1;
                sceneNameText = '静园A1';
                break;
            case 'jingyuanA2':
                sceneImage = jingyuanAImage2;
                sceneNameText = '静园A2';
                break;
            case 'jingyuanA3':
                sceneImage = jingyuanAImage3;
                sceneNameText = '静园A3';
                break;
            case 'TeachingBuilding':
                sceneImage = TeachingBuildingImage;
                sceneNameText = '教学楼';
                break;
            case 'TeachingBuilding2':
                sceneImage = TeachingBuildingImage2;
                sceneNameText = '教学楼2';
                break;
            case 'TeachingBuilding3':
                sceneImage = TeachingBuildingImage3;
                sceneNameText = '教学楼3';
                break;
            case 'TeachingBuilding4':
                sceneImage = TeachingBuildingImage4;
                sceneNameText = '教学楼4';
                break;
            case 'library':
                sceneImage = libraryImage;
                sceneNameText = '图书馆一楼';
                break;
            case 'library2':
                sceneImage = libraryImage2;
                sceneNameText = '图书馆二楼';
                break;
            case 'securityRoom':
                sceneImage = securityRoomImage;
                sceneNameText = '保安室';
                break;
            case 'Hospital':
                sceneImage = HospitalImage;
                sceneNameText = '医院';
                break;
        }
        
        if (sceneImage && sceneImage.width > 0) {
            // 居中显示场景图片
            const scale = Math.min(W / sceneImage.width, H / sceneImage.height);
            const width = sceneImage.width * scale;
            const height = sceneImage.height * scale;
            const x = (W - width) / 2;
            const y = (H - height) / 2;
            
            ctx.drawImage(sceneImage, x, y, width, height);
            
            // 绘制碰撞箱
            interiorColliders.forEach(collider => {
                //钥匙拾取效果
                if (collider.type === 'keys'&& keys) {
                    ctx.fillStyle = '#779BB3';
                    ctx.fillRect(collider.x + x + collider.width/3, collider.y + y + collider.height*5/7, collider.width/2, collider.height/5);
                }

                if (collider.type === 'needletubing'&& needletubing) {
                    ctx.fillStyle = '#3F5666';
                    ctx.fillRect(collider.x + x, collider.y + y, collider.width, collider.height);
                }
                
                // ctx.strokeStyle = 'white'; 
                // ctx.lineWidth = 1;
                // ctx.strokeRect(collider.x + x, collider.y + y, collider.width, collider.height);
            });
            
            interiorInteractors.forEach(actor => {
                if (actor.type === 'student') {
                    if (piecesImg.complete) {
                        ctx.drawImage(
                            piecesImg,
                            actor.x + x,
                            actor.y + y,
                            actor.width,
                            actor.height
                        );
                    }
                }
                
            //     ctx.strokeStyle = 'yellow'; 
            //     ctx.lineWidth = 1;
            //     ctx.strokeRect(actor.x + x, actor.y + y, actor.width, actor.height);
            });

            // 绘制内部场景玩家
            // 选中当前方向对应的图片
            let img;
            switch (interiorPlayer.direction) {
                case 'up': img = playerUp; break;
                case 'down': img = playerDown; break;
                case 'left': img = playerUpLeft; break;
                case 'right': img = playerUpRight; break;
                case 'upLeft': img = playerUpLeft; break;
                case 'upRight': img = playerUpRight; break;
                case 'downLeft': img = playerDownLeft; break;
                case 'downRight': img = playerDownRight; break;
                default: img = playerDown;
            }

            if (img && img.complete) {
                ctx.drawImage(
                    img,
                    x + interiorPlayer.x,
                    y + interiorPlayer.y,
                    interiorPlayer.width,
                    interiorPlayer.height
                );
            } else {
                // 如果没加载完就画个占位方块
                ctx.fillStyle = 'pink';
                ctx.fillRect(
                    x + interiorPlayer.x,
                    y + interiorPlayer.y,
                    interiorPlayer.width,
                    interiorPlayer.height
                );
            }
         
            // 7.绘制图书馆场景交互提示
            if (currentScene === 'library') {
                if (libraryInteraction.nearStairs) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键上楼', W / 2, H - 60);
                }
                if (libraryInteraction.nearDoor) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键出门', W / 2, H - 30);
                }
                if (libraryInteraction.nearBookshelf) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看书架', W / 2, H - 30);
                }
                if (libraryInteraction.nearDownStairs) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键下楼', W / 2, H - 30);
                }
                if (libraryInteraction.nearDesk1) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看书桌', W / 2, H - 30);
                }
                
            }

            if (currentScene === 'library2') {
                if (libraryInteraction.nearDownStairs) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键下楼', W / 2, H - 30);
                }
                if (libraryInteraction.nearLab) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看实验台', W / 2, H - 30);
                }
                if (libraryInteraction.nearDesk2) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看书桌', W / 2, H - 30);
                }
                if (libraryInteraction.nearDesk3) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看书桌', W / 2, H - 30);
                }
                if (libraryInteraction.nearDesk4) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看书桌', W / 2, H - 30);
                }
                if (libraryInteraction.nearBookshelf1) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看书架', W / 2, H - 30);
                }
                if (libraryInteraction.nearBookshelf2) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看书架', W / 2, H - 30);
                }
            }

            if (currentScene === 'jingyuanA') {
                if (jingyuanAInteraction.nearUpStairs) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键上楼', W / 2, H - 60);
                }
                if (jingyuanAInteraction.nearDoor) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键出门', W / 2, H - 30);
                }
                if (jingyuanAInteraction.nearAunt) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键与阿姨对话', W / 2, H - 30);
                }
            }
            
            if (currentScene === 'jingyuanA1') {
                if (jingyuanAInteraction.nearDownStairs) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键下楼', W / 2, H - 60);
                }
                if (jingyuanAInteraction.nearRoom) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入', W / 2, H - 30);
                }
                if (jingyuanAInteraction.nearStorage) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键上楼', W / 2, H - 30);
                }
                if (jingyuanAInteraction.nearLockedDoor) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入', W / 2, H - 30);
                }
            }

            if (currentScene === 'jingyuanA2') {
                if (jingyuanAInteraction.nearBed) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键睡觉', W / 2, H - 60);
                }
                if (jingyuanAInteraction.nearRoomExit) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键出房间', W / 2, H - 30);
                }
            }

            if (currentScene === 'jingyuanA3') {
                if (jingyuanAInteraction.nearBox) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键打开箱子', W / 2, H - 60);
                }
                if (jingyuanAInteraction.nearStorageExit) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键出房间', W / 2, H - 30);
                }
            }

            if (currentScene === 'securityRoom') {
                if (securityRoomInteraction.nearDoor) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键出门', W / 2, H - 30);
                }

                if (securityRoomInteraction.nearKeys&&!keys) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键拿走钥匙', W / 2, H - 30);
                }

                if (securityRoomInteraction.nearGuard) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键与保安对话', W / 2, H - 30);
                }
            }

            if (currentScene === 'TeachingBuilding') {
                if (TeachingBuildingInteraction.nearDoor) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键出门', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearCorridorDoor1) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入走廊', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearLockedDoor1) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearLockedDoor2) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearLockedDoor3) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入', W / 2, H - 30);
                }
            }

            if (currentScene === 'TeachingBuilding2') {
                if (TeachingBuildingInteraction.nearCorridorDoor2) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键前往一楼', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearCorridorDoor3) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键前往二楼', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearStudent) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('地上有一些纸张碎片，按空格键查看', W / 2, H - 30);
                }
            }

            if (currentScene === 'TeachingBuilding3') {
                if (TeachingBuildingInteraction.nearCorridorDoor4) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入走廊', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearLockedDoor4) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearLockedDoor5) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearRoom) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键进入', W / 2, H - 30);
                }
            }
            if (currentScene === 'TeachingBuilding4') {
                if (TeachingBuildingInteraction.nearRoomExit) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键返回', W / 2, H - 30);
                }
                if (TeachingBuildingInteraction.nearStorage) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键打开储物箱', W / 2, H - 30);
                }
            }
            if (currentScene === 'Hospital') {
                if (HospitalInteraction.nearDoor) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键出门', W / 2, H - 30);
                }
                if (HospitalInteraction.nearWorkTop) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看实验台', W / 2, H - 30);
                }
                if (HospitalInteraction.nearNeedleTubing && !needletubing) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键拿走针管', W / 2, H - 30);
                }
                if (HospitalInteraction.nearPaper) {
                    ctx.fillStyle = 'yellow';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('按空格键查看桌上的纸', W / 2, H - 30);
                }
            }

        } else {
            // 显示加载提示
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${sceneNameText} 场景加载中...`, W / 2, H / 2);
        }
        
    }
    
    // 绘制手电筒光照效果
    function drawFlashlight() {
        const gradient = ctx.createRadialGradient(
            W / 2, H / 2, 5,
            W / 2, H / 2, LIGHT_RADIUS
        );
        
        gradient.addColorStop(0.1, `rgba(212, 228, 37, 0.1)`);
        gradient.addColorStop(0.3, `rgba(0, 0, 0, 0.1)`);
        gradient.addColorStop(0.35, `rgba(0, 0, 0, 0.8)`);
        gradient.addColorStop(0.4, `rgba(0, 0, 0, 1)`);
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(W / 2, H / 2);
        
        const startAngle = player.direction - LIGHT_ANGLE / 2;
        const endAngle = player.direction + LIGHT_ANGLE / 2;
        
        ctx.arc(
            W / 2, H / 2,
            LIGHT_RADIUS,
            startAngle,
            endAngle
        );
        ctx.closePath();
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    function drawDarkness() {
        // 创建一个径向渐变，从中心向外变暗
        const gradient = ctx.createRadialGradient(
            W / 2, H / 2, 5,
            W / 2, H / 2, LIGHT_RADIUS
        );
                
        // 偏黄的光照
        gradient.addColorStop(0.025, `rgba(0, 0, 0, 0)`);
        // 最外围完全黑暗
        gradient.addColorStop(0.15, `rgba(0, 0, 0, 1)`);
                
        // 保存当前绘图状态
        ctx.save();
                
        // 清除除了扇形区域外的所有内容，创建光照范围
        ctx.globalCompositeOperation = 'destination-out';
                
        // 现在绘制光照区域（扇形）
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(W / 2, H / 2);
        
        // 计算扇形的两个边缘角度（基于玩家朝向）
        const startAngle = player.direction - LIGHT_ANGLE / 2;
        const endAngle = player.direction + LIGHT_ANGLE / 2;
                
        // 绘制扇形
        ctx.arc(
            W / 2, H / 2,
            LIGHT_RADIUS,
            endAngle,
            startAngle
        );
        ctx.closePath();
                
        // 应用渐变
        ctx.fillStyle = gradient;
        ctx.fill();
                
        // 恢复绘图状态
        ctx.restore();
    }

    function drawRoundDarkness() {
        // 创建一个径向渐变，从中心向外变暗
        const gradient = ctx.createRadialGradient(
            W / 2, H / 2, 5,
            W / 2, H / 2, LIGHT_RADIUS
        );
                
        gradient.addColorStop(0.02, `rgba(0, 0, 0, 0)`);
        // 最外围完全黑暗
        gradient.addColorStop(0.1, `rgba(0, 0, 0, 1)`);
                
        // 保存当前绘图状态
        ctx.save();
                
        // 清除除了扇形区域外的所有内容，创建光照范围
        ctx.globalCompositeOperation = 'destination-out';
                
        // 现在绘制光照区域（扇形）
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(W / 2, H / 2);
        
        // 计算扇形的两个边缘角度（基于玩家朝向）
        const startAngle = 0;
        const endAngle = Math.PI * 2;
                
        // 绘制环形
        ctx.arc(
            W / 2, H / 2,
            LIGHT_RADIUS,
            endAngle,
            startAngle
        );
        ctx.closePath();
                
        // 应用渐变
        ctx.fillStyle = gradient;
        ctx.fill();
                
        // 恢复绘图状态
        ctx.restore();
    }

    
    // 绘制玩家
    function drawPlayer() {
        
        const canvasX = W / 2 - player.width / 2; 
        const canvasY = H / 2 - player.height / 2; 

        ctx.save();
        ctx.translate(W / 2, H / 2); // 平移到画布中心
        ctx.rotate(player.direction + Math.PI / 2); // 跟随玩家朝向旋转
        
        if (playerImg.complete) {
            // 调整绘制位置以适应旋转中心
            ctx.drawImage(playerImg, -player.width / 2, -player.height / 2, 30, 30);
        } else {
            ctx.fillStyle = '#f04c83ff';
            ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
        }
        
        // 绘制朝向指示器
        ctx.fillStyle = '#fff'; // 指示器颜色（白色）
        ctx.beginPath();
        ctx.moveTo(0, 0); // 起点（玩家中心）
        ctx.lineTo(player.width / 2, 0); // 右点（朝向方向）
        ctx.lineTo(player.width / 4, -player.height / 4); // 左上点
        ctx.lineTo(player.width / 4, player.height / 4); // 左下点
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // 绘制障碍物
    // First, initialize zombieImg at the top of your script (with other images)
    const zombieImg = new Image();
    zombieImg.src = "zombie.png"; // Ensure this path is correct (e.g., same folder as mygame.js)


    function drawObstacles() {
        obstacles.forEach(obstacle => {
            // Calculate zombie position (same as original obstacle position)
            const canvasX = obstacle.worldX - player.worldX + W / 2;
            const canvasY = obstacle.worldY - player.worldY + H / 2;

            // 计算障碍物的移动方向（朝向）
            const direction = Math.atan2(obstacle.dy, obstacle.dx) + Math.PI/2;

            // Draw zombie instead of red rectangle
            if (zombieImg.complete) {
                ctx.save();
                // 将绘图上下文移动到僵尸中心位置
                ctx.translate(canvasX + obstacle.width * 0.35, canvasY + obstacle.height * 0.35);
                // 根据移动方向旋转
                ctx.rotate(direction);
                // 绘制僵尸图片（居中绘制）
                ctx.drawImage(
                    zombieImg, 
                    -obstacle.width * 0.35, 
                    -obstacle.height * 0.35, 
                    obstacle.width * 0.7, // Slightly enlarge zombie (optional)
                    obstacle.height * 0.7 // Slightly enlarge zombie (optional)
                );
                ctx.restore();
            } else {
                // Fallback: Keep red rectangle if zombie.png loads slowly
                ctx.fillStyle = '#f72585';
                ctx.fillRect(canvasX, canvasY, 30, 30);
            }
        });
    }
    // 绘制建筑物
    function drawBuildings() {
        buildings.forEach(building => {
            building.draw();
        });
    }
    
    // 绘制进入提示
    function drawEnterPrompt() {
        if (nearBuilding) {
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Press Space to enter ${nearBuilding.name}`, W / 2, H - 50);
        }
    }
    
    // 绘制调试信息
    function drawDebugInfo() {
        ctx.save();                    // 保存画布状态，防止别处改的 textAlign/textBaseline/transform 污染这里
        ctx.textBaseline = 'top';      // 可选：统一基线，避免垂直偏移差异

        if (nearBuilding) {
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Near: ${nearBuilding.name}`, 10, 20);
            ctx.fillText(`Entrance: (${Math.round(nearBuilding.entrance.x)}, ${Math.round(nearBuilding.entrance.y)})`, 10, 35);
        }
        
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'left';  // <- **关键**：在这里强制左对齐，避免被别处的 'center' 覆盖
        ctx.fillText(`移动:WASD 交互:Space 背包:B 暂停:P 保存:V`,10,50);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`玩家: (${Math.round(player.worldX)}, ${Math.round(player.worldY)})`, 10, 70);
        ctx.fillText(`场景: ${currentScene}`, 10, 90);
        
        if (['jingyuanA','jingyuanA1','jingyuanA2','jingyuanA3','library','library2',
            'securityRoom','TeachingBuilding','TeachingBuilding1','TeachingBuilding2',
            'TeachingBuilding3','TeachingBuilding4','Hospital'].includes(currentScene)) {
            ctx.fillText(`内部玩家: (${Math.round(interiorPlayer.x)}, ${Math.round(interiorPlayer.y)})`, 10, 110);
        }

        ctx.restore();                 // 恢复画布状态
    }

    
    // 绘制小地图
        // 绘制小地图
    function drawMinimap() {
        if (!backgroundLoaded || currentScene !== 'main') return;
        
        ctx.save();
        
        ctx.beginPath();
        ctx.arc(MINIMAP_POS_X, MINIMAP_POS_Y, MINIMAP_SIZE / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(22, 33, 62, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const mapScale = (MINIMAP_SIZE - 10) / Math.max(scaledBackgroundWidth, scaledBackgroundHeight);
        const mapOffsetX = MINIMAP_POS_X - (scaledBackgroundWidth * mapScale) / 2;
        const mapOffsetY = MINIMAP_POS_Y - (scaledBackgroundHeight * mapScale) / 2;
        
        ctx.fillStyle = 'rgba(76, 201, 240, 0.3)';
        ctx.fillRect(
            mapOffsetX,
            mapOffsetY,
            scaledBackgroundWidth * mapScale,
            scaledBackgroundHeight * mapScale
        );
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.49)';
        buildings.forEach(building => {
            ctx.beginPath();
            const startX = mapOffsetX + (building.points[0].x * mapScale);
            const startY = mapOffsetY + (building.points[0].y * mapScale);
            ctx.moveTo(startX, startY);
            
            for (let i = 1; i < building.points.length; i++) {
                const pointX = mapOffsetX + (building.points[i].x * mapScale);
                const pointY = mapOffsetY + (building.points[i].y * mapScale);
                ctx.lineTo(pointX, pointY);
            }
            
            ctx.closePath();
            ctx.fill();
            
            // 绘制建筑出入口标志
            if (building.entrance) {
                const entranceX = mapOffsetX + (building.entrance.x * mapScale);
                const entranceY = mapOffsetY + (building.entrance.y * mapScale);
                
                // 绘制入口标志
                ctx.fillStyle = '#004bfbff';
                ctx.beginPath();
                ctx.arc(entranceX, entranceY, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制入口标记
                ctx.fillStyle = '#ffffffff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('E', entranceX, entranceY);
            }
        });
        
        const playerMapX = mapOffsetX + (player.worldX * mapScale);
        const playerMapY = mapOffsetY + (player.worldY * mapScale);
        
        ctx.beginPath();
        ctx.arc(playerMapX, playerMapY, PLAYER_MARKER_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        
        ctx.restore();
    }
    
    // 限制玩家在背景范围内
    function constrainPlayerToBackground() {
        if (!backgroundLoaded) return;
        
        player.worldX = Math.max(0, Math.min(player.worldX, scaledBackgroundWidth - player.width));
        player.worldY = Math.max(0, Math.min(player.worldY, scaledBackgroundHeight - player.height));
    }
    
    // 8.（加入新场景）限制内部场景玩家在场景范围内
    function constrainInteriorPlayer() {
        if (!['jingyuanA', 'jingyuanA1','jingyuanA2','jingyuanA3','library', 'library2', 
            'securityRoom','TeachingBuilding','TeachingBuilding2','TeachingBuilding3','TeachingBuilding4','Hospital'].includes(currentScene)) 
        return;
        
        let sceneImage;
        switch(currentScene) {
            case 'TeachingBuilding2': sceneImage = TeachingBuildingImage2; break;
            case 'TeachingBuilding3': sceneImage = TeachingBuildingImage3; break;
            case 'TeachingBuilding4': sceneImage = TeachingBuildingImage4; break;
            case 'jingyuanA': sceneImage = jingyuanAImage; break;
            case 'jingyuanA1': sceneImage = jingyuanAImage1; break;
            case 'jingyuanA2': sceneImage = jingyuanAImage2; break;
            case 'jingyuanA3': sceneImage = jingyuanAImage3; break;
            case 'library': sceneImage = libraryImage; break;
            case 'library2': sceneImage = libraryImage2; break;
            case 'securityRoom': sceneImage = securityRoomImage; break;
            case 'TeachingBuilding': sceneImage = TeachingBuildingImage; break;
            case 'Hospital': sceneImage = HospitalImage; break;
        }
        
        if (sceneImage.complete) {
            const scale = Math.min(W / sceneImage.width, H / sceneImage.height);
            const width = sceneImage.width * scale;
            const height = sceneImage.height * scale;
            
            interiorPlayer.x = Math.max(0, Math.min(interiorPlayer.x, width - interiorPlayer.width));
            interiorPlayer.y = Math.max(0, Math.min(interiorPlayer.y, height - interiorPlayer.height));
        }
    }
    
    // 检查玩家与建筑物的碰撞
    function checkBuildingCollisions() {
        const playerLeft = player.worldX;
        const playerRight = player.worldX + player.width;
        const playerTop = player.worldY;
        const playerBottom = player.worldY + player.height;
        
        for (const building of buildings) {
            if (building.intersectsRect(playerLeft, playerTop, player.width, player.height)) {
                return true;
            }
        }
        
        return false;
    }
    
    // 8.1 检查内部场景玩家与碰撞箱的碰撞（包含图书馆特殊交互检测）
    function checkInteriorCollisions() {
        if (!['jingyuanA', 'jingyuanA1','jingyuanA2','jingyuanA3', 'library', 'library2', 'securityRoom',
            'TeachingBuilding','TeachingBuilding2','TeachingBuilding3','TeachingBuilding4','Hospital'].includes(currentScene)) 
        return false;
        
        const playerLeft = interiorPlayer.x;
        const playerRight = interiorPlayer.x + interiorPlayer.width;
        const playerTop = interiorPlayer.y;
        const playerBottom = interiorPlayer.y + interiorPlayer.height;
        
        for (const collider of interiorColliders) {
            const colliderLeft = collider.x;
            const colliderRight = collider.x + collider.width;
            const colliderTop = collider.y;
            const colliderBottom = collider.y + collider.height;
            
            const collision = playerLeft < colliderRight &&
                playerRight > colliderLeft &&
                playerTop < colliderBottom &&
                playerBottom > colliderTop;
            if (collision) {
                return true;
            }
        }
        return false;
    }

    // 8.2 检查内部场景玩家与交互体的碰撞
    function checkInteriorInteraction(){
        if (!['jingyuanA', 'jingyuanA1','jingyuanA2','jingyuanA3', 'library', 'library2', 'securityRoom','TeachingBuilding',
            'TeachingBuilding2','TeachingBuilding3','TeachingBuilding4','Hospital'].includes(currentScene)) 
        return false;
        
        const playerLeft = interiorPlayer.x;
        const playerRight = interiorPlayer.x + interiorPlayer.width;
        const playerTop = interiorPlayer.y;
        const playerBottom = interiorPlayer.y + interiorPlayer.height;
        
        // 重置图书馆交互状态
        if (currentScene === 'library') {
            libraryInteraction.nearStairs = false;
            libraryInteraction.nearDoor = false;
            libraryInteraction.nearDesk1 = false;
            libraryInteraction.nearBookshelf1 = false;
            libraryInteraction.nearBookshelf = false;
        }
        if (currentScene === 'library2') {
            libraryInteraction.nearDownStairs = false;
            libraryInteraction.nearLab = false;
            libraryInteraction.nearDesk2 = false;
            libraryInteraction.nearDesk3 = false;
            libraryInteraction.nearDesk4 = false;
            libraryInteraction.nearBookshelf2 = false;
        }

        // 重置jingyuanA交互状态
        if (currentScene === 'jingyuanA') {
            jingyuanAInteraction.nearUpStairs = false;
            jingyuanAInteraction.nearDoor = false;
            jingyuanAInteraction.nearAunt = false;
        }

        if (currentScene === 'jingyuanA1') {
            jingyuanAInteraction.nearDownStairs = false;
            jingyuanAInteraction.nearRoom = false;
            jingyuanAInteraction.nearStorage = false;
            jingyuanAInteraction.nearLockedDoor = false;
        }

        if (currentScene === 'jingyuanA2') {
            jingyuanAInteraction.nearBed = false;
            jingyuanAInteraction.nearRoomExit = false;
        }

        if (currentScene === 'jingyuanA3') {
            jingyuanAInteraction.nearBox = false;
            jingyuanAInteraction.nearStorageExit = false;
        }

        // 重置保安亭交互状态
        if (currentScene === 'securityRoom') {
            securityRoomInteraction.nearDoor = false;
            securityRoomInteraction.nearKeys = false;
            securityRoomInteraction.nearGuard = false;
        }
        
        // 重置教学楼交互状态
        if (currentScene === 'TeachingBuilding') {
            TeachingBuildingInteraction.nearDoor = false;
            TeachingBuildingInteraction.nearCorridorDoor1 = false;
            TeachingBuildingInteraction.nearLockedDoor1 = false;
            TeachingBuildingInteraction.nearLockedDoor2 = false;
            TeachingBuildingInteraction.nearLockedDoor3 = false;
        }

        if (currentScene === 'TeachingBuilding2') {
            TeachingBuildingInteraction.nearCorridorDoor2 = false;
            TeachingBuildingInteraction.nearCorridorDoor3 = false;
            TeachingBuildingInteraction.nearStudent = false;
        }

        if (currentScene === 'TeachingBuilding3') {
            TeachingBuildingInteraction.nearCorridorDoor4 = false;
            TeachingBuildingInteraction.nearLockedDoor4 = false;
            TeachingBuildingInteraction.nearLockedDoor5 = false;
            TeachingBuildingInteraction.nearRoom = false;
        }

        if (currentScene === 'TeachingBuilding4') {
            TeachingBuildingInteraction.nearRoomExit = false;
            TeachingBuildingInteraction.nearStorage = false;
        }

        // 重置医院交互状态
        if (currentScene === 'Hospital') {
            HospitalInteraction.nearDoor = false;
            HospitalInteraction.nearWorkTop = false;
            HospitalInteraction.nearPaper = false;
            HospitalInteraction.nearNeedleTubing = false;
        }

        let isInteracting = false;
        
        for (const actor of interiorInteractors) {
            const actorLeft = actor.x;
            const actorRight = actor.x + actor.width;
            const actorTop = actor.y;
            const actorBottom = actor.y + actor.height;
            
            const interaction = playerLeft < actorRight &&
                playerRight > actorLeft &&
                playerTop < actorBottom &&
                playerBottom > actorTop;
            
            if (interaction) {
                isInteracting = true;
                
                // 检测图书馆特殊碰撞
                if (currentScene === 'library') {
                    if (actor.type === 'stairs') {
                        libraryInteraction.nearStairs = true;
                    }
                    if (actor.type === 'door') {
                        libraryInteraction.nearDoor = true;
                    }
                    if (actor.type === 'desk1') {
                        libraryInteraction.nearDesk1 = true;
                    }
                    if (actor.type === 'bookshelf') {
                        libraryInteraction.nearBookshelf = true;
                    }
                    if (actor.type === 'bookshelf1') {
                        libraryInteraction.nearBookshelf1 = true;
                    }
                }

                // 检测图书馆二楼下楼楼梯
                if (currentScene === 'library2' ) {
                    if (actor.type === 'downStairs') {
                        libraryInteraction.nearDownStairs = true;
                    }
                    if (actor.type === 'lab') {
                        libraryInteraction.nearLab = true;
                    }
                    if (actor.type === 'desk2') {
                        libraryInteraction.nearDesk2 = true;
                    }
                    if (actor.type === 'desk3') {
                        libraryInteraction.nearDesk3 = true;
                    }
                    if (actor.type === 'desk4') {
                        libraryInteraction.nearDesk4 = true;
                    }
                    if (actor.type === 'bookshelf2') {
                        libraryInteraction.nearBookshelf2 = true;
                    }
                }

                // 检测jingyuanAhall特殊碰撞
                if (currentScene === 'jingyuanA') {
                    if (actor.type === 'upstairs') {
                        jingyuanAInteraction.nearUpStairs = true;
                    }
                    if (actor.type === 'door') {
                        jingyuanAInteraction.nearDoor = true;
                    }
                    if (actor.type === 'aunt') {
                        jingyuanAInteraction.nearAunt = true;
                    }
                }

                // 检测jingyuanA corridor特殊碰撞
                if (currentScene === 'jingyuanA1') {
                    if (actor.type === 'downstairs') {
                        jingyuanAInteraction.nearDownStairs = true;
                    }
                    if (actor.type === 'room') {
                        jingyuanAInteraction.nearRoom = true;
                    }
                    if (actor.type === 'storage') {
                        jingyuanAInteraction.nearStorage = true;
                    }
                    if (actor.type === 'lockedroom') {
                        jingyuanAInteraction.nearLockedDoor = true;
                    }
                }

                if (currentScene === 'jingyuanA2') {
                    if (actor.type === 'bed') {
                        jingyuanAInteraction.nearBed = true;
                    }
                    if (actor.type === 'roomexit') {
                        jingyuanAInteraction.nearRoomExit = true;
                    }
                }

                if (currentScene === 'jingyuanA3') {
                    if (actor.type === 'box') {
                        jingyuanAInteraction.nearBox = true;
                    }
                    if (actor.type === 'storageexit') {
                        jingyuanAInteraction.nearStorageExit = true;
                    }
                }

                // 检测保安亭特殊碰撞
                if (currentScene === 'securityRoom') {
                    if (actor.type === 'door') {
                        securityRoomInteraction.nearDoor = true;
                    }
                    if (actor.type === 'keys') {
                        securityRoomInteraction.nearKeys = true;
                    }
                    if (actor.type === 'guard') {
                        securityRoomInteraction.nearGuard = true;
                    }
                }

                // 检测教学楼特殊碰撞
                if (currentScene === 'TeachingBuilding') {
                    if (actor.type === 'door') {
                        TeachingBuildingInteraction.nearDoor = true;
                    }
                    if (actor.type === 'corridordoor1') {
                        TeachingBuildingInteraction.nearCorridorDoor1 = true;
                    }
                    if (actor.type === 'lockeddoor1') {
                        TeachingBuildingInteraction.nearLockedDoor1 = true;
                    }
                    if (actor.type === 'lockeddoor2') {
                        TeachingBuildingInteraction.nearLockedDoor2 = true;
                    }
                    if (actor.type === 'lockeddoor3') {
                        TeachingBuildingInteraction.nearLockedDoor3 = true;
                    }
                }

                if (currentScene === 'TeachingBuilding2') {
                    if (actor.type === 'corridordoor2') {
                        TeachingBuildingInteraction.nearCorridorDoor2 = true;
                    }
                    if (actor.type === 'corridordoor3') {
                        TeachingBuildingInteraction.nearCorridorDoor3 = true;
                    }
                    if (actor.type === 'student') {
                        TeachingBuildingInteraction.nearStudent = true;
                    }
                }

                if (currentScene === 'TeachingBuilding3') {
                    if (actor.type === 'corridordoor4') {
                        TeachingBuildingInteraction.nearCorridorDoor4 = true;
                    }
                    if (actor.type === 'lockeddoor4') {
                        TeachingBuildingInteraction.nearLockedDoor4 = true;
                    }
                    if (actor.type === 'lockeddoor5') {
                        TeachingBuildingInteraction.nearLockedDoor5 = true;
                    }
                    if (actor.type === 'room') {
                        TeachingBuildingInteraction.nearRoom = true;
                    }
                }

                if (currentScene === 'TeachingBuilding4') {
                    if (actor.type === 'roomexit') {
                        TeachingBuildingInteraction.nearRoomExit = true;
                    }
                    if (actor.type === 'storage') {
                        TeachingBuildingInteraction.nearStorage = true;
                    }
                }
                
                if (currentScene === 'Hospital') {
                    if (actor.type === 'door') {
                        HospitalInteraction.nearDoor = true;
                    }
                    if (actor.type === 'worktop') {
                        HospitalInteraction.nearWorkTop = true;
                    }
                    if (actor.type === 'paper') {
                        HospitalInteraction.nearPaper = true;
                    }
                    if (actor.type === 'needletubing') {
                        HospitalInteraction.nearNeedleTubing = true;
                    }
                }
            }
        }
        
        return isInteracting;
    }
    
    // 检查玩家是否靠近建筑物入口
    function checkNearBuildings() {
        nearBuilding = null;
        
        for (const building of buildings) {
            if (building.isPlayerNearEntrance()) {
                nearBuilding = building;
                break;
            }
        }
        
        return nearBuilding !== null;
    }
    
    // 进入建筑物场景
    function enterBuilding(building) {
        if (['library', 'library2','TeachingBuilding','Hospital'].includes(building.sceneName)){
            if (!keys) {
                alert('门锁住了，你需要钥匙');
                return;
            }
        }

        if (['jingyuanB', 'jingyuanC','jingyuanD','DiningHall','AdministrativeBuilding'].includes(building.sceneName)){
            alert('大门被堵住了');
            return;
        }
        console.log(`进入${building.name}场景`);

        // 成就追踪：记录进入的建筑物
        if (!enteredBuildings.has(building.sceneName)) {
            enteredBuildings.add(building.sceneName);
            updateAchievementProgress('explorer');
        }
        
        // 成就追踪：图书馆访问次数
        if (building.sceneName === 'library' || building.sceneName === 'library2') {
            libraryVisits++;
            updateAchievementProgress('library_visitor');
        }
        
    //     if (building.sceneName === 'securityRoom') {
    //     window.location.href = "保安亭.html";  // 主目录下要有这个文件
    //     return;
    // }
    //         if (building.sceneName === 'TeachingBuilding') {
    //     window.location.href = "jiaoxuelou.html";  // 主目录下要有这个文件
    //     return;
    // }
        currentScene = building.sceneName;
        nearBuilding = null;
        
        // 暂停主游戏循环
        cancelAnimationFrame(gameLoop);
        if (obstacleInterval) {
            clearInterval(obstacleInterval);
        }
        
        // 9.初始化内部场景玩家位置
        let sceneImage;
        switch(currentScene) {
            case 'jingyuanA': sceneImage = jingyuanAImage; break;
            case 'jingyuanA1': sceneImage = jingyuanAImage1; break;
            case 'jingyuanA2': sceneImage = jingyuanAImage2; break;
            case 'jingyuanA3': sceneImage = jingyuanAImage3; break;
            case 'library': sceneImage = libraryImage; break;
            case 'library2': sceneImage = libraryImage2; break;
            case 'securityRoom': sceneImage = securityRoomImage; break;
            case 'library2': sceneImage = libraryImage2; break;
            case 'TeachingBuilding': sceneImage = TeachingBuildingImage; break;
            case 'TeachingBuilding2': sceneImage = TeachingBuildingImage2; break;
            case 'TeachingBuilding3': sceneImage = TeachingBuildingImage3; break;
            case 'TeachingBuilding4': sceneImage = TeachingBuildingImage4; break;
            case 'Hospital': sceneImage = HospitalImage; break;
        }
        
        if (sceneImage.complete) {
            const scale = Math.min(W / sceneImage.width, H / sceneImage.height);
            const width = sceneImage.width * scale;
            const height = sceneImage.height * scale;
            
            // 根据不同场景设置初始位置
            switch(currentScene) {
                case 'jingyuanA': 
                    interiorPlayer.x = 750 * scale;
                    interiorPlayer.y = 400 * scale;
                    break;
                // case 'jingyuanA1': 
                //     interiorPlayer.x = 820 * scale;
                //     interiorPlayer.y = 1200 * scale;
                //     break;
                // case 'jingyuanA2': 
                //     interiorPlayer.x = 750 * scale;
                //     interiorPlayer.y = 400 * scale;
                //     break;
                // case 'jingyuanA3': 
                //     interiorPlayer.x = 750 * scale;
                //     interiorPlayer.y = 400 * scale;
                //     break;
                case 'library': 
                    interiorPlayer.x = 1250 * scale;
                    interiorPlayer.y = 600 * scale;
                    break;
                case 'securityRoom': 
                    interiorPlayer.x = 820 * scale;
                    interiorPlayer.y = 1200 * scale;
                    break;
                // case 'library2': 
                //     interiorPlayer.x = 50 * scale;  
                //     interiorPlayer.y = 520 * scale;  
                //     break;
                case 'TeachingBuilding': 
                    interiorPlayer.x = 150 * scale;
                    interiorPlayer.y = 600 * scale;
                    break;
                case 'Hospital': 
                    interiorPlayer.x = W * 0.65;  
                    interiorPlayer.y = H * 0.27;
                    break;
            }

            interiorPlayer.dx = 0;
            interiorPlayer.dy = 0;
        }
        
        // 初始化对应场景的碰撞箱
        initInteriorColliders(currentScene);
        initInteriorInteractors(currentScene);
        
        // 开始绘制内部场景
        drawInteriorSceneLoop();
    }
    
    // 10.图书馆场景切换（一楼→二楼或二楼→一楼）
    function switchLibraryFloor(targetFloor) {
        // 保存当前玩家位置用于返回时定位
        const currentX = interiorPlayer.x;
        const currentY = interiorPlayer.y;
        
        currentScene = targetFloor;
        
        // 初始化目标楼层场景
        let sceneImage = targetFloor === 'library2' ? libraryImage2 : libraryImage;
        if (sceneImage.complete) {
            const scale = Math.min(W / sceneImage.width, H / sceneImage.height);
            const width = sceneImage.width * scale;
            const height = sceneImage.height * scale;
            
            // 设置对应楼层的初始位置（与楼梯位置对应）
            if (targetFloor === 'library2') {
                // 从一楼上到二楼，位置对应楼梯
                interiorPlayer.x = 200 * scale;
                interiorPlayer.y = 900 * scale;
            } else {
                // 从二楼下到一楼，位置对应楼梯
                interiorPlayer.x = canvas.width*0.15;
                interiorPlayer.y = H*0.32;
            }
            
            interiorPlayer.dx = 0;
            interiorPlayer.dy = 0;
        }
        
        // 初始化目标楼层碰撞箱
        initInteriorColliders(currentScene);
        initInteriorInteractors(currentScene);
    }
    
    // 静园场景切换
    function switchjingyuanA(origin,target) {
        // 保存当前玩家位置用于返回时定位
        const currentX = interiorPlayer.x;
        const currentY = interiorPlayer.y;
        
        currentScene = target;
        
        // 初始化目标楼层场景
        let sceneImage;
        switch(target) {
            case 'jingyuanA1': sceneImage = jingyuanAImage1; break;
            case 'jingyuanA2': sceneImage = jingyuanAImage2; break;
            case 'jingyuanA3': sceneImage = jingyuanAImage3; break;
            default: sceneImage = jingyuanAImage; break;
        }
        
        if (sceneImage.complete) {
            const scale = Math.min(W / sceneImage.width, H / sceneImage.height);
            const width = sceneImage.width * scale;
            const height = sceneImage.height * scale;
            
            // 设置对应楼层的初始位置（与楼梯位置对应）
            if (origin === 'jingyuanA' && target === 'jingyuanA1') {
                // 从一楼上到二楼，位置对应楼梯
                interiorPlayer.x = 320 * scale;
                interiorPlayer.y = 720 * scale;
            } else if (origin === 'jingyuanA2' && target === 'jingyuanA1') {
                interiorPlayer.x = canvas.width*0.55;
                interiorPlayer.y = H*0.45;
                // 成就追踪：拒绝躺平（走出宿舍楼）     
                unlockAchievement('no_layoff');
            } else if (origin === 'jingyuanA3' && target === 'jingyuanA1') {
                interiorPlayer.x = canvas.width*0.27;
                interiorPlayer.y = H*0.55;
            } else if (target === 'jingyuanA2') {
                interiorPlayer.x = canvas.width*0.5;
                interiorPlayer.y = H*0.8;
            } else if (target === 'jingyuanA3') {
                // 从二楼下到一楼，位置对应楼梯
                interiorPlayer.x = canvas.width*0.9;
                interiorPlayer.y = H*0.5;
            } else if (target === 'jingyuanA') {
                // 从二楼下到一楼，位置对应楼梯
                interiorPlayer.x = canvas.width*0.13;
                interiorPlayer.y = H*0.51;
            }
            
            interiorPlayer.dx = 0;
            interiorPlayer.dy = 0;
        }
        
        // 初始化目标楼层碰撞箱
        initInteriorColliders(currentScene);
        initInteriorInteractors(currentScene);
    }

    // 静园场景切换
    function switchTeachingBuilding(origin,target) {
        // 保存当前玩家位置用于返回时定位
        const currentX = interiorPlayer.x;
        const currentY = interiorPlayer.y;
        
        currentScene = target;
        
        // 初始化目标楼层场景
        let sceneImage;
        switch(target) {
            case 'TeachingBuilding2': sceneImage = TeachingBuildingImage2; break;
            case 'TeachingBuilding3': sceneImage = TeachingBuildingImage3; break;
            case 'TeachingBuilding4': sceneImage = TeachingBuildingImage4; break;
            default: sceneImage = TeachingBuildingImage; break;
        }
        
        if (sceneImage.complete) {
            const scale = Math.min(W / sceneImage.width, H / sceneImage.height);
            const width = sceneImage.width * scale;
            const height = sceneImage.height * scale;
            
            // 设置对应楼层的初始位置（与楼梯位置对应）
            if (origin === 'TeachingBuilding' && target === 'TeachingBuilding2') {
                interiorPlayer.x = 160 * scale;
                interiorPlayer.y = 650 * scale;
            } else if (origin === 'TeachingBuilding3' && target === 'TeachingBuilding2') {
                interiorPlayer.x = canvas.width*0.86;
                interiorPlayer.y = H*0.8;
            }else if (origin === 'TeachingBuilding2' && target === 'TeachingBuilding') {
                interiorPlayer.x = canvas.width*0.86;
                interiorPlayer.y = H*0.65;
            } else if (origin === 'TeachingBuilding4' && target === 'TeachingBuilding3') {
                interiorPlayer.x = canvas.width*0.35;
                interiorPlayer.y = H*0.5;
            } else if (origin === 'TeachingBuilding2' && target === 'TeachingBuilding3') {
                interiorPlayer.x = canvas.width*0.86;
                interiorPlayer.y = H*0.65;
            } else if (target === 'TeachingBuilding4') {
                interiorPlayer.x = canvas.width*0.5;
                interiorPlayer.y = H*0.9;
            } 
            interiorPlayer.dx = 0;
            interiorPlayer.dy = 0;
        }
        
        // 初始化目标楼层碰撞箱
        initInteriorColliders(currentScene);
        initInteriorInteractors(currentScene);
    }

    // 退出建筑物场景
    function exitBuilding() {
        console.log("退出建筑物，返回校园");

        cancelAnimationFrame(gameLoop);

        currentScene = 'main';
        
        // 恢复主游戏循环
        update();
        obstacleInterval = setInterval(spawnObstacle, 2000);
    }
    
    // 内部场景绘制循环
    // 修改内部场景绘制循环函数，添加倒计时显示
    function drawInteriorSceneLoop() {
        if (isPaused||menu_paused) {
            draw();
            gameLoop = requestAnimationFrame(drawInteriorSceneLoop);
            return;
        }

        // 更新感染倒计时
        if (isInfected && !isPaused && !menu_paused) {
            infectionTime = INFECTION_DURATION - (Date.now() - infectionStartTime);
            if (infectionTime <= 0) {
                gameOver();
                return;
            }
        }

        // 更新内部场景玩家位置
        if (['jingyuanA', 'jingyuanA1', 'jingyuanA2', 'jingyuanA3', 'library', 'library2', 'securityRoom','TeachingBuilding'
            ,'TeachingBuilding2','TeachingBuilding3','TeachingBuilding4','Hospital'].includes(currentScene)) {
            const prevX = interiorPlayer.x;
            const prevY = interiorPlayer.y;

            interiorPlayer.x += interiorPlayer.dx;
            if (checkInteriorCollisions()) {
                interiorPlayer.x = prevX;
            }
            
            interiorPlayer.y += interiorPlayer.dy;
            if (checkInteriorCollisions()) {
                interiorPlayer.y = prevY;
            }
            
            constrainInteriorPlayer();
        }
        
        checkInteriorInteraction();
        drawInteriorScene();
        drawDebugInfo();
        
        // 绘制感染倒计时
        if (isInfected) {
            drawInfectionTimer();
        }
        
        gameLoop = requestAnimationFrame(drawInteriorSceneLoop);
    }
    
    // 获取玩家与建筑物的碰撞法向量
    function getCollisionNormal() {
        const playerCenterX = player.worldX + player.width / 2;
        const playerCenterY = player.worldY + player.height / 2;
        
        let closestDistance = Infinity;
        let normalX = 0;
        let normalY = 0;
        
        for (const building of buildings) {
            for (let i = 0; i < building.points.length; i++) {
                const j = (i + 1) % building.points.length;
                const p1 = building.points[i];
                const p2 = building.points[j];
                
                // 计算线段到点的最近距离和法向量
                const result = pointToLineDistance(playerCenterX, playerCenterY, p1.x, p1.y, p2.x, p2.y);
                
                if (result.distance < closestDistance && result.distance < player.width / 2) {
                    closestDistance = result.distance;
                    normalX = result.normalX;
                    normalY = result.normalY;
                }
            }
        }
        
        return { normalX, normalY };
    }
    
    // 计算点到线段的距离和法向量
    function pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        
        if (len_sq !== 0) {
            param = dot / len_sq;
        }
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算法向量（从点指向线段）
        const normalX = dx / distance;
        const normalY = dy / distance;
        
        return { distance, normalX, normalY };
    }

    // 添加绘制感染倒计时函数
    function drawInfectionTimer() {
        const minutes = Math.floor(infectionTime / 60000);
        const seconds = Math.floor((infectionTime % 60000) / 1000);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(W/2 - 100, 20, 200, 40);
        
        ctx.fillStyle = '#ffffffaf';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`病毒发作倒计时: ${timeString}`, W/2, 45);
    }
    
    // 更新游戏状态
    function update() {
        if (currentScene !== 'main') return;

        if(isPaused||menu_paused){
            draw();
            gameLoop=requestAnimationFrame(update);
            return;
        }

        // 更新感染倒计时
        if (isInfected && !isPaused && !menu_paused) {
            infectionTime = INFECTION_DURATION - (Date.now() - infectionStartTime);
            if (infectionTime <= 0) {
                gameOver();
                return;
            }
        }
        
        const prevX = player.worldX;
        const prevY = player.worldY;
        
        player.worldX += player.dx;
        player.worldY += player.dy;
        
        // 精确的碰撞响应算法
        if (checkBuildingCollisions()) {
            // 获取碰撞法向量
            const { normalX, normalY } = getCollisionNormal();
            
            if (normalX !== 0 || normalY !== 0) {
                // 计算在法向量方向上的投影
                const dot = player.dx * normalX + player.dy * normalY;
                
                // 移除法向量方向的速度分量
                const slideX = player.dx - dot * normalX;
                const slideY = player.dy - dot * normalY;
                
                // 应用滑动速度
                player.worldX = prevX + slideX;
                player.worldY = prevY + slideY;
                
                // 如果仍然碰撞，完全停止
                if (checkBuildingCollisions()) {
                    player.worldX = prevX;
                    player.worldY = prevY;
                }
            } else {
                // 无法获取法向量，使用备选方案
                player.worldX = prevX;
                player.worldY = prevY;
            }
        }
        
        // 检查玩家是否靠近建筑物入口
        checkNearBuildings();
        updatePlayerDirection();
        constrainPlayerToBackground();
        
        obstacles.forEach(obstacle => {
            const prevObstacleX = obstacle.worldX;
            const prevObstacleY = obstacle.worldY;
        
            obstacle.worldX += obstacle.dx;
            obstacle.worldY += obstacle.dy;

            // 检查僵尸是否与建筑物碰撞
            if (checkObstacleBuildingCollision(obstacle)) {
                // 反弹效果
                obstacle.worldX = prevObstacleX;
                obstacle.worldY = prevObstacleY;
                
                // 随机改变方向实现反弹效果
                obstacle.dx = -obstacle.dx + (Math.random() - 0.5) * 2;
                obstacle.dy = -obstacle.dy + (Math.random() - 0.5) * 2;
            }
        });

        
        obstacles = obstacles.filter(obstacle => {
            const isOffScreen = 
                obstacle.worldX + obstacle.width < player.worldX - W/2 - 100 ||
                obstacle.worldX > player.worldX + W/2 + 100 ||
                obstacle.worldY + obstacle.height < player.worldY - H/2 - 100 ||
                obstacle.worldY > player.worldY + H/2 + 100;
            
            if (isOffScreen) {
                scoreElement.textContent = stones;
                return false;
            }
            return true;
        });
        
        if (checkObstacleCollisions()) {
        }
        
        drawBackground();
        drawBuildings();
        drawObstacles();
        drawPlayer();
        if(!Flashlight){
            drawRoundDarkness();
        }else {
            drawDarkness();
            drawFlashlight();
        };
        if (isInfected) {
            drawInfectionTimer();
        }
        drawEnterPrompt();
        drawMinimap();
        drawDebugInfo();
        
        gameLoop = requestAnimationFrame(update);
    }

    // 检查障碍物是否与建筑物碰撞
    function checkObstacleBuildingCollision(obstacle) {
        const obstacleLeft = obstacle.worldX;
        const obstacleRight = obstacle.worldX + obstacle.width;
        const obstacleTop = obstacle.worldY;
        const obstacleBottom = obstacle.worldY + obstacle.height;
        
        for (const building of buildings) {
            if (building.intersectsRect(obstacleLeft, obstacleTop, obstacle.width, obstacle.height)) {
                return true;
            }
        }
        
        return false;
    }

    function draw(){
        if (currentScene === 'main') {
            drawBackground();
            drawBuildings();
            drawObstacles();
            drawPlayer();
            drawEnterPrompt();
            drawMinimap();
        } else {
            drawInteriorScene();
        }
            
        // 如果游戏暂停，显示暂停提示
        if (isPaused&&!menu_paused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, W, H);
                
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('游戏暂停', W / 2, H / 2);
                
            ctx.font = '20px Arial';
            ctx.fillText('按 P 键继续游戏', W / 2, H / 2 + 40);
        }
        drawDebugInfo();
    }
    
    // 更新玩家朝向
    function updatePlayerDirection() {
        if (player.dx !== 0 || player.dy !== 0) {
            player.direction = Math.atan2(player.dy, player.dx);
        }
    }
    
    // 生成障碍物
    function spawnObstacle() {
        if (!isGameRunning || !backgroundLoaded || currentScene !== 'main' || isPaused || menu_paused) return;
        
        const width = Math.random() * 40 + 20;
        const height = Math.random() * 40 + 20;
        
        const spawnDistance = 600;
        let worldX, worldY, dx, dy;
        
        const direction = Math.random();
        
        if (direction < 0.25) {
            worldX = player.worldX - spawnDistance;
            worldY = player.worldY - 200 + Math.random() * 400;
            dx = Math.random() * 0.75 + 2;
            dy = (Math.random() - 0.25) * 1;
        } else if (direction < 0.5) {
            worldX = player.worldX + spawnDistance;
            worldY = player.worldY - 200 + Math.random() * 400;
            dx = -(Math.random() * 0.75 + 2);
            dy = (Math.random() - 0.25) * 1;
        } else if (direction < 0.75) {
            worldX = player.worldX - 200 + Math.random() * 400;
            worldY = player.worldY - spawnDistance;
            dx = (Math.random() - 0.5) * 0.25;
            dy = Math.random() * 0.75 + 2;
        } else {
            worldX = player.worldX - 200 + Math.random() * 400;
            worldY = player.worldY + spawnDistance;
            dx = (Math.random() - 0.5) * 0.25;
            dy = -(Math.random() * 0.75 + 2);
        }
        
        worldX = Math.max(0, Math.min(worldX, scaledBackgroundWidth - width));
        worldY = Math.max(0, Math.min(worldY, scaledBackgroundHeight - height));
        
        // 确保僵尸不在建筑物内部生成
        const obstacle = {
            worldX: worldX,
            worldY: worldY,
            width: width,
            height: height,
            dx: dx,
            dy: dy
        };
    
        // 检查生成位置是否在建筑物内
        if (isPositionInBuilding(obstacle.worldX, obstacle.worldY, obstacle.width, obstacle.height)) {
            return; // 如果在建筑物内，则不生成
        }
    
        obstacles.push(obstacle);
    }

    // 检查位置是否在建筑物内
    function isPositionInBuilding(x, y, width, height) {
        for (const building of buildings) {
            if (building.containsPoint(x, y) ||
                building.containsPoint(x + width, y) ||
                building.containsPoint(x, y + height) ||
                building.containsPoint(x + width, y + height)) {
                return true;
            }
        }
        return false;
    }

    // 障碍物碰撞检测
    function checkObstacleCollisions() {
        const playerLeft = player.worldX;
        const playerRight = player.worldX + player.width;
        const playerTop = player.worldY;
        const playerBottom = player.worldY + player.height;
        
        return obstacles.some(obstacle => {
            const obstacleLeft = obstacle.worldX;
            const obstacleRight = obstacle.worldX + obstacle.width;
            const obstacleTop = obstacle.worldY;
            const obstacleBottom = obstacle.worldY + obstacle.height;
            
            const collision = playerLeft < obstacleRight &&
                playerRight > obstacleLeft &&
                playerTop < obstacleBottom &&
                playerBottom > obstacleTop;
                
            // 如果发生碰撞且玩家未被感染
            if (collision && !isInfected) {
                // 设置感染状态
                isInfected = true;
                infectionStartTime = Date.now();
                infectionTime = INFECTION_DURATION;
                
                // 显示感染提示
                alert("你不幸被感染了，病毒潜伏期是二十五分钟，你必须在二十五分钟内找到或制得解药。");
                biteAudio.currentTime = 0;
                biteAudio.play();
            }
            
            return collision;
        });
    }

    // 游戏结束
    function gameOver() {
        isGameRunning = false;
        cancelAnimationFrame(gameLoop);
        clearInterval(obstacleInterval);
        
        drawBackground();
        drawBuildings();
        drawPlayer();
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        
        // 根据游戏结束原因显示不同信息
        if (isInfected && infectionTime <= 0) {
            ctx.fillText('病毒发作，你没能及时找到解药!', W / 2, H / 2);
                    dieAudio.currentTime = 0;
        dieAudio.play();
        } else {
            ctx.fillText('游戏结束!', W / 2, H / 2);
        }
        
        // ctx.fillText(`最终分数: ${stones}`, W / 2, H / 2 + 40);
        clearInventory();  // 玩家死亡 → 背包清空
    }

        // 游戏结束
    function gameOver() {
        isGameRunning = false;
        cancelAnimationFrame(gameLoop);
        clearInterval(obstacleInterval);
        
        drawBackground();
        drawBuildings();
        drawPlayer();
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        
        // 根据游戏结束原因显示不同信息
        if (isInfected && infectionTime <= 0) {
            ctx.fillText('病毒发作，你没能及时找到解药!', W / 2, H / 2);
                    dieAudio.currentTime = 0;
        dieAudio.play();
        } else {
            ctx.fillText('游戏结束!', W / 2, H / 2);
        }
        
        // ctx.fillText(`最终分数: ${stones}`, W / 2, H / 2 + 40);
        clearInventory();  // 玩家死亡 → 背包清空
    }

// 添加保存游戏函数
    function saveGame() {
        if (!isGameRunning) return;
        
        // 在保存前更新感染时间（如果被感染）
        if (isInfected && infectionStartTime > 0) {
            infectionTime = INFECTION_DURATION - (Date.now() - infectionStartTime);
            // 确保感染时间不会小于0
            infectionTime = Math.max(0, infectionTime);
        }
        
        const saveData = {
            player: {
                worldX: player.worldX,
                worldY: player.worldY,
                x: player.x,
                y: player.y,
                direction: player.direction
            },
            interiorPlayer: {
                x: interiorPlayer.x,
                y: interiorPlayer.y,
                direction: interiorPlayer.direction
            },
            currentScene: currentScene,
            items: {
                keys: keys,
                Flashlight: Flashlight,
                antibody: antibody,
                elementA: elementA,
                elementB: elementB,
                formula: formula,
                needletubing: needletubing
            },
            stats: {
                stones: stones,
                isInfected: isInfected,
                infectionTime: infectionTime,
                // 不再保存感染开始时间，而是保存剩余时间
                infectionStartTime: isInfected ? Date.now() : 0
            }
        };
        
        localStorage.setItem("mygameSave", JSON.stringify(saveData));
        handleDialogue(["游戏已保存！"]);
    }

    // 添加加载游戏函数
    function loadGame() {
        const saveData = localStorage.getItem("mygameSave");
        if (!saveData) {
            handleDialogue(["没有找到存档文件！"]);
            return false;
        }
        
        try {
            const data = JSON.parse(saveData);
            
            player.worldX = data.player.worldX;
            player.worldY = data.player.worldY;
            player.x = data.player.x || 0;
            player.y = data.player.y || 0;
            player.direction = data.player.direction || 0;
            
            interiorPlayer.x = data.interiorPlayer.x;
            interiorPlayer.y = data.interiorPlayer.y;
            interiorPlayer.direction = data.interiorPlayer.direction || 0;
            
            currentScene = data.currentScene;
            
            keys = data.items.keys;
            Flashlight = data.items.Flashlight;
            antibody = data.items.antibody;
            elementA = data.items.elementA;
            elementB = data.items.elementB;
            formula = data.items.formula;
            needletubing = data.items.needletubing;
            
            stones = data.stats.stones;
            isInfected = data.stats.isInfected;
            infectionTime = data.stats.infectionTime;
            // 使用保存的时间重新计算感染开始时间
            infectionStartTime = data.stats.infectionStartTime || 0;
            
            // 修复感染状态恢复逻辑
            if (isInfected && infectionStartTime > 0) {
                // 重新设置感染开始时间，确保倒计时正确
                infectionStartTime = Date.now() - (INFECTION_DURATION - infectionTime);
            }
            
            scoreElement.textContent = stones;
            
            // 根据当前场景初始化相应状态
            if (currentScene === 'main') {
                initBuildings();
                // 修复：确保游戏循环正确恢复
                cancelAnimationFrame(gameLoop); // 先取消可能存在的旧循环
                update();
                // 修复：确保障碍物生成间隔正确恢复
                if (obstacleInterval) {
                    clearInterval(obstacleInterval);
                }
                obstacleInterval = setInterval(spawnObstacle, 1000);
            } else {
                initInteriorColliders(currentScene);
                initInteriorInteractors(currentScene);
                // 修复：确保内部场景循环正确恢复
                cancelAnimationFrame(gameLoop); // 先取消可能存在的旧循环
                drawInteriorSceneLoop();
            }
            
            handleDialogue(["存档读取成功！"]);
            return true;
        } catch (e) {
            handleDialogue(["存档文件损坏！"]);
            return false;
        }
    }

    function startGame() {
        const saveData = localStorage.getItem("mygameSave");
        if (!saveData) {
            // alert("没有存档！");
            if (backgroundLoaded) {
                // 设置玩家出生位置 initiate the player's position in main map
                // 静园A
                player.worldX = 640 * BACKGROUND_SCALE;
                player.worldY = 4380 * BACKGROUND_SCALE; 
                
                // 保安室
                // player.worldX = 2058 * BACKGROUND_SCALE;
                // player.worldY = 4470 * BACKGROUND_SCALE;

                // //图书馆
                // player.worldX = 2572 * BACKGROUND_SCALE;
                // player.worldY = 4300 * BACKGROUND_SCALE;

                // //综教楼
                // player.worldX = 2025 * BACKGROUND_SCALE;
                // player.worldY = 3000 * BACKGROUND_SCALE;

                // //校医院
                // player.worldX = 1406 * BACKGROUND_SCALE;
                // player.worldY = 2900 * BACKGROUND_SCALE;
            } else {
                player.worldX = 0;
                player.worldY = 0;
            }
            
            clearInventory(); 

            isGameRunning = true;
            isPaused = false;
            menu_paused = false;

            if (currentScene === 'jingyuanA2') {
                // 设置玩家在 jingyuanA2 场景中的初始位置
                const sceneImage = jingyuanAImage2;
                if (sceneImage.complete) {
                    const scale = Math.min(W / sceneImage.width, H / sceneImage.height);
                    interiorPlayer.x = canvas.width * 0.25;  // 设置初始位置
                    interiorPlayer.y = H * 0.37;             // 设置初始位置
                    // interiorPlayer.x = W * 0.65;  // 设置初始位置
                    // interiorPlayer.y = H * 0.27;             // 设置初始位置
                    interiorPlayer.dx = 0;
                    interiorPlayer.dy = 0;
                }
                
                // 初始化 jingyuanA2 场景的碰撞箱和交互体
                initInteriorColliders(currentScene);
                initInteriorInteractors(currentScene);
                
                // 开始绘制内部场景
                cancelAnimationFrame(gameLoop); // 确保没有旧的动画循环
                drawInteriorSceneLoop();
            } else {
                player.dx = 0;
                player.dy = 0;
                player.direction = 0;
                obstacles = [];
                stones = 0;
                scoreElement.textContent = stones;
                isGameRunning = true;
                currentScene = 'jingyuanA2';
                nearBuilding = null;
                Flashlight = false;
                keys = false;

                isInfected = false;
                infectionTime = 0;
                infectionStartTime = 0;

                initBuildings();
                
                cancelAnimationFrame(gameLoop); // 确保没有旧的动画循环
                update();
                if (obstacleInterval) {
                    clearInterval(obstacleInterval);
                }
                obstacleInterval = setInterval(spawnObstacle, 1000);
            }
        } else {
            const data = JSON.parse(saveData);

            player.worldX = data.player.worldX;
            player.worldY = data.player.worldY;

            interiorPlayer.x = data.interiorPlayer.x;
            interiorPlayer.y = data.interiorPlayer.y;
            interiorPlayer.direction = data.interiorPlayer.direction;

            currentScene = data.currentScene;

            keys = data.items.keys;
            Flashlight = data.items.Flashlight;
            antibody = data.items.antibody;
            elementA = data.items.elementA;
            elementB = data.items.elementB;
            formula = data.items.formula;
            needletubing = data.items.needletubing;

            stones = data.stats.stones;
            isInfected = data.stats.isInfected;
            infectionTime = data.stats.infectionTime;
            infectionStartTime = data.stats.infectionStartTime || 0;

            // 修复感染状态恢复逻辑
            if (isInfected && infectionStartTime > 0) {
                // 重新设置感染开始时间，确保倒计时正确
                infectionStartTime = Date.now() - (INFECTION_DURATION - infectionTime);
                
                // 检查是否已经超时
                if (infectionTime <= 0) {
                    // 如果感染时间已过期，游戏结束
                    gameOver();
                    return;
                }
            }

            isGameRunning = true;
            isPaused = false;
            menu_paused = false;

            if (currentScene === 'main'){
                initBuildings();
                cancelAnimationFrame(gameLoop); // 确保没有旧的动画循环
                update();
                if (obstacleInterval) {
                    clearInterval(obstacleInterval);
                }
                obstacleInterval = setInterval(spawnObstacle, 1000);
            } else {
                // 初始化 jingyuanA2 场景的碰撞箱和交互体
                initInteriorColliders(currentScene);
                initInteriorInteractors(currentScene);
                
                // 开始绘制内部场景
                cancelAnimationFrame(gameLoop); // 确保没有旧的动画循环
                drawInteriorSceneLoop();
            }
            alert("存档读取成功");
        }
    }


    // 添加开始动画变量
    let startAnimationActive = true;
    let animationStartTime = 0;
    const ANIMATION_DURATION = 3000; // 3秒动画

    // 绘制开始动画
    function drawStartAnimation() {
        if (!startAnimationActive) return;
        
        const currentTime = Date.now();
        if (animationStartTime === 0) {
            animationStartTime = currentTime;
        }
        
        const elapsed = currentTime - animationStartTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
        
        // 清除画布
        ctx.clearRect(0, 0, W, H);
        
        // 绘制背景渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, '#040614ff');
        gradient.addColorStop(1, '#02123bff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
        
        // 绘制标题
        ctx.textAlign = 'center';
        ctx.font = 'bold 100px Arial';
        
        // 标题动画效果
        const titleAlpha = Math.min(progress * 2, 1);
        const titleScale = 0.5 + 0.5 * progress;
        const titleY = H / 2 - 50 + (1 - progress) * 50;
        
        ctx.save();
        ctx.translate(W / 2, titleY);
        ctx.scale(titleScale, titleScale);
        ctx.fillStyle = `rgba(255, 255, 255, ${titleAlpha})`;
        ctx.fillText('Guardians: Midnight BIT', 0, 0);
        ctx.restore();
        
        // 绘制副标题
        ctx.font = '60px Arial';
        const subtitleAlpha = Math.max(0, (progress - 0.5) * 2);
        ctx.fillStyle = `rgba(200, 200, 255, ${subtitleAlpha})`;
        ctx.fillText('Real Antidote', W / 2, H / 2 + 100);
        
        // 绘制进度条
        const progressBarWidth = 300;
        const progressBarHeight = 10;
        const progressBarX = (W - progressBarWidth) / 2;
        const progressBarY = H / 2 + 200;
        
        // 进度条背景
        ctx.fillStyle = 'rgba(100, 100, 150, 0.5)';
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        
        // 进度条前景
        const progressWidth = progressBarWidth * progress;
        const progressGradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progressWidth, 0);
        progressGradient.addColorStop(0, '#ffffffff');
        progressGradient.addColorStop(1, '#000000ff');
        ctx.fillStyle = progressGradient;
        ctx.fillRect(progressBarX, progressBarY, progressWidth, progressBarHeight);
        
        // 绘制加载文本
        ctx.font = '25px Arial';
        ctx.fillStyle = `rgba(255, 255, 255, ${subtitleAlpha})`;
        ctx.fillText('Loading', W / 2, H / 2 + 250);
        
        // 动画结束时开始游戏
        if (progress >= 1) {
            startAnimationActive = false;
            startGame();
        }
    }

    // 自动开始游戏函数
    function autoStartGame() {
        // 检查资源是否加载完成
        if (backgroundLoaded && sceneImagesLoaded) {
            // 如果动画激活，则绘制动画，否则直接开始游戏
            if (startAnimationActive) {
                drawStartAnimation();
                requestAnimationFrame(autoStartGame);
            } else {
                startGame();
            }
        } else {
            // 如果资源未加载完成，等待100ms后再次检查
            setTimeout(autoStartGame, 100);
        }
    }


    // 页面加载完成后自动开始游戏
    autoStartGame();

    // 初始检查场景图片加载
    checkSceneImagesLoaded();

    // 初始化成就系统
    initAchievements();

    //创建对话函数
    // 对话状态
    let inDialogue = false;
    let dialogueIndex = 0;

    // 初始化对话框样式（可以在页面加载时执行）
    function initDialogueStyle() {
        const box = document.getElementById('dialogueBox');
        if (!box) return;
        
        // 设置基础样式
        box.style.position = 'fixed';
        box.style.bottom = '50px';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';
        box.style.maxWidth = '80%';
        box.style.width = '600px';
        box.style.padding = '20px 25px';
        box.style.backgroundColor = '#000';
        box.style.borderRadius = '18px';
        box.style.border = '1px solid #8b04045b';
        box.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)';
        box.style.color = '#fff';
        box.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        box.style.fontSize = '16px';
        box.style.lineHeight = '1.6';
        box.style.transition = 'all 0.3s ease';
        box.style.opacity = '0';
        
        // 添加对话框尾巴
        const tail = document.createElement('div');
        tail.style.position = 'absolute';
        tail.style.bottom = '-10px';
        tail.style.left = '50%';
        tail.style.transform = 'translateX(-50%)';
        tail.style.borderWidth = '10px 10px 0';
        tail.style.borderStyle = 'solid';
        tail.style.borderColor = '#ffffffd2 transparent transparent';
        tail.style.pointerEvents = 'none'; // 让点击穿透尾巴
        box.appendChild(tail);
    }

    // 初始化样式（页面加载时调用）
    window.addEventListener('load', initDialogueStyle);

    function handleDialogues(dialogueArray, onComplete) {
    const box = document.getElementById('dialogueBox');
    if (!box) return; // 确保对话框元素存在
    
    if (!inDialogue) {
        // 开始对话 - 显示对话框
        inDialogue = true;
        dialogueIndex = 0;
        box.innerText = dialogueArray[dialogueIndex];
        box.style.display = 'block';
        
        // 淡入动画
        setTimeout(() => {
            box.style.opacity = '1';
        }, 10);
    } else {
        // 显示下一句
        dialogueIndex++;
        if (dialogueIndex < dialogueArray.length) {
            // 过渡动画
            box.style.opacity = '0';
            setTimeout(() => {
                box.innerText = dialogueArray[dialogueIndex];
                box.style.opacity = '1';
            }, 200);
        } else {
            // 对话结束 - 隐藏对话框
            box.style.opacity = '0';
            setTimeout(() => {
                inDialogue = false;
                dialogueIndex = 0;
                box.style.display = 'none';
                // 执行完成回调
                if (onComplete) onComplete();
            }, 300);
        }
    }
}

    function handleDialogue(dialogueArray) {
        const box = document.getElementById('dialogueBox');
        if (!box) return; // 确保对话框元素存在
        
        if (!inDialogue) {
            // 开始对话 - 显示对话框
            inDialogue = true;
            dialogueIndex = 0;
            box.innerText = dialogueArray[dialogueIndex];
            box.style.display = 'block';
            
            // 淡入动画
            setTimeout(() => {
                box.style.opacity = '1';
            }, 10);
        } else {
            // 显示下一句
            dialogueIndex++;
            if (dialogueIndex < dialogueArray.length) {
                // 过渡动画
                box.style.opacity = '0';
                setTimeout(() => {
                    box.innerText = dialogueArray[dialogueIndex];
                    box.style.opacity = '1';
                }, 200);
            } else {
                // 对话结束 - 隐藏对话框
                box.style.opacity = '0';
                setTimeout(() => {
                    inDialogue = false;
                    dialogueIndex = 0;
                    box.style.display = 'none';
                }, 300);
            }
        }
    }


    // 撬锁小游戏
    let inLockPickingGame = false;
    let lockPickingSuccess = false;
    let lockPickingTimer;
    let lockPickingTime = 40; // 40秒倒计时
    let currentDifficulty = 'normal'; // easy, normal, hard
    let pins = [];
    let isApplyingTorque = false;
    let unlockedPins = 0;
    let maxPins = 5;
    let tolerance = 10;

    // 创建撬锁小游戏UI
    function createLockPickingGame() {
        // 创建游戏容器
        const container = document.createElement('div');
        container.id = 'lockpicking-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.zIndex = '1000';
        container.style.color = 'white';
        container.style.fontFamily = 'Arial, sans-serif';
        
        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '箱子上锁了，你需要撬锁打开它';
        title.style.marginBottom = '20px';
        title.style.color = '#FFD700';
        container.appendChild(title);
        
        // 创建难度选择
        const difficultyContainer = document.createElement('div');
        difficultyContainer.style.marginBottom = '20px';
        difficultyContainer.innerHTML = `
            <label>选择难度: </label>
            <select id="difficulty-select" style="padding: 5px; margin: 0 10px;">
                <option value="easy">简单</option>
                <option value="normal" selected>普通</option>
                <option value="hard">困难</option>
            </select>
            <button id="start-game-btn" style="padding: 5px 10px;">开始游戏</button>
        `;
        container.appendChild(difficultyContainer);
        
        // 创建游戏区域
        const gameArea = document.createElement('div');
        gameArea.id = 'lockpicking-game-area';
        gameArea.style.width = '600px';
        gameArea.style.height = '300px';
        gameArea.style.position = 'relative';
        gameArea.style.marginBottom = '20px';
        gameArea.style.display = 'none'; // 初始隐藏
        container.appendChild(gameArea);
        
        // 创建锁芯
        const lockCore = document.createElement('div');
        lockCore.id = 'lock-core';
        lockCore.style.position = 'absolute';
        lockCore.style.left = '50px';
        lockCore.style.top = '50px';
        lockCore.style.width = '40px';
        lockCore.style.height = '200px';
        lockCore.style.backgroundColor = '#555';
        lockCore.style.border = '2px solid #333';
        gameArea.appendChild(lockCore);
        
        // 创建扭力区域
        const torqueArea = document.createElement('div');
        torqueArea.id = 'torque-area';
        torqueArea.style.position = 'absolute';
        torqueArea.style.right = '50px';
        torqueArea.style.top = '50px';
        torqueArea.style.width = '100px';
        torqueArea.style.height = '200px';
        torqueArea.style.backgroundColor = '#444';
        torqueArea.style.border = '2px solid #333';
        torqueArea.style.display = 'flex';
        torqueArea.style.flexDirection = 'column';
        torqueArea.style.justifyContent = 'center';
        torqueArea.style.alignItems = 'center';
        torqueArea.style.cursor = 'pointer';
        torqueArea.innerHTML = '<div>按住施加扭力</div>';
        gameArea.appendChild(torqueArea);
        
        // 创建进度条
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.width = '500px';
        progressBarContainer.style.height = '20px';
        progressBarContainer.style.border = '1px solid white';
        progressBarContainer.style.marginBottom = '20px';
        progressBarContainer.style.display = 'none'; // 初始隐藏
        
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBarContainer.appendChild(progressBar);
        
        container.appendChild(progressBarContainer);
        
        // 创建信息显示
        const infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.justifyContent = 'space-between';
        infoContainer.style.width = '500px';
        infoContainer.style.marginBottom = '20px';
        infoContainer.style.display = 'none'; // 初始隐藏
        
        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'lockpicking-time';
        timeDisplay.textContent = '时间: 40';
        infoContainer.appendChild(timeDisplay);
        
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'lockpicking-status';
        statusDisplay.textContent = '状态: 准备中';
        infoContainer.appendChild(statusDisplay);
        
        container.appendChild(infoContainer);
        
        // 创建提示
        const hint = document.createElement('p');
        hint.id = 'lockpicking-hint';
        hint.textContent = '请选择难度并点击开始游戏';
        hint.style.marginBottom = '20px';
        container.appendChild(hint);
        
        // 创建测试按钮
        const testButton = document.createElement('button');
        testButton.textContent = '（测试）自动解锁';
        testButton.style.padding = '10px 20px';
        testButton.style.fontSize = '16px';
        testButton.style.cursor = 'pointer';
        testButton.style.display = 'none'; // 初始隐藏
        testButton.onclick = autoUnlock;
        container.appendChild(testButton);
        
        // 创建结束按钮
        const endButton = document.createElement('button');
        endButton.textContent = '放弃';
        endButton.style.padding = '10px 20px';
        endButton.style.fontSize = '16px';
        endButton.style.cursor = 'pointer';
        endButton.style.marginTop = '10px';
        endButton.onclick = function() {
            endLockPickingGame(false);
        }
        container.appendChild(endButton);
        
        document.body.appendChild(container);
        
        // 绑定事件
        document.getElementById('start-game-btn').addEventListener('click', startLockPickingGame);
        torqueArea.addEventListener('mousedown', startApplyingTorque);
        torqueArea.addEventListener('mouseup', stopApplyingTorque);
        torqueArea.addEventListener('mouseleave', stopApplyingTorque);
        
        // 触摸事件支持
        torqueArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startApplyingTorque();
        });
        torqueArea.addEventListener('touchend', stopApplyingTorque);
    }

    // 初始化插销
    function initPins() {
        pins = [];
        const gameArea = document.getElementById('lockpicking-game-area');
        if (!gameArea) return;
        
        // 清除旧的插销
        const oldPins = gameArea.querySelectorAll('.pin');
        oldPins.forEach(pin => pin.remove());
        
        // 根据难度设置参数
        switch(currentDifficulty) {
            case 'easy':
                maxPins = 3;
                tolerance = 15;
                break;
            case 'normal':
                maxPins = 5;
                tolerance = 10;
                break;
            case 'hard':
                maxPins = 7;
                tolerance = 5;
                break;
        }
        
        // 创建插销
        for (let i = 0; i < maxPins; i++) {
            const pin = document.createElement('div');
            pin.className = 'pin';
            pin.dataset.index = i;
            pin.style.position = 'absolute';
            pin.style.left = (100 + i * 50) + 'px';
            pin.style.top = '50px';
            pin.style.width = '20px';
            pin.style.height = '200px';
            pin.style.backgroundColor = '#888';
            pin.style.border = '1px solid #666';
            pin.style.cursor = 'ns-resize';
            pin.style.display = 'flex';
            pin.style.flexDirection = 'column';
            pin.style.justifyContent = 'flex-end';
            
            // 插销顶部（可移动部分）
            const pinTop = document.createElement('div');
            pinTop.className = 'pin-top';
            pinTop.style.width = '100%';
            pinTop.style.height = '30px';
            pinTop.style.backgroundColor = '#666';
            pinTop.style.position = 'relative';
            pinTop.style.cursor = 'ns-resize';
            
            // 目标位置标记
            const targetMarker = document.createElement('div');
            targetMarker.className = 'target-marker';
            targetMarker.style.position = 'absolute';
            targetMarker.style.width = '100%';
            targetMarker.style.height = '4px';
            targetMarker.style.backgroundColor = 'red';
            targetMarker.style.top = (Math.random() * 170 + 15) + 'px'; // 随机目标位置
            pin.appendChild(targetMarker);
            
            pin.appendChild(pinTop);
            
            // 插销编号
            const pinNumber = document.createElement('div');
            pinNumber.style.position = 'absolute';
            pinNumber.style.top = '-25px';
            pinNumber.style.left = '50%';
            pinNumber.style.transform = 'translateX(-50%)';
            pinNumber.textContent = i + 1;
            pin.appendChild(pinNumber);
            
            gameArea.appendChild(pin);
            
            // 添加拖拽事件
            let isDragging = false;
            let startY = 0;
            let startTop = 0;
            
            pinTop.addEventListener('mousedown', (e) => {
                isDragging = true;
                startY = e.clientY;
                startTop = parseInt(pinTop.style.top || '0');
                e.preventDefault();
            });
            
            // 触摸事件支持
            pinTop.addEventListener('touchstart', (e) => {
                isDragging = true;
                startY = e.touches[0].clientY;
                startTop = parseInt(pinTop.style.top || '0');
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const deltaY = e.clientY - startY;
                let newTop = startTop + deltaY;
                
                // 限制移动范围
                newTop = Math.max(0, Math.min(170, newTop));
                pinTop.style.top = newTop + 'px';
                
                checkPinPosition(i, newTop);
            });
            
            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const deltaY = e.touches[0].clientY - startY;
                let newTop = startTop + deltaY;
                
                // 限制移动范围
                newTop = Math.max(0, Math.min(170, newTop));
                pinTop.style.top = newTop + 'px';
                
                checkPinPosition(i, newTop);
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
            
            document.addEventListener('touchend', () => {
                isDragging = false;
            });
            
            pins.push({
                element: pin,
                topElement: pinTop,
                targetPosition: parseInt(targetMarker.style.top),
                currentPosition: 0,
                isCorrect: false
            });
        }
    }

    // 检查插销位置
    function checkPinPosition(pinIndex, position) {
        const pin = pins[pinIndex];
        if (!pin) return;
        
        const diff = Math.abs(position - pin.targetPosition);
        if (diff <= tolerance) {
            if (!pin.isCorrect) {
                pin.isCorrect = true;
                unlockedPins++;
                updateProgressBar();
                pin.element.style.backgroundColor = '#4CAF50'; // 绿色表示正确
            }
        } else {
            if (pin.isCorrect) {
                pin.isCorrect = false;
                unlockedPins--;
                updateProgressBar();
                pin.element.style.backgroundColor = '#888'; // 灰色表示未对齐
            }
        }
        
        // 如果正在施加扭力且所有插销都正确，则解锁
        if (isApplyingTorque && unlockedPins === maxPins) {
            endLockPickingGame(true);
        }
    }

    // 更新进度条
    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = (unlockedPins / maxPins) * 100;
            progressBar.style.width = progress + '%';
        }
        
        const statusDisplay = document.getElementById('lockpicking-status');
        if (statusDisplay) {
            statusDisplay.textContent = `状态: ${unlockedPins}/${maxPins} 插销就位`;
        }
    }

    // 开始施加扭力
    function startApplyingTorque() {
        isApplyingTorque = true;
        const torqueArea = document.getElementById('torque-area');
        if (torqueArea) {
            torqueArea.style.backgroundColor = '#666';
        }
        
        // 如果所有插销都正确，则解锁
        if (unlockedPins === maxPins) {
            endLockPickingGame(true);
        }
    }

    // 停止施加扭力
    function stopApplyingTorque() {
        isApplyingTorque = false;
        const torqueArea = document.getElementById('torque-area');
        if (torqueArea) {
            torqueArea.style.backgroundColor = '#444';
        }
        
        // 如果有插销未对齐，产生回滑效果
        if (unlockedPins < maxPins) {
            pins.forEach((pin, index) => {
                if (!pin.isCorrect) {
                    // 随机回滑一部分
                    const currentTop = parseInt(pin.topElement.style.top || '0');
                    const newTop = Math.min(170, currentTop + Math.random() * 30);
                    pin.topElement.style.top = newTop + 'px';
                    checkPinPosition(index, newTop);
                }
            });
        }
    }

    // 自动解锁（测试功能）
    function autoUnlock() {
        pins.forEach((pin, index) => {
            // 将插销移动到正确位置
            pin.topElement.style.top = pin.targetPosition + 'px';
            checkPinPosition(index, pin.targetPosition);
        });
        
        // 模拟施加扭力
        setTimeout(() => {
            startApplyingTorque();
        }, 500);
    }

    // 启动撬锁小游戏
    function startLockPickingGame() {
        inLockPickingGame = true;
        lockPickingSuccess = false;
        unlockedPins = 0;
        lockPickingTime = 40;
        
        // 获取选择的难度
        const difficultySelect = document.getElementById('difficulty-select');
        if (difficultySelect) {
            currentDifficulty = difficultySelect.value;
        }
        
        // 显示游戏区域
        const gameArea = document.getElementById('lockpicking-game-area');
        const progressBarContainer = document.querySelector('#lockpicking-container > div:nth-child(5)');
        const infoContainer = document.querySelector('#lockpicking-container > div:nth-child(6)');
        const hint = document.getElementById('lockpicking-hint');
        const testButton = document.querySelector('#lockpicking-container button:nth-child(2)');
        
        if (gameArea) gameArea.style.display = 'block';
        if (progressBarContainer) progressBarContainer.style.display = 'block';
        if (infoContainer) infoContainer.style.display = 'flex';
        if (hint) hint.textContent = '拖动插销到正确位置，然后按住右侧区域施加扭力';
        if (testButton) testButton.style.display = 'block';
        
        // 隐藏难度选择
        const difficultyContainer = document.querySelector('#lockpicking-container > div:nth-child(2)');
        if (difficultyContainer) difficultyContainer.style.display = 'none';
        
        // 初始化插销
        initPins();
        
        // 更新UI
        document.getElementById('lockpicking-time').textContent = '时间: ' + lockPickingTime;
        updateProgressBar();
        
        // 开始计时器
        lockPickingTimer = setInterval(() => {
            lockPickingTime--;
            document.getElementById('lockpicking-time').textContent = '时间: ' + lockPickingTime;
            
            if (lockPickingTime <= 0) {
                endLockPickingGame(false);
            }
        }, 1000);
    }

    // 结束撬锁小游戏
    function endLockPickingGame(success = false) {
        inLockPickingGame = false;
        clearInterval(lockPickingTimer);
        
        // 移除游戏界面
        const container = document.getElementById('lockpicking-container');
        if (container) {
            document.body.removeChild(container);
        }
        
        // 根据结果处理
        if (success) {
            // 成功获得手电筒
            handleDialogue(["你成功撬开了锁，箱子里有一支手电筒！ 按B打开背包查看"]);
            GetFlashlight();
        } else {
            // 时间到或放弃
            handleDialogue(["撬锁失败，你没有成功打开箱子"]);
        }
    }




    

    // 添加冰红茶小游戏状态变量
    let inMinigame = false;
    let minigameScore = 0;
    let minigameTime = 30; // 30秒倒计时
    let minigameTimer;

    function createMinigameUI() {
        // 创建游戏容器
        const container = document.createElement('div');
        container.id = 'minigame-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.zIndex = '1000';
        container.style.color = 'white';
        container.style.fontFamily = 'Arial, sans-serif';
        
        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '冰红茶小游戏';
        title.style.marginBottom = '20px';
        container.appendChild(title);
        
        // 创建说明
        const instructions = document.createElement('p');
        instructions.textContent = '快速点击冰红茶瓶获取分数！';
        instructions.style.marginBottom = '20px';
        container.appendChild(instructions);
        
        // 创建游戏区域
        const gameArea = document.createElement('div');
        gameArea.id = 'minigame-area';
        gameArea.style.width = '600px';
        gameArea.style.height = '400px';
        gameArea.style.position = 'relative';
        gameArea.style.border = '2px solid white';
        gameArea.style.marginBottom = '20px';
        container.appendChild(gameArea);
        
        // 创建分数和时间显示
        const infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.justifyContent = 'space-between';
        infoContainer.style.width = '600px';
        infoContainer.style.marginBottom = '20px';
        
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'minigame-score';
        scoreDisplay.textContent = '分数: 0';
        infoContainer.appendChild(scoreDisplay);
        
        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'minigame-time';
        timeDisplay.textContent = '时间: 30';
        infoContainer.appendChild(timeDisplay);
        
        container.appendChild(infoContainer);
        
        // 创建结束按钮
        const endButton = document.createElement('button');
        endButton.textContent = '结束游戏';
        endButton.style.padding = '10px 20px';
        endButton.style.fontSize = '16px';
        endButton.style.cursor = 'pointer';
        endButton.onclick = endMinigame;
        container.appendChild(endButton);
        
        document.body.appendChild(container);
        
        // 开始小游戏
        startMinigame();
    }

    // 开始小游戏
    function startMinigame() {
        inMinigame = true;
        minigameScore = 0;
        minigameTime = 30;
        
        // 更新UI
        document.getElementById('minigame-score').textContent = '分数: ' + minigameScore;
        document.getElementById('minigame-time').textContent = '时间: ' + minigameTime;
        
        // 开始计时器
        minigameTimer = setInterval(() => {
            minigameTime--;
            document.getElementById('minigame-time').textContent = '时间: ' + minigameTime;
            
            if (minigameTime <= 0) {
                endMinigame();
            }
        }, 1000);
        
        // 生成冰红茶瓶
        generateBottle();
    }

    // 生成冰红茶瓶
    function generateBottle() {
        if (!inMinigame) return;
        
        const gameArea = document.getElementById('minigame-area');
        if (!gameArea) return;
        
        // 创建冰红茶瓶
        const bottle = document.createElement('div');
        bottle.className = 'bottle';
        bottle.style.position = 'absolute';
        bottle.style.width = '50px';
        bottle.style.height = '80px';
        bottle.style.backgroundColor = '#8B4513';
        bottle.style.border = '2px solid #A0522D';
        bottle.style.borderRadius = '5px';
        bottle.style.cursor = 'pointer';
        
        // 随机位置
        const maxX = gameArea.offsetWidth - 50;
        const maxY = gameArea.offsetHeight - 80;
        const posX = Math.floor(Math.random() * maxX);
        const posY = Math.floor(Math.random() * maxY);
        
        bottle.style.left = posX + 'px';
        bottle.style.top = posY + 'px';
        
        // 点击事件
        bottle.onclick = () => {
            minigameScore += 10;
            document.getElementById('minigame-score').textContent = '分数: ' + minigameScore;
            gameArea.removeChild(bottle);
            
            // 生成新瓶
            setTimeout(generateBottle, 300);
        };
        
        gameArea.appendChild(bottle);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (bottle.parentNode === gameArea) {
                gameArea.removeChild(bottle);
                // 生成新瓶
                setTimeout(generateBottle, 300);
            }
        }, 3000);
    }

    // 结束小游戏
    function endMinigame() {
        inMinigame = false;
        clearInterval(minigameTimer);
        
        // 移除游戏界面
        const container = document.getElementById('minigame-container');
        if (container) {
            document.body.removeChild(container);
        }
        
        // 显示结果
        alert(`小游戏结束！你的分数是: ${minigameScore}`);
        
        // 如果分数超过50，给予奖励
        if (minigameScore >= 50) {
            alert('恭喜你获得了冰红茶一瓶！');
            // 这里可以添加获取物品的逻辑
        }
    }

   



    // 拼图小游戏状态
    let inPuzzleGame = false;
    let puzzlePieces = [];
    let puzzleContainer = null;

    // 1. 启动拼图小游戏
    function startPuzzleGame() {
        inPuzzleGame = true;
        puzzlePieces = [];

        puzzleContainer = document.createElement('div');
        puzzleContainer.id = 'puzzle-container';
        puzzleContainer.style.position = 'fixed';
        puzzleContainer.style.top = '0';
        puzzleContainer.style.left = '0';
        puzzleContainer.style.width = '100%';
        puzzleContainer.style.height = '100%';
        puzzleContainer.style.backgroundColor = 'rgba(0,0,0,0.9)';
        puzzleContainer.style.display = 'flex';
        puzzleContainer.style.flexDirection = 'column';
        puzzleContainer.style.justifyContent = 'center';
        puzzleContainer.style.alignItems = 'center';
        puzzleContainer.style.zIndex = '2000';
        document.body.appendChild(puzzleContainer);

        const title = document.createElement('h2');
        title.textContent = '神秘的笔记碎片';
        title.style.color = '#fff';
        title.style.marginBottom = '20px';
        puzzleContainer.appendChild(title);

        const tip = document.createElement('p');
        tip.textContent = '点击任意两块碎片即可交换位置，最终拼成完整纸张查看内容。';
        tip.style.color = '#ccc';
        tip.style.marginBottom = '15px';
        tip.style.fontSize = '14px';
        puzzleContainer.appendChild(tip);


        const puzzleArea = document.createElement('div');
        puzzleArea.id = 'puzzle-area';
        puzzleArea.style.width = '400px';
        puzzleArea.style.height = '400px';
        puzzleArea.style.position = 'relative';
        puzzleArea.style.border = '2px solid #fff';
        puzzleContainer.appendChild(puzzleArea);

        const size = 100;
        const positions = Array.from({ length: 16 }, (_, i) => i);
        shuffleArray(positions);

        // 换成自己的 400×400 图片
        const imgUrl = '../images/note.png';

        positions.forEach((val, idx) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.position = 'absolute';
            piece.style.width = size + 'px';
            piece.style.height = size + 'px';
            piece.style.boxSizing = 'border-box';
            piece.style.border = '1px solid #fff';
            piece.style.cursor = 'pointer';

            const correctRow = Math.floor(val / 4);
            const correctCol = val % 4;

            piece.style.backgroundImage = `url(${imgUrl})`;
            piece.style.backgroundSize = '400px 400px';
            piece.style.backgroundPosition = `-${correctCol * size}px -${correctRow * size}px`;

            const initRow = Math.floor(idx / 4);
            const initCol = idx % 4;
            piece.style.left = (initCol * size) + 'px';
            piece.style.top = (initRow * size) + 'px';

            piece.dataset.correct = val;
            piece.addEventListener('click', () => handlePieceClick(piece, idx));

            puzzleArea.appendChild(piece);
            puzzlePieces.push(piece);
        });

        const exitBtn = document.createElement('button');
        exitBtn.textContent = '放弃';
        exitBtn.style.marginTop = '20px';
        exitBtn.style.padding = '10px 20px';
        exitBtn.style.fontSize = '16px';
        exitBtn.onclick = () => endPuzzleGame(false);
        puzzleContainer.appendChild(exitBtn);
    }

    // 2. 打乱数组
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // 3. 点击交换
    function handlePieceClick(piece, idx) {
        if (!window.selectedPiece) {
            window.selectedPiece = piece;
            piece.style.border = '2px solid yellow';
        } else {
            const first = window.selectedPiece;
            const second = piece;

            const tempLeft = first.style.left;
            const tempTop = first.style.top;

            first.style.left = second.style.left;
            first.style.top = second.style.top;
            second.style.left = tempLeft;
            second.style.top = tempTop;

            first.style.border = '1px solid #fff';
            second.style.border = '1px solid #fff';
            window.selectedPiece = null;

            if (checkPuzzleComplete() || readpieces) {
                endPuzzleGame(true);
            }
        }
    }

    // 4. 完成检测
    function checkPuzzleComplete() {
        const size = 100;
        for (let i = 0; i < 16; i++) {
            const piece = puzzlePieces[i];
            const correct = parseInt(piece.dataset.correct);
            const expectedLeft = (correct % 4) * size;
            const expectedTop = Math.floor(correct / 4) * size;
            if (parseInt(piece.style.left) !== expectedLeft || parseInt(piece.style.top) !== expectedTop) {
                return false;
            }
        }
        return true;
    }
    
    // 5. 结束拼图小游戏（成功后展示图片）
    function endPuzzleGame(success) {
        inPuzzleGame = false;
        if (puzzleContainer) {
            document.body.removeChild(puzzleContainer);
            puzzleContainer = null;
        }

        if (success) {
            diamondAudio.currentTime = 0;
            diamondAudio.play();
            // 创建全屏遮罩
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '3000';

            // 创建图片容器（横向排列）
            const imgContainer = document.createElement('div');
            imgContainer.style.display = 'flex';
            imgContainer.style.gap = '20px';
         
            // 创建中文图片元素
            const imgCn = document.createElement('img');
            imgCn.src = '../images/note cn.png';
            imgCn.style.maxWidth = '45%';
            imgCn.style.maxHeight = '80vh';

            // 创建英文图片元素
            const imgEn = document.createElement('img');
            imgEn.src = '../images/note en.png';
            imgEn.style.maxWidth = '45%';
            imgEn.style.maxHeight = '80vh';

            imgContainer.appendChild(imgCn);
            imgContainer.appendChild(imgEn);
            overlay.appendChild(imgContainer);
            
            surprisingAudio.currentTime = 0;
            surprisingAudio.play();

            // 添加关闭功能（空格键或点击关闭）
            const closeOverlay = () => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                    document.removeEventListener('keydown', closeOnSpace);
                }
            };
            
            // 空格键关闭
            const closeOnSpace = (e) => {
                if (e.key === ' ') {
                    closeOverlay();
                }
            };
            document.addEventListener('keydown', closeOnSpace);

            // 点击任意位置关闭
            overlay.addEventListener('click', closeOverlay);

            document.body.appendChild(overlay);

            readpieces = true;
        } else {
            return;
        }
    }




    // 密码破解小游戏
    let inPasswordGame = false;
    let targetPassword = [];
    let attempts = 0;
    let maxAttempts = 6;
    let passwordGameContainer = null;

    // 生成目标密码
    function generateTargetPassword() {
        const numbers = [1, 2, 3, 4, 5, 6, 7];
        targetPassword = [];
        
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            targetPassword.push(numbers[randomIndex]);
            numbers.splice(randomIndex, 1);
        }
    }

    // ... existing code ...

    // 创建密码破解小游戏UI
    function createPasswordGame() {
        // 重置游戏状态
        generateTargetPassword();
        attempts = 0;
        inPasswordGame = true;
        
        // 创建游戏容器
        passwordGameContainer = document.createElement('div');
        passwordGameContainer.id = 'password-game-container';
        passwordGameContainer.style.position = 'fixed';
        passwordGameContainer.style.top = '0';
        passwordGameContainer.style.left = '0';
        passwordGameContainer.style.width = '100%';
        passwordGameContainer.style.height = '100%';
        passwordGameContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        passwordGameContainer.style.display = 'flex';
        passwordGameContainer.style.flexDirection = 'column';
        passwordGameContainer.style.justifyContent = 'center';
        passwordGameContainer.style.alignItems = 'center';
        passwordGameContainer.style.zIndex = '2000';
        passwordGameContainer.style.color = 'white';
        passwordGameContainer.style.fontFamily = 'Arial, sans-serif';
        
        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '储物箱上有密码锁，你可能需要破解密码来打开它';
        title.style.marginBottom = '10px';
        title.style.color = '#4CAF50';
        passwordGameContainer.appendChild(title);
        
        // 创建详细说明
        const description = document.createElement('div');
        description.style.marginBottom = '20px';
        description.style.color = '#ccc';
        description.style.textAlign = 'center';
        description.style.maxWidth = '80%';
        
        const descTitle = document.createElement('h3');
        descTitle.textContent = '游戏说明';
        descTitle.style.color = '#FFD700';
        descTitle.style.marginBottom = '10px';
        description.appendChild(descTitle);
        
        const descList = document.createElement('ul');
        descList.style.textAlign = 'left';
        descList.style.margin = '0 auto';
        descList.style.maxWidth = '600px';
        
        const descItems = [
            '你需要破解一个4位数的密码，每位数字都在1-7之间且不重复',
            '你有6次尝试机会来猜测正确的密码',
            '每次猜测后，系统会给出以下提示：',
            '  A: 数字和位置都正确',
            '  B: 数字正确但位置错误',
            '  C: 密码中不存在这个数字',
            '根据提示调整你的猜测，直到找到正确密码'
        ];
        
        descItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.style.marginBottom = '8px';
            descList.appendChild(li);
        });
        
        description.appendChild(descList);
        passwordGameContainer.appendChild(description);
        
        // 创建输入区域
        const inputContainer = document.createElement('div');
        inputContainer.style.marginBottom = '20px';
        inputContainer.style.display = 'flex';
        inputContainer.style.gap = '10px';
        
        const inputs = [];
        for (let i = 0; i < 4; i++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = '7';
            input.style.width = '50px';
            input.style.height = '50px';
            input.style.textAlign = 'center';
            input.style.fontSize = '24px';
            input.style.border = '2px solid #555';
            input.style.borderRadius = '5px';
            input.style.backgroundColor = '#333';
            input.style.color = 'white';
            input.addEventListener('input', function() {
                if (this.value.length >= 1) {
                    this.value = this.value.charAt(0);
                    if (parseInt(this.value) < 1 || parseInt(this.value) > 7) {
                        this.value = '';
                    } else if (i < 3) {
                        inputs[i+1].focus();
                    }
                }
            });
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value === '' && i > 0) {
                    inputs[i-1].focus();
                }
            });
            inputContainer.appendChild(input);
            inputs.push(input);
        }
        
        passwordGameContainer.appendChild(inputContainer);
        
        // 创建提交按钮
        const submitButton = document.createElement('button');
        submitButton.textContent = '提交猜测';
        submitButton.style.padding = '10px 20px';
        submitButton.style.fontSize = '18px';
        submitButton.style.marginBottom = '20px';
        submitButton.style.cursor = 'pointer';
        submitButton.style.backgroundColor = '#4CAF50';
        submitButton.style.color = 'white';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '5px';
        submitButton.onclick = function() {
            const guess = inputs.map(input => parseInt(input.value)).filter(val => !isNaN(val));
            
            if (guess.length !== 4) {
                alert('请输入完整的4位数字');
                return;
            }
            
            // 检查是否有重复数字
            if (new Set(guess).size !== 4) {
                alert('数字不能重复');
                return;
            }
            
            // 检查数字范围
            if (guess.some(num => num < 1 || num > 7)) {
                alert('每个数字必须在1-7之间');
                return;
            }
            
            attempts++;
            const result = checkGuess(guess);
            addResultToHistory(guess, result);
            
            // 清空输入框
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
            
            if (result.A === 4) {
                // 猜对了
                setTimeout(() => {
                    alert('密码正确！');
                    endPasswordGame(true);
                }, 500);
            } else if (attempts >= maxAttempts) {
                // 用完所有尝试次数
                setTimeout(() => {
                    alert(`游戏结束！正确密码是：${targetPassword.join('')}`);
                    endPasswordGame(false);
                }, 500);
            }
        };
        passwordGameContainer.appendChild(submitButton);
        
        // 创建历史记录区域
        const historyContainer = document.createElement('div');
        historyContainer.id = 'password-history';
        historyContainer.style.width = '80%';
        historyContainer.style.maxHeight = '300px';
        historyContainer.style.overflowY = 'auto';
        historyContainer.style.border = '1px solid #555';
        historyContainer.style.padding = '10px';
        historyContainer.style.marginBottom = '20px';
        historyContainer.style.backgroundColor = '#222';
        
        const historyTitle = document.createElement('h3');
        historyTitle.textContent = '猜测历史';
        historyTitle.style.marginTop = '0';
        historyContainer.appendChild(historyTitle);
        
        passwordGameContainer.appendChild(historyContainer);
        
        // 创建放弃按钮
        const exitButton = document.createElement('button');
        exitButton.textContent = '放弃';
        exitButton.style.padding = '10px 20px';
        exitButton.style.fontSize = '16px';
        exitButton.style.cursor = 'pointer';
        exitButton.style.backgroundColor = '#f44336';
        exitButton.style.color = 'white';
        exitButton.style.border = 'none';
        exitButton.style.borderRadius = '5px';
        exitButton.onclick = function() {
            endPasswordGame(false);
        };
        passwordGameContainer.appendChild(exitButton);
        
        document.body.appendChild(passwordGameContainer);
        
        // 聚焦到第一个输入框
        inputs[0].focus();
    }

    // 检查猜测结果
    function checkGuess(guess) {
        let A = 0; // 数字和位置都正确
        let B = 0; // 数字正确但位置错误
        let C = 0; // 密码中不存在这个数字
        
        // 计算A
        for (let i = 0; i < 4; i++) {
            if (guess[i] === targetPassword[i]) {
                A++;
            }
        }
        
        // 计算B和C
        for (let i = 0; i < 4; i++) {
            if (guess[i] === targetPassword[i]) {
                continue; // 已经计算过A了
            }
            
            if (targetPassword.includes(guess[i])) {
                B++;
            } else {
                C++;
            }
        }
        
        return { A, B, C };
    }

    // 添加结果到历史记录
    function addResultToHistory(guess, result) {
        const historyContainer = document.getElementById('password-history');
        const historyEntry = document.createElement('div');
        historyEntry.style.marginBottom = '10px';
        historyEntry.style.padding = '5px';
        historyEntry.style.borderBottom = '1px solid #444';
        historyEntry.textContent = `猜测: ${guess.join('')} | A: ${result.A} | B: ${result.B} | C: ${result.C}`;
        historyContainer.appendChild(historyEntry);
        
        // 滚动到底部
        historyContainer.scrollTop = historyContainer.scrollHeight;
    }

    // 结束密码破解小游戏
    function endPasswordGame(success) {
        inPasswordGame = false;
        if (passwordGameContainer) {
            document.body.removeChild(passwordGameContainer);
            passwordGameContainer = null;
        }
        
        if (success) {
            if (!readpaper){
                handleDialogues(["你打开了储物柜，在里面有一个冷藏箱,打开冷藏箱，你发现了一瓶名为“γ-5fe”的药剂,可是你并不知道它是干什么用的,按B打开背包查看"]);
            } else {
                handleDialogues(["你打开了储物柜，在里面有一个冷藏箱,你打开了冷箱，发现里面有一瓶名为“γ-5fe”的药剂,这正是你想要的东西之一,按B打开背包查看"]);
            }
            GetElementB();
            unlockAchievement('holmes');
        } if (!success) {
            return;
        }
    }





    // 找书小游戏状态变量
    let inBookFindingGame = false;
    let bookFindingTime = 60; // 60秒倒计时
    let bookFindingTimer;
    let targetBooks = []; // 目标书籍列表
    let foundBooks = []; // 已找到的书籍
    let allBooks = []; // 所有书籍

    // 书籍数据
    const bookDatabase = [
        // 目标书籍（生物化学病毒药理相关）
        { id: 1, title: "病毒学原理与应用", category: "target", description: "详细介绍各类病毒的结构、复制机制及防控方法" },
        { id: 2, title: "生物化学反应机制", category: "target", description: "深入解析生物体内化学反应的原理和过程" },
        { id: 3, title: "抗病毒药物研究进展", category: "target", description: "最新抗病毒药物的研发历程和临床应用" },
        { id: 4, title: "免疫系统与疫苗开发", category: "target", description: "免疫系统工作机制及疫苗设计原理" },
        { id: 5, title: "分子生物学实验技术", category: "target", description: "分子生物学研究中的关键实验技术和方法" },
        { id: 6, title: "病原微生物学", category: "target", description: "各类病原微生物的特性、致病机制及检测方法" },
        
        // 普通书籍
        { id: 7, title: "高等数学", category: "normal", description: "微积分、线性代数等高等数学内容" },
        { id: 8, title: "大学物理", category: "normal", description: "经典力学、电磁学等物理学基础" },
        { id: 9, title: "计算机科学导论", category: "normal", description: "计算机科学的基本概念和发展历程" },
        { id: 10, title: "世界历史", category: "normal", description: "从古代到现代的世界历史概览" },
        { id: 11, title: "文学经典选读", category: "normal", description: "中外文学名著的精选篇章" },
        { id: 12, title: "艺术鉴赏", category: "normal", description: "绘画、雕塑、音乐等艺术形式的欣赏" },
        { id: 13, title: "心理学基础", category: "normal", description: "心理学的基本理论和研究方法" },
        { id: 14, title: "经济学原理", category: "normal", description: "微观经济学和宏观经济学的基本概念" },
        { id: 15, title: "哲学概论", category: "normal", description: "西方哲学和东方哲学的主要思想" },
        { id: 16, title: "地理学探索", category: "normal", description: "自然地理和人文地理的研究内容" },
        { id: 17, title: "天文学基础", category: "normal", description: "宇宙、星系、行星等天体的研究" },
        { id: 18, title: "环境科学", category: "normal", description: "环境保护和可持续发展的科学基础" },
        { id: 19, title: "语言学导论", category: "normal", description: "语言的结构、发展和应用研究" },
        { id: 20, title: "教育学原理", category: "normal", description: "教育的基本理论和教学方法" },
        { id: 21, title: "社会学基础", category: "normal", description: "社会结构、社会关系和社会变迁的研究" },
        { id: 22, title: "法学概论", category: "normal", description: "法律的基本概念和主要法律体系" },
        { id: 23, title: "管理学原理", category: "normal", description: "组织管理的基本理论和实践方法" },
        { id: 24, title: "统计学基础", category: "normal", description: "数据分析和统计推断的基本方法" }
    ];

    // 创建找书小游戏UI
    function createBookFindingGame() {
        // 重置游戏状态
        inBookFindingGame = true;
        bookFindingTime = 60;
        foundBooks = [];
        
        // 随机选择4-6本目标书籍
        const targetBookPool = bookDatabase.filter(book => book.category === "target");
        const normalBooks = bookDatabase.filter(book => book.category === "normal");
        
        // 随机选择目标书籍数量（4-6本）
        const targetCount = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6
        targetBooks = [];
        
        // 随机选择目标书籍
        const shuffledTargets = [...targetBookPool].sort(() => 0.5 - Math.random());
        targetBooks = shuffledTargets.slice(0, targetCount);
        
        // 创建所有书籍列表（目标书籍+随机普通书籍）
        allBooks = [...targetBooks];
        
        // 添加随机普通书籍以填满书架
        const shuffledNormal = [...normalBooks].sort(() => 0.5 - Math.random());
        const normalCount = 30 - targetBooks.length; // 总共30本书
        allBooks = allBooks.concat(shuffledNormal.slice(0, normalCount));
        
        // 打乱所有书籍顺序
        allBooks = [...allBooks].sort(() => 0.5 - Math.random());
        
        // 创建游戏容器
        const container = document.createElement('div');
        container.id = 'book-finding-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.zIndex = '1000';
        container.style.color = 'white';
        container.style.fontFamily = 'Arial, sans-serif';
        
        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '寻找关键书籍';
        title.style.marginBottom = '10px';
        title.style.color = '#4CAF50';
        container.appendChild(title);
        
        // 创建说明
        const description = document.createElement('p');
        description.textContent = '在书架上找到与生物化学病毒相关的书籍，时间限制：60秒';
        description.style.marginBottom = '20px';
        description.style.color = '#ccc';
        container.appendChild(description);
        
        // 创建游戏区域
        const gameArea = document.createElement('div');
        gameArea.id = 'book-finding-game-area';
        gameArea.style.width = '800px';
        gameArea.style.height = '500px';
        gameArea.style.position = 'relative';
        gameArea.style.marginBottom = '20px';
        gameArea.style.display = 'flex';
        container.appendChild(gameArea);
        
        // 创建书架区域
        const bookshelfArea = document.createElement('div');
        bookshelfArea.id = 'bookshelf-area';
        bookshelfArea.style.width = '500px';
        bookshelfArea.style.height = '100%';
        bookshelfArea.style.border = '2px solid #555';
        bookshelfArea.style.marginRight = '20px';
        bookshelfArea.style.position = 'relative';
        bookshelfArea.style.backgroundColor = '#333';
        bookshelfArea.style.overflow = 'hidden';
        gameArea.appendChild(bookshelfArea);
        
        // 创建目标书籍列表区域
        const targetListArea = document.createElement('div');
        targetListArea.id = 'target-list-area';
        targetListArea.style.width = '280px';
        targetListArea.style.height = '100%';
        targetListArea.style.border = '2px solid #555';
        targetListArea.style.padding = '10px';
        targetListArea.style.backgroundColor = '#222';
        targetListArea.style.overflowY = 'auto';
        gameArea.appendChild(targetListArea);
        
        // 创建目标书籍标题
        const targetListTitle = document.createElement('h3');
        targetListTitle.textContent = '需要找到的书籍 (' + targetBooks.length + '本)';
        targetListTitle.style.marginTop = '0';
        targetListTitle.style.color = '#FFD700';
        targetListArea.appendChild(targetListTitle);
        
        // 创建目标书籍列表
        const targetList = document.createElement('ul');
        targetList.id = 'target-book-list';
        targetList.style.listStyleType = 'none';
        targetList.style.padding = '0';
        targetList.style.margin = '0';
        
        targetBooks.forEach(book => {
            const listItem = document.createElement('li');
            listItem.id = 'target-book-' + book.id;
            listItem.textContent = book.title;
            listItem.style.padding = '8px';
            listItem.style.marginBottom = '5px';
            listItem.style.backgroundColor = '#444';
            listItem.style.borderRadius = '4px';
            listItem.style.transition = 'all 0.3s';
            targetList.appendChild(listItem);
        });
        
        targetListArea.appendChild(targetList);
        
        // 创建书架（5排×6列）
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 6; col++) {
            const bookIndex = row * 6 + col;
            if (bookIndex < allBooks.length) {
                const book = allBooks[bookIndex];
                
                const bookElement = document.createElement('div');
                bookElement.className = 'book-item';
                bookElement.dataset.id = book.id;
                bookElement.dataset.title = book.title;
                bookElement.dataset.description = book.description;
                bookElement.dataset.flipped = 'false'; // 添加翻面状态属性
                
                bookElement.style.position = 'absolute';
                bookElement.style.left = (col * 75 + 25) + 'px';
                bookElement.style.top = (row * 90 + 25) + 'px';
                bookElement.style.width = '60px';
                bookElement.style.height = '70px';
                bookElement.style.backgroundColor = '#8B4513';
                bookElement.style.border = '1px solid #A0522D';
                bookElement.style.borderRadius = '3px';
                bookElement.style.cursor = 'pointer';
                bookElement.style.display = 'flex';
                bookElement.style.justifyContent = 'center';
                bookElement.style.alignItems = 'center';
                bookElement.style.textAlign = 'center';
                bookElement.style.fontSize = '10px';
                bookElement.style.padding = '5px';
                bookElement.style.boxSizing = 'border-box';
                bookElement.style.transition = 'transform 0.5s';
                bookElement.style.transformStyle = 'preserve-3d';
                
                // 初始状态下不显示书名（背面朝上）
                bookElement.textContent = '?';
                bookElement.style.backgroundColor = '#5D4037'; // 暗一些的颜色表示背面
                bookElement.style.color = '#5D4037'; // 文字颜色与背景相同，隐藏文字
                
                // 鼠标悬停效果
                bookElement.addEventListener('mouseenter', function() {
                    if (this.dataset.flipped === 'false') {
                        this.style.transform = 'scale(1.1)';
                        this.style.zIndex = '10';
                    }
                });
                
                bookElement.addEventListener('mouseleave', function() {
                    if (this.dataset.flipped === 'false') {
                        this.style.transform = 'scale(1)';
                        this.style.zIndex = '1';
                    }
                });
                
                // 点击事件 - 翻面效果
                bookElement.addEventListener('click', function() {
                    if (this.dataset.flipped === 'false') {
                        // 翻转到正面
                        this.style.transform = 'rotateY(180deg)';
                        this.dataset.flipped = 'true';
                        
                        // 延迟显示书名，模拟翻面效果
                        setTimeout(() => {
                            this.style.backgroundColor = '#8B4513';
                            this.style.color = 'white';
                            // 截取书名前几个字显示在书上
                            const shortTitle = book.title.length > 8 ? book.title.substring(0, 8) + '...' : book.title;
                            this.textContent = shortTitle;
                            
                            // 添加点击处理逻辑
                            handleBookClick(book);
                        }, 250);
                    } else {
                        // 已经翻面的书籍直接处理点击
                        handleBookClick(book);
                    }
                });
                
                bookshelfArea.appendChild(bookElement);
            }
        }
    }

        
        // 创建信息显示区域
        const infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.justifyContent = 'space-between';
        infoContainer.style.width = '800px';
        infoContainer.style.marginBottom = '20px';
        
        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'book-finding-time';
        timeDisplay.textContent = '剩余时间: ' + bookFindingTime + '秒';
        timeDisplay.style.fontSize = '18px';
        timeDisplay.style.color = '#FFD700';
        infoContainer.appendChild(timeDisplay);
        
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'book-finding-status';
        statusDisplay.textContent = '已找到: 0/' + targetBooks.length;
        statusDisplay.style.fontSize = '18px';
        statusDisplay.style.color = '#4CAF50';
        infoContainer.appendChild(statusDisplay);
        
        container.appendChild(infoContainer);
        
        // 创建结束按钮
        const endButton = document.createElement('button');
        endButton.textContent = '放弃寻找';
        endButton.style.padding = '10px 20px';
        endButton.style.fontSize = '16px';
        endButton.style.cursor = 'pointer';
        endButton.style.backgroundColor = '#f44336';
        endButton.style.color = 'white';
        endButton.style.border = 'none';
        endButton.style.borderRadius = '5px';
        endButton.onclick = function() {
            endBookFindingGame(false);
        };
        container.appendChild(endButton);
        
        document.body.appendChild(container);
        
        // 开始计时器
        bookFindingTimer = setInterval(() => {
            bookFindingTime--;
            document.getElementById('book-finding-time').textContent = '剩余时间: ' + bookFindingTime + '秒';
            
            if (bookFindingTime <= 0) {
                endBookFindingGame(false);
            }
        }, 1000);
    }

    // 处理书籍点击
    function handleBookClick(book) {
        if (!inBookFindingGame) return;
        
        // 显示书籍信息
        alert('书籍: ' + book.title + '\n\n描述: ' + book.description);
        
        // 检查是否为目标书籍且未被找到
        const isTargetBook = targetBooks.some(target => target.id === book.id);
        const alreadyFound = foundBooks.some(found => found.id === book.id);
        
        if (isTargetBook && !alreadyFound) {
            // 添加到已找到列表
            foundBooks.push(book);
            
            // 在目标列表中高亮显示
            const targetElement = document.getElementById('target-book-' + book.id);
            if (targetElement) {
                targetElement.style.backgroundColor = '#4CAF50';
                targetElement.style.textDecoration = 'line-through';
            }
            
            // 更新状态显示
            document.getElementById('book-finding-status').textContent = '已找到: ' + foundBooks.length + '/' + targetBooks.length;
            
            // 检查是否找到所有目标书籍
            if (foundBooks.length === targetBooks.length||formula) {
                setTimeout(() => {
                    endBookFindingGame(true);
                }, 1000);
            }
        }
    }

    // 结束找书小游戏
    function endBookFindingGame(success) {
        inBookFindingGame = false;
        clearInterval(bookFindingTimer);
        
        // 移除游戏界面
        const container = document.getElementById('book-finding-container');
        if (container) {
            document.body.removeChild(container);
        }
        
        // 根据结果处理
        if (success) {
            handleDialogue([
                "你在书籍中找到了所需配方，按B打开背包查看"]);
            GetFormula();
        } else {
            if (bookFindingTime <= 0) {
                handleDialogue([
                    "时间到了，你没能找到所有关键书籍。",
                ]);
            } else {
                handleDialogue([
                    "你放弃了寻找书籍。",
                ]);
            }
            return;
        }
    }





    // 试管分液小游戏变量
    let inLiquidGame = false;
    let liquidGameContainer = null;
    let liquidSteps = [
        { name: "添加β-31与γ-5fe药剂", completed: false },
        { name: "加入抗体溶液", completed: false },
        { name: "滴入催化剂A", completed: false },
        { name: "滴入催化剂B", completed: false },
        { name: "混合搅拌", completed: false },
        { name: "静置分离", completed: false }
    ];
    let currentStep = 0;
    let liquidTimer = null;

    // 创建试管分液小游戏
    function createLiquidGame() {
        // 设置游戏状态
        inLiquidGame = true;
        currentStep = 0;
        
        // 重置步骤状态
        liquidSteps.forEach(step => step.completed = false);
        
        // 创建游戏容器
        liquidGameContainer = document.createElement('div');
        liquidGameContainer.id = 'liquid-game-container';
        liquidGameContainer.style.position = 'fixed';
        liquidGameContainer.style.top = '0';
        liquidGameContainer.style.left = '0';
        liquidGameContainer.style.width = '100%';
        liquidGameContainer.style.height = '100%';
        liquidGameContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        liquidGameContainer.style.display = 'flex';
        liquidGameContainer.style.flexDirection = 'column';
        liquidGameContainer.style.justifyContent = 'center';
        liquidGameContainer.style.alignItems = 'center';
        liquidGameContainer.style.zIndex = '1000';
        liquidGameContainer.style.color = 'white';
        liquidGameContainer.style.fontFamily = 'Arial, sans-serif';
        
        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '制作解药';
        title.style.marginBottom = '10px';
        title.style.color = '#4CAF50';
        liquidGameContainer.appendChild(title);
        
        // 创建说明
        const description = document.createElement('p');
        description.textContent = '按照正确的顺序制作解药'
        description.style.marginBottom = '20px';
        description.style.color = '#ccc';
        liquidGameContainer.appendChild(description);
        
        // 创建游戏区域
        const gameArea = document.createElement('div');
        gameArea.id = 'liquid-game-area';
        gameArea.style.width = '800px';
        gameArea.style.height = '500px';
        gameArea.style.position = 'relative';
        gameArea.style.marginBottom = '20px';
        gameArea.style.display = 'flex';
        gameArea.style.backgroundColor = '#222';
        gameArea.style.borderRadius = '10px';
        gameArea.style.padding = '20px';
        gameArea.style.boxSizing = 'border-box';
        liquidGameContainer.appendChild(gameArea);
        
        // 创建试管区域
        const tubeArea = document.createElement('div');
        tubeArea.id = 'tube-area';
        tubeArea.style.width = '300px';
        tubeArea.style.height = '100%';
        tubeArea.style.position = 'relative';
        tubeArea.style.marginRight = '20px';
        gameArea.appendChild(tubeArea);
        
        // 创建试管
        const tube = document.createElement('div');
        tube.id = 'liquid-tube';
        tube.style.width = '80px';
        tube.style.height = '300px';
        tube.style.border = '3px solid #555';
        tube.style.borderRadius = '40px 40px 10px 10px';
        tube.style.position = 'absolute';
        tube.style.bottom = '20px';
        tube.style.left = '50%';
        tube.style.transform = 'translateX(-50%)';
        tube.style.backgroundColor = '#111';
        tube.style.overflow = 'hidden';
        tubeArea.appendChild(tube);
        
        // 创建液体容器
        const liquidContainer = document.createElement('div');
        liquidContainer.id = 'liquid-container';
        liquidContainer.style.position = 'absolute';
        liquidContainer.style.bottom = '0';
        liquidContainer.style.width = '100%';
        liquidContainer.style.height = '0%';
        liquidContainer.style.backgroundColor = '#2196F3';
        liquidContainer.style.transition = 'height 0.5s';
        tube.appendChild(liquidContainer);
        
        // 创建步骤列表区域
        const stepArea = document.createElement('div');
        stepArea.id = 'step-area';
        stepArea.style.width = '460px';
        stepArea.style.height = '100%';
        stepArea.style.border = '2px solid #555';
        stepArea.style.padding = '15px';
        stepArea.style.boxSizing = 'border-box';
        stepArea.style.backgroundColor = '#333';
        stepArea.style.borderRadius = '5px';
        gameArea.appendChild(stepArea);
        
        // 创建步骤标题
        const stepTitle = document.createElement('h3');
        stepTitle.textContent = '制作步骤';
        stepTitle.style.marginTop = '0';
        stepTitle.style.color = '#FFD700';
        stepArea.appendChild(stepTitle);
        
        // 创建步骤列表
        const stepList = document.createElement('ul');
        stepList.id = 'liquid-step-list';
        stepList.style.listStyleType = 'none';
        stepList.style.padding = '0';
        stepList.style.margin = '0';
        
        liquidSteps.forEach((step, index) => {
            const listItem = document.createElement('li');
            listItem.id = 'step-' + index;
            listItem.textContent = (index + 1) + '. ' + step.name;
            listItem.style.padding = '12px';
            listItem.style.marginBottom = '10px';
            listItem.style.backgroundColor = '#444';
            listItem.style.borderRadius = '4px';
            listItem.style.cursor = 'pointer';
            listItem.style.transition = 'all 0.3s';
            
            // 添加点击事件
            listItem.addEventListener('click', () => {
                if (index === currentStep && !step.completed) {
                    completeStep(index);
                }
            });
            
            stepList.appendChild(listItem);
        });
        
        stepArea.appendChild(stepList);
        
        // 创建信息显示区域
        const infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.justifyContent = 'space-between';
        infoContainer.style.width = '800px';
        infoContainer.style.marginBottom = '20px';
        
        const stepDisplay = document.createElement('div');
        stepDisplay.id = 'liquid-current-step';
        stepDisplay.textContent = '当前步骤: ' + (currentStep + 1) + '/' + liquidSteps.length;
        stepDisplay.style.fontSize = '18px';
        stepDisplay.style.color = '#4CAF50';
        infoContainer.appendChild(stepDisplay);
        
        liquidGameContainer.appendChild(infoContainer);
        
        // 创建操作提示
        const instruction = document.createElement('p');
        instruction.id = 'liquid-instruction';
        instruction.textContent = '请点击正确的步骤来制作解药';
        instruction.style.marginBottom = '20px';
        instruction.style.color = '#ccc';
        instruction.style.fontSize = '16px';
        liquidGameContainer.appendChild(instruction);
        
        // 创建放弃按钮
        const endButton = document.createElement('button');
        endButton.textContent = '放弃制作';
        endButton.style.padding = '10px 20px';
        endButton.style.fontSize = '16px';
        endButton.style.cursor = 'pointer';
        endButton.style.backgroundColor = '#f44336';
        endButton.style.color = 'white';
        endButton.style.border = 'none';
        endButton.style.borderRadius = '5px';
        endButton.onclick = function() {
            endLiquidGame(false);
        };
        liquidGameContainer.appendChild(endButton);
        
        document.body.appendChild(liquidGameContainer);
        
    }

    // 完成步骤
    function completeStep(stepIndex) {
        // 更新步骤状态
        liquidSteps[stepIndex].completed = true;
        document.getElementById('step-' + stepIndex).style.backgroundColor = '#4CAF50';
        document.getElementById('step-' + stepIndex).style.textDecoration = 'line-through';
        
        // 更新试管中的液体
        const liquidContainer = document.getElementById('liquid-container');
        let newHeight = ((stepIndex + 1) / liquidSteps.length) * 100;
        liquidContainer.style.height = newHeight + '%';
        
        // 根据步骤改变液体颜色
        switch(stepIndex) {
            case 0: // γ-5fe药剂 - 蓝色
                liquidContainer.style.backgroundColor = '#2196F3';
                break;
            case 1: // 抗体溶液 - 绿色
                liquidContainer.style.backgroundColor = '#4CAF50';
                break;
            case 2: // 催化剂A - 红色
                liquidContainer.style.backgroundColor = '#F44336';
                break;
            case 3: // 催化剂B - 紫色
                liquidContainer.style.backgroundColor = '#9C27B0';
                break;
            case 4: // 混合搅拌 - 黄色
                liquidContainer.style.backgroundColor = '#FFEB3B';
                break;
            case 5: // 静置分离 - 金色
                liquidContainer.style.backgroundColor = '#FFD700';
                break;
        }
        
        // 更新当前步骤
        currentStep++;
        document.getElementById('liquid-current-step').textContent = '当前步骤: ' + (currentStep + 1) + '/' + liquidSteps.length;
        
        // 检查是否完成所有步骤
        if (currentStep >= liquidSteps.length) {
            setTimeout(() => {
                endLiquidGame(true);
            }, 150);
        } else {
            // 更新提示信息
            document.getElementById('liquid-instruction').textContent = '下一步: ' + liquidSteps[currentStep].name;
        }
    }

    // 结束试管分液小游戏
    function endLiquidGame(success) {
        // inLiquidGame = false;
        clearInterval(liquidTimer);
        
        // 移除游戏界面
        if (liquidGameContainer) {
            document.body.removeChild(liquidGameContainer);
            liquidGameContainer = null;
        }
        
        // 根据结果处理
        if (success) {
            winGame();
            victoryAudio.currentTime = 0;
            victoryAudio.play();
        } else {
            handleDialogue([
                "你放弃了制作解药,功亏一篑。"
            ]);
        }
    }

    // 游戏胜利
    function winGame() {
        if (!win) {
            win = true;
            // 完美胜利成就（不被感染的情况下胜利）
            if (!wasInfected) {
                unlockAchievement('perfect_victory');
            }
            
            // 背水一战成就（在被感染后25分钟内胜利）
            if (wasInfected) {
                const timeSinceInfection = Date.now() - infectionStartTime;
                // 25分钟 = 1500000毫秒
                if (timeSinceInfection <= 1500000) {
                    unlockAchievement('final_battle');
                }
            }
            if(!Flashlight){
                    unlockAchievement('dark_path');

            }
            // // 显示胜利界面
            // showWinScreen();
        }
        handleGameVictory();
    }


        function handleGameVictory() {
        // 显示胜利界面（改为图片展示）
        const victoryContainer = document.createElement('div');
        victoryContainer.id = 'victory-container';
        victoryContainer.style.position = 'fixed';
        victoryContainer.style.top = '0';
        victoryContainer.style.left = '0';
        victoryContainer.style.width = '100%';
        victoryContainer.style.height = '100%';
        victoryContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        victoryContainer.style.display = 'flex';
        victoryContainer.style.flexDirection = 'column';
        victoryContainer.style.justifyContent = 'center';
        victoryContainer.style.alignItems = 'center';
        victoryContainer.style.zIndex = '3000';
        victoryContainer.style.color = '#fff';
        victoryContainer.style.fontFamily = 'Arial, sans-serif';
        victoryContainer.style.padding = '20px';
        victoryContainer.style.boxSizing = 'border-box';
        victoryContainer.style.overflow = 'hidden';
        victoryContainer.style.cursor = 'pointer';
        
        // 图片数组（替换为实际的图片路径）
        const victoryImages = [
            '../images/success/note.png',
            '../images/success/cn.png',
            '../images/success/en.png'
        ];
        
        let currentImageIndex = 0;
        
        // 创建图片元素
        const imageElement = document.createElement('img');
        imageElement.src = victoryImages[0];
        imageElement.style.maxWidth = '90%';
        imageElement.style.maxHeight = '95vh';
        imageElement.style.objectFit = 'contain';
        imageElement.style.display = 'block';
        imageElement.style.margin = '0 auto';
        
        // 创建图片说明文字
        const imageText = document.createElement('p');
        imageText.id = 'image-text';
        imageText.textContent = 'click to continue';
        imageText.style.marginTop = '10px';
        imageText.style.fontSize = '18px';
        imageText.style.color = '#DDD';
        imageText.style.textAlign = 'center';
        
        // 创建进度指示器
        const progressIndicator = document.createElement('div');
        progressIndicator.id = 'progress-indicator';
        progressIndicator.textContent = `(${currentImageIndex + 1}/${victoryImages.length})`;
        progressIndicator.style.marginTop = '10px';
        progressIndicator.style.fontSize = '16px';
        progressIndicator.style.color = '#888';
        
        victoryContainer.appendChild(imageElement);
        victoryContainer.appendChild(imageText);
        victoryContainer.appendChild(progressIndicator);
        
        // 点击事件处理
        victoryContainer.addEventListener('click', function() {
            currentImageIndex++;
            
            if (currentImageIndex < victoryImages.length) {
                // 显示下一张图片
                imageElement.src = victoryImages[currentImageIndex];
                progressIndicator.textContent = `(${currentImageIndex + 1}/${victoryImages.length})`;
                
                // 最后一张图片时更改提示文字
                if (currentImageIndex === victoryImages.length - 1) {
                    imageText.textContent = 'Click to re-experience the game (achievements will not be cleared)';
                }
            } else {
                // 所有图片展示完毕，重新开始游戏
                localStorage.removeItem('mygameSave');
                window.location.href = "mygame.html";
            }
        });
        
        document.body.appendChild(victoryContainer);
        
        // 暂停游戏主循环
        isGameRunning = false;
    }



    // 11.键盘控制（+场景切换逻辑)
    function keyDown(e) {
        if(e.key === 'v') saveGame();

        if (e.key === 'p' || e.key === 'P'|| menu_paused) {
            isPaused = !isPaused;

            if (isInfected) {
                if (isPaused) {
                    // 暂停时保存当前的感染开始时间
                    pauseInfectionStartTime = infectionStartTime;
                    // 重新计算感染开始时间，使倒计时暂停
                    infectionStartTime = Date.now() - (INFECTION_DURATION - infectionTime);
                } else {
                    // 恢复时计算感染开始时间
                    infectionStartTime = Date.now() - (INFECTION_DURATION - infectionTime);
                }
            }

            return;
        }
        
        if (isPaused) return;

        // 如果在小游戏中，忽略其他按键
        if (inLockPickingGame) return;
        if (inPuzzleGame) return; 
        if (inMinigame) return;
        if (inPasswordGame) return;
        if (inBookFindingGame) return;
        if (inLiquidGame) return;


        if (!isGameRunning) return;
        
        if (currentScene === 'main') {
            if (e.key === 'd') {
                player.dx = player.speed;
            } else if (e.key === 'a') {
                player.dx = -player.speed;
            } else if (e.key === 's') {
                player.dy = player.speed;
            } else if (e.key === 'w') {
                player.dy = -player.speed;
            } else if (e.key === ' ' && nearBuilding) {
                // 空格键进入建筑物
                enterBuilding(nearBuilding);
            }
            const moving = (player.dx !== 0 || player.dy !== 0);
            if (moving) {
                if (walkingAudio.paused) {
                    walkingAudio.play();
                }
            } else {
                walkingAudio.pause(); // 停止但不重置 currentTime
            }
        } else if (['jingyuanA', 'jingyuanA1', 'jingyuanA2', 'jingyuanA3', 'library', 'library2', 'securityRoom','TeachingBuilding',
            'TeachingBuilding1',
            'TeachingBuilding2',
            'TeachingBuilding3',
            'TeachingBuilding4','Hospital'].includes(currentScene))
        {
            const interiormoving = (interiorPlayer.dx !== 0 || interiorPlayer.dy !== 0);
            if (interiormoving) {
                if (walkingAudio.paused) {
                    walkingAudio.play();
                }
            } else {
                walkingAudio.pause(); // 停止但不重置 currentTime
            }
            // 内部场景玩家控制
            if (e.key === 'd') {
                interiorPlayer.dx = interiorPlayer.speed;
                interiorPlayer.direction = 'right';
            } else if (e.key === 'a') {
                interiorPlayer.dx = -interiorPlayer.speed;
                interiorPlayer.direction = 'left';
            } else if (e.key === 's') {
                interiorPlayer.dy = interiorPlayer.speed;
                interiorPlayer.direction = 'down';
            } else if (e.key === 'w') {
                interiorPlayer.dy = -interiorPlayer.speed;
                interiorPlayer.direction = 'up';
            } else if (e.key === 'Escape' && currentScene == 'TeachingBuilding') {
                exitBuilding();
            } else if (e.key === ' ' && currentScene === 'library') {
                if (libraryInteraction.nearStairs) {
                    switchLibraryFloor('library2');
                } else if (libraryInteraction.nearDoor) {
                    exitBuilding();
                } else if (libraryInteraction.nearBookshelf) {
                    if (!formula){
                        createBookFindingGame();                        
                    } else {
                        handleDialogue(["你在书籍中找到了配方，按B打开背包查看"]);
                    }
                } else if (libraryInteraction.nearBookshelf1){
                    handleDialogue(["这排书架上摆放着《物理学原理》和《化学基础》"
                        ,"它们似乎被一股无形的力量所吸引，在昏暗中泛着微光。"
                        ,"这可能就是破解谜题的关键？"]);
                } else if (libraryInteraction.nearDesk1){
                    handleDialogue(["这张课桌上散落着泛黄的草稿纸和笔记本，上面潦草地写着一些模糊的公式和奇特的符号。"
                        ,"每一个笔画都仿佛在低语，述说着一个未知的秘密。"
                    ]);
                }
            } else if (e.key === ' ' && currentScene === 'library2') {
                // 图书馆二楼：空格键下楼
                if (libraryInteraction.nearDownStairs){
                    switchLibraryFloor('library');
                } else if (libraryInteraction.nearLab) {
                    if(!elementA){
                        if(!readpaper){
                            handleDialogue(["桌子上摆放着一瓶绿色药剂，上面印着“β-31”，你不知道它是干什么用的，但你把他放进了包里,按B查看背包"]);
                        } else {
                            handleDialogue(["桌子上摆放着一瓶绿色药剂，上面印着“β-31,这正是你想要的,按B查看背包"]);
                        }
                        GetElementA();
                    } 

                } else if (libraryInteraction.nearDesk2){
                    handleDialogue(["这个书架上的书籍封面都磨损严重，散发着陈旧的气息。",
                        "其中，一本名为《炼金术士的秘密》的书籍特别显眼，似乎在召唤你。"
                    ]);
                } else if (libraryInteraction.nearDesk3){
                    handleDialogue(["这片区域似乎是研究植物学的地方。",
                        "几个盆栽里，一株藤蔓在黑暗中闪烁着微光，它的根须深深扎进土壤，仿佛连接着某个远古的秘密。"
                    ]);
                } else if (libraryInteraction.nearDesk4){
                    handleDialogue(["你发现一个被遗弃的讲台，上面有一叠乐谱，看起来像是一首未完成的曲子。",
                        "它孤零零地躺在那里，等待着有人能续写它的篇章。"
                    ]);
                } else if (libraryInteraction.nearBookshelf2){
                    handleDialogue(["你注意到这张桌子上有一个被打开的笔记本，上面写着关于“时间悖论”的理论，旁边还有一杯冒着热气的咖啡。",
                        "这里的时间似乎被静止了。"
                    ]);
                }

            } else if (e.key === ' ' && currentScene === 'jingyuanA') {
                // 静园A场景交互
                if (jingyuanAInteraction.nearAunt) {
                    // 调用对话函数
                    if (!readpaper){
                        handleDialogue([
                            "宿管阿姨：现在外面很危险，到处都是僵尸",
                            "宿管阿姨：你最好回去继续睡觉",
                            "宿管阿姨：非要出去的话，最好拿着手电筒。"
                        ]);
                    } else if (readpaper && !antibody && !isInfected && needletubing){
                            handleDialogues([
                                "宿管阿姨：孩子，你可算回来了",
                                "你：是的阿姨，但我现在想问您件事",
                                "宿管阿姨：没问题，你说吧",
                                "你：我想知道您为何没有被感染？",
                                "宿管阿姨：我也不知道，你也看到了，我的手臂上有抓痕，但已经过去好多天了",
                                "你：阿姨，您可能有免疫的抗体，也许，您是我们的希望！",
                                "宿管阿姨：真的吗？那、那我有什么可以帮到忙？",
                                "你：我从您身上抽一点血液，可以吗？",
                                "宿管阿姨：没问题！孩子，只要我能出到力，能再次看到你们的笑容，我做什么都不会后悔！",
                                "......你用针管为阿姨抽取了一些血液。按B查看背包"
                            ], GetAntibody); // 将 GetAntibody 作为回调函数传递
                    } else if (readpaper && !antibody && isInfected && needletubing){
                        handleDialogues([
                            "宿管阿姨：孩子，你、你受伤了。。",
                            "你：是的阿姨，但我现在想问您件事",
                            "宿管阿姨：没问题，你说吧",
                            "你：我想知道您为何没有被感染？",
                            "宿管阿姨：我也不知道，你也看到了，我的手臂上有抓痕，但已经过去好多天了",
                            "你：阿姨，您可能有免疫的抗体，也许，您是我们的希望！",
                            "宿管阿姨：真的吗？那、那我有什么可以帮到忙？",
                            "你：我从您身上抽一点血液，可以吗？",
                            "宿管阿姨：没问题！孩子，只要我能出到力，能再次看到你们的笑容，我做什么都不会后悔！",
                            "......你用针管为阿姨抽取了一些血液。按B查看背包"
                        ],GetAntibody);
                    } else if (readpaper && !antibody && !needletubing && isInfected){
                        handleDialogue([
                            "宿管阿姨：孩子，你、你受伤了。。",
                            "你：是的阿姨，但我现在想问您件事",
                            "宿管阿姨：没问题，你说吧",
                            "你：我想知道您为何没有被感染？",
                            "宿管阿姨：我也不知道，你也看到了，我的手臂上有抓痕，但已经过去好多天了",
                            "你：阿姨，您可能有免疫的抗体，也许，您是我们的希望！",
                            "宿管阿姨：真的吗？那、那我有什么可以帮到忙？",
                            "你：我从您身上抽一点血液，可以吗？",
                            "宿管阿姨：可是你现在需要一个针管，在校医院应该能找到"
                        ]);
                    } else if (readpaper && !antibody && !needletubing && !isInfected){
                        handleDialogue([
                            "宿管阿姨：孩子，你可算回来了",
                            "你：是的阿姨，但我现在想问您件事",
                            "宿管阿姨：没问题，你说吧",
                            "你：我想知道您为何没有被感染？",
                            "宿管阿姨：我也不知道，你也看到了，我的手臂上有抓痕，但已经过去好多天了",
                            "你：阿姨，您可能有免疫的抗体，也许，您是我们的希望！",
                            "宿管阿姨：真的吗？那、那我有什么可以帮到忙？",
                            "你：我从您身上抽一点血液，可以吗？",
                            "宿管阿姨：可是你现在需要一个针管，在校医院应该能找到"
                        ]);
                    }      
                } else if (jingyuanAInteraction.nearUpStairs) {
                    switchjingyuanA('jingyuanA','jingyuanA1');
                } else if (jingyuanAInteraction.nearDoor) {
                    exitBuilding();
                }
            } else if (e.key === ' ' && currentScene === 'jingyuanA1') {
                if (jingyuanAInteraction.nearDownStairs){
                    switchjingyuanA('jingyuanA1','jingyuanA');
                } else if (jingyuanAInteraction.nearRoom) {
                    switchjingyuanA('jingyuanA1','jingyuanA2');
                } else if (jingyuanAInteraction.nearStorage) {
                    switchjingyuanA('jingyuanA1','jingyuanA3');
                } else if (jingyuanAInteraction.nearLockedDoor) {
                    handleDialogue(["门锁住了"]);
                }
            } else if (e.key === ' ' && currentScene === 'jingyuanA2') {
                if (jingyuanAInteraction.nearBed){
                    alert('在丧尸的嚎叫下，你依旧睡着了，宿舍很安全，今夜是平安夜。');
                    addItem('平安夜纪念章');
                    handleDialogue(["你获得了平安夜纪念章！按B查看背包"]);
                } else if (jingyuanAInteraction.nearRoomExit) {
                    switchjingyuanA('jingyuanA2','jingyuanA1');
                } else if (jingyuanAInteraction.nearStorage) {
                    switchjingyuanA('jingyuanA2','jingyuanA3');
                }
            } else if (e.key === ' ' && currentScene === 'jingyuanA3') {
                if (jingyuanAInteraction.nearStorageExit) {
                    switchjingyuanA('jingyuanA3','jingyuanA1');
                } else if (jingyuanAInteraction.nearBox) {
                    if (!Flashlight) {
                        // 启动撬锁小游戏
                        createLockPickingGame();
                    } else {
                        handleDialogue(["箱子里空空如也"]);
                    }
                }
            } else if (e.key === ' ' && currentScene === 'securityRoom'){
                if (securityRoomInteraction.nearDoor){
                    exitBuilding();
                } else if (securityRoomInteraction.nearKeys){
                    GetKeys();

                } else if (securityRoomInteraction.nearGuard){
                    handleDialogue(["保安：孩子。。。",
                        "保安：你。。还好吗",
                        "保安：天灾啊。。。我尽力了。。。",
                        "你：大爷。。您",
                        "保安：我刚刚。。。被僵尸咬了。。。你快走吧！",
                        "你：我，我会尽力去救您还有其他人的！",
                        "保安：真的吗。。孩子。。你也许要先去综教楼看看。。那里还有好多学生",
                        "你：我记下了！",
                        "保安：有你这决心，我死也瞑目了！。。",
                        "你：大爷，我会的！",
                        "保安：。。。。。(silence)",
                        "你：您能听见吗。。。",
                        "你：大爷。。。。"
                    ]); 
                }

            } else if (e.key === ' ' && currentScene === 'TeachingBuilding'){
                if (TeachingBuildingInteraction.nearDoor){
                    exitBuilding();
                } else if (TeachingBuildingInteraction.nearLockedDoor1){
                    handleDialogue(["门锁住了"]);
                } else if (TeachingBuildingInteraction.nearLockedDoor2){
                    handleDialogue(["门锁住了"]);
                } else if (TeachingBuildingInteraction.nearLockedDoor3){
                    handleDialogue(["门锁住了"]);
                } else if (TeachingBuildingInteraction.nearCorridorDoor1){
                    switchTeachingBuilding('TeachingBuilding','TeachingBuilding2');
                }
            } else if (e.key === ' ' && currentScene === 'TeachingBuilding2'){
                if (TeachingBuildingInteraction.nearCorridorDoor2){
                    switchTeachingBuilding('TeachingBuilding2','TeachingBuilding');
                }
                else if (TeachingBuildingInteraction.nearCorridorDoor3){
                    switchTeachingBuilding('TeachingBuilding2','TeachingBuilding3');
                } else if (TeachingBuildingInteraction.nearStudent){
                    // // 启动冰红茶小游戏
                    // createMinigameUI();
                    if(!readpieces){
                        startPuzzleGame();
                    } else {
                        // 创建全屏遮罩
                        const overlay = document.createElement('div');
                        overlay.style.position = 'fixed';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.width = '100%';
                        overlay.style.height = '100%';
                        overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
                        overlay.style.display = 'flex';
                        overlay.style.justifyContent = 'center';
                        overlay.style.alignItems = 'center';
                        overlay.style.zIndex = '3000';

                        const imgContainer = document.createElement('div');
                        imgContainer.style.display = 'flex';
                        imgContainer.style.gap = '20px';

                        const imgCn = document.createElement('img');
                        imgCn.src = '../images/note cn.png';
                        imgCn.style.maxWidth = '45%';
                        imgCn.style.maxHeight = '80vh';

                        const imgEn = document.createElement('img');
                        imgEn.src = '../images/note en.png';
                        imgEn.style.maxWidth = '45%';
                        imgEn.style.maxHeight = '80vh';

                        imgContainer.appendChild(imgCn);
                        imgContainer.appendChild(imgEn);
                        overlay.appendChild(imgContainer);

                        surprisingAudio.currentTime = 0;
                        surprisingAudio.play();
                        // 添加关闭功能
                        const closeOverlay = () => {
                            if (document.body.contains(overlay)) {
                                document.body.removeChild(overlay);
                                document.removeEventListener('keydown', closeOnSpace);
                            }
                        };
                        
                        // 空格键关闭
                        const closeOnSpace = (e) => {
                            if (e.key === ' ') {
                                closeOverlay();
                            }
                        };
                        document.addEventListener('keydown', closeOnSpace);

                        // 点击任意位置关闭
                        overlay.addEventListener('click', closeOverlay);

                        document.body.appendChild(overlay);
                    }
                }
            }
            else if (e.key === ' ' && currentScene === 'TeachingBuilding3'){
                if (TeachingBuildingInteraction.nearCorridorDoor4){
                    switchTeachingBuilding('TeachingBuilding3','TeachingBuilding2');
                } else if (TeachingBuildingInteraction.nearLockedDoor4){
                    handleDialogue(["门锁住了"]);
                } else if (TeachingBuildingInteraction.nearLockedDoor5){
                    handleDialogue(["门锁住了"]);
                } else if (TeachingBuildingInteraction.nearRoom){
                    switchTeachingBuilding('TeachingBuilding3','TeachingBuilding4');
                }
            }
            else if (e.key === ' ' && currentScene === 'TeachingBuilding4'){
                if (TeachingBuildingInteraction.nearRoomExit){
                    switchTeachingBuilding('TeachingBuilding4','TeachingBuilding3');
                } else if (TeachingBuildingInteraction.nearStorage){
                    // handleDialogue(["储物柜上了密码锁，你可能要破译密码"]);
                    if (!elementB)  {
                        createPasswordGame();
                    } 
                }
            }
            else if (e.key === ' ' && currentScene === 'Hospital'){
                if (HospitalInteraction.nearDoor){
                    exitBuilding();
                } else if (HospitalInteraction.nearNeedleTubing){
                    handleDialogue(["你拾取了针管，按B打开背包查看"]);
                    GetNeedleTubing();
                } else if (HospitalInteraction.nearPaper){
                    ReadPaper();
                    surprisingAudio.currentTime = 0;
                    surprisingAudio.play();
                } else if (HospitalInteraction.nearWorkTop){
                    if (formula && elementA && elementB && antibody) {
                        // 分液小游戏
                        createLiquidGame();
                    } else {
                        handleDialogue(["你需要先找到所有所需物品"]);
                    }
                }
            }
            if (e.key === 'w' && interiorPlayer.dx < 0) interiorPlayer.direction = 'upLeft';
            if (e.key === 'w' && interiorPlayer.dx > 0) interiorPlayer.direction = 'upRight';
            if (e.key === 's' && interiorPlayer.dx < 0) interiorPlayer.direction = 'downLeft';
            if (e.key === 's' && interiorPlayer.dx > 0) interiorPlayer.direction = 'downRight';
        }
    }

    function keyUp(e) {
        if (!isGameRunning) return;
        
        if (currentScene === 'main') {
            if (e.key === 'd' && player.dx > 0) {
                player.dx = 0;
            } else if (e.key === 'a' && player.dx < 0) {
                player.dx = 0;
            } else if (e.key === 's' && player.dy > 0) {
                player.dy = 0;
            } else if (e.key === 'w' && player.dy < 0) {
                player.dy = 0;
            }
        } else if (['jingyuanA', 'jingyuanA1', 'jingyuanA2', 'jingyuanA3', 'library', 'library2', 'securityRoom','TeachingBuilding',
            'TeachingBuilding1',
            'TeachingBuilding2',
            'TeachingBuilding3',
            'TeachingBuilding4','Hospital'].includes(currentScene)) {
            // 内部场景玩家控制
            if (e.key === 'd' && interiorPlayer.dx > 0) {
                interiorPlayer.dx = 0;
            } else if (e.key === 'a' && interiorPlayer.dx < 0) {
                interiorPlayer.dx = 0;
            } else if (e.key === 's' && interiorPlayer.dy > 0) {
                interiorPlayer.dy = 0;
            } else if (e.key === 'w' && interiorPlayer.dy < 0) {
                interiorPlayer.dy = 0;
            } 
        }
    }

    // 键盘事件监听
    // document.addEventListener('keydown', (e) => {
    //     if (e.key === 'p' || e.key === 'P') {
    //         isPaused = !isPaused;
    //         return;
    //     }
        
    //     if (isPaused) return;

    //     if (currentScene === 'main') {
    //         switch(e.key) {
    //             case 'ArrowUp':
    //             case 'w':
    //             case 'W':
    //                 player.dy = -player.speed;
    //                 player.direction = -Math.PI / 2;
    //                 break;
    //             case 'ArrowDown':
    //             case 's':
    //             case 'S':
    //                 player.dy = player.speed;
    //                 player.direction = Math.PI / 2;
    //                 break;
    //             case 'ArrowLeft':
    //             case 'a':
    //             case 'A':
    //                 player.dx = -player.speed;
    //                 player.direction = Math.PI;
    //                 break;
    //             case 'ArrowRight':
    //             case 'd':
    //             case 'D':
    //                 player.dx = player.speed;
    //                 player.direction = 0;
    //                 break;
    //             case ' ':
    //                 if (nearBuilding) {
    //                     enterBuilding(nearBuilding);
    //                 }
    //                 break;
    //         }
    //     } else {
    //         // 内部场景控制
    //         switch(e.key) {
    //             case 'ArrowUp':
    //             case 'w':
    //             case 'W':
    //                 interiorPlayer.dy = -interiorPlayer.speed;
    //                 break;
    //             case 'ArrowDown':
    //             case 's':
    //             case 'S':
    //                 interiorPlayer.dy = interiorPlayer.speed;
    //                 break;
    //             case 'ArrowLeft':
    //             case 'a':
    //             case 'A':
    //                 interiorPlayer.dx = -interiorPlayer.speed;
    //                 break;
    //             case 'ArrowRight':
    //             case 'd':
    //             case 'D':
    //                 interiorPlayer.dx = interiorPlayer.speed;
    //                 break;
    //             case ' ':
    //                 // 图书馆内部交互
    //                 if (currentScene === 'library' && libraryInteraction.nearStairs) {
    //                     switchLibraryFloor('library2');
    //                 } else if (currentScene === 'library2' && libraryInteraction.nearDownStairs) {
    //                     switchLibraryFloor('library');
    //                 } else if (currentScene === 'library' && libraryInteraction.nearDoor) {
    //                     exitBuilding();
    //                 } else if (currentScene === 'library' && libraryInteraction.nearBookshelf) {
    //                     alert("书架上有很多书，但没有找到有用的线索。");
    //                 } else if (currentScene === 'library' && libraryInteraction.nearBookshelf1) {
    //                     alert("书架上有很多书，但没有找到有用的线索。");
    //                 } else if (currentScene === 'library' && libraryInteraction.nearDesk1) {
    //                     alert("桌子上有一些笔记本和笔，但没有重要信息。");
    //                 } else if (currentScene === 'library2' && libraryInteraction.nearLab) {
    //                     alert("实验台上放着一些化学试剂，看起来很危险。");
    //                 } else if (currentScene === 'library2' && libraryInteraction.nearDesk2) {
    //                     alert("桌子上有一些笔记本和笔，但没有重要信息。");
    //                 } else if (currentScene === 'library2' && libraryInteraction.nearDesk3) {
    //                     alert("桌子上有一些笔记本和笔，但没有重要信息。");
    //                 } else if (currentScene === 'library2' && libraryInteraction.nearDesk4) {
    //                     alert("桌子上有一些笔记本和笔，但没有重要信息。");
    //                 } else if (currentScene === 'library2' && libraryInteraction.nearBookshelf2) {
    //                     alert("书架上有很多书，但没有找到有用的线索。");
    //                 } else if (currentScene === 'jingyuanA' && jingyuanAInteraction.nearUpStairs) {
    //                     switchjingyuanA('jingyuanA','jingyuanA1');
    //                 } else if (currentScene === 'jingyuanA' && jingyuanAInteraction.nearDoor) {
    //                     exitBuilding();
    //                 } else if (currentScene === 'jingyuanA' && jingyuanAInteraction.nearAunt) {
    //                     alert("阿姨说：'晚上不要到处乱跑，注意安全。'");
    //                 } else if (currentScene === 'jingyuanA1' && jingyuanAInteraction.nearDownStairs) {
    //                     switchjingyuanA('jingyuanA1','jingyuanA');
    //                 } else if (currentScene === 'jingyuanA1' && jingyuanAInteraction.nearRoom) {
    //                     switchjingyuanA('jingyuanA1','jingyuanA2');
    //                 } else if (currentScene === 'jingyuanA1' && jingyuanAInteraction.nearStorage) {
    //                     switchjingyuanA('jingyuanA1','jingyuanA3');
    //                 } else if (currentScene === 'jingyuanA2' && jingyuanAInteraction.nearRoomExit) {
    //                     switchjingyuanA('jingyuanA2','jingyuanA1');
    //                 } else if (currentScene === 'jingyuanA3' && jingyuanAInteraction.nearStorageExit) {
    //                     switchjingyuanA('jingyuanA3','jingyuanA1');
    //                 } else if (currentScene === 'jingyuanA3' && jingyuanAInteraction.nearBox) {
    //                     alert("你找到了一个手电筒，按B打开背包查看");
    //                     GetFlashlight();
    //                 } else if (currentScene === 'securityRoom' && securityRoomInteraction.nearDoor) {
    //                     exitBuilding();
    //                 } else if (currentScene === 'securityRoom' && securityRoomInteraction.nearKeys) {
    //                     GetKeys();
    //                 } else if (currentScene === 'TeachingBuilding' && TeachingBuildingInteraction.nearDoor) {
    //                     exitBuilding();
    //                 } else if (currentScene === 'TeachingBuilding' && TeachingBuildingInteraction.nearCorridorDoor1) {
    //                     switchTeachingBuilding('TeachingBuilding','TeachingBuilding2');
    //                 } else if (currentScene === 'TeachingBuilding2' && TeachingBuildingInteraction.nearCorridorDoor2) {
    //                     switchTeachingBuilding('TeachingBuilding2','TeachingBuilding');
    //                 } else if (currentScene === 'TeachingBuilding2' && TeachingBuildingInteraction.nearCorridorDoor3) {
    //                     switchTeachingBuilding('TeachingBuilding2','TeachingBuilding3');
    //                 } else if (currentScene === 'TeachingBuilding3' && TeachingBuildingInteraction.nearCorridorDoor4) {
    //                     switchTeachingBuilding('TeachingBuilding3','TeachingBuilding2');
    //                 } else if (currentScene === 'TeachingBuilding3' && TeachingBuildingInteraction.nearRoom) {
    //                     switchTeachingBuilding('TeachingBuilding3','TeachingBuilding4');
    //                 } else if (currentScene === 'TeachingBuilding4' && TeachingBuildingInteraction.nearRoomExit) {
    //                     switchTeachingBuilding('TeachingBuilding4','TeachingBuilding3');
    //                 } else if (currentScene === 'TeachingBuilding' && TeachingBuildingInteraction.nearLockedDoor1) {
    //                     alert("门锁住了。");
    //                 } else if (currentScene === 'TeachingBuilding' && TeachingBuildingInteraction.nearLockedDoor2) {
    //                     alert("门锁住了。");
    //                 } else if (currentScene === 'TeachingBuilding' && TeachingBuildingInteraction.nearLockedDoor3) {
    //                     alert("门锁住了。");
    //                 } else if (currentScene === 'TeachingBuilding3' && TeachingBuildingInteraction.nearLockedDoor4) {
    //                     alert("门锁住了。");
    //                 } else if (currentScene === 'TeachingBuilding3' && TeachingBuildingInteraction.nearLockedDoor5) {
    //                     alert("门锁住了。");
    //                 } else if (currentScene === 'TeachingBuilding2' && TeachingBuildingInteraction.nearStudent) {
    //                     alert("学长说：'图书馆二楼有一些重要的资料，但需要钥匙才能进入。'");
    //                 }
    //                 break;
    //             case 'Escape':
    //                 exitBuilding();
    //                 break;
    //             case 'p':
    //             case 'P':
    //                 // 切换暂停状态
    //                 isPaused = !isPaused;
    //                 break;
    //         }
    //     }
    // });


    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    // 初始检查场景图片加载
    checkSceneImagesLoaded();
});
