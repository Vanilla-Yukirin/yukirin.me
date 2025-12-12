// CV页面脚本 - 从JSON加载数据

// 加载JSON数据并渲染页面
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderPage(data);
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

// 渲染页面
function renderPage(data) {
    // 渲染个人信息
    document.querySelector('.title').textContent = data.personal.name;
    document.querySelector('.subtitle').textContent = data.personal.subtitle;
    
    const aboutContent = document.querySelector('.about-content');
    aboutContent.innerHTML = data.personal.about.map(item => `<p>${item}</p>`).join('');
    
    // 渲染竞赛成就
    const achievementList = document.querySelector('.achievement-list');
    achievementList.innerHTML = data.achievements.map(item => `<li>${item}</li>`).join('');
    
    // 渲染项目经历
    const projectList = document.querySelector('.project-list');
    projectList.innerHTML = data.projects.map(project => `
        <div class="project-item">
            <h3>${project.title}</h3>
            <p class="project-period">${project.period}</p>
            <p class="project-desc">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    // 渲染论文列表
    const paperList = document.querySelector('.paper-list');
    paperList.innerHTML = data.papers.map(paper => `
        <li>
            <strong>${paper.title}</strong>
            ${paper.author} · ${paper.venue}
        </li>
    `).join('');
    
    // 渲染技能特长
    const skillsGrid = document.querySelector('.skills-grid');
    skillsGrid.innerHTML = Object.entries(data.skills).map(([category, skills]) => `
        <div class="skill-category">
            <h4>${category}</h4>
            <div class="skill-tags">
                ${skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    // 渲染链接
    const linksGrid = document.querySelector('.links-grid');
    linksGrid.innerHTML = data.links.map(link => `
        <a href="${link.url}" class="link-item" ${link.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            <span class="link-icon">${link.icon}</span>
            <div class="link-text">
                <div class="link-name">${link.name}</div>
                <div class="link-desc">${link.desc}</div>
            </div>
        </a>
    `).join('');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 控制台彩蛋
    console.log('%c🌸 欢迎来到 Vanilla Yukirin 的简历页面！', 'color: #ff9ec7; font-size: 16px; font-weight: bold;');
    console.log('%c数据从 data.json 动态加载 ✨', 'color: #b4a7f5; font-size: 12px;');
    
    // 加载数据
    loadData();
    
    // 为卡片添加简单的渐入效果
    setTimeout(() => {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, 100);
});

// 添加平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
