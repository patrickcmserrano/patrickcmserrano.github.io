#!/usr/bin/env python3
"""
add_post.py - Helper script to add and register blog posts in patrickcmserrano.github.io

Usage:
    python3 .agents/skills/blog-post/scripts/add_post.py path/to/draft.md [options]

Options:
    --slug SLUG         Custom slug suffix (without date prefix)
    --date YYYY-MM-DD   Custom publication date (defaults to today)
    --lang LANG         Language suffix (default: pt)
    --tags TAG1,TAG2    Comma-separated tags
    --excerpt TEXT      Custom excerpt (defaults to subtitle or first paragraph)
    --read-time TIME    Custom read time (e.g. '8 min'; defaults to auto-calculated)
    --build             Run 'npm run build' after registration
    --dry-run           Preview actions without writing to disk
"""

import argparse
import datetime
import json
import math
import os
import re
import subprocess
import sys
import unicodedata
from pathlib import Path


def slugify(text: str) -> str:
    """Normalize text into a URL-friendly slug."""
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text).strip("-")
    return text


def clean_markdown_for_excerpt(text: str) -> str:
    """Strip common markdown syntax from text to produce a clean plain-text excerpt."""
    # Remove code spans, bold, italic
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"_([^_]+)_", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    return text.strip()


def calculate_read_time(content: str) -> str:
    """Estimate read time assuming ~200 words per minute."""
    # Strip fenced code blocks from word count
    clean_content = re.sub(r"```[\s\S]*?```", "", content)
    words = len(re.findall(r"\b\w+\b", clean_content))
    minutes = max(1, math.ceil(words / 200))
    return f"{minutes} min"


def parse_post(content: str):
    """Extract title, subtitle/first paragraph, and calculate metrics."""
    lines = content.splitlines()

    title = ""
    subtitle = ""
    first_para = ""

    # Find H1
    h1_index = -1
    for i, line in enumerate(lines):
        if line.strip().startswith("# "):
            title = line.strip()[2:].strip()
            h1_index = i
            break

    # Find subtitle (usually italic line right after H1) or first text paragraph
    if h1_index != -1:
        for line in lines[h1_index + 1 :]:
            stripped = line.strip()
            if not stripped or stripped.startswith("---"):
                continue
            if stripped.startswith("*") and stripped.endswith("*") and len(stripped) > 2:
                subtitle = stripped[1:-1].strip()
                break
            elif not first_para and not stripped.startswith("#"):
                first_para = stripped
                break

    excerpt = subtitle or first_para
    excerpt = clean_markdown_for_excerpt(excerpt)
    return title, excerpt


def main():
    parser = argparse.ArgumentParser(description="Add and register a post in patrickcmserrano.github.io")
    parser.add_argument("file", help="Path to markdown file")
    parser.add_argument("--slug", help="Slug name without date prefix")
    parser.add_argument("--date", help="Publication date (YYYY-MM-DD), default today")
    parser.add_argument("--lang", default="pt", help="Post language (default: pt)")
    parser.add_argument("--tags", help="Comma-separated list of tags")
    parser.add_argument("--excerpt", help="Custom excerpt")
    parser.add_argument("--read-time", help="Custom read time (e.g. '7 min')")
    parser.add_argument("--build", action="store_true", help="Run 'npm run build' after adding")
    parser.add_argument("--dry-run", action="store_true", help="Show proposed changes without writing")

    args = parser.parse_args()

    input_path = Path(args.file)
    if not input_path.exists():
        print(f"Erro: Arquivo '{input_path}' não encontrado.", file=sys.stderr)
        sys.exit(1)

    repo_root = Path.cwd()
    posts_json_path = repo_root / "static" / "posts.json"
    static_posts_dir = repo_root / "static" / "posts"

    if not posts_json_path.exists():
        print(f"Erro: '{posts_json_path}' não encontrado. Execute a partir da raiz do repositório.", file=sys.stderr)
        sys.exit(1)

    content = input_path.read_text(encoding="utf-8")
    parsed_title, parsed_excerpt = parse_post(content)

    title = parsed_title or input_path.stem.replace("-", " ").title()
    excerpt = args.excerpt or parsed_excerpt
    read_time = args.read_time or calculate_read_time(content)
    date_str = args.date or datetime.date.today().isoformat()

    # Determine slug and ID
    if args.slug:
        slug_core = slugify(args.slug)
    else:
        # If filename already has a date prefix YYYY-MM-DD-..., preserve it
        stem = input_path.stem.replace(".pt", "").replace(".en", "")
        if re.match(r"^\d{4}-\d{2}-\d{2}-", stem):
            full_slug = stem
            slug_core = stem[11:]
        else:
            slug_core = slugify(title)

    post_id = f"{date_str}-{slug_core}" if not re.match(r"^\d{4}-\d{2}-\d{2}-", slug_core) else slug_core
    target_filename = f"{post_id}.{args.lang}.md"
    target_path = static_posts_dir / target_filename

    # Tags
    if args.tags:
        tags = [t.strip() for t in args.tags.split(",") if t.strip()]
    else:
        tags = ["Engenharia de Software", "Arquitetura"]

    post_entry = {
        "id": post_id,
        "title": title,
        "excerpt": excerpt,
        "date": date_str,
        "readTime": read_time,
        "tags": tags,
    }

    print("\n==================================================")
    print("📋 Detalhes do Post")
    print("==================================================")
    print(f"ID / Slug  : {post_id}")
    print(f"Título     : {title}")
    print(f"Data       : {date_str}")
    print(f"Tempo      : {read_time}")
    print(f"Tags       : {tags}")
    print(f"Resumo     : {excerpt[:120]}..." if len(excerpt) > 120 else f"Resumo     : {excerpt}")
    print(f"Destino    : {target_path.relative_to(repo_root)}")
    print("==================================================\n")

    if args.dry_run:
        print("[DRY-RUN] Nenhuma alteração foi realizada em disco.")
        return

    # 1. Copiar/escrever arquivo markdown
    target_path.parent.mkdir(parents=True, exist_ok=True)
    target_path.write_text(content, encoding="utf-8")
    print(f"✓ Arquivo copiado/atualizado: {target_path.relative_to(repo_root)}")

    # 2. Atualizar static/posts.json
    try:
        posts_data = json.loads(posts_json_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Erro ao ler posts.json: {e}", file=sys.stderr)
        sys.exit(1)

    # Checar se já existe entrada com este ID
    existing_idx = next((i for i, p in enumerate(posts_data) if p.get("id") == post_id), None)
    if existing_idx is not None:
        posts_data[existing_idx] = post_entry
        print(f"✓ Entrada existente atualizada em static/posts.json (posição {existing_idx + 1})")
    else:
        posts_data.insert(0, post_entry)
        print("✓ Nova entrada inserida no topo de static/posts.json")

    posts_json_path.write_text(json.dumps(posts_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("✓ static/posts.json salvo com sucesso.")

    # 3. Opcional: build
    if args.build:
        print("\n🔨 Executando 'npm run build'...")
        res = subprocess.run(["npm", "run", "build"], cwd=repo_root)
        if res.returncode == 0:
            print("✓ Build concluído com sucesso!")
        else:
            print(f"⚠️ Build falhou com código {res.returncode}", file=sys.stderr)
            sys.exit(res.returncode)

    print("\n🎉 Post configurado com sucesso!")
    print("Próximos passos:")
    print("  1. git status")
    print(f"  2. git commit -m 'feat(blog): adicionar artigo sobre {slug_core}'")
    print("  3. git push origin main")


if __name__ == "__main__":
    main()
