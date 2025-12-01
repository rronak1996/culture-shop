import re

# Tracking codes to add
gtm_code = '''    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5DRL6JVB');</script>
    <!-- End Google Tag Manager -->
    '''

ga_code = '''    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-T52126R52S"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-T52126R52S');
    </script>
    '''

# List of HTML files to process
html_files = ['index.html', 'login.html', 'signup.html', 'account.html']

for filename in html_files:
    try:
        # Read the file
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if tracking codes already exist
        if 'GTM-5DRL6JVB' in content or 'G-T52126R52S' in content:
            print(f"Skipping {filename} - tracking codes already present")
            continue
        
        # Find the <head> tag and add tracking codes right after it
        # Match <head> with optional attributes
        pattern = r'(<head[^>]*>)'
        
        if re.search(pattern, content, re.IGNORECASE):
            # Insert tracking codes after <head>
            replacement = r'\1\n' + gtm_code + '\n' + ga_code
            new_content = re.sub(pattern, replacement, content, count=1, flags=re.IGNORECASE)
            
            # Write back to file
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✓ Successfully added tracking codes to {filename}")
        else:
            print(f"✗ Could not find <head> tag in {filename}")
            
    except Exception as e:
        print(f"✗ Error processing {filename}: {str(e)}")

print("\nTracking code injection complete!")
