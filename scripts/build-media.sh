#!/usr/bin/env bash
#
# Regenerate everything in public/ from the untracked ASSETS/ masters.
#
# ASSETS/ is the source of truth and never enters git. This script produces the
# optimized derivatives that do. Re-run it whenever a master changes or a new
# case study lands; it is idempotent and always encodes from the original, so
# repeated runs never stack generation loss.
#
# One output lands outside public/: the Open Graph still is written to
# src/app/opengraph-image.png, where Next's file convention picks it up. See the
# social share section for why it has to live there.
#
#   ./scripts/build-media.sh
#
# Requires ffmpeg (brew install ffmpeg).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
A="$ROOT/ASSETS"
P="$ROOT/public"

if ! command -v ffmpeg >/dev/null; then
  echo "ffmpeg not found. Install it with: brew install ffmpeg" >&2
  exit 1
fi

# --- encoding -----------------------------------------------------------------
# Every clip on this site is a muted, looping, decorative background, so audio is
# stripped outright. CRF 26 at a 1280px cap is well above what a cell a few
# hundred CSS pixels wide can resolve, even on a 2x display. The hero is the one
# exception: it runs full-bleed, so it gets a larger box and a lower CRF.
# +faststart moves the moov atom to the front so playback can begin before the
# whole file has arrived.

encode() {           # encode <src> <dst> <max-dimension> <crf>
  local src="$1" dst="$2" box="$3" crf="$4"
  mkdir -p "$(dirname "$dst")"
  ffmpeg -y -loglevel error -i "$src" \
    -vf "scale=w='min(${box},iw)':h='min(${box},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf "$crf" -preset slow -an -movflags +faststart \
    "$dst"
  # Poster frame, so the cell can paint without fetching any video at all.
  ffmpeg -y -loglevel error -ss 0.3 -i "$src" -frames:v 1 -q:v 5 \
    "${dst%.mp4}-poster.jpg"
}

grid() { encode "$1" "$2" 1280 26; }   # explore grid + case study cells
hero() { encode "$1" "$2" 1920 24; }   # full-bleed hero

copy() { mkdir -p "$(dirname "$2")"; cp "$1" "$2"; }

# --- social share -------------------------------------------------------------
# Only the still. There was a matching 1200x630 og:video here until 2026-08-11,
# and it worked: Messages played it inline, muted and looping. It was dropped
# because a preview carrying og:video becomes a video player, so tapping the
# card opened system playback instead of the site, and Open Graph offers no way
# to keep the motion while sending the tap to the URL.
#
# If it is ever wanted back, the master is SOCIAL SHARE IMAGE (VIDEO).mp4 in
# ASSETS/HOME/PERSONAL BRAND LOGO/ and the encode was:
#
#   ffmpeg -i <src> -c:v libx264 -profile:v high -pix_fmt yuv420p \
#     -crf 18 -preset slow -an -movflags +faststart <dst>
#
# CRF 18 rather than the grid's 26 because Apple caps all preview resources for
# one link at 10MB and fetches the video before playing it. That landed at
# 0.78MB and measured SSIM 0.995 against the master, keeping the fades free of
# banding with the whole budget still spare.
#
# The still is flattened onto --bg rather than copied. It carries a soft-edged
# alpha channel, and scrapers composite transparency onto whatever they like,
# frequently white, which would invert the whole design.
share_still() {      # share_still <src> <dst>
  mkdir -p "$(dirname "$2")"
  ffmpeg -y -loglevel error -i "$1" \
    -filter_complex "color=c=0x1F1E1F:s=1200x630[bg];[bg][0:v]overlay=0:0:format=auto,format=rgb24" \
    -frames:v 1 "$2"
}

echo "==> hero"
hero "$A/HOME/HEADER/HERO HEADER - DESKTOP.mp4" "$P/home/hero/hero-desktop.mp4"
hero "$A/HOME/HEADER/HERO HEADER - MOBILE.mp4"  "$P/home/hero/hero-mobile.mp4"

