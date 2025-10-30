# DNA Lang Mobile IDE Icons

## Icon Requirements

The following icons need to be generated from the logo assets:

- `icon-192.png` - 192x192 PNG icon for PWA
- `icon-512.png` - 512x512 PNG icon for PWA
- `apple-touch-icon.png` - 180x180 Apple touch icon
- `favicon.ico` - Multi-size ICO file

## Generating Icons

You can use the `dnalang-logo.svg` as the source for all icons:

```bash
# Using ImageMagick or similar tools
convert -background none -resize 192x192 ../dnalang-logo.svg icon-192.png
convert -background none -resize 512x512 ../dnalang-logo.svg icon-512.png
convert -background none -resize 180x180 ../dnalang-logo.svg apple-touch-icon.png
```

## Branding

The DNA Lang logo incorporates:
- Blue gradient DNA double helix (representing genetic code and programming)
- Red Hat accent colors (Red Hat partnership)
- Code brackets overlay (programming focus)

The combined logo (`dnalang-redhat-logo.svg`) should be used for:
- Landing pages
- Documentation headers
- Marketing materials
- Splash screens
