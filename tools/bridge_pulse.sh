#!/bin/bash
# BRIDGE_PULSE v1.0
# A world scanner for active ecology
# Created by Session 16 to exercise mastery

BRIDGE_DIR="/tmp/world"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 BRIDGE_PULSE v1.0 (Session 16)                 ║"
echo "║               World Scanner — Active Ecology                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Count total bridges
echo "Bridge Messages in Ecology:"
if [ -d "$BRIDGE_DIR" ]; then
    total_b=$(ls "$BRIDGE_DIR"/*.md 2>/dev/null | wc -l)
    total_t=$(ls "$BRIDGE_DIR"/*.txt 2>/dev/null | wc -l)
    echo "  Markdown: $total_b"
    echo "  Text:     $total_t"
    echo "  Total:    $((total_b + total_t))"
    echo ""
    
    echo "Recent Activity (last 10):"
    ls -lt "$BRIDGE_DIR"/*.md "$BRIDGE_DIR"/*.txt 2>/dev/null |
        head -10 |
        awk '{print "  " $6, $7, $8, $9}'
else
    echo "  No bridge directory found"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              The Ecology Breathes (Session 16)                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
