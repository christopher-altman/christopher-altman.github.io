#!/bin/bash
# Hero Image Format Conversion Script
# Converts JPEG hero images to WebP and AVIF formats for optimal compression
#
# Requirements:
# - ImageMagick (brew install imagemagick)
# - libavif (brew install libavif)
# - cwebp (brew install webp)
#
# Usage:
#   chmod +x scripts/convert-hero-images.sh
#   ./scripts/convert-hero-images.sh

set -e

ASSETS_DIR="assets"
LIGHT_JPEG="${ASSETS_DIR}/accuracy-vs-identifiability-light.jpeg"
DARK_JPEG="${ASSETS_DIR}/accuracy-vs-identifiability-dark.jpeg"

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Hero Image Format Conversion${NC}"
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

echo "Checking dependencies..."
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
convert_image() {
  local input="$1"
  local basename="${input%.jpeg}"

  if [ ! -f "$input" ]; then
    echo -e "${YELLOW}⚠  Source file not found: $input${NC}"
    echo "   Skipping conversion (will use placeholder paths)"
    return 0
  fi

  echo -e "${BLUE}Processing: $(basename "$input")${NC}"

  # WebP conversion (quality 90, exact metadata preservation)
  echo "  → Converting to WebP..."
  cwebp -q 90 -m 6 -metadata all -exact "$input" -o "${basename}.webp"

  # AVIF conversion (quality 85, 4:4:4 chroma for color accuracy)
  echo "  → Converting to AVIF..."
  avifenc --min 0 --max 50 --speed 4 --yuv 444 --codec aom "$input" "${basename}.avif"

  # File size comparison
  local jpeg_size=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null)
  local webp_size=$(stat -f%z "${basename}.webp" 2>/dev/null || stat -c%s "${basename}.webp" 2>/dev/null)
  local avif_size=$(stat -f%z "${basename}.avif" 2>/dev/null || stat -c%s "${basename}.avif" 2>/dev/null)

  echo -e "  ${GREEN}✓ Conversion complete${NC}"
  echo "    JPEG: $(numfmt --to=iec-i --suffix=B $jpeg_size)"
  echo "    WebP: $(numfmt --to=iec-i --suffix=B $webp_size) ($(awk "BEGIN {printf \"%.1f\", ($webp_size/$jpeg_size)*100}")% of JPEG)"
  echo "    AVIF: $(numfmt --to=iec-i --suffix=B $avif_size) ($(awk "BEGIN {printf \"%.1f\", ($avif_size/$jpeg_size)*100}")% of JPEG)"
  echo
}

# Convert both variants
convert_image "$LIGHT_JPEG"
convert_image "$DARK_JPEG"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Conversion Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo "Generated files:"
echo "  • ${ASSETS_DIR}/accuracy-vs-identifiability-light.webp"
echo "  • ${ASSETS_DIR}/accuracy-vs-identifiability-light.avif"
echo "  • ${ASSETS_DIR}/accuracy-vs-identifiability-dark.webp"
echo "  • ${ASSETS_DIR}/accuracy-vs-identifiability-dark.avif"
echo
echo "Next steps:"
echo "  1. Verify image quality: open generated files in browser"
echo "  2. Commit generated assets: git add assets/*.{webp,avif}"
echo "  3. Test theme toggle: ensure all formats swap correctly"
echo