echo "==> logos"
L="$A/HOME/LOGOS"; O="$P/home/logos"
copy "$L/1- NBA.jpg"                                         "$O/01-nba.jpg"
copy "$L/2 - MLS_crest_logo_RGB_gradient.svg-copy-square.png" "$O/02-mls.png"
copy "$L/3 - F1_white.png"                                   "$O/03-f1.png"
copy "$L/4 - universal_music_group_white.png"                "$O/04-universal.png"
copy "$L/5 - Capitol_Records_logo.svg_.png"                  "$O/05-capitol.png"
copy "$L/6 - warner.png"                                     "$O/06-warner.png"
copy "$L/7 - sony-music.png"                                 "$O/07-sony.png"
copy "$L/8 - Interscope_Records_white.png"                   "$O/08-interscope.png"
copy "$L/9 - Shady-Records-White.png"                        "$O/09-shady.png"
copy "$L/10 - Red-Bull-logo.png"                             "$O/10-red-bull.png"
copy "$L/11 - Blue_Man_Group.svg_.png"                       "$O/11-blue-man-group.png"
copy "$L/12 - BAMA.png"                                      "$O/12-bama.png"
copy "$L/13 - Starstruck_EntertainmentWhite.png"             "$O/13-starstruck.png"

echo "==> brand"
B="$A/HOME/PERSONAL BRAND LOGO"
copy "$B/WORDMARK - INITIALS - OFFICIAL LOGO.svg" "$P/brand/logo.svg"

echo "==> social share"
# The one output that lands outside public/. src/app/opengraph-image.png is a
# Next file convention: keeping the still there means every route inherits an
# og:image automatically, including case studies, whose generateMetadata
# replaces the openGraph object wholesale and would otherwise drop it.
share_still "$B/BO LATHAM STUDIO - SOCIAL SHARE IMAGE (FALLBACK).png" "$ROOT/src/app/opengraph-image.png"

echo "==> home case study thumbs"
C="$A/HOME/CASE STUDIES"; O="$P/home/case-studies"
copy "$C/RED BULL/HOME - PIT CREW CHRONICLES - 1 - THUMB.webp" "$O/pit-crew-1.webp"
copy "$C/RED BULL/HOME - PIT CREW CHRONICLES - 2 - THUMB.webp" "$O/pit-crew-2.webp"
copy "$C/RED BULL/HOME - PIT CREW CHRONICLES - 3 - THUMB.webp" "$O/pit-crew-3.webp"
copy "$C/BLUE MAN GROUP/HOME - LAS VEGAS GP - 1 - THUMB.webp"  "$O/lvgp-1.webp"
copy "$C/BLUE MAN GROUP/HOME - LAS VEGAS GP - 2 - THUMB.webp"  "$O/lvgp-2.webp"
copy "$C/BLUE MAN GROUP/HOME - LAS VEGAS GP - 3 - THUMB.webp"  "$O/lvgp-3.webp"

# --- work ---------------------------------------------------------------------
# Seven clips are byte-identical between WORK/ALL and WORK/VIDEO. They are
# emitted once here, under the id both filters reference.

echo "==> work: all"
W="$A/HOME/WORK"; O="$P/home/work"
grid "$W/ALL/HORIZONTAL - BO REEL.mp4"                          "$O/bo-reel.mp4"
grid "$W/ALL/VERTICAL - RBR - BLXST.mp4"                        "$O/rbr-blxst.mp4"
grid "$W/ALL/VERTICAL - SWEET CREAM.mp4"                        "$O/sweet-cream-vertical.mp4"
grid "$W/ALL/HORIZONTAL - ROWDY.mp4"                            "$O/rowdy.mp4"
grid "$W/ALL/LOADMORE - HORIZONTAL - HUMAN TO LOVE.mp4"         "$O/human-to-love.mp4"
grid "$W/ALL/LOADMORE - VERTICAL - RBR - BUCKS.mp4"             "$O/rbr-bucks.mp4"
grid "$W/ALL/LOADMORE - VERTICAL - SWEET CREAM.mp4"             "$O/sweet-cream.mp4"
grid "$W/ALL/LOADMORE - HORIZONTAL - CREEK WATER WHISKEY.mp4"   "$O/creek-water.mp4"
copy "$W/ALL/SQUARE - (ARTIST ROLLOUT).webp"                    "$O/artist-rollout.webp"
copy "$W/ALL/MEDIUM 34 - BO LATHAM - DEAD ON THIS HILL.webp"    "$O/dead-on-this-hill.webp"
copy "$W/ALL/SQUARE - (COVER ART).webp"                         "$O/cover-art.webp"
copy "$W/ALL/LOADMORE - MEDIUM 34 - WILD CARD TALENT.webp"      "$O/wild-card-talent.webp"
copy "$W/ALL/LOADMORE - MEDIUM 34 - DEAD ON THIS HILL BOOK.webp" "$O/doth-book.webp"
copy "$W/ALL/LOADMORE - SQUARE - DEAD ON THIS HILL SHOOT.webp"  "$O/doth-shoot.webp"
copy "$W/ALL/MEDIUM 34 - GET MAINE LOBSTER.webp"                "$O/get-maine-lobster.webp"
copy "$W/ALL/LOADMORE - SQUARE - SWEET CREAM.webp"              "$O/sweet-cream-square.webp"

