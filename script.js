// 主页JavaScript脚本

// ============ 背景粒子动画 ============
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 粒子类
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // 边界检查
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 159, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // 创建粒子
    const particles = [];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 动画循环
    function animate() {
        ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新和绘制粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // 绘制连接线
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 159, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();

// ============ Markdown渲染 ============
// 关于我的Markdown内容（可以修改）
const aboutMarkdown = `
我是一名数据科学与大数据技术专业的在读学生，对深度学习和算法竞赛充满热情。

### 🏆 竞赛成就
- **ICPC 区域赛银奖** - 国际大学生程序设计竞赛
- **数学建模国家二等奖** (2次) - 全国大学生数学建模竞赛
- **浙江省GPLT银奖** - 第二十二届大学生程序设计竞赛
- **统计建模浙江省一等奖** (2次)

### 💡 研究方向
专注于医学影像分析、自然语言处理和深度学习模型优化，致力于将前沿技术应用于实际问题解决。

### 🎯 技能
**编程语言**: Python, C/C++, MATLAB  
**深度学习**: PyTorch, TensorFlow  
**架构**: ResNet, Transformer, ViT, U-Net
`;

// 渲染Markdown
document.addEventListener('DOMContentLoaded', function() {
    const aboutContent = document.getElementById('about-content');
    if (aboutContent && typeof marked !== 'undefined') {
        aboutContent.innerHTML = marked.parse(aboutMarkdown);
    }
});

// ============ 项目卡片数据 ============
// 可以方便地添加、修改或删除项目
const projects = [
    {
        title: 'ResViTM-Net',
        link: 'https://github.com/Vanilla-Yukirin',
        background: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
        tags: [
            { name: '深度学习', color: '#ff6b9d' },
            { name: '医学影像', color: '#c084fc' },
            { name: 'PyTorch', color: '#fbbf24' }
        ],
        description: '基于ResNet+ViT+Meta的CT图像肺结核识别模型，在4999份样本上达到96.0%准确率',
        comment: '已发表于IEEE CISAT 2025'
    },
    {
        title: 'GA-TextCNN',
        link: 'https://github.com/Vanilla-Yukirin',
        background: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
        tags: [
            { name: 'NLP', color: '#3b82f6' },
            { name: '遗传算法', color: '#10b981' },
            { name: '文本分类', color: '#f59e0b' }
        ],
        description: '创新性遗传算法-TextCNN混合模型，在中文谣言检测数据集上达到97.9%准确率',
        comment: '统计建模竞赛浙江省一等奖'
    },
    {
        title: '分子性质预测',
        link: 'https://github.com/Vanilla-Yukirin',
        background: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
        tags: [
            { name: '注意力机制', color: '#8b5cf6' },
            { name: '分子预测', color: '#06b6d4' },
            { name: '性能优化', color: '#f43f5e' }
        ],
        description: '基于自适应注意力机制的化学分子性质预测模型，MSE从978.3降至931.9',
        comment: '已发表于IEEE ICAICE 2024'
    },
    {
        title: '个人博客',
        link: '#',
        background: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
        tags: [
            { name: '技术分享', color: '#ec4899' },
            { name: 'Markdown', color: '#6366f1' }
        ],
        description: '记录学习笔记、技术心得和项目经验的个人博客',
        comment: '持续更新中...'
    },
    // 可以继续添加更多项目...
    // {
    //     title: '你的项目名称',
    //     link: '项目链接',
    //     background: '背景图片URL',
    //     tags: [
    //         { name: '标签1', color: '颜色1' },
    //         { name: '标签2', color: '颜色2' }
    //     ],
    //     description: '项目描述',
    //     comment: '一句话评价'
    // }
];

// 渲染项目卡片
function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    grid.innerHTML = projects.map(project => `
        <a href="${project.link}" class="project-card" target="_blank" rel="noopener noreferrer" style="background-image: url('${project.background}')">
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${project.title}</h3>
                    <svg class="card-link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </div>
                <div class="card-tags">
                    ${project.tags.map(tag => `
                        <span class="card-tag" style="background-color: ${tag.color}">${tag.name}</span>
                    `).join('')}
                </div>
                <p class="card-description">${project.description}</p>
                <p class="card-comment">${project.comment}</p>
            </div>
        </a>
    `).join('');
}

// 页面加载时渲染
document.addEventListener('DOMContentLoaded', renderProjects);

// ============ 控制台彩蛋 ============
console.log('%c🌟 欢迎来到 Vanilla Yukirin 的主页！', 'color: #00ff9f; font-size: 20px; font-weight: bold;');
console.log('%c如果你对这个网站感兴趣，欢迎访问 GitHub 查看源码 ✨', 'color: #00d4ff; font-size: 14px;');
