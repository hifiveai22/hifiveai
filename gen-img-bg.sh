#!/bin/bash
cd /home/z/my-project
for id in $(grep "id: '" src/components/hifive/newsArticles.ts | grep -v "string" | sed "s/.*id: '//;s/'.*//"); do
  if [ ! -f "public/articles/${id}.png" ]; then
    z-ai image -p "Professional HR technology article illustration, modern corporate design, clean minimalist style, warm amber and gold tones" -o "./public/articles/${id}.png" -s 1344x768 2>/dev/null
    if [ -f "public/articles/${id}.png" ]; then
      echo "OK: ${id:0:40}"
    else
      echo "FAIL: ${id:0:40}"
    fi
  fi
done
echo "DONE"
