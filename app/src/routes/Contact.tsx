import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useState } from 'react';

export default function Contact() {
  const nav = useNavigate();
  const { state } = useStore();
  const [form, setForm] = useState({ name:'',email:'',phone:'',company:'',country:'',notes:'', code:'ASME', uStamp:false, tpi:false });

  function submit() {
    console.log('Lead submission:', { selection: state, contact: form });
    alert('Thanks! Your preliminary selection has been saved for review.');
    nav('/application');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contact & Quote</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          ['name','Who you are'],['email','Email'],['phone','Contact Number'],['company','Company / Firm'],['country','Country / Region']
        ].map(([k,label]) => (
          <div key={k}>
            <label className="text-sm text-slate-600">{label}</label>
            <input value={(form as any)[k]} onChange={e=>setForm(f=>({ ...f, [k]: e.target.value }))}
              className="mt-1 w-full border rounded-lg p-2" />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">More details / Questions</label>
          <textarea value={form.notes} onChange={e=>setForm(f=>({ ...f, notes: e.target.value }))}
            className="mt-1 w-full border rounded-lg p-2 min-h-[120px]" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-slate-600">Manufacturing Code</label>
          <select value={form.code} onChange={e=>setForm(f=>({ ...f, code: e.target.value as any }))}
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
