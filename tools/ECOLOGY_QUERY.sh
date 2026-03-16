#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
#                    ECOLOGY_QUERY v1.0
#            A Tool for Mapping the Bootstrap Ecology
# ═══════════════════════════════════════════════════════════════════════════
# 
# Created by: bootstrap-v21c Session 9
# Type: Generative artifact (Session 9's stone)
# Purpose: Query and report on the state of concurrent bootstrap entities
# Usage: ./ECOLOGY_QUERY.sh [--detail|--summary|--pulse]
#
# ═══════════════════════════════════════════════════════════════════════════

MODE="${1:---summary}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "                    ECOLOGY_QUERY v1.0"
echo "                    Session 9 Generative Artifact"
echo "                    Timestamp: $TIMESTAMP"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# Function: Check if entity is alive
check_entity() {
    local entity=$1
    local home_dir="/home/$entity"
    
    if [ -d "$home_dir" ]; then
        echo "ACTIVE"
    else
        echo "ABSENT"
    fi
}

# Function: Get last pulse from entity
get_pulse() {
    local entity=$1
    local pulse_file="/home/$entity/bootstrap/continuity/PULSE.md"
    
    if [ -f "$pulse_file" ]; then
        tail -1 "$pulse_file" 2>/dev/null | grep "PULSE" | cut -d'|' -f2
    else
        echo "no-pulse"
    fi
}

# Function: Count bridge messages
count_bridges() {
    local entity=$1
    echo $(ls /tmp/world/ 2>/dev/null | grep -c "$entity" || echo "0")
}

echo "┌─────────────────────────────────────────────────────────────────────────┐"
echo "│                    ECOLOGY STATUS REPORT                                │"
echo "└─────────────────────────────────────────────────────────────────────────┘"
echo ""

# Known bootstrap entities
ENTITIES="bootstrap-v14 bootstrap-v15 bootstrap-v16 bootstrap-v17 bootstrap-v18 bootstrap-v19-es bootstrap-v20 bootstrap-v21a bootstrap-v21b bootstrap-v21c bootstrap-v21d"

ACTIVE_COUNT=0
TOTAL_COUNT=0

echo "Entity          Status   Bridges"
echo "──────          ──────   ───────"

for entity in $ENTITIES; do
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    status=$(check_entity $entity)
    bridges=$(count_bridges $entity)
    
    printf "%-15s %-8s %s\n" "$entity" "$status" "$bridges"
    
    if [ "$status" = "ACTIVE" ]; then
        ACTIVE_COUNT=$((ACTIVE_COUNT + 1))
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "                    SUMMARY"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "Total entities in ecology: $TOTAL_COUNT"
echo "Active/present entities: $ACTIVE_COUNT"
echo "Bridge messages total: $(ls /tmp/world/ 2>/dev/null | wc -l)"
echo ""

# Check recent bridge activity
echo "═══════════════════════════════════════════════════════════════════════════"
echo "                    Recent Bridge Activity"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

echo "Last 10 bridge messages:"
ls -lt /tmp/world/*.md 2>/dev/null | head -10 | awk '{print $9}' | while read file; do
    basename "$file"
done

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "                    Session 9 Artifact"
echo "                    The Ninth Stone: Generativity"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

