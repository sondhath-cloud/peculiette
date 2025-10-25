# Peculiette Site

A modern, responsive website for Peculiette Digital Solutions featuring:

- **Sticky Navigation** with blend-mode effects
- **Video Background Heroes** with optimized WebM videos
- **Contact Forms** with PHP backend integration
- **Payment Integration** with Stripe
- **Admin Dashboard** for managing website requests
- **Responsive Design** with Bootstrap 5

## Features

- 🎆 **Fireworks Video Background** - Optimized ping-pong loop (1.2MB)
- 🎨 **Blend Mode Effects** - Modern CSS blend modes for text
- 📱 **Mobile Responsive** - Works on all devices
- 💳 **Stripe Integration** - Secure payment processing
- 📧 **Contact Forms** - PHP-powered contact system
- 🔧 **Admin Panel** - Manage website requests

## Project Structure

```
peculiette-site/
├── main/                    # Main application folder
│   ├── assets/             # Video assets
│   ├── api/                # PHP API endpoints
│   ├── libs/               # Stripe PHP library
│   ├── *.html              # Website pages
│   ├── style.css           # Main styles
│   ├── shared-styles.css   # Shared component styles
│   └── script.js           # JavaScript functionality
├── payment/                # Payment pages
└── README.md               # This file
```

## Getting Started

1. **Local Development:**
   ```bash
   cd main
   python3 -m http.server 8000
   ```
   Open: http://localhost:8000

2. **Production Deployment:**
   - Upload to web hosting with PHP support
   - Configure database connection in `main/api/config.php`
   - Set up Stripe API keys for payment processing

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend:** PHP, MySQL
- **Payments:** Stripe API
- **Video:** WebM format with FFmpeg optimization
- **Styling:** CSS Blend Modes, Custom Animations

## Video Optimization

The fireworks background video has been optimized from 69MB to 1.2MB using:
- FFmpeg compression
- 10-second ping-pong loop (forward-backward-forward)
- WebM format for web compatibility

## License

This project is licensed under the MIT License.

