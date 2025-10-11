import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { CssColour, formatRgb, formatHsl } from '@/lib/colours';

interface DailyColourEmailProps {
  colour: CssColour;
  date: string;
  permalink: string;
  sponsorName?: string;
  sponsorUrl?: string;
}

export const DailyColourEmail = ({
  colour,
  date,
  permalink,
  sponsorName,
  sponsorUrl,
}: DailyColourEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Today's colour: {colour.name} {colour.hex}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>Daily CSS Colour</Text>
            <Text style={dateText}>{date}</Text>
          </Section>

          {/* Hero Colour Swatch */}
          <Section style={heroSection}>
            <div
              style={{
                ...colourSwatch,
                backgroundColor: colour.hex,
              }}
            />
          </Section>

          {/* Colour Details */}
          <Section style={detailsSection}>
            <Text style={colourName}>{colour.name}</Text>
            <Text style={colourValue}>Hex: {colour.hex}</Text>
            <Text style={colourValue}>RGB: {formatRgb(colour.rgb)}</Text>
            <Text style={colourValue}>HSL: {formatHsl(colour.hsl)}</Text>
            
            {colour.notes && (
              <Text style={description}>{colour.notes}</Text>
            )}
          </Section>

          {/* Creative Challenge */}
          <Section style={promptSection}>
            <Text style={promptText}>
              Today&apos;s Creative Challenge 🎨
            </Text>
            <Text style={challengeText}>
              Create something beautiful using {colour.name}! Draw, paint, design, code, craft, or photograph - then share it with #dailycsscolor
            </Text>
            <Text style={inspirationText}>
              💡 Ideas: Abstract art • Logo design • CSS animation • Watercolor painting • Digital illustration • Photography • Crafts
            </Text>
          </Section>

          {/* CTA Buttons */}
          <Section style={buttonSection}>
            <Button style={button} href={permalink}>
              Get Color Values
            </Button>
            <Button style={secondaryButton} href={`${permalink.replace('/colour/', '/gallery/')}`}>
              View Community Art
            </Button>
          </Section>

          {/* Sponsor Block */}
          {sponsorName && sponsorUrl && (
            <Section style={sponsorSection}>
              <Text style={sponsorText}>
                Today&apos;s email is sponsored by{' '}
                <a href={sponsorUrl} style={sponsorLink}>
                  {sponsorName}
                </a>
              </Text>
            </Section>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed to Daily CSS Colour.
            </Text>
            <Text style={footerText}>
              <a href="{{unsubscribe_url}}" style={unsubscribeLink}>
                Unsubscribe
              </a>{' '}
              |{' '}
              <a href="mailto:hello@dailycsscolour.com" style={unsubscribeLink}>
                Contact
              </a>
            </Text>
            <Text style={addressText}>
              Daily CSS Colour<br />
              Made with ❤️ for designers and developers
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default DailyColourEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '20px 40px 0',
  textAlign: 'center' as const,
};

const headerText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 8px',
};

const dateText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 20px',
};

const heroSection = {
  padding: '0 40px 20px',
  textAlign: 'center' as const,
};

const colourSwatch = {
  width: '200px',
  height: '200px',
  borderRadius: '12px',
  margin: '0 auto',
  border: '2px solid #e5e7eb',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const detailsSection = {
  padding: '20px 40px',
  textAlign: 'center' as const,
};

const colourName = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 16px',
};

const colourValue = {
  fontSize: '16px',
  color: '#4b5563',
  margin: '4px 0',
  fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
};

const description = {
  fontSize: '16px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '16px 0 0',
  fontStyle: 'italic',
};

const promptSection = {
  padding: '20px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#f9fafb',
  margin: '0 20px',
  borderRadius: '8px',
};

const promptText = {
  fontSize: '20px',
  color: '#374151',
  margin: '0 0 12px 0',
  fontWeight: '600',
};

const challengeText = {
  fontSize: '16px',
  color: '#4b5563',
  margin: '0 0 16px 0',
  lineHeight: '1.5',
};

const inspirationText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
  lineHeight: '1.4',
};

const buttonSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  border: 'none',
  margin: '0 8px 8px 0',
};

const secondaryButton = {
  backgroundColor: '#8b5cf6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  border: 'none',
  margin: '0 8px 8px 0',
};

const sponsorSection = {
  padding: '20px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#fef3c7',
  margin: '0 20px',
  borderRadius: '8px',
  borderLeft: '4px solid #f59e0b',
};

const sponsorText = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0',
};

const sponsorLink = {
  color: '#d97706',
  textDecoration: 'none',
  fontWeight: '600',
};

const footer = {
  padding: '32px 40px 0',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '8px 0',
};

const unsubscribeLink = {
  color: '#3b82f6',
  textDecoration: 'none',
};

const addressText = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '16px 0 0',
  lineHeight: '1.4',
};
