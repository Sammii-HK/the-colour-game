export default function StructuredData() {
  // Use static data for build time - no need for dynamic color in SEO markup
  const today = new Date().toISOString().split('T')[0];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://thecolorgame.uk/#website",
        "url": "https://thecolorgame.uk/",
        "name": "Daily CSS Colour",
        "description": "Free color palette generator with daily CSS colors delivered via email",
        "publisher": {
          "@id": "https://thecolorgame.uk/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://thecolorgame.uk/colour/{search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://thecolorgame.uk/#organization",
        "name": "The Colour Game",
        "url": "https://thecolorgame.uk/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://thecolorgame.uk/icon-512.png",
          "width": 512,
          "height": 512
        },
        "sameAs": [
          "https://twitter.com/thecolorgame"
        ]
      },
      {
        "@type": "WebApplication",
        "name": "Daily CSS Colour",
        "url": "https://thecolorgame.uk/",
        "description": "Free color palette generator and daily CSS color inspiration tool",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Daily CSS color delivery via email",
          "Color palette generator", 
          "Hex, RGB, HSL color values",
          "Interactive color game",
          "Color inspiration and design ideas"
        ]
      },
      {
        "@type": "Article", 
        "@id": `https://thecolorgame.uk/colour/${today}/#article`,
        "headline": "Daily CSS Color - Design Inspiration and Color Values",
        "description": "Discover beautiful CSS colors with hex codes, RGB and HSL values for web design inspiration.",
        "image": `https://thecolorgame.uk/api/og?date=${today}`,
        "datePublished": `${today}T07:30:00Z`,
        "dateModified": `${today}T07:30:00Z`,
        "author": {
          "@type": "Organization",
          "@id": "https://thecolorgame.uk/#organization"
        },
        "publisher": {
          "@type": "Organization", 
          "@id": "https://thecolorgame.uk/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://thecolorgame.uk/colour/${today}/`
        }
      },
      {
        "@type": "EmailMessage",
        "about": "Daily CSS color newsletter",
        "description": "Daily email newsletter featuring CSS colors, hex codes, and design inspiration",
        "sender": {
          "@type": "Organization",
          "@id": "https://thecolorgame.uk/#organization"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
