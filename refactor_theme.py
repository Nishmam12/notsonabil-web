#!/usr/bin/env python3
"""
Script to replace hardcoded dark theme classes with semantic neutral classes
"""

import re
import sys
from pathlib import Path

# Define replacement mappings
REPLACEMENTS = [
    # Background replacements
    (r'dark:bg-\[#0f172a\]', 'dark:bg-neutral-900'),
    (r'dark:bg-\[#111827\]', 'dark:bg-neutral-800'),
    (r'dark:bg-\[#0b1220\]', 'dark:bg-neutral-950'),
    (r'dark:bg-\[rgba\(10,16,28,0\.9\)\]', 'dark:bg-neutral-950/90'),
    (r'dark:bg-\[rgba\(10,16,30,0\.65\)\]', 'dark:bg-neutral-950/65'),
    (r'dark:bg-\[rgba\(15,23,42,0\.9\)\]', 'dark:bg-neutral-900/90'),
    (r'dark:bg-\[rgba\(15,23,42,0\.7\)\]', 'dark:bg-neutral-900/70'),
    (r'dark:bg-\[rgba\(59,130,246,0\.18\)\]', 'dark:bg-blue-500/20'),
    (r'dark:bg-\[rgba\(59,130,246,0\.15\)\]', 'dark:bg-blue-500/15'),
    (r'dark:bg-\[rgba\(59,130,246,0\.1\)\]', 'dark:bg-blue-500/10'),
    (r'dark:bg-\[rgba\(148,163,184,0\.15\)\]', 'dark:bg-neutral-400/15'),
    
    # Border replacements
    (r'dark:border-slate-800/70', 'dark:border-neutral-800'),
    (r'dark:border-slate-800/60', 'dark:border-neutral-800/60'),
    (r'dark:border-slate-700/60', 'dark:border-neutral-700/60'),
    (r'dark:border-slate-700', 'dark:border-neutral-700'),
    (r'dark:border-slate-800', 'dark:border-neutral-800'),
    (r'dark:border-slate-200', 'dark:border-neutral-200'),
    
    # Text color replacements  
    (r'dark:text-slate-100', 'dark:text-neutral-100'),
    (r'dark:text-slate-200', 'dark:text-neutral-200'),
    (r'dark:text-slate-300', 'dark:text-neutral-300'),
    (r'dark:text-slate-400', 'dark:text-neutral-400'),
    (r'dark:text-slate-500', 'dark:text-neutral-500'),
    (r'dark:text-slate-600', 'dark:text-neutral-600'),
    (r'dark:text-slate-700', 'dark:text-neutral-700'),
    (r'dark:text-slate-900', 'dark:text-neutral-900'),
    
    # Hover states
    (r'dark:hover:border-slate-500', 'dark:hover:border-neutral-500'),
    (r'dark:hover:bg-\[rgba\(148,163,184,0\.08\)\]', 'dark:hover:bg-neutral-400/10'),
    (r'dark:hover:text-slate-200', 'dark:hover:text-neutral-200'),
]

def process_file(file_path):
    """Process a single file and apply all replacements"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        for pattern, replacement in REPLACEMENTS:
            content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✓ Updated: {file_path}")
            return True
        return False
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python refactor_theme.py <directory>")
        sys.exit(1)
    
    root_dir = Path(sys.argv[1])
    if not root_dir.exists():
        print(f"Error: Directory {root_dir} does not exist")
        sys.exit(1)
    
    # Find all .tsx and .ts files
    files = list(root_dir.rglob("*.tsx")) + list(root_dir.rglob("*.ts"))
    
    updated_count = 0
    for file_path in files:
        # Skip node_modules and .next
        if 'node_modules' in str(file_path) or '.next' in str(file_path):
            continue
        if process_file(file_path):
            updated_count += 1
    
    print(f"\nCompleted! Updated {updated_count} files.")

if __name__ == "__main__":
    main()
