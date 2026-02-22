# Personal Portfolio Website

A modern, polished, single-page portfolio website designed for product managers and business professionals. Built with clean HTML, CSS, and JavaScript - no frameworks required!

## 🎨 Design Features

- **Modern & Polished**: Inspired by professional portfolios with a clean, minimalist aesthetic
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Scroll-triggered animations and smooth transitions
- **Professional Color Scheme**: Blue/indigo gradient palette with teal accents
- **Interactive Elements**: Hover effects, smooth scrolling, and dynamic navbar

## 📋 Sections Included

1. **Navigation Bar** - Sticky header with smooth scroll navigation
2. **Hero Section** - Profile photo, introduction, CTAs, and key stats
3. **About Section** - Bio and core competencies
4. **Experience Timeline** - Work history with achievements
5. **Projects Showcase** - Card-based portfolio with impact metrics
6. **Contact Section** - Social links and contact form
7. **Footer** - Copyright and credits

## 🚀 Quick Start

### View Locally

1. Open the `personal-website` folder
2. Double-click `index.html` to open in your browser
3. That's it! No build process or dependencies required

### Customize Your Content

#### 1. Replace Placeholder Text

Search for the following placeholders in `index.html` and replace with your information:

- `[Your Name]` - Your full name
- `[Your Initials]` - Your initials for the logo (e.g., "JO")
- `[Job Title]` - Your current role (e.g., "Product Manager")
- `[Industry 1], [Industry 2], [Industry 3]` - Your industry experience
- `[X] years`, `[Y]M+ users`, `[Z]+ products` - Your statistics
- Work experience items (companies, dates, achievements)
- Project descriptions and impact metrics
- Skills and competencies

#### 2. Add Your Profile Photo

Replace the placeholder image in the hero section:

```html
<!-- Find this line in index.html: -->
<img src="https://via.placeholder.com/200" alt="Profile Photo">

<!-- Replace with your photo: -->
<img src="profile-photo.jpg" alt="Your Name">
```

**Photo Tips:**
- Use a square image (recommended: 400x400px minimum)
- Professional headshot works best
- Save as `profile-photo.jpg` in the same folder as `index.html`

#### 3. Add Project Images

Replace placeholder project images:

```html
<!-- Find these lines in the projects section: -->
<img src="https://via.placeholder.com/400x250" alt="Project 1">

<!-- Replace with your project images: -->
<img src="project1.jpg" alt="Project Name">
```

**Image Tips:**
- Use landscape images (recommended: 800x500px)
- Keep file sizes under 500KB for fast loading
- Use descriptive alt text for accessibility

#### 4. Update Social Links

Find the social links section and update your profiles:

```html
<!-- LinkedIn -->
<a href="https://linkedin.com/in/your-profile" target="_blank">

<!-- Twitter -->
<a href="https://twitter.com/your-handle" target="_blank">

<!-- Email -->
<a href="mailto:your-email@example.com">

<!-- GitHub -->
<a href="https://github.com/your-username" target="_blank">
```

#### 5. Customize Colors (Optional)

Want to change the color scheme? Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4f46e5;      /* Main brand color */
    --secondary-color: #06b6d4;     /* Accent color */
    /* ... other colors ... */
}
```

**Suggested Palettes:**
- **Purple/Pink**: `--primary-color: #8b5cf6; --secondary-color: #ec4899;`
- **Blue/Green**: `--primary-color: #3b82f6; --secondary-color: #10b981;`
- **Orange/Red**: `--primary-color: #f97316; --secondary-color: #ef4444;`

## 📧 Contact Form Integration

The contact form is set up but needs a backend service to function. Here are three easy options:

### Option 1: Formspree (Recommended - Free)

