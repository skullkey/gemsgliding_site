# GEMS Thermal Soaring Website

A clean, minimal website for the GEMS Thermal Soaring RC Gliding Club.

## File Structure

```
├── index.html          # Main website file
├── styles.css          # All styling
├── script.js           # Gallery loading and interactions
├── gallery.json        # Gallery content (EDIT THIS to add photos/videos)
├── images/             # Folder for your photos
│   ├── hero.jpg        # Main hero image
│   └── ...             # Other photos
└── README.md           # This file
```

## Quick Start

1. **Add your hero image**: 
   - Place your main background image as `images/hero.jpg`
   - This will appear on the landing page

2. **Update gallery content**:
   - Add photos to the `images/` folder
   - Edit `gallery.json` to list them (see instructions below)

3. **Update contact info**:
   - Edit the Location and Contact sections in `index.html`
   - Replace the Google Maps embed URL

## How to Add Photos and Videos to Gallery

### Adding Photos

1. Copy your photo to the `images/` folder (e.g., `flying-day-2025.jpg`)

2. Open `gallery.json` and add an entry:

```json
{
  "type": "image",
  "src": "images/flying-day-2025.jpg",
  "caption": "Your caption here"
}
```

### Adding YouTube Videos

1. Get the YouTube video URL (e.g., `https://www.youtube.com/watch?v=ABC123xyz`)

2. Add an entry to `gallery.json`:

```json
{
  "type": "video",
  "src": "https://www.youtube.com/watch?v=ABC123xyz",
  "caption": "Your video caption"
}
```

### Complete Example of gallery.json

```json
{
  "items": [
    {
      "type": "image",
      "src": "images/group-photo.jpg",
      "caption": "Club members at flying day"
    },
    {
      "type": "video",
      "src": "https://www.youtube.com/watch?v=ABC123xyz",
      "caption": "F3K Competition Highlights"
    },
    {
      "type": "image",
      "src": "images/sunset-flight.jpg",
      "caption": "Beautiful evening flight"
    }
  ]
}
```

**Important**: 
- Items appear in the order you list them
- Make sure to include commas between items
- Don't forget the closing brackets `]` and `}`

## Updating Other Content

### About Section
Edit the `index.html` file around line 30-50 to update club information.

### Location
1. Get your Google Maps embed code:
   - Go to Google Maps
   - Search for your location
   - Click "Share" → "Embed a map"
   - Copy the iframe code
   - Replace the iframe in `index.html` around line 75

2. Update GPS coordinates and directions in the same section

### Contact Information
Edit lines 90-110 in `index.html` to update email, phone, and committee member information.

## Hosting the Website

You can host this website for free on:

- **GitHub Pages**: Free, easy, no server needed
- **Netlify**: Free, drag-and-drop deployment
- **Vercel**: Free hosting with automatic SSL
- **Your own hosting**: Just upload all files via FTP

All of these work perfectly with static HTML sites like this.

## Testing Locally

Open `index.html` in your web browser to preview. The gallery won't work when opening directly from your file system (due to browser security), but will work fine once uploaded to a web server.

To test locally with gallery working:
- Use Python: `python -m http.server 8000` then visit `http://localhost:8000`
- Or use VS Code with Live Server extension

## Troubleshooting

**Gallery not loading?**
- Check that `gallery.json` has valid JSON syntax
- Verify image paths are correct
- Make sure images folder exists and has the right photos

**Hero image not showing?**
- Ensure `images/hero.jpg` exists
- Check the file name matches exactly (case-sensitive)

**YouTube videos not playing?**
- Verify the URL is correct
- Some videos may have embedding disabled by the uploader

## Tips

- Keep photo file sizes reasonable (under 2MB each) for fast loading
- Use descriptive filenames (e.g., `f3k-competition-2025.jpg`)
- Regular JPG format works best for photos
- Videos are embedded from YouTube, so they don't slow down your site

---

Questions? Need help updating the site? Contact the webmaster!
