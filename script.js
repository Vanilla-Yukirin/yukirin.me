// 背景粒子动画
(function() {
    const canvas = document.getElementById('canvas');
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
    const particleCount = 100;
    
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
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 159, ${0.2 * (1 - distance / 150)})`;
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

// 鼠标跟随效果
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '4px';
    cursor.style.height = '4px';
    cursor.style.borderRadius = '50%';
    cursor.style.background = '#00ff9f';
    cursor.style.pointerEvents = 'none';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.opacity = '0.6';
    cursor.style.transition = 'opacity 0.3s ease';
    cursor.style.zIndex = '9999';
    
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        cursor.style.opacity = '0';
        setTimeout(() => cursor.remove(), 300);
    }, 100);
});

// 滚动显示动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 为所有section添加初始样式和观察
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// 链接卡片点击反馈
document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // 如果链接是 # 开头（占位符），阻止默认行为
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
            // 添加一个临时的反馈效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        }
    });
});

// 添加打字机效果到标题
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 页面加载完成后执行
window.addEventListener('load', () => {
    // 添加淡入效果
    document.querySelector('.header').style.opacity = '0';
    document.querySelector('.header').style.transform = 'translateY(-20px)';
    document.querySelector('.header').style.transition = 'opacity 1s ease, transform 1s ease';
    
    setTimeout(() => {
        document.querySelector('.header').style.opacity = '1';
        document.querySelector('.header').style.transform = 'translateY(0)';
    }, 100);
});

// 控制台彩蛋
console.log('%c👋 Hello, Explorer!', 'color: #00ff9f; font-size: 20px; font-weight: bold;');
console.log('%c你发现了一个彩蛋！', 'color: #00d4ff; font-size: 14px;');
console.log('%c欢迎来到 Vanilla Yukirin 的个人主页', 'color: #94a3b8; font-size: 12px;');
console.log('%c如果你对这个网站感兴趣，欢迎访问 GitHub 查看源码！', 'color: #94a3b8; font-size: 12px;');
