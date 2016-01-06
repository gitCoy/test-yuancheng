node r.js -o build.js
echo "--------------------   gzip  －－－－－－－－－－－－"
gzip -k dist/*
gzip -k dist/*/*
gzip -k dist/*/*/*
gzip -k dist/*/*/*/*
gzip -k dist/*/*/*/*/*
gzip -k dist/*/*/*/*/*/*
