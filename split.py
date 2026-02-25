import os

html_file = 'neural_blog.html'
with open(html_file, 'r') as f:
    lines = f.readlines()

# Extract styles.css (lines 16 to 275, 0-indexed: 15 to 275)
css_lines = lines[15:275]
with open('styles.css', 'w') as f:
    f.writelines(css_lines)

# Extract visualizations.js (lines 652 to 1371, 0-indexed: 651 to 1371)
vis_js_lines = lines[651:1371]
with open('visualizations.js', 'w') as f:
    f.writelines(vis_js_lines)

# Extract quiz.js (lines 1372 to 1420, 0-indexed: 1371 to 1420)
quiz_js_lines = lines[1371:1420]
with open('quiz.js', 'w') as f:
    f.writelines(quiz_js_lines)

# Create new HTML
new_html_lines = lines[:14] # Up to before <style>
new_html_lines.append('    <link rel="stylesheet" href="styles.css">\n')
new_html_lines.extend(lines[276:650]) # Between </style> and <script>
new_html_lines.append('    <script src="visualizations.js"></script>\n')
new_html_lines.append('    <script src="quiz.js"></script>\n')
new_html_lines.extend(lines[1421:]) # After </script>

with open(html_file, 'w') as f:
    f.writelines(new_html_lines)

print("Split completed.")
