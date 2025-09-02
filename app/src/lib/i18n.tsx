/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // type-only

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

// Normalize French accents (fix encoding issues in source literals)
// Only overrides visible UI strings without changing structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fr: any = (translations as any).fr;
if (fr) {
  fr.app.subtitle = 'Sélecteur de Réservoir Anti-bélier';
  fr.app.version = 'Édition Professionnelle';
  fr.steps.summary = 'Résumé';
  fr.application.title = 'Média / Application';
  fr.application.subtitle = 'Pour quelle application ou média utiliserez-vous ce produit ?';
  fr.application.media.CleanWater = 'Eau propre';
  fr.application.media.Potable = 'Eau potable';
  fr.application.media.TSE = "Effluent d'égout traité";
  fr.application.media.NoSolids = 'Média sans solides';
  fr.application.media.Sewage = 'Égout';
  fr.application.media.WasteWater = 'Eaux usées';
  fr.application.media.Solids = 'Média avec solides';
  fr.application.descriptions.CleanWater = "Pour les systèmes d'eau propre municipaux et industriels";
  fr.application.descriptions.Potable = "Systèmes conformes à l'eau potable";
  fr.application.descriptions.TSE = "Applications d'eau recyclée";
  fr.application.descriptions.Sewage = 'Égouts bruts et eaux usées';
  fr.application.descriptions.WasteWater = 'Eaux usées industrielles et municipales';
  fr.configuration.subtitle = "Sélectionnez la technologie et l'orientation pour votre application";
  fr.configuration.specialRequirements = 'Exigences spéciales';
  fr.configuration.araaQuestion = 'Minimum 1-2 démarrages/arrêts de pompe par jour avec pipeline relativement plat ?';
  fr.configuration.araaNote = "(Pas d'alimentation électrique impliquée)";
  fr.configuration.araaSelected = 'Technologie ARAA sélectionnée - Configuration verticale uniquement';
  fr.configuration.products.Hydrochoc.tagline = "Réservoir à vessie pour applications d'eau potable";
  fr.configuration.products.Hydrochoc.features = [
    'Protection anti-bélier',
    'Conception eau dans vessie',
    "Horizontal jusqu'à 120 000 litres",
    "Vertical jusqu'à 60 000 litres",
  ];
  fr.configuration.products.Hydrofort.tagline = "Réservoir à vessie pour eau potable ou industrielle";
  fr.configuration.products.Hydrofort.features = [
    "Contrôle du cycle de pompe/stockage d'eau",
    'Conception eau dans vessie',
    "Horizontal jusqu'à 120 000 litres",
    "Vertical jusqu'à 60 000 litres",
  ];
  fr.configuration.products.EUV.tagline = "Réservoir à vessie pour eaux usées et eau brute";
  fr.configuration.products.EUV.features = [
    'Pour protection anti-bélier',
    'Applications avec sédimentation importante',
    'Conception air dans vessie',
    "Vertical uniquement, jusqu'à 60 000 litres",
  ];
  fr.configuration.products.ARAA.tagline = 'Réservoir style tube plongeur';
  fr.configuration.products.ARAA.features = [
    'Pour protection anti-bélier',
    'Conception sans vessie',
    'Basse pression avec hauteur statique nulle',
    "Vertical uniquement, jusqu'à 80 000 litres",
  ];
  fr.configuration.products.Compressor.name = 'COMPRESSEUR';
  fr.configuration.products.Compressor.tagline = 'Package complet de protection anti-bélier';
  fr.configuration.products.Compressor.features = [
    'Protection anti-bélier et contrôle du cycle de pompe',
    'Package complet avec panneau de contrôle',
    'Configuration verticale ou horizontale',
    "Toutes applications d'eau",
  ];
  fr.sizing.title = 'Dimensionnement du Réservoir';
  fr.sizing.subtitle = 'Configurez les dimensions ou la capacité de votre réservoir anti-bélier';
  fr.sizing.dimensionsKnown = 'Dimensions connues';
  fr.sizing.capacityKnown = 'Capacité connue';
  fr.sizing.diameter = 'Diamètre';
  fr.sizing.length = 'Longueur totale';
  fr.sizing.capacity = 'Capacité';
  fr.sizing.volumeGallons = 'Volume (Gallons US)';
  fr.sizing.autoCalculate = "Les dimensions seront calculées automatiquement selon la technologie et l'orientation";
  fr.sizing.show3D = 'Afficher la visualisation 3D';
  fr.sizing.surgeAnalysisTitle = 'Analyse anti-bélier professionnelle requise';
  fr.sizing.surgeAnalysisDesc = 'Pour un dimensionnement précis et un devis final, une analyse anti-bélier complète est requise.';
  fr.sizing.downloadForm = 'Télécharger le formulaire AQ120';
  fr.summary.title = 'Résumé professionnel';
  fr.summary.subtitle = 'Vérifiez la configuration de votre réservoir anti-bélier';
  fr.summary.media = 'Média';
  fr.summary.capacity = 'Capacité';
  fr.summary.diameter = 'Diamètre';
  fr.summary.length = 'Longueur';
  fr.summary.quoteRequirements = 'Exigences pour devis final';
  fr.summary.requirements = [
    'Quantité / Nombre de produits',
    'Pression de conception',
    'Code de fabrication (ASME, EN, etc.)',
    'Exigences U-Stamp (si ASME)',
    'Exigences TPI',
    'Courbes de pompe',
    'Profils de pipeline',
    'Détails de débit',
  ];
  fr.contact.title = 'Contact et demande de devis';
  fr.contact.subtitle = 'Complétez vos informations pour recevoir un devis détaillé';
  fr.contact.fields.name = 'Nom complet';
  fr.contact.fields.email = 'Adresse e-mail';
  fr.contact.fields.phone = 'Numéro de téléphone';
  fr.contact.fields.company = 'Entreprise / Organisation';
  fr.contact.fields.country = 'Pays / Région';
  fr.contact.fields.notes = 'Exigences supplémentaires / Questions';
  fr.contact.manufacturingStandards = 'Normes de fabrication';
  fr.contact.manufacturingCode = 'Code de fabrication';
  fr.contact.uStamp = 'U-Stamp ASME requis ?';
  fr.contact.tpi = 'Inspecteur tiers (TPI) ?';
  fr.contact.attachments = 'Pièces jointes';
  fr.contact.attachmentTypes = 'Courbes de pompe, profils de pipeline, spécifications (PDF, Excel, CAD)';
  fr.contact.whatNext = 'Que se passe-t-il ensuite ?';
  fr.contact.nextSteps = [
    'Votre demande sera envoyée à notre département hydraulique',
    'Un spécialiste technique examinera vos exigences',
    'Vous recevrez un devis détaillé dans les 24-48 heures',
    'Optionnel : Planifier une consultation pour discuter de votre projet',
  ];
  fr.contact.submitButton = 'Soumettre la demande de devis';
  fr.contact.downloadPDF = 'Télécharger le résumé PDF';
  fr.contact.submissionSuccess = 'Merci ! Votre demande a été soumise. Notre département hydraulique examinera vos exigences et vous contactera sous 24-48 heures.';
}

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const segments = key.split('.');
    let value: unknown = translations[language] as Record<string, unknown>;

    for (const seg of segments) {
      if (
        value &&
        typeof value === 'object' &&
        seg in (value as Record<string, unknown>)
      ) {
        value = (value as Record<string, unknown>)[seg];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
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
