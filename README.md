# yukirin.me

Personal homepage and hub for Vanilla Yukirin.

## Features

- 🎨 Tech-style design with animated particle background
- 📱 Fully responsive layout for mobile and desktop
- ✨ Interactive animations and effects
- 🔗 Portal links to GitHub, email, blog, and more
- 📊 Integrated analytics tracking
- 🎯 Personal introduction and achievements showcase

## Quick Start

This is a pure static website - no build tools required!

### Local Development

Simply serve the files with any HTTP server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (http-server)
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then open http://localhost:8080 in your browser.

### Deployment

Deploy the entire repository to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any web server (nginx, Apache, etc.)

All files (`index.html`, `style.css`, `script.js`) should be in the root directory of your web server.

## Customization

### Update Personal Information

Edit `index.html` to update:
- Personal details (name, education, major)
- Competition achievements
- Technical skills
- Contact links

### Modify Colors

Edit the CSS custom properties in `style.css`:

```css
:root {
    --primary-color: #00ff9f;      /* Main accent color */
    --secondary-color: #00d4ff;     /* Secondary accent */
    --background: #0a0e27;          /* Background color */
    /* ... */
}
```

### Adjust Animations

Modify particle count or animation behavior in `script.js`:

```javascript
const particleCount = 100;  // Number of particles
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Personal website - All rights reserved.