// Structured Data (JSON-LD) Components for Schema.org Verification
// Adheres strictly to: ZERO fake reviews, ZERO fake aggregate ratings,
// ZERO fabricated testimonials, and accurate representation of visible page content.

import React from "react";

interface OrganizationJsonLdProps {
  url?: string;
  name?: string;
}

export function OrganizationJsonLd({
  url = "https://www.indusnet-ai.com",
  name = "Indusnet AI"
}: OrganizationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "legalName": "Indusnet Technologies Ltd.",
    "url": url,
    "logo": `${url}/logo.png`,
    "description": "AI-First enterprise application development and systems engineering. Designing, building, and deploying production AI applications, autonomous agents, and private RAG systems.",
    "foundingDate": "2023",
    "parentOrganization": {
      "@type": "Organization",
      "name": "Indusnet Technologies"
    },
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Number 46 First Floor, Tansi Nagar, Velachery",
        "addressLocality": "Chennai",
        "postalCode": "600042",
        "addressCountry": "IN"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park",
        "postalCode": "408933",
        "addressCountry": "SG"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-988-491-5977",
        "contactType": "technical support",
        "areaServed": "IN"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+65-9448-3805",
        "contactType": "sales",
        "areaServed": "SG"
      },
      {
        "@type": "ContactPoint",
        "email": "info@indusnet-ai.com",
        "contactType": "customer service"
      }
    ],
    "sameAs": [
      "https://linkedin.com/company/indusnet-ai",
      "https://twitter.com/indusnet_ai",
      "https://github.com/indusnet-ai"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Indusnet AI",
    "url": "https://www.indusnet-ai.com",
    "description": "Enterprise AI application development and delivery company. AI-First. From Strategy to Software.",
    "publisher": {
      "@type": "Organization",
      "name": "Indusnet AI"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `https://www.indusnet-ai.com${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceJsonLdProps {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}

export function ServiceJsonLd({ name, description, url, serviceType }: ServiceJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": url.startsWith("http") ? url : `https://www.indusnet-ai.com${url}`,
    "serviceType": serviceType,
    "provider": {
      "@type": "Organization",
      "name": "Indusnet AI",
      "url": "https://www.indusnet-ai.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  authorName: string;
  imageUrl?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  authorName,
  imageUrl = "https://www.indusnet-ai.com/og-image.png"
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": url.startsWith("http") ? url : `https://www.indusnet-ai.com${url}`,
    "datePublished": datePublished,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Indusnet AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.indusnet-ai.com/logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
