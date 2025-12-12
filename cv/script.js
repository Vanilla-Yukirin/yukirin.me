// 简单的页面交互脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 控制台彩蛋
    console.log('%c🌸 欢迎来到 Vanilla Yukirin 的个人主页！', 'color: #ff9ec7; font-size: 16px; font-weight: bold;');
    console.log('%c如果你对这个网站感兴趣，欢迎访问 GitHub 查看源码 ✨', 'color: #b4a7f5; font-size: 12px;');
    
    // 为卡片添加简单的渐入效果
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
