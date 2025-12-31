#!/bin/bash
# Convert Transparent PNGs to WebP/AVIF
# Optimized for transparent backgrounds with sharp text preservation
#
# Requirements:
# - ImageMagick, cwebp, avifenc (brew install imagemagick webp libavif)
#
# Usage:
#   chmod +x scripts/convert-transparent-images.sh
#   ./scripts/convert-transparent-images.sh

set -e

ASSETS_DIR="assets"
LIGHT_PNG="${ASSETS_DIR}/accuracy-vs-identifiability-light-transparent.png"
DARK_PNG="${ASSETS_DIR}/accuracy-vs-identifiability-dark-transparent.png"

# Output paths (replace original filenames)
LIGHT_WEBP="${ASSETS_DIR}/accuracy-vs-identifiability-light.webp"
LIGHT_AVIF="${ASSETS_DIR}/accuracy-vs-identifiability-light.avif"
DARK_WEBP="${ASSETS_DIR}/accuracy-vs-identifiability-dark.webp"
DARK_AVIF="${ASSETS_DIR}/accuracy-vs-identifiability-dark.avif"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Convert Transparent PNGs to WebP/AVIF${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check dependencies
check_dependency() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${YELLOW}⚠  $1 not found. Install with: brew install $2${NC}"
    return 1
  fi
  echo -e "${GREEN}✓ $1 installed${NC}"
  return 0
}

DEPS_OK=true
check_dependency "cwebp" "webp" || DEPS_OK=false
check_dependency "avifenc" "libavif" || DEPS_OK=false

if [ "$DEPS_OK" = false ]; then
  echo
  echo -e "${YELLOW}Missing dependencies. Install them and re-run this script.${NC}"
  exit 1
fi

echo

# Convert function
convert_transparent() {
  local input="$1"
  local output_webp="$2"
  local output_avif="$3"
  local variant="$4"

  if [ ! -f "$input" ]; then
    echo -e "${YELLOW}⚠  Source file not found: $input${NC}"
    echo "   Run ./scripts/make-transparent-background.sh first"
    return 1
  fi

  echo -e "${BLUE}Processing: $(basename "$input")${NC}"

  # WebP conversion
  # - Quality 90 for sharp text
  # - Exact mode preserves alpha channel precision
  # - Lossless alpha channel
  echo "  → Converting to WebP..."
  cwebp -q 90 -m 6 -exact -alpha_q 100 "$input" -o "$output_webp"

  # AVIF conversion
  # - High quality lossy for RGB (q=85)
  # - 4:4:4 chroma (no subsampling for sharp edges)
  # - Quality 100 for alpha (preserves transparency)
  echo "  → Converting to AVIF..."
  avifenc -q 85 --qalpha 100 --speed 4 --yuv 444 "$input" "$output_avif"

  # File size comparison
  local png_size=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null)
  local webp_size=$(stat -f%z "$output_webp" 2>/dev/null || stat -c%s "$output_webp" 2>/dev/null)
  local avif_size=$(stat -f%z "$output_avif" 2>/dev/null || stat -c%s "$output_avif" 2>/dev/null)

  echo -e "  ${GREEN}✓ Conversion complete${NC}"
  echo "    PNG:  $(numfmt --to=iec-i --suffix=B $png_size 2>/dev/null || echo "${png_size} bytes")"
  echo "    WebP: $(numfmt --to=iec-i --suffix=B $webp_size 2>/dev/null || echo "${webp_size} bytes") ($(awk "BEGIN {printf \"%.1f\", ($webp_size/$png_size)*100}")% of PNG)"
  echo "    AVIF: $(numfmt --to=iec-i --suffix=B $avif_size 2>/dev/null || echo "${avif_size} bytes") ($(awk "BEGIN {printf \"%.1f\", ($avif_size/$png_size)*100}")% of PNG)"
  echo
}

# Convert both variants
convert_transparent "$LIGHT_PNG" "$LIGHT_WEBP" "$LIGHT_AVIF" "light"
convert_transparent "$DARK_PNG" "$DARK_WEBP" "$DARK_AVIF" "dark"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Conversion Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo "Generated files:"
echo "  • ${LIGHT_WEBP}"
echo "  • ${LIGHT_AVIF}"
echo "  • ${DARK_WEBP}"
echo "  • ${DARK_AVIF}"
echo
echo "Next steps:"
echo "  1. Verify transparency in browser (refresh with hard reload)"
echo "  2. CSS background-color will fill transparent areas with theme color"
echo "  3. Test theme toggle to ensure smooth transition"
echo
echo "Note: Original transparent PNGs retained in assets/ for reference"
echo
