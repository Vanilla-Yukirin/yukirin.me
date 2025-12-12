// 主页JavaScript脚本 - 从JSON加载数据

// ============ 加载JSON数据 ============
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderPage(data);
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

// ============ 渲染页面 ============
function renderPage(data) {
    // 渲染头像和标题
    document.getElementById('avatar').src = data.personal.avatar;
    document.querySelector('.main-title').textContent = data.personal.name;
    document.querySelector('.subtitle').textContent = data.personal.subtitle;
    
    // 渲染个人信息
    const infoList = document.querySelector('.info-list');
    infoList.innerHTML = Object.entries(data.personal.info).map(([label, value]) => `
        <div class="info-item">
            <span class="info-label">${label}:</span>
            <span class="info-value">${value}</span>
        </div>
    `).join('');
    
    // 渲染关于我（Markdown）
    if (typeof marked !== 'undefined') {
        const aboutContent = document.getElementById('about-content');
        aboutContent.innerHTML = marked.parse(data.about);
    }
    
    // 渲染项目卡片
    renderProjects(data.projects);
}



// ============ 辅助函数 ============
function isValidColor(color) {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
    return hexPattern.test(color) || rgbPattern.test(color) || rgbaPattern.test(color);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============ 渲染项目卡片（左右布局） ============
function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    grid.innerHTML = projects.map(project => {
        const isImageLeft = project.imagePosition === 'left';
        
        // 图片部分
        const imageHtml = `
            <div class="card-image" style="background-image: url('${escapeHtml(project.image)}')"></div>
        `;
        
        // 内容部分
        const contentHtml = `
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${escapeHtml(project.title)}</h3>
                    <svg class="card-link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </div>
                <div class="card-tags">
                    ${project.tags.map(tag => {
                        const color = isValidColor(tag.color) ? tag.color : '#33ccff';
                        return `<span class="card-tag" style="background-color: ${color}">${escapeHtml(tag.name)}</span>`;
                    }).join('')}
                </div>
                <p class="card-description">${escapeHtml(project.description)}</p>
                <p class="card-comment">${escapeHtml(project.comment)}</p>
            </div>
        `;
        
        return `
            <a href="${escapeHtml(project.link)}" class="project-card" target="_blank" rel="noopener noreferrer">
                ${isImageLeft ? imageHtml + contentHtml : contentHtml + imageHtml}
            </a>
        `;
    }).join('');
}

// ============ 页面加载 ============
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // 控制台彩蛋
    console.log('%c💙 欢迎来到 Vanilla Yukirin 的主页！', 'color: #33ccff; font-size: 20px; font-weight: bold;');
    console.log('%c数据从 data.json 动态加载 ✨', 'color: #66b3ff; font-size: 14px;');
});
