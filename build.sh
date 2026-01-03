#!/bin/bash

# Simple script to manually render the home page with posts
cat > /tmp/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dan Lages</title>
  <link rel="stylesheet" href="/assets/main.css">
</head>
<body>
  <div class="hero-header" id="heroHeader">
    <div class="hero-overlay">
      <h1 class="hero-title">Dan Lages</h1>
      <p class="hero-description">The blog of an iOS Engineer</p>
    </div>
  </div>

  <nav class="sticky-nav" id="stickyNav">
    <header class="site-header">
      <div class="wrapper">
        <a class="site-title" href="/">Dan Lages</a>
        <nav class="site-nav">
          <a class="page-link" href="/posts/">Posts</a>
          <a class="page-link" href="/about/">About</a>
        </nav>
      </div>
    </header>
  </nav>

  <main class="page-content" aria-label="Content">
    <div class="wrapper">
      <div class="home">
        <ul class="post-list">
EOF

# Add posts (newest first)
for post in _posts/*.markdown; do
  if [ -f "$post" ]; then
    title=$(grep "^title:" "$post" | sed 's/title: *"\(.*\)"/\1/')
    date=$(grep "^date:" "$post" | sed 's/date: *\([^ ]*\).*/\1/')
    content=$(sed -n '/^---$/,/^---$/!p' "$post" | tail -n +2)
    
    cat >> /tmp/index.html << ENDPOST
          <li>
            <span class="post-meta">$date</span>
            <h3>
              <a class="post-link" href="#">$title</a>
            </h3>
            <div class="post-content">
              $content
            </div>
          </li>
ENDPOST
  fi
done

cat >> /tmp/index.html << 'EOF'
        </ul>
      </div>
    </div>
  </main>

  <script src="/assets/js/scroll-animation.js"></script>
</body>
</html>
EOF

cp /tmp/index.html index.html
echo "Generated index.html with all posts"
