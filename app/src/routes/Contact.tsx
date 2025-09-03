import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../lib/i18n';
import { useTheme } from '../lib/theme';
import { generatePDF } from '../lib/pdfGenerator';
import { litresToUsGallons } from '../lib/sizing';

type Code = 'ASME' | 'EN' | 'CODAP' | 'AS1210' | 'PD5500';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  notes: string;
  code: Code;
  uStamp: boolean;
  tpi: boolean;
}

export default function Contact() {
  const nav = useNavigate();
  const { state, setState } = useStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState<ContactForm>({
    name: state.name ?? '',
    email: state.email ?? '',
    phone: state.phone ?? '',
    company: state.company ?? '',
    country: state.country ?? '',
    notes: state.notes ?? '',
    code: (state.code ?? 'ASME') as Code,
    uStamp: state.uStamp ?? false,
    tpi: state.tpi ?? false,
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactForm, string>> = {};
    
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.company.trim()) newErrors.company = 'Company is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownloadPDF = async () => {
    const pdfData = {
      ...state,
      ...form,
      capacityGallons: state.capacityLitres ? litresToUsGallons(state.capacityLitres) : 0,
      generatedAt: new Date().toISOString()
    };
    await generatePDF(pdfData);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Update state with form data
    setState(s => ({ ...s, ...form }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate and download PDF
    await handleDownloadPDF();
    
    setIsSubmitting(false);
    alert(t('contact.submissionSuccess'));
    nav('/application');
  };

  const formFields = [
    { key: 'name' as const, type: 'text', icon: '👤', required: true },
    { key: 'email' as const, type: 'email', icon: '📧', required: true },
    { key: 'phone' as const, type: 'tel', icon: '📞', required: false },
    { key: 'company' as const, type: 'text', icon: '🏢', required: true },
    { key: 'country' as const, type: 'text', icon: '🌍', required: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {t('contact.title')}
        </h1>
        <p className="mt-2 text-lg" style={{ color: theme.textSecondary }}>
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Contact Form */}
      <div className="grid md:grid-cols-2 gap-6">
        {formFields.map((field, idx) => (
          <motion.div
            key={field.key}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <label className="block text-sm font-medium mb-2">
              <span className="mr-2">{field.icon}</span>
              {t(`contact.fields.${field.key}`)}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              value={form[field.key]}
              onChange={(e) => setForm(f => ({ ...f, [field.key]: e.target.value }))}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 ${
                errors[field.key] ? 'border-red-500' : ''
              }`}
              style={{
                borderColor: errors[field.key] ? theme.error : theme.borderColor,
                backgroundColor: theme.bgTertiary
              }}
            />
            {errors[field.key] && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm mt-1"
                style={{ color: theme.error }}
              >
                {errors[field.key]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Manufacturing Standards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="font-semibold text-lg">{t('contact.manufacturingStandards')}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('contact.manufacturingCode')}
            </label>
            <select
              value={form.code}
              onChange={(e) => setForm(f => ({ ...f, code: e.target.value as Code }))}
              className="w-full px-4 py-3 border-2 rounded-xl"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgTertiary
              }}
            >
              <option value="ASME">ASME BPVC Sec VIII Div 1</option>
              <option value="EN">EN 13445</option>
              <option value="CODAP">CODAP (France)</option>
              <option value="AS1210">AS1210 (Australia)</option>
            </select>
          </div>
          
          {form.code === 'ASME' && (
            <motion.label
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
              style={{ backgroundColor: theme.bgTertiary }}
            >
              <input
                type="checkbox"
                checked={form.uStamp}
                onChange={(e) => setForm(f => ({ ...f, uStamp: e.target.checked }))}
                className="w-5 h-5 rounded"
                style={{ accentColor: theme.primary }}
              />
              <span className="text-sm font-medium">{t('contact.uStamp')}</span>
            </motion.label>
          )}
          
          <motion.label
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: theme.bgTertiary }}
          >
            <input
              type="checkbox"
              checked={form.tpi}
              onChange={(e) => setForm(f => ({ ...f, tpi: e.target.checked }))}
              className="w-5 h-5 rounded"
              style={{ accentColor: theme.primary }}
            />
            <span className="text-sm font-medium">{t('contact.tpi')}</span>
          </motion.label>
        </div>
      </motion.div>

      {/* Additional Notes (append indication if AQ10 present) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <label className="block text-sm font-medium mb-2">
          {t('contact.fields.notes')}
          {state.enquiryRef && (
            <span className="ml-2 text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              AQ10 Ref: {state.enquiryRef}
            </span>
          )}
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
          className="w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2"
          style={{
            borderColor: theme.borderColor,
            backgroundColor: theme.bgTertiary
          }}
          rows={4}
          placeholder={t('contact.fields.notesPlaceholder')}
        />
        {state.inquiryType && (
          <p className="mt-2 text-[11px] text-slate-500">
            AQ10 Inquiry Type: {state.inquiryType} • Signed: {state.checkedSignedAtISO ? new Date(state.checkedSignedAtISO).toLocaleString() : '—'}
          </p>
        )}
      </motion.div>

      {/* File Attachments */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <h3 className="font-semibold">{t('contact.attachments')}</h3>
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          {t('contact.attachmentTypes')}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.xlsx,.xls,.dwg,.dxf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 border-2 rounded-lg font-medium"
          style={{
            borderColor: theme.borderColor,
            color: theme.textPrimary
          }}
        >
          📎 Choose Files
        </motion.button>
        
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: theme.bgTertiary }}
              >
                <span className="text-sm truncate flex-1">{file.name}</span>
                <span className="text-xs mx-2" style={{ color: theme.textSecondary }}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* What Happens Next */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-6 rounded-xl border-2"
        style={{
          borderColor: theme.success,
          background: `${theme.success}11`
        }}
      >
        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: theme.success }}>
          📞 {t('contact.whatNext')}
        </h3>
        <ul className="space-y-2 text-sm">
          {['0', '1', '2', '3'].map(idx => (
            <li key={idx} className="flex items-start gap-2">
              <span style={{ color: theme.success }}>✓</span>
              <span>{t(`contact.nextSteps.${idx}`)}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => nav('/summary')}
          className="px-6 py-3 border-2 rounded-lg font-medium"
          style={{
            borderColor: theme.borderColor,
            color: theme.textPrimary
          }}
        >
          {t('navigation.back')}
        </motion.button>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPDF}
            className="px-6 py-3 border-2 rounded-lg font-medium flex items-center gap-2"
            style={{
              borderColor: theme.primary,
              color: theme.primary
            }}
          >
            📄 {t('contact.downloadPDF')}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 text-white rounded-lg font-medium shadow-lg disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⏳
                </motion.span>
                Processing...
              </span>
            ) : (
              <>
                {t('contact.submitButton')} →
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}