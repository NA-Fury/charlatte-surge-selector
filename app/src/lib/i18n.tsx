import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // type-only (fix TS1484)

type Language = 'en' | 'fr';

const translations = {
  en: {
    app: {
      subtitle: 'Surge Vessel Selector',
      version: 'Professional Edition'
    },
    navigation: {
      next: 'Next',
      back: 'Back',
      submit: 'Submit',
      cancel: 'Cancel'
    },
    steps: {
      application: 'Application',
      configuration: 'Configuration',
      sizing: 'Sizing',
      summary: 'Summary',
      contact: 'Contact'
    },
    application: {
      title: 'Media / Application',
      subtitle: 'What application or media will you be using this product for?',
      media: {
        CleanWater: 'Clean Water',
        Potable: 'Potable Water',
        TSE: 'Treated Sewage Effluent',
        NoSolids: 'Media Without Solids',
        Sewage: 'Sewage',
        WasteWater: 'Waste Water',
        Solids: 'Media with Solids'
      },
      descriptions: {
        CleanWater: 'For municipal and industrial clean water systems',
        Potable: 'Drinking water compliant systems',
        TSE: 'Recycled water applications',
        NoSolids: 'Clear fluids without particulates',
        Sewage: 'Raw sewage and wastewater',
        WasteWater: 'Industrial and municipal wastewater',
        Solids: 'Fluids containing suspended solids'
      }
    },
    configuration: {
      title: 'Configuration',
      subtitle: 'Select the technology and orientation for your application',
      technology: 'Technology',
      orientation: 'Orientation',
      specialRequirements: 'Special Requirements',
      araaQuestion: 'Minimum 1-2 pump start/stops per day with relatively flat pipeline?',
      araaNote: '(No power/electricity implied)',
      araaSelected: 'ARAA Technology Selected - Vertical configuration only',
      products: {
        Hydrochoc: {
          name: 'HYDROCHOC',
          tagline: 'Bladder tank line for drinking water applications',
          features: [
            'Surge protection',
            'Water in bladder design',
            'Horizontal up to 120,000 liters',
            'Vertical up to 60,000 liters'
          ]
        },
        Hydrofort: {
          name: 'HYDROFORT',
          tagline: 'Bladder tank for drinking or plant water',
          features: [
            'Pump cycle control/water storage',
            'Water in bladder design',
            'Horizontal up to 120,000 liters',
            'Vertical up to 60,000 liters'
          ]
        },
        EUV: {
          name: 'EUV',
          tagline: 'Bladder tank for wastewater and raw water',
          features: [
            'For surge protection',
            'Heavy sedimentation applications',
            'Air in bladder design',
            'Vertical only, up to 60,000 liters'
          ]
        },
        ARAA: {
          name: 'ARAA',
          tagline: 'Dipping tube style tank',
          features: [
            'For surge protection',
            'Design with no bladder',
            'Low pressure with zero static head',
            'Vertical only, up to 80,000 liters'
          ]
        },
        Compressor: {
          name: 'COMPRESSOR',
          tagline: 'Complete surge protection package',
          features: [
            'Surge protection & pump cycle control',
            'Complete package with control panel',
            'Vertical or horizontal configuration',
            'All water applications'
          ]
        }
      }
    },
    sizing: {
      title: 'Vessel Sizing',
      subtitle: 'Configure the dimensions or capacity of your surge vessel',
      dimensionsKnown: 'Dimensions Known',
      capacityKnown: 'Capacity Known',
      diameter: 'Diameter',
      length: 'Overall Length',
      capacity: 'Capacity',
      volumeLitres: 'Volume (Litres)',
      volumeGallons: 'Volume (US Gallons)',
      configuration: 'Configuration',
      autoCalculate: 'Dimensions will be automatically calculated based on technology and orientation',
      show3D: 'Show 3D Visualization',
      surgeAnalysisTitle: 'Professional Surge Analysis Required',
      surgeAnalysisDesc: 'For accurate sizing and final quotation, a complete surge analysis is required.',
      downloadForm: 'Download AQ120 Form'
    },
    summary: {
      title: 'Professional Summary',
      subtitle: 'Review your surge vessel configuration',
      configuration: 'Configuration',
      dimensions: 'Dimensions',
      media: 'Media',
      technology: 'Technology',
      orientation: 'Orientation',
      capacity: 'Capacity',
      diameter: 'Diameter',
      length: 'Length',
      quoteRequirements: 'Final Quote Requirements',
      requirements: [
        'Quantity / Number of Products',
        'Design Pressure',
        'Manufacturing Code (ASME, EN, etc.)',
        'U-Stamp Requirements (if ASME)',
        'TPI Requirements',
        'Pump Curves',
        'Pipeline Profiles',
        'Flow Rate Details'
      ]
    },
    contact: {
      title: 'Contact & Quote Request',
      subtitle: 'Complete your information to receive a detailed quote',
      fields: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Company / Organization',
        country: 'Country / Region',
        notes: 'Additional Requirements / Questions',
        notesPlaceholder: 'Please describe any specific requirements, site conditions, or questions...'
      },
      manufacturingStandards: 'Manufacturing Standards',
      manufacturingCode: 'Manufacturing Code',
      uStamp: 'ASME U-Stamp Required?',
      tpi: 'Third-Party Inspector (TPI)?',
      attachments: 'Attachments',
      attachmentTypes: 'Pump curves, pipeline profiles, specifications (PDF, Excel, CAD)',
      whatNext: 'What Happens Next?',
      nextSteps: [
        'Your inquiry will be sent to our Hydraulic Department',
        'A technical specialist will review your requirements',
        'You\'ll receive a detailed quote within 24-48 hours',
        'Optional: Schedule a consultation to discuss your project'
      ],
      submitButton: 'Submit Quote Request',
      downloadPDF: 'Download PDF Summary',
      submissionSuccess: 'Thank you! Your inquiry has been submitted. Our hydraulic department will review your requirements and contact you within 24-48 hours.'
    }
  },
  fr: {
    app: {
      subtitle: 'Sélecteur de Réservoir Anti-Bélier',
      version: 'Édition Professionnelle'
    },
    navigation: {
      next: 'Suivant',
      back: 'Retour',
      submit: 'Soumettre',
      cancel: 'Annuler'
    },
    steps: {
      application: 'Application',
      configuration: 'Configuration',
      sizing: 'Dimensionnement',
      summary: 'Résumé',
      contact: 'Contact'
    },
    application: {
      title: 'Média / Application',
      subtitle: 'Pour quelle application ou média utiliserez-vous ce produit?',
      media: {
        CleanWater: 'Eau Propre',
        Potable: 'Eau Potable',
        TSE: 'Effluent d\'Égout Traité',
        NoSolids: 'Média Sans Solides',
        Sewage: 'Égout',
        WasteWater: 'Eaux Usées',
        Solids: 'Média avec Solides'
      },
      descriptions: {
        CleanWater: 'Pour les systèmes d\'eau propre municipaux et industriels',
        Potable: 'Systèmes conformes à l\'eau potable',
        TSE: 'Applications d\'eau recyclée',
        NoSolids: 'Fluides clairs sans particules',
        Sewage: 'Égouts bruts et eaux usées',
        WasteWater: 'Eaux usées industrielles et municipales',
        Solids: 'Fluides contenant des solides en suspension'
      }
    },
    configuration: {
      title: 'Configuration',
      subtitle: 'Sélectionnez la technologie et l\'orientation pour votre application',
      technology: 'Technologie',
      orientation: 'Orientation',
      specialRequirements: 'Exigences Spéciales',
      araaQuestion: 'Minimum 1-2 démarrages/arrêts de pompe par jour avec pipeline relativement plat?',
      araaNote: '(Pas d\'alimentation électrique impliquée)',
      araaSelected: 'Technologie ARAA Sélectionnée - Configuration verticale uniquement',
      products: {
        Hydrochoc: {
          name: 'HYDROCHOC',
          tagline: 'Réservoir à vessie pour applications d\'eau potable',
          features: [
            'Protection anti-bélier',
            'Conception eau dans vessie',
            'Horizontal jusqu\'à 120 000 litres',
            'Vertical jusqu\'à 60 000 litres'
          ]
        },
        Hydrofort: {
          name: 'HYDROFORT',
          tagline: 'Réservoir à vessie pour eau potable ou industrielle',
          features: [
            'Contrôle du cycle de pompe/stockage d\'eau',
            'Conception eau dans vessie',
            'Horizontal jusqu\'à 120 000 litres',
            'Vertical jusqu\'à 60 000 litres'
          ]
        },
        EUV: {
          name: 'EUV',
          tagline: 'Réservoir à vessie pour eaux usées et eau brute',
          features: [
            'Pour protection anti-bélier',
            'Applications avec sédimentation importante',
            'Conception air dans vessie',
            'Vertical uniquement, jusqu\'à 60 000 litres'
          ]
        },
        ARAA: {
          name: 'ARAA',
          tagline: 'Réservoir style tube plongeur',
          features: [
            'Pour protection anti-bélier',
            'Conception sans vessie',
            'Basse pression avec hauteur statique nulle',
            'Vertical uniquement, jusqu\'à 80 000 litres'
          ]
        },
        Compressor: {
          name: 'COMPRESSEUR',
          tagline: 'Package complet de protection anti-bélier',
          features: [
            'Protection anti-bélier et contrôle du cycle de pompe',
            'Package complet avec panneau de contrôle',
            'Configuration verticale ou horizontale',
            'Toutes applications d\'eau'
          ]
        }
      }
    },
    sizing: {
      title: 'Dimensionnement du Réservoir',
      subtitle: 'Configurez les dimensions ou la capacité de votre réservoir anti-bélier',
      dimensionsKnown: 'Dimensions Connues',
      capacityKnown: 'Capacité Connue',
      diameter: 'Diamètre',
      length: 'Longueur Totale',
      capacity: 'Capacité',
      volumeLitres: 'Volume (Litres)',
      volumeGallons: 'Volume (Gallons US)',
      configuration: 'Configuration',
      autoCalculate: 'Les dimensions seront calculées automatiquement selon la technologie et l\'orientation',
      show3D: 'Afficher la Visualisation 3D',
      surgeAnalysisTitle: 'Analyse Anti-Bélier Professionnelle Requise',
      surgeAnalysisDesc: 'Pour un dimensionnement précis et un devis final, une analyse anti-bélier complète est requise.',
      downloadForm: 'Télécharger le Formulaire AQ120'
    },
    summary: {
      title: 'Résumé Professionnel',
      subtitle: 'Vérifiez la configuration de votre réservoir anti-bélier',
      configuration: 'Configuration',
      dimensions: 'Dimensions',
      media: 'Média',
      technology: 'Technologie',
      orientation: 'Orientation',
      capacity: 'Capacité',
      diameter: 'Diamètre',
      length: 'Longueur',
      quoteRequirements: 'Exigences pour Devis Final',
      requirements: [
        'Quantité / Nombre de Produits',
        'Pression de Conception',
        'Code de Fabrication (ASME, EN, etc.)',
        'Exigences U-Stamp (si ASME)',
        'Exigences TPI',
        'Courbes de Pompe',
        'Profils de Pipeline',
        'Détails de Débit'
      ]
    },
    contact: {
      title: 'Contact et Demande de Devis',
      subtitle: 'Complétez vos informations pour recevoir un devis détaillé',
      fields: {
        name: 'Nom Complet',
        email: 'Adresse Email',
        phone: 'Numéro de Téléphone',
        company: 'Entreprise / Organisation',
        country: 'Pays / Région',
        notes: 'Exigences Supplémentaires / Questions',
        notesPlaceholder: 'Veuillez décrire les exigences spécifiques, conditions du site, ou questions...'
      },
      manufacturingStandards: 'Normes de Fabrication',
      manufacturingCode: 'Code de Fabrication',
      uStamp: 'U-Stamp ASME Requis?',
      tpi: 'Inspecteur Tiers (TPI)?',
      attachments: 'Pièces Jointes',
      attachmentTypes: 'Courbes de pompe, profils de pipeline, spécifications (PDF, Excel, CAD)',
      whatNext: 'Que Se Passe-t-il Ensuite?',
      nextSteps: [
        'Votre demande sera envoyée à notre Département Hydraulique',
        'Un spécialiste technique examinera vos exigences',
        'Vous recevrez un devis détaillé dans les 24-48 heures',
        'Optionnel: Planifier une consultation pour discuter de votre projet'
      ],
      submitButton: 'Soumettre la Demande de Devis',
      downloadPDF: 'Télécharger le Résumé PDF',
      submissionSuccess: 'Merci! Votre demande a été soumise. Notre département hydraulique examinera vos exigences et vous contactera dans les 24-48 heures.'
    }
  }
};

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within TranslationProvider');
  return context;
}