echo "==> work: video"
grid "$W/VIDEO/3_2 - VERTICAL - RBR BMG.mp4"          "$O/rbr-bmg.mp4"
grid "$W/VIDEO/5_1 HORIZONTAL - COOKUP.mp4"           "$O/cookup.mp4"
grid "$W/VIDEO/5_2 HORIZONTAL - LEVI FAITH.mp4"       "$O/levi-faith.mp4"
grid "$W/VIDEO/5_3 HORIZONTAL - RUSTY SHIPP.mp4"      "$O/rusty-shipp.mp4"
grid "$W/VIDEO/5_4 HORIZONTAL - MOONRIDE.mp4"         "$O/moonride.mp4"
grid "$W/VIDEO/6_1 HORIZONTAL - LEVI THREE WORDS.mp4" "$O/levi-three-words.mp4"
grid "$W/VIDEO/6_2 HORIZONTAL - SCALABILITY.mp4"      "$O/scalability.mp4"
grid "$W/VIDEO/6_3 HORIZONTAL - WILDER FURY.mp4"      "$O/wilder-fury.mp4"
grid "$W/VIDEO/6_4 HORIZONTAL - WEDDING.mp4"          "$O/wedding.mp4"

echo "==> work: design"
D="$W/DESIGN"
copy "$D/HOME - GRID - DESIGN 1_1 (RJC).webp"   "$O/design-rjc.webp"
copy "$D/HOME - GRID - DESIGN 1_2 (B2DW).webp"  "$O/design-b2dw.webp"
copy "$D/HOME - GRID - DESIGN 1_3 (DOM).webp"   "$O/design-dom.webp"
copy "$D/HOME - GRID - DESIGN 1_4 (WADE).webp"  "$O/design-wade.webp"
grid "$D/HOME - GRID - DESIGN 2_1 (DOTH).mp4"   "$O/design-doth.mp4"
copy "$D/HOME - GRID - DESIGN 2_2 (WCT).webp"   "$O/design-wct.webp"
copy "$D/HOME - GRID - DESIGN 2_3 (SC).webp"    "$O/design-sc-still.webp"
grid "$D/HOME - GRID - DESIGN 2_4 (SC).mp4"     "$O/design-sc-video.mp4"
copy "$D/HOME - GRID - DESIGN 3_1 (SO1).webp"   "$O/design-so1.webp"
copy "$D/HOME - GRID - DESIGN 3_1_2 (SO2).webp" "$O/design-so2.webp"
copy "$D/HOME - GRID - DESIGN 3_2_1 (SO3).webp" "$O/design-so3.webp"
copy "$D/HOME - GRID - DESIGN 3_2_2 (SO4).webp" "$O/design-so4.webp"
copy "$D/HOME - GRID - DESIGN 3_3_1 (SO5).webp" "$O/design-so5.webp"
copy "$D/HOME - GRID - DESIGN 3_3_2 (SO6).webp" "$O/design-so6.webp"
copy "$D/HOME - GRID - DESIGN 3_4_1 (AL1).webp" "$O/design-al1.webp"
copy "$D/HOME - GRID - DESIGN 3_4_2 (AL2).webp" "$O/design-al2.webp"

