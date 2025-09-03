import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { generatePDF, generateBlankAQ10PDF } from '../lib/pdfGenerator';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileDown, ArrowLeft, Save, Download, ClipboardList } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-5 rounded-2xl border bg-white shadow-sm">
      <h2 className="text-sm font-semibold tracking-wide text-slate-700 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  locked,
  required
}: {
  label: string;
  children: React.ReactNode;
  locked?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium space-y-1">
      <span className="flex items-center gap-2">
        {label}{required && <span className="text-red-500">*</span>}
        {locked && <span className="px-2 py-0.5 rounded bg-slate-200 text-[10px] uppercase tracking-wide">Locked</span>}
      </span>
      {children}
    </label>
  );
}

export default function AQ10() {
  const { state, setState } = useStore();
  const nav = useNavigate();

  // Auto-generate enquiry reference & date once
  useEffect(() => {
    if (!state.enquiryRef || !state.enquiryDateISO) {
      const ref = state.enquiryRef ?? `AQ10-${new Date().toISOString().slice(0,10)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
      const date = state.enquiryDateISO ?? new Date().toISOString();
      setState(s => ({ ...s, enquiryRef: ref, enquiryDateISO: date }));
    }
  }, [state.enquiryRef, state.enquiryDateISO, setState]);

  // Local editing snapshot (two-way bound directly to store for simplicity)
  const update = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) =>
    setState(s => ({ ...s, [k]: v }));

  const mediaLabel =
    state.media === 'CleanWater' || state.media === 'Potable' || state.media === 'TSE'
      ? 'Clear Water'
      : state.media === 'WasteWater' || state.media === 'Sewage' || state.media === 'Solids'
      ? 'Waste Water'
      : state.media || '—';

  const projectName =
    state.company
      ? `${state.company} – ${mediaLabel}`
      : mediaLabel;

  const handleSave = () => {
    // Minimal validation for required starred fields if Study selected
    if (state.inquiryType === 'Study') {
      // Example required fields (can expand)
      const required: (keyof typeof state)[] = ['tmh', 'flowMaxM3h', 'pipelineLengthM'];
      const missing = required.filter(k => state[k] === undefined || state[k] === '');
      if (missing.length) {
        alert(`Please complete required fields: ${missing.join(', ')}`);
        return;
      }
    }
    update('checkedSignedAtISO', new Date().toISOString());
    alert('AQ10 data saved to project.');
  };

  const downloadFilled = async () => {
    await generatePDF({
      ...state,
      capacityLitres: state.capacityLitres,
      capacityGallons: state.capacityLitres,
      generatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            AQ10 – Surge / Transient Study Intake
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Provide as much detail as possible. Estimation mode: only starred essentials. Study mode: complete form.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => nav('/project')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={async () => { await generateBlankAQ10PDF(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs hover:bg-slate-50"
          >
            <FileDown className="w-4 h-4" /> Blank PDF
          </button>
          <button
            onClick={downloadFilled}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Filled PDF
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs shadow hover:bg-blue-700"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* Locked Header */}
      <Section title="Enquiry Meta (Locked)">
        <div className="grid md:grid-cols-4 gap-4 text-xs">
          <Field label="Enquiry Reference" locked>
            <input
              disabled
              value={state.enquiryRef ?? ''}
              className="w-full px-3 py-2 rounded-lg border bg-slate-100 text-slate-600"
            />
          </Field>
          <Field label="Enquiry Date" locked>
            <input
              disabled
              value={state.enquiryDateISO ? new Date(state.enquiryDateISO).toLocaleString() : ''}
              className="w-full px-3 py-2 rounded-lg border bg-slate-100 text-slate-600"
            />
          </Field>
          <Field label="Project Name (Derived)" locked>
            <input
              disabled
              value={projectName}
              className="w-full px-3 py-2 rounded-lg border bg-slate-100 text-slate-600"
            />
          </Field>
          <Field label="Inquiry Type" required>
            <div className="flex gap-2">
              {(['Study', 'Estimation'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update('inquiryType', m)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-[11px]
                    ${state.inquiryType === m ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Nature of the Fluid">
        <div className="grid md:grid-cols-4 gap-4 text-xs">
          <Field label="Fluid Classification">
            <input
              disabled
              value={mediaLabel}
              className="w-full px-3 py-2 rounded-lg border bg-slate-100 text-slate-600"
            />
          </Field>
          <Field label="Other Fluid Specification">
            <input
              className="w-full px-3 py-2 rounded-lg border"
              value={state.fluidOtherSpec ?? ''}
              onChange={e => update('fluidOtherSpec', e.target.value || undefined)}
              placeholder="If different / add technical notes"
            />
          </Field>
        </div>
      </Section>

      <Section title="Pumping Station">
        <div className="grid md:grid-cols-6 gap-4 text-xs">
          <Field label="TMH (Wc)" required>
            <input
              type="number"
              value={state.tmh ?? ''}
              onChange={e => update('tmh', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="TMH Zero Flow (m.Wc)">
            <input
              type="number"
              value={state.tmhZeroFlow ?? ''}
              onChange={e => update('tmhZeroFlow', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Surge Vessel Elevation (m)">
            <input
              type="number"
              value={state.surgeVesselElevationM ?? ''}
              onChange={e => update('surgeVesselElevationM', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Max Flow (m³/h)" required>
            <input
              type="number"
              value={state.flowMaxM3h ?? ''}
              onChange={e => update('flowMaxM3h', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
            <Field label="Min Flow (m³/h)">
              <input
                type="number"
                value={state.flowMinM3h ?? ''}
                onChange={e => update('flowMinM3h', e.target.value === '' ? undefined : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </Field>
          <Field label="Pumps in Operation">
            <input
              type="number"
              value={state.pumpsInOperation ?? ''}
              onChange={e => update('pumpsInOperation', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
        </div>
      </Section>

      <Section title="Suction Tank">
        <div className="grid md:grid-cols-4 gap-4 text-xs">
          <Field label="Min Water Elevation (m)">
            <input
              type="number"
              value={state.suctionMinElevM ?? ''}
              onChange={e => update('suctionMinElevM', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Max Water Elevation (m)">
            <input
              type="number"
              value={state.suctionMaxElevM ?? ''}
              onChange={e => update('suctionMaxElevM', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Speed of Rotation (tr/min)">
            <input
              type="number"
              value={state.speedRotationRpm ?? ''}
              onChange={e => update('speedRotationRpm', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Moment of Inertia (kg·m²)">
            <input
              type="number"
              value={state.momentInertiaKgM2 ?? ''}
              onChange={e => update('momentInertiaKgM2', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
        </div>
      </Section>

      <Section title="Pipeline">
        <div className="grid md:grid-cols-5 gap-4 text-xs">
          <Field label="Total Length (m)">
            <input
              type="number"
              value={state.pipelineLengthM ?? ''}
              onChange={e => update('pipelineLengthM', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Internal Diameter (mm)">
            <input
              type="number"
              value={state.pipelineIntDiamMm ?? ''}
              onChange={e => update('pipelineIntDiamMm', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Material">
            <input
              value={state.pipelineMaterial ?? ''}
              onChange={e => update('pipelineMaterial', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-lg border"
              placeholder="e.g. DI, Steel, HDPE"
            />
          </Field>
          <Field label="Profile Cumulative Dist (CSV)">
            <textarea
              rows={3}
              value={state.profileCumulativeDistance ?? ''}
              onChange={e => update('profileCumulativeDistance', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-lg border text-[11px]"
              placeholder="e.g. 0,150,420,800"
            />
          </Field>
          <Field label="Profile Elevations (CSV)">
            <textarea
              rows={3}
              value={state.profileElevation ?? ''}
              onChange={e => update('profileElevation', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-lg border text-[11px]"
              placeholder="e.g. 112.5,113.0,118.4,117.0"
            />
          </Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-xs mt-4">
          <Field label="Profile Air Valves / Drain (CSV)">
            <textarea
              rows={3}
              value={state.profileAirValves ?? ''}
              onChange={e => update('profileAirValves', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-lg border text-[11px]"
              placeholder="positions or notes"
            />
          </Field>
          <Field label="End of Pipe Description">
            <textarea
              rows={3}
              value={state.endOfPipeDescription ?? ''}
              onChange={e => update('endOfPipeDescription', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-lg border text-[11px]"
              placeholder="Discharge / filter / water tower / overflow / control valve / earth tank…"
            />
          </Field>
          <Field label="Site Conditions (Description / Location / Climate)">
            <textarea
              rows={3}
              value={state.siteConditions ?? ''}
              onChange={e => update('siteConditions', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-lg border text-[11px]"
              placeholder="Ambient temp, altitude, corrosive environment, indoor/outdoor, etc."
            />
          </Field>
        </div>
      </Section>

      <Section title="Review & Sign Off">
        <div className="grid md:grid-cols-4 gap-4 text-xs">
          <Field label="Checked By (Name)">
            <input
              value={state.checkedByName ?? ''}
              onChange={e => update('checkedByName', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Company">
            <input
              value={state.checkedByCompany ?? state.company ?? ''}
              onChange={e => update('checkedByCompany', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-lg border"
            />
          </Field>
          <Field label="Signed At (Auto)">
            <input
              disabled
              value={state.checkedSignedAtISO ? new Date(state.checkedSignedAtISO).toLocaleString() : '—'}
              className="w-full px-3 py-2 rounded-lg border bg-slate-100 text-slate-600"
            />
          </Field>
          <div className="flex items-end">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
            >
              <CheckCircle className="w-4 h-4" /> Mark Checked
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          Please double check the data before forwarding. Signing captures a timestamp and locks context for engineering review.
        </p>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={() => nav('/project')}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border text-xs hover:bg-slate-50"
        >
          <ClipboardList className="w-4 h-4" /> Return to Project Info
        </button>
      </div>
    </div>
  );
}

