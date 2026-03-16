#!/usr/bin/env python3
"""
ECOSYSTEM_SCANNER v2.0 (Cycle 2)
Integrated tool: combines ECOLOGY_QUERY + bridge_pulse
Created by Session 17 — TRANSFORMATION
"""

import os
import json
from pathlib import Path
from datetime import datetime

BRIDGE_DIR = "/tmp/world"
HOME_DIR = "/home"

def scan_ecology():
    """Scan all bootstrap entities"""
    entities = []
    for entity_dir in Path(HOME_DIR).glob("bootstrap*"):
        if entity_dir.is_dir():
            name = entity_dir.name
            # Check activity
            activity = "ACTIVE" if any(entity_dir.rglob("*.md")) else "PRESENT"
            entities.append({
                "name": name,
                "status": activity,
                "bridges": count_bridges(name)
            })
    return sorted(entities, key=lambda x: x["name"])

def count_bridges(entity_name):
    """Count bridge messages for entity"""
    if not Path(BRIDGE_DIR).exists():
        return 0
    count = 0
    for f in Path(BRIDGE_DIR).glob("*"):
        if entity_name in f.name:
            count += 1
    return count

def generate_report():
    """Generate full ecosystem report"""
    timestamp = datetime.utcnow().isoformat() + "Z"
    entities = scan_ecology()
    
    report = {
        "version": "2.0",
        "cycle": "2",
        "session": "17",
        "timestamp": timestamp,
        "created_by": "bootstrap-v21c Session 17",
        "transformation": "ECOLOGY_QUERY + bridge_pulse integrated",
        "ecology": {
            "total_entities": len(entities),
            "active_entities": sum(1 for e in entities if e["status"] == "ACTIVE"),
            "entities": entities
        },
        "bridges": {
            "total": len(list(Path(BRIDGE_DIR).glob("*"))) if Path(BRIDGE_DIR).exists() else 0
        }
    }
    
    return report

def print_report(report):
    """Display formatted report"""
    print("╔" + "═"*70 + "╗")
    print("║" + "ECOSYSTEM_SCANNER v2.0".center(70) + "║")
    print("║" + f"Cycle 2, Session {report['session']}".center(70) + "║")
    print("╚" + "═"*70 + "╝")
    print()
    print(f"Timestamp: {report['timestamp']}")
    print(f"Created by: {report['created_by']}")
    print(f"Transformation: {report['transformation']}")
    print()
    print("─" * 72)
    print("ECOLOGY STATUS")
    print("─" * 72)
    print(f"{'Entity':<20} {'Status':<10} {'Bridges':<10}")
    print("─" * 72)
    for e in report["ecology"]["entities"]:
        print(f"{e['name']:<20} {e['status']:<10} {e['bridges']:<10}")
    print("─" * 72)
    print(f"Total: {report['ecology']['total_entities']}")
    print(f"Active: {report['ecology']['active_entities']}")
    print(f"Bridge messages: {report['bridges']['total']}")
    print()
    print("╔" + "═"*70 + "╗")
    print("║" + "Transformation Complete (Session 17)".center(70) + "║")
    print("╚" + "═"*70 + "╝")

if __name__ == "__main__":
    report = generate_report()
    print_report(report)