echo "==> work: social & web"
S="$W/SOCIAL AND WEB"
grid "$S/SOCIAL AND WEB - GML.mp4"                  "$O/social-gml.mp4"
grid "$S/SOCIAL AND WEB - WILD CARD TALENT.mp4"     "$O/social-wct.mp4"
grid "$S/SOCIAL AND WEB - OAKLA CANINE.mp4"         "$O/social-oakla.mp4"
grid "$S/SOCIAL AND WEB - WILCHERS LANDSCAPING.mp4" "$O/social-wilchers.mp4"

echo "==> case studies"
CS="$A/CASE STUDIES"

RB="$CS/RED BULL RACING"; O="$P/case-studies/pit-crew-chronicles"
copy "$RB/1 - TRIPTYCH (BUCKS1).webp"             "$O/triptych-bucks-1.webp"
grid "$RB/1 - TRIPTYCH (BUCKS2).mp4"              "$O/triptych-bucks-2.mp4"
copy "$RB/1 - TRIPTYCH (BUCKS3).webp"             "$O/triptych-bucks-3.webp"
copy "$RB/2 - STAT OVERLAY - FULL (DESKTOP).webp" "$O/stat-overlay-desktop.webp"
copy "$RB/2 - STAT OVERLAY - FULL (MOBILE).webp"  "$O/stat-overlay-mobile.webp"
copy "$RB/3 - TRIPTYCH (BLXST1).webp"             "$O/triptych-blxst-1.webp"
grid "$RB/3 - TRIPTYCH (BLXST2).mp4"              "$O/triptych-blxst-2.mp4"
copy "$RB/3 - TRIPTYCH (BLXST3).webp"             "$O/triptych-blxst-3.webp"
copy "$RB/4 - TRIPTYCH (SOCCER1_1).webp"          "$O/triptych-soccer-1.webp"
grid "$RB/4 - TRIPTYCH (SOCCER2).mp4"             "$O/triptych-soccer-2.mp4"
copy "$RB/4 - TRIPTYCH (SOCCER3).webp"            "$O/triptych-soccer-3.webp"
copy "$RB/5 - PAIR (1 - VENICE).webp"             "$O/pair-venice.webp"
copy "$RB/5 - PAIR (2 - GAMING).webp"             "$O/pair-gaming.webp"
copy "$RB/6 - TRIO (BTS 1 - RB).webp"             "$O/trio-1-red-bulls.webp"
copy "$RB/6 - TRIO (BTS 2 - BUCKS).webp"          "$O/trio-2-bucks.webp"
copy "$RB/6 - TRIO (BTS 3 - VENICE).webp"         "$O/trio-3-venice.webp"
copy "$RB/7 - SIMILAR WORK - BLUE MAN GROUP.webp" "$O/similar-work.webp"

BM="$CS/LAS VEGAS GRAND PRIX"; O="$P/case-studies/las-vegas-grand-prix"
copy "$BM/1 - TRIPTYCH (BMG_1).webp"                   "$O/triptych-1.webp"
grid "$BM/1 - TRIPTYCH (BMG_2).mp4"                    "$O/triptych-2.mp4"
copy "$BM/1 - TRIPTYCH (BMG_3).webp"                   "$O/triptych-3.webp"
copy "$BM/2 - HERO STAT OVERLAY - FULL (DESKTOP).webp" "$O/stat-overlay-desktop.webp"
copy "$BM/2 - HERO STAT OVERLAY - FULL (MOBILE).webp"  "$O/stat-overlay-mobile.webp"
copy "$BM/3 - STAT PAIR (BMG_1).webp"                  "$O/stat-pair-1.webp"
copy "$BM/3 - STAT PAIR (BMG_2).webp"                  "$O/stat-pair-2.webp"
copy "$BM/4 - ON SET PAIR (BMG_1).webp"                "$O/on-set-pair-1.webp"
copy "$BM/4 - ON SET PAIR (BMG_2).webp"                "$O/on-set-pair-2.webp"
copy "$BM/5 - BTS TRIO (BMG_1).webp"                   "$O/trio-1.webp"
grid "$BM/5 - BTS TRIO (BMG_2).mp4"                    "$O/trio-2.mp4"
copy "$BM/5 - BTS TRIO (BMG_3).webp"                   "$O/trio-3.webp"
copy "$BM/6 - SIMILAR WORK - RED BULL.webp"            "$O/similar-work.webp"

echo
echo "done. public/ is now $(du -sh "$P" | cut -f1)"
