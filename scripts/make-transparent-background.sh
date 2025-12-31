#!/bin/bash
# Make Hero Images Transparent Background
# Removes background while preserving sharp text/plot elements
#
# Requirements:
# - ImageMagick (brew install imagemagick)
#
# Usage:
#   chmod +x scripts/make-transparent-background.sh
#   ./scripts/make-transparent-background.sh

set -e

ASSETS_DIR="assets"
LIGHT_JPEG="${ASSETS_DIR}/accuracy-vs-identifiability-light.jpeg"
DARK_JPEG="${ASSETS_DIR}/accuracy-vs-identifiability-dark.jpeg"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Make Hero Images Transparent${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check ImageMagick
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
  echo -e "${YELLOW}⚠  ImageMagick not found. Install with: brew install imagemagick${NC}"
  exit 1
fi
echo -e "${GREEN}✓ ImageMagick installed${NC}"
echo

# Determine ImageMagick command (v7 uses 'magick', v6 uses 'convert')
if command -v magick &> /dev/null; then
  MAGICK_CMD="magick"
else
  MAGICK_CMD="convert"
fi

# Process function
make_transparent() {
  local input="$1"
  local output_png="$2"
  local bg_color="$3"
  local variant_name="$4"

  if [ ! -f "$input" ]; then
    echo -e "${YELLOW}⚠  Source file not found: $input${NC}"
    return 1
  fi

  echo -e "${BLUE}Processing: $(basename "$input") → $(basename "$output_png")${NC}"

  # Step 1: Make background transparent
  # - Use fuzzy color matching to catch slight variations
  # - Preserve alpha channel for anti-aliased text edges
  echo "  → Removing ${variant_name} background (${bg_color})..."

  $MAGICK_CMD "$input" \
    -fuzz 8% \
    -transparent "$bg_color" \
    -alpha set \
    -channel RGBA \
    "$output_png"

  # Step 2: Clean up edge artifacts (optional, preserves text sharpness)
  # Remove semi-transparent pixels at edges while keeping text anti-aliasing
  echo "  → Cleaning edge artifacts..."

  $MAGICK_CMD "$output_png" \
    -alpha extract \
    -morphology Erode Octagon:1 \
    "$output_png" \
    -compose CopyOpacity \
    -composite \
    "$output_png"

  # Verify output
  local png_size=$(stat -f%z "$output_png" 2>/dev/null || stat -c%s "$output_png" 2>/dev/null)
  echo -e "  ${GREEN}✓ Created transparent PNG${NC}"
  echo "    Size: $(numfmt --to=iec-i --suffix=B $png_size 2>/dev/null || echo "${png_size} bytes")"

  # Check transparency
  local transparent_pixels=$($MAGICK_CMD "$output_png" -format "%[fx:mean.a<1?1:0]" info: 2>/dev/null || echo "unknown")
  if [ "$transparent_pixels" = "1" ]; then
    echo -e "    ${GREEN}✓ Transparency confirmed${NC}"
  else
    echo -e "    ${YELLOW}⚠ Warning: No transparent pixels detected (may need to adjust -fuzz)${NC}"
  fi
  echo
}

# Light mode: white/off-white background
echo -e "${BLUE}═══ Light Mode (White Background) ═══${NC}"
echo

# Detect actual background color from light image (top-left corner)
if [ -f "$LIGHT_JPEG" ]; then
  LIGHT_BG_COLOR=$($MAGICK_CMD "$LIGHT_JPEG" -crop 1x1+10+10 -format '%[pixel:u]' info: 2>/dev/null || echo "white")
  echo "  Detected background color: ${LIGHT_BG_COLOR}"

  # Convert to hex if needed (for better matching)
  if [[ "$LIGHT_BG_COLOR" =~ srgb ]]; then
    # Extract RGB values and convert to hex
    LIGHT_BG_HEX=$($MAGICK_CMD "$LIGHT_JPEG" -crop 1x1+10+10 -format '#%[hex:u]' info: 2>/dev/null || echo "#FFFFFF")
    echo "  Hex color: ${LIGHT_BG_HEX}"
    LIGHT_BG_COLOR="$LIGHT_BG_HEX"
  fi
else
  LIGHT_BG_COLOR="#FFFFFF"
  echo "  Using default: ${LIGHT_BG_COLOR}"
fi

make_transparent \
  "$LIGHT_JPEG" \
  "${ASSETS_DIR}/accuracy-vs-identifiability-light-transparent.png" \
  "$LIGHT_BG_COLOR" \
  "light"

# Dark mode: dark gray/black background
echo -e "${BLUE}═══ Dark Mode (Dark Background) ═══${NC}"
echo

# Detect actual background color from dark image
if [ -f "$DARK_JPEG" ]; then
  DARK_BG_COLOR=$($MAGICK_CMD "$DARK_JPEG" -crop 1x1+10+10 -format '%[pixel:u]' info: 2>/dev/null || echo "black")
  echo "  Detected background color: ${DARK_BG_COLOR}"

  if [[ "$DARK_BG_COLOR" =~ srgb ]]; then
    DARK_BG_HEX=$($MAGICK_CMD "$DARK_JPEG" -crop 1x1+10+10 -format '#%[hex:u]' info: 2>/dev/null || echo "#111827")
    echo "  Hex color: ${DARK_BG_HEX}"
    DARK_BG_COLOR="$DARK_BG_HEX"
  fi
else
  DARK_BG_COLOR="#111827"
  echo "  Using default: ${DARK_BG_COLOR}"
fi

make_transparent \
  "$DARK_JPEG" \
  "${ASSETS_DIR}/accuracy-vs-identifiability-dark-transparent.png" \
  "$DARK_BG_COLOR" \
  "dark"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Transparency Conversion Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo "Created files:"
echo "  • ${ASSETS_DIR}/accuracy-vs-identifiability-light-transparent.png"
echo "  • ${ASSETS_DIR}/accuracy-vs-identifiability-dark-transparent.png"
echo
echo "Next steps:"
echo "  1. Verify transparency: open generated PNGs in preview/browser"
echo "  2. Convert to modern formats:"
echo "     ./scripts/convert-transparent-images.sh"
echo "  3. Update HTML to use transparent variants"
echo "  4. CSS background-color will provide the theme-matched background"
echo
