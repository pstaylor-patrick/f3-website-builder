# F3 Website Builder

## Tech Stack

- [Figma](https://www.figma.com/) for designs
- [Next.js](https://nextjs.org/) for application
- [Material UI (MUI)](https://mui.com/material-ui/integrations/nextjs/) for design system
- [Vercel](https://vercel.com/frameworks/nextjs) for hosting
- [Supabase](https://supabase.com/database) for database
- [Supabase](https://supabase.com/auth) for auth
- [Cloudinary](https://github.com/cloudinary-community/next-cloudinary/) for images
- [Google](https://marketingplatform.google.com/about/analytics/) for analytics
- [GitHub](https://github.com/pstaylor-patrick/f3-website-builder) for source control

## Functional Requirements

**As a local F3 man, I can:**

1. Create website
2. Preview website
3. Publish website
4. Unpublish website
5. Update website

**As a nation admin, I can:**

1. Moderate content (“approve and publish”)
2. Unpublish website
3. See platform analytics
    1. count of websites
    2. adoption rate (count of builder sites divided by total count of regions)
4. Audit usage details
    1. `websites_dim` data table - discrete set of websites on platform (and their descriptors like geography, published status, etc.)
    2. `activity_fact` data table - create and update website events

## Nonfunctional Requirements

### Builder Essentials

- mobile first - heavily optimize for mobile management of local region websites
- role-based access control (RBAC) - leverage RBAC to enforce principle of least privilege

---

<aside>
<img src="https://www.notion.so/icons/warning_gray.svg" alt="https://www.notion.so/icons/warning_gray.svg" width="40px" />

**Disclaimer**: AI-Generated Nonfunctional Requirements Below

For context, these are largely referring to the published local region website that was created using this builder.

</aside>

### **Performance Essentials**

- **Page Load Time:**
    - Total load time must be **under 2 seconds** on broadband (5 Mbps).
- **Largest Contentful Paint (LCP):**
    - LCP must occur within **2 seconds** to ensure key content is visible quickly.
- **Asset Optimization:**
    - Use **compressed images** (WebP) and minified CSS/JS.
    - Critical CSS is **inlined**, and JavaScript is **deferred**.
- **Lazy Loading:**
    - Images below the fold must use **lazy loading** to reduce initial load time.

---

### **SEO Essentials**

- **Meta Tags and Titles:**
    - Include **unique title tags** and meta descriptions for each page.
- **Semantic HTML:**
    - Use proper HTML5 tags (`<header>`, `<main>`, `<section>`).
- **Mobile Responsiveness:**
    - Ensure the site adapts well to screens as small as **320px** wide.
- **Sitemap:**
    - Generate an **XML sitemap** for search engines.

---

### **Hosting and Delivery**

- **Static Hosting with CDN:**
    - Deploy to a static hosting service (e.g., Vercel, Netlify) with a global CDN for low latency.
- **HTTPS:**
    - Enforce HTTPS for all content.
- **Caching:**
    - Enable **long-term caching** for static assets with versioned filenames.

---

### **User Experience Essentials**

- **Perceived Performance:**
    - Critical content (text and hero image) must render within **1 second**.
- **Fonts:**
    - Use system fonts or WOFF2 with `font-display: swap`.
- **Stability (CLS):**
    - Ensure **no significant layout shifts** during loading (target CLS < 0.1).

---

### **Monitoring (Optional but Ideal)**

- **Performance Testing:**
    - Use Lighthouse or WebPageTest to verify load times and metrics like LCP and CLS.

---

## **Summary of MVP Focus**

1. **Fast page load** (<2 seconds).
2. **SEO basics**: meta tags, semantic HTML, and a sitemap.
3. **Static hosting** with a CDN for delivery.
4. **Optimized assets** (compressed images, deferred scripts).
5. **Mobile responsiveness** and HTTPS enforcement.