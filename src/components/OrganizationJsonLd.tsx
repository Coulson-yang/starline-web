import { getSiteUrl, siteDescription } from "@/lib/site";

export function OrganizationJsonLd({ name }: { name: string }) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name,
    description: siteDescription,
    url: getSiteUrl(),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}
