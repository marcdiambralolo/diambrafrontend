import React, { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Analysis } from '@/lib/interfaces'; // ✅ unifie l’import (évite 2 types différents)
import { parseMarkdownContent } from './analysis-pdf.utils';

type AnalysisDocumentProps = { analyse: Analysis };

/**
 * React-PDF peut crash sur :
 * - emojis (surrogate pairs)
 * - variation selectors (ex: \uFE0F)
 * - caractères de contrôle
 * Cette sanitation “sauve” la génération.
 */
function sanitizePdfText(input: unknown): string {
  const s = String(input ?? '');

  return (
    s
      // normalise
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, '  ')
      // supprime caractères de contrôle (hors \n)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      // supprime variation selectors (emoji style)
      .replace(/\uFE0F/g, '')
      // supprime emojis (surrogate pairs)
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      // évite des séquences trop longues d’espaces
      .replace(/[ \u00A0]{3,}/g, '  ')
  );
}

function safeDateLabel(input: unknown): string {
  const raw = String(input ?? '').trim();
  if (!raw) return '';

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return ''; // ✅ évite erreurs / "Invalid Date"

  return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: '2-digit' });
}

/** split par sections markdown `##` tout en gardant une 1ère section propre */
function splitIntoSections(md: string): string[] {
  const text = md.replace(/\r\n/g, '\n').trim();
  if (!text) return [''];

  const parts = text.split(/\n##\s+/g);
  if (parts.length === 1) return [text];

  return parts.map((p, i) => (i === 0 ? p : `## ${p}`));
}

/** parse markdown safe : si le parser plante, on fallback en simple texte */
function safeParseMarkdown(section: string): Array<{ type: string; text?: string }> {
  try {
    const parsed = parseMarkdownContent(section);
    if (!Array.isArray(parsed)) return [{ type: 'text', text: section }];
    return parsed.map((x) => ({
      type: String(x?.type ?? 'text'),
      text: x?.text ? String(x.text) : '',
    }));
  } catch {
    return [{ type: 'text', text: section }];
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },

  header: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#f8fafc', // slate-50
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  title: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0f172a', // ✅ texte noir/slate-900
    marginBottom: 6,
  },

  date: {
    fontSize: 10,
    color: '#475569', // slate-600
    marginBottom: 2,
  },

  section: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  h1: {
    fontSize: 15,
    fontWeight: 900,
    marginTop: 8,
    marginBottom: 8,
    color: '#0f172a',
  },
  h2: {
    fontSize: 13,
    fontWeight: 900,
    marginBottom: 7,
    color: '#0f172a',
  },
  h3: {
    fontSize: 11,
    fontWeight: 800,
    marginTop: 7,
    marginBottom: 4,
    color: '#0f172a',
  },

  li: {
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 4,
    marginLeft: 10,
    lineHeight: 1.35,
  },

  text: {
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 1.35,
  },

  muted: {
    color: '#475569',
  },

  footer: {
    position: 'absolute',
    bottom: 18,
    left: 30,
    right: 30,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 8.5,
    color: '#64748b',
  },

  pageNumber: {
    textAlign: 'center',
    fontSize: 8.5,
    color: '#94a3b8',
    marginTop: 3,
  },
});

export const AnalysisDocument: React.FC<AnalysisDocumentProps> = ({ analyse }) => {
  // ✅ sanitize pour éviter crash du renderer
  const title = sanitizePdfText(analyse.title || analyse.prompt || 'Analyse');
  const texteRaw = sanitizePdfText(analyse.texte || analyse.text || '');
  const dateLabel = safeDateLabel(analyse.dateGeneration || analyse.createdAt);

  // ✅ sections mémorisées
  const sections = useMemo(() => splitIntoSections(texteRaw), [texteRaw]);

  return (
    <Document>
      {sections.map((section, idx) => {
        const parsed = safeParseMarkdown(section);

        return (
          <Page key={idx} size="A4" style={styles.page}>
            <View style={styles.header}>
              {/* ✅ titre affiché sur chaque page (plus pro) */}
              <Text style={styles.title}>{title}</Text>
              {!!dateLabel && <Text style={styles.date}>Généré le : {dateLabel}</Text>}
              {analyse._id ? (
                <Text style={[styles.date, styles.muted]}>
                  ID analyse : {sanitizePdfText(analyse._id)}
                </Text>
              ) : null}
            </View>

            <View style={styles.section}>
              {parsed.map((el, i) => {
                const t = sanitizePdfText(el.text ?? '');

                switch (el.type) {
                  case 'h1':
                    return (
                      <Text key={i} style={styles.h1}>
                        {t}
                      </Text>
                    );
                  case 'h2':
                    return (
                      <Text key={i} style={styles.h2}>
                        {t}
                      </Text>
                    );
                  case 'h3':
                    return (
                      <Text key={i} style={styles.h3}>
                        {t}
                      </Text>
                    );
                  case 'li':
                    return (
                      <Text key={i} style={styles.li}>
                        • {t}
                      </Text>
                    );
                  case 'bold':
                    // ⚠️ “bold” isolé sans inline nesting : on le rend comme un petit titre
                    return (
                      <Text key={i} style={styles.h3}>
                        {t}
                      </Text>
                    );
                  case 'text':
                  default:
                    return (
                      <Text key={i} style={styles.text}>
                        {t}
                      </Text>
                    );
                }
              })}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Mon Etoile — Intelligence Astrologique</Text>
              <Text style={styles.footerText}>© {new Date().getFullYear()} Mon Etoile. Tous droits réservés.</Text>
              <Text style={styles.pageNumber}>Page {idx + 1} / {sections.length}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};
