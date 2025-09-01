import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useState } from 'react';

type Code = 'ASME' | 'EN' | 'CODAP' | 'AS1210' | 'PD5500';

interface ContactForm {
  name: string; email: string; phone: string; company: string; country: string; notes: string;
  code: Code; uStamp: boolean; tpi: boolean;
}

const fieldDefs = [
  { key: 'name', label: 'Who you are' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Contact Number' },
  { key: 'company', label: 'Company / Firm' },
  { key: 'country', label: 'Country / Region' },
] as const;
type FieldKey = typeof fieldDefs[number]['key'];

export default function Contact() {
  const nav = useNavigate();
  const { state } = useStore();

  const [form, setForm] = useState<ContactForm>({
    name: state.name ?? '',
    email: state.email ?? '',
    phone: '',
    company: state.company ?? '',
    country: state.country ?? '',
    notes: state.notes ?? '',
    code: 'ASME',
    uStamp: false,
    tpi: false,
  });

  function setField<K extends FieldKey>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function submit() {
    console.log('Lead submission:', { selection: state, contact: form });
    alert('Thanks! Your preliminary selection has been saved for review.');
    nav('/application');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contact & Quote</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {fieldDefs.map(def => (
          <div key={def.key}>
            <label className="text-sm text-slate-600">{def.label}</label>
            <input
              value={form[def.key]}
              onChange={(e) => setField(def.key, e.target.value)}
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">More details / Questions</label>
          <textarea
            value={form.notes}
            onChange={e=>setForm(f=>({ ...f, notes: e.target.value }))}
            className="mt-1 w-full border rounded-lg p-2 min-h-[120px]"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-slate-600">Manufacturing Code</label>
          <select
            value={form.code}
            onChange={e=>setForm(f=>({ ...f, code: e.target.value as Code }))}
            className="mt-1 w-full border rounded-lg p-2">
            <option value="ASME">ASME BPVC Sec VIII</option>
            <option value="EN">EN 13445</option>
            <option value="CODAP">CODAP (France)</option>
            <option value="AS1210">AS 1210 (Australia)</option>
            <option value="PD5500">PD 5500 (UK)</option>
          </select>
        </div>
        <label className="flex items-end gap-2">
          <input type="checkbox" checked={form.uStamp} onChange={e=>setForm(f=>({ ...f, uStamp: e.target.checked }))}/>
          ASME U-Stamp required?
        </label>
        <label className="flex items-end gap-2">
          <input type="checkbox" checked={form.tpi} onChange={e=>setForm(f=>({ ...f, tpi: e.target.checked }))}/>
          Third-Party Inspector (TPI)?
        </label>
      </div>

      <div className="flex justify-between">
        <button onClick={() => nav('/summary')} className="px-3 py-2 border rounded-lg">Back</button>
        <button onClick={submit} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Submit</button>
      </div>
    </div>
  );
}
