const fs = require('fs');

function generatePublicMenuHtml() {
  try {
    const menuData = JSON.parse(fs.readFileSync('./data/menu.json', 'utf8'));
    
    // Get unique categories maintaining order from the data
    const categories = [];
    const seenCategories = new Set();
    
    menuData.forEach(item => {
      if (!seenCategories.has(item.category)) {
        categories.push(item.category);
        seenCategories.add(item.category);
      }
    });

    // Generate navigation for categories
    const navHtml = categories.map(category => {
      const anchorId = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return `<a href="#${anchorId}" class="nav-link">${category}</a>`;
    }).join('');

    // Generate menu sections and split into two columns
    const midpoint = Math.ceil(categories.length / 2);
    const leftCategories = categories.slice(0, midpoint);
    const rightCategories = categories.slice(midpoint);
    
    const generateCategorySection = (category) => {
      const anchorId = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const items = menuData.filter(item => item.category === category);
      
      const itemsHtml = items.map(item => {
        const vegIcon = item.veg ? 
          '<span class="veg-indicator"></span>' : 
          '<span class="non-veg-indicator"></span>';
        
        let priceDisplay;
        if (item.variants && item.variants.length > 0) {
          const prices = item.variants.map(v => `₹${v.price}`).join(' / ');
          priceDisplay = prices;
        } else {
          priceDisplay = `₹${item.price}`;
        }
        
        return `
          <div class="menu-item">
            <div class="item-header">
              ${vegIcon}
              <span class="item-name">${item.name}</span>
            </div>
            <div class="item-price">${priceDisplay}</div>
          </div>
        `;
      }).join('');
      
      return `
        <section id="${anchorId}" class="menu-section">
          <h2 class="category-title">${category}</h2>
          <div class="items-grid">
            ${itemsHtml}
          </div>
        </section>
      `;
    };
    
    const leftColumnHtml = leftCategories.map(generateCategorySection).join('');
    const rightColumnHtml = rightCategories.map(generateCategorySection).join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu - Bong Flavours</title>
    <link href="https://fonts.googleapis.com/css2?family=Gupter:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --brand-maroon: #6F1D1B;
            --brand-tan: #BB9457;
            --brand-dark: #432818;
            --brand-brown: #99582A;
            --brand-cream: #FFE6A7;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Gupter', serif;
            background: var(--brand-dark);
            color: var(--brand-cream);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* 2-Column Book Layout */
        .menu-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
        }
        
        .menu-column {
            background: var(--brand-cream);
            color: var(--brand-dark);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            min-height: calc(100vh - 200px);
        }
        
        @media (max-width: 768px) {
            .menu-content {
                grid-template-columns: 1fr;
                gap: 20px;
            }
        }
        
        .header {
            text-align: center;
            padding: 40px 0;
            border-bottom: 3px solid var(--brand-tan);
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 3rem;
            color: var(--brand-cream);
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2rem;
            color: var(--brand-tan);
        }
        
        .menu-nav {
            position: sticky;
            top: 0;
            background: var(--brand-dark);
            border-bottom: 2px solid var(--brand-tan);
            padding: 20px 0;
            margin-bottom: 40px;
            z-index: 100;
        }
        
        .nav-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
        }
        
        .nav-link {
            color: var(--brand-cream);
            text-decoration: none;
            padding: 10px 20px;
            border: 2px solid var(--brand-tan);
            border-radius: 25px;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .nav-link:hover {
            background: var(--brand-tan);
            color: var(--brand-dark);
        }
        
        .filter-controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .filter-btn {
            padding: 8px 16px;
            border: 1px solid var(--brand-tan);
            background: transparent;
            color: var(--brand-cream);
            border-radius: 20px;
            cursor: pointer;
            font-family: 'Gupter', serif;
            transition: all 0.3s ease;
        }
        
        .filter-btn.active,
        .filter-btn:hover {
            background: var(--brand-tan);
            color: var(--brand-dark);
        }
        
        .menu-section {
            margin-bottom: 60px;
        }
        
        .category-title {
            font-size: 2.5rem;
            color: var(--brand-maroon);
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--brand-tan);
        }
        
        .items-grid {
            display: grid;
            gap: 20px;
        }
        
        .menu-item {
            background: var(--brand-cream);
            color: var(--brand-dark);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid var(--brand-tan);
            transition: all 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .menu-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(111, 29, 27, 0.3);
        }
        
        .item-header {
            display: flex;
            align-items: center;
            flex: 1;
        }
        
        .item-name {
            font-size: 1.1rem;
            font-weight: 500;
        }
        
        .item-price {
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--brand-maroon);
        }
        
        .veg-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid #28a745;
            background: #28a745;
            border-radius: 2px;
            margin-right: 10px;
        }
        
        .non-veg-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid #dc3545;
            background: #dc3545;
            border-radius: 2px;
            margin-right: 10px;
        }
        
        .footer {
            text-align: center;
            padding: 40px 0;
            border-top: 2px solid var(--brand-tan);
            margin-top: 60px;
        }
        
        .footer p {
            color: var(--brand-tan);
            margin-bottom: 10px;
        }
        
        .footer a {
            color: var(--brand-cream);
            text-decoration: none;
            font-weight: bold;
        }
        
        .footer a:hover {
            color: var(--brand-tan);
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .nav-links {
                gap: 10px;
            }
            
            .nav-link {
                padding: 8px 15px;
                font-size: 0.9rem;
            }
            
            .category-title {
                font-size: 2rem;
            }
            
            .menu-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .item-price {
                align-self: flex-end;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Bong Flavours Menu</h1>
            <p>Authentic Bengali Cuisine</p>
        </header>
        
        <nav class="menu-nav">
            <div class="nav-links">
                ${navHtml}
            </div>
        </nav>
        
        <div class="filter-controls">
            <button class="filter-btn active" onclick="filterItems('all')">All Items</button>
            <button class="filter-btn" onclick="filterItems('veg')">🌱 Vegetarian</button>
            <button class="filter-btn" onclick="filterItems('non-veg')">🍖 Non-Vegetarian</button>
        </div>
        
        <main class="menu-content">
            <div class="menu-column">
                ${leftColumnHtml}
            </div>
            <div class="menu-column">
                ${rightColumnHtml}
            </div>
        </main>
        
        <footer class="footer">
            <p>For orders and reservations, call us at <strong>8238018577</strong></p>
            <p>Or visit our <a href="/app/menu">online ordering system</a></p>
            <p>Lunch: 11am - 3pm | Dinner: 6pm - 11pm</p>
        </footer>
    </div>
    
    <script>
        function filterItems(type) {
            const menuItems = document.querySelectorAll('.menu-item');
            const filterBtns = document.querySelectorAll('.filter-btn');
            
            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            menuItems.forEach(item => {
                const hasVegIndicator = item.querySelector('.veg-indicator');
                const hasNonVegIndicator = item.querySelector('.non-veg-indicator');
                
                let show = false;
                
                if (type === 'all') {
                    show = true;
                } else if (type === 'veg' && hasVegIndicator) {
                    show = true;
                } else if (type === 'non-veg' && hasNonVegIndicator) {
                    show = true;
                }
                
                item.style.display = show ? 'flex' : 'none';
            });
            
            // Hide empty sections
            const sections = document.querySelectorAll('.menu-section');
            sections.forEach(section => {
                const visibleItems = section.querySelectorAll('.menu-item[style*="flex"], .menu-item:not([style*="none"])');
                section.style.display = visibleItems.length > 0 ? 'block' : 'none';
            });
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>`;

    // Ensure public directory exists
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public');
    }

    fs.writeFileSync('./public/menu.html', html);
    console.log('✅ Static menu HTML generated successfully at public/menu.html');
    
    // Also log some stats
    const totalItems = menuData.length;
    const vegItems = menuData.filter(item => item.veg).length;
    const nonVegItems = totalItems - vegItems;
    
    console.log(`📊 Menu Statistics:`);
    console.log(`   Total items: ${totalItems}`);
    console.log(`   Vegetarian: ${vegItems}`);
    console.log(`   Non-vegetarian: ${nonVegItems}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Categories: ${categories.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error generating menu HTML:', error);
    process.exit(1);
  }
}

generatePublicMenuHtml();
