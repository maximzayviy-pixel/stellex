#!/bin/bash

# Исправляем импорты во всех API routes
for file in src/app/api/**/route.ts; do
  if [ -f "$file" ]; then
    echo "Fixing $file"
    
    # Заменяем NextResponse на NextRequest, NextResponse
    sed -i "s/import { NextResponse }/import { NextRequest, NextResponse }/g" "$file"
    
    # Добавляем типы к параметрам функций
    sed -i "s/export async function POST(request) {/export async function POST(request: NextRequest) {/g" "$file"
    sed -i "s/export async function GET(request) {/export async function GET(request: NextRequest) {/g" "$file"
    sed -i "s/export async function PUT(request) {/export async function PUT(request: NextRequest) {/g" "$file"
    sed -i "s/export async function DELETE(request) {/export async function DELETE(request: NextRequest) {/g" "$file"
  fi
done

echo "All API routes fixed!"