1. Go to [formspree.io](https://formspree.io) and sign up
2. Create a new form and get your form ID
3. In `script.js`, uncomment the Formspree code block (around line 60):

```javascript
fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
.then(response => {
    if (response.ok) {
        alert('Message sent successfully!');
        contactForm.reset();
    }
})
.catch(error => console.error('Error:', error));
```

4. Replace `YOUR_FORM_ID` with your actual Formspree form ID

### Option 2: Netlify Forms

If deploying to Netlify:

1. Add `data-netlify="true"` to your form tag in `index.html`:

```html
<form class="contact-form" id="contactForm" data-netlify="true">
```

2. Deploy to Netlify - forms will work automatically!

### Option 3: Formspark

1. Sign up at [formspark.io](https://formspark.io)
2. Create a form and get your form ID
3. Update the fetch URL in `script.js` to:

```javascript
fetch('https://submit-form.com/YOUR_FORMSPARK_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended - Free & Easy)

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your `personal-website` folder into Netlify
3. Get instant free hosting with HTTPS and custom domain support
4. Automatic form handling included!

**Deployment Steps:**
- Go to Netlify Dashboard → "Add new site" → "Deploy manually"
- Drag the entire `personal-website` folder
- Your site is live in seconds!

### Option 2: GitHub Pages (Free)

1. Create a GitHub account if you don't have one
2. Create a new repository named `your-username.github.io`
3. Upload your website files to the repository
4. Go to Settings → Pages and enable GitHub Pages
5. Your site will be live at `https://your-username.github.io`

### Option 3: Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository or upload files directly
3. Instant deployment with free hosting

### Option 4: Traditional Web Hosting

Upload files via FTP to any web host (GoDaddy, Bluehost, HostGator, etc.)

## 🎯 Customization Tips

### Adding More Sections

To add a new section:

1. Add HTML structure between existing sections:

```html
<section id="new-section" class="new-section">
    <div class="container">
        <h2 class="section-title">New Section</h2>
        <!-- Your content -->
    </div>
</section>
```

2. Add navigation link:

```html
<li><a href="#new-section">New Section</a></li>
```

3. Add custom styles in `styles.css`

### Removing Sections

Simply delete the section HTML from `index.html` and remove the corresponding navigation link.

### Mobile Menu

The current design hides navigation on very small screens. To add a hamburger menu:

1. Uncomment the mobile menu code in `script.js` (bottom section)
2. Add hamburger button HTML to navbar
3. Add corresponding CSS styles

## 🔧 Advanced Customizations

### Stats Counter Animation

Uncomment the stats counter code in `script.js` (around line 100) to animate the hero statistics when scrolled into view.

### Lazy Loading Images

For better performance with many images:

1. Change `src` to `data-src` in your image tags:

```html
<img data-src="project1.jpg" alt="Project 1">
```

2. The JavaScript will automatically lazy-load them

### SEO Optimization

Update the meta tags in the `<head>` section:

```html
<meta name="description" content="Your compelling description here">
<title>Your Name - Your Title</title>

<!-- Add Open Graph tags for social sharing: -->
<meta property="og:title" content="Your Name - Product Manager">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yoursite.com/preview-image.jpg">
```

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Content Writing Tips

### Hero Section
- Start with a strong, clear statement of what you do
- Highlight your unique value proposition
- Use metrics that matter (users impacted, revenue generated, etc.)

### About Section
- Tell your story - what drives you?
- Show personality while staying professional
- Focus on what makes you different

### Experience Section
- Use action verbs (Led, Launched, Increased, Built)
- Quantify achievements whenever possible
- Show impact, not just responsibilities

### Projects Section
- Lead with results and impact
- Explain the problem you solved
- Use metrics to demonstrate success

## 🎨 Design Principles Used

- **Whitespace**: Generous spacing for readability
- **Hierarchy**: Clear visual hierarchy guides the eye
- **Consistency**: Repeated patterns create familiarity
- **Contrast**: Important elements stand out
- **Responsiveness**: Mobile-first, works everywhere

## 📄 File Structure

```
personal-website/
│
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Interactive functionality
└── README.md           # This file
```

## 🆘 Troubleshooting

**Images not showing?**
- Check file paths are correct
- Make sure images are in the same folder as `index.html`
- Use lowercase filenames without spaces

**Styles not applying?**
- Verify `styles.css` is in the same folder
- Check browser console for errors (F12)
- Try hard refresh (Ctrl/Cmd + Shift + R)

**Contact form not working?**
- Integrate with a form service (see Contact Form Integration section)
- Check browser console for errors
- Verify form service credentials

**Mobile menu not showing?**
- On very small screens, nav links are hidden by default
- Consider implementing the hamburger menu (see Mobile Menu section)

## 🚀 Next Steps

1. ✅ Customize all placeholder content with your information
2. ✅ Add your photos and project images
3. ✅ Update social media links
4. ✅ Choose and integrate a contact form service
5. ✅ Test on multiple devices and browsers
6. ✅ Deploy to your hosting service of choice
7. ✅ Share your new portfolio!

## 💡 Additional Resources

- [Google Fonts](https://fonts.google.com) - Add custom typography
- [Font Awesome](https://fontawesome.com) - Icon library
- [Unsplash](https://unsplash.com) - Free stock photos
- [Coolors](https://coolors.co) - Color palette generator
- [Can I Use](https://caniuse.com) - Check browser compatibility

## 📧 Questions?

If you have questions about customizing your portfolio:
1. Check this README first
2. Search online for specific HTML/CSS tutorials
3. Use browser developer tools (F12) to experiment

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

Good luck with your new portfolio! 🎉
