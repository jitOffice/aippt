#!/bin/bash

# Agent Architecture Cleanup & Verification Script
# Purpose: Verify the layered architecture is working correctly

echo "🔍 Agent Architecture Verification"
echo "=================================="
echo ""

# Check directory structure
echo "📁 1. Checking directory structure..."
AGENTS_DIR="/Users/apple/Desktop/github/px-doc/apps/editor/src/views/slide-page/agents"

if [ -d "$AGENTS_DIR/core" ] && [ -d "$AGENTS_DIR/memory" ] && [ -d "$AGENTS_DIR/skills" ]; then
    echo "   ✅ Layered directories exist: core/, memory/, skills/"
else
    echo "   ❌ Missing required directories"
    exit 1
fi

# Check legacy code is removed
if [ -d "$AGENTS_DIR/capabilities" ]; then
    echo "   ❌ Legacy capabilities/ folder still exists"
    exit 1
else
    echo "   ✅ Legacy capabilities/ folder removed"
fi

if [ -f "$AGENTS_DIR/AgentCapabilities.ts" ]; then
    echo "   ❌ Legacy AgentCapabilities.ts still exists"
    exit 1
else
    echo "   ✅ Legacy AgentCapabilities.ts removed"
fi

echo ""

# Check public API exports
echo "📦 2. Checking public API (index.ts)..."
if grep -q "export.*agentOrchestrator.*from.*core" "$AGENTS_DIR/index.ts" && \
   grep -q "export.*contextManager.*from.*memory" "$AGENTS_DIR/index.ts" && \
   grep -q "export.*skillRegistry.*from.*skills" "$AGENTS_DIR/index.ts"; then
    echo "   ✅ All exports correctly routed through index.ts"
else
    echo "   ❌ Missing exports in index.ts"
    exit 1
fi

echo ""

# Check for direct imports (anti-pattern)
echo "🔗 3. Checking import patterns..."
DIRECT_IMPORTS=$(grep -r "from.*agents/\(core\|memory\|skills\)/" \
    /Users/apple/Desktop/github/px-doc/apps/editor/src/views/slide-page/components/ \
    2>/dev/null | grep -v "node_modules" | wc -l)

if [ "$DIRECT_IMPORTS" -eq 0 ]; then
    echo "   ✅ No direct imports found in components (using public API)"
else
    echo "   ⚠️  Found $DIRECT_IMPORTS direct imports (should use public API)"
    grep -r "from.*agents/\(core\|memory\|skills\)/" \
        /Users/apple/Desktop/github/px-doc/apps/editor/src/views/slide-page/components/ \
        2>/dev/null | grep -v "node_modules"
fi

echo ""

# Check file locations
echo "📄 4. Checking file locations..."
FILES_CORRECT=true

if [ ! -f "$AGENTS_DIR/core/AgentOrchestrator.ts" ]; then
    echo "   ❌ AgentOrchestrator.ts not in core/"
    FILES_CORRECT=false
fi

if [ ! -f "$AGENTS_DIR/memory/ContextManager.ts" ]; then
    echo "   ❌ ContextManager.ts not in memory/"
    FILES_CORRECT=false
fi

if [ ! -f "$AGENTS_DIR/skills/SkillRegistry.ts" ]; then
    echo "   ❌ SkillRegistry.ts not in skills/"
    FILES_CORRECT=false
fi

if [ ! -f "$AGENTS_DIR/skills/implementations/TextOptimizationSkill.ts" ]; then
    echo "   ❌ Skills not in skills/implementations/"
    FILES_CORRECT=false
fi

if [ "$FILES_CORRECT" = true ]; then
    echo "   ✅ All files in correct locations"
fi

echo ""

# Count skills
echo "🎯 5. Counting registered skills..."
SKILL_COUNT=$(ls -1 "$AGENTS_DIR/skills/implementations/"*.ts 2>/dev/null | wc -l)
echo "   ℹ️  Found $SKILL_COUNT skill implementations"

echo ""

# Summary
echo "=================================="
echo "✅ Architecture verification complete!"
echo ""
echo "📊 Summary:"
echo "   - Core files: $(ls -1 $AGENTS_DIR/core/*.ts 2>/dev/null | wc -l)"
echo "   - Memory files: $(ls -1 $AGENTS_DIR/memory/*.ts 2>/dev/null | wc -l)"
echo "   - Skill files: $SKILL_COUNT"
echo "   - Legacy code: Removed ✓"
echo ""
echo "🚀 Architecture is ready for development!"
