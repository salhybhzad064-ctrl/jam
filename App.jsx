import React, { useMemo, useState } from 'react';

const ppeList = [
  'کلاه ایمنی','عینک ایمنی','گوشی ایمنی','دستکش برش‌مقاوم','دستکش ضدشیمیایی',
  'ماسک نیم‌صورت','ماسک گردوغبار','لباس کار','ایمنی کف پا/ایمن‌کفش','هارنس/کمربند ایمنی'
];

const rate = (v)=> Number.isFinite(+v)? Math.max(1,Math.min(10, +v)) : 1;
const category = (rpn)=> rpn>=200? 'خیلی بالا/بحرانی' : rpn>=100? 'بالا' : rpn>=50? 'متوسط' : 'پایین';
const catClass = (c)=> c.includes('بحرانی')? 'pill danger' : c==='بالا'? 'pill danger' : c==='متوسط'? 'pill' : 'pill success';

function autoSOP(hazard, ppe, rpn){
  const lines = [
    `1) قبل از شروع کار، ارزیابی ریسک FMEA انجام و تایید سرپرست اخذ شود.`,
    `2) استفاده از تجهیزات حفاظت فردی: ${ppe.length? ppe.join('، ') : 'بر اساس ارزیابی.'}`,
    `3) کنترل‌های مهندسی/اداری اجرا شود (محصورسازی، تهویه، برچسب‌گذاری، قفل و تگ).`,
    `4) ناحیه کار تمیز، روشن و دسترسی اضطراری باز باشد.`,
    `5) در صورت تغییر شرایط، کار متوقف و ارزیابی مجدد انجام شود.`,
    `سطح ریسک: ${category(rpn)} (RPN=${rpn}).`
  ];
  return lines.join('\n');
}

function autoEmergency(hazard){
  return [
    `- توقف ایمن عملیات و دورسازی افراد غیرمرتبط.`,
    `- اطلاع‌رسانی به سرپرست/HSE و تماس با اورژانس در صورت جراحت.`,
    `- استفاده از تجهیزات اضطراری (دوش/شست‌وشوی چشم/جعبه کمک‌های اولیه/کپسول آتش‌نشانی).`,
    `- ایمن‌سازی محل (قطع انرژی، قرنطینه، تهویه).`,
    `- ثبت حادثه/شبه‌حادثه و تحلیل ریشه‌ای.`
  ].join('\n');
}

export default function App(){
  const [hazard, setHazard] = useState('');
  const [s, setS] = useState(5);
  const [o, setO] = useState(5);
  const [d, setD] = useState(5);
  const [ppe, setPpe] = useState([]);
  const [controls, setControls] = useState('ایزولاسیون، قفل و تگ، تهویه، حصارکشی، آموزش.');
  const [sop, setSop] = useState('');
  const [emer, setEmer] = useState('');

  const rpn = useMemo(()=> rate(s)*rate(o)*rate(d), [s,o,d]);
  const cat = useMemo(()=> category(rpn), [rpn]);

  const togglePpe = (item)=> setPpe(ppe.includes(item)? ppe.filter(i=>i!==item) : [...ppe, item]);

  const handleAuto = ()=>{
    setSop(autoSOP(hazard, ppe, rpn));
    setEmer(autoEmergency(hazard));
  }

  const downloadHtml = ()=>{
    const html = `<!doctype html><html lang="fa" dir="rtl"><meta charset="utf-8"><title>Behzad HSE گزارش</title>
      <body style="font-family:Tahoma,Arial">
      <h2>Behzad HSE – FMEA & PPE & SOP & Emergency</h2>
      <p><b>خطر:</b> ${hazard||'-'}</p>
      <p><b>شدت(S):</b> ${s} | <b>وقوع(O):</b> ${o} | <b>کشف(D):</b> ${d} | <b>RPN:</b> ${rpn} – ${cat}</p>
      <p><b>کنترل‌های پیشنهادی:</b> ${controls}</p>
      <p><b>PPE:</b> ${ppe.length? ppe.join('، ') : '-'}</p>
      <h3>SOP</h3><pre>${sop||autoSOP(hazard,ppe,rpn)}</pre>
      <h3>EMERGENCY PLAN</h3><pre>${emer||autoEmergency(hazard)}</pre>
      </body></html>`;
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Behzad-HSE-Report.html';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="wrap">
      <div className="card">
        <h1>Behzad HSE – ارزیابی ریسک FMEA</h1>
        <p className="note">خطر را وارد کن، مقادیر S/O/D را 1 تا 10 بده؛ RPN و رده ریسک محاسبه می‌شود. همزمان PPE و SOP و EMERGENCY را بساز.</p>
        <div className="grid">
          <div>
            <label>شرح خطر</label>
            <input value={hazard} onChange={e=>setHazard(e.target.value)} placeholder="مثال: سقوط از ارتفاع در داربست" />
          </div>
            <div>
              <label>کنترل‌های مهندسی/اداری پیشنهادی</label>
              <input value={controls} onChange={e=>setControls(e.target.value)} />
            </div>
          <div>
            <label>Severity (1-10)</label>
            <input type="number" min="1" max="10" value={s} onChange={e=>setS(e.target.value)} />
          </div>
          <div>
            <label>Occurrence (1-10)</label>
            <input type="number" min="1" max="10" value={o} onChange={e=>setO(e.target.value)} />
          </div>
          <div>
            <label>Detection (1-10)</label>
            <input type="number" min="1" max="10" value={d} onChange={e=>setD(e.target.value)} />
          </div>
          <div>
            <label>RPN</label>
            <div className="row"><span className="pill">{rpn}</span><span className={catClass(cat)}>{cat}</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>ماتریکس تجهیزات حفاظت فردی (PPE)</h2>
        <div className="row">
          {ppeList.map(item=> (
            <label key={item} style={{display:'inline-flex',alignItems:'center',gap:6}} className="pill">
              <input type="checkbox" checked={ppe.includes(item)} onChange={()=>togglePpe(item)} />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>SOP (دستورالعمل اجرایی استاندارد)</h2>
        <textarea rows={7} value={sop} onChange={e=>setSop(e.target.value)} placeholder="گام‌های SOP را وارد کن یا دکمه تولید خودکار را بزن..." />
        <h2>EMERGENCY PLAN (طرح اضطراری)</h2>
        <textarea rows={6} value={emer} onChange={e=>setEmer(e.target.value)} placeholder="سناریو و اقدامات اضطراری..." />
        <div className="row" style={{marginTop:10}}>
          <button className="btn" onClick={handleAuto}>تولید خودکار SOP و EMERGENCY</button>
          <button className="btn" onClick={downloadHtml}>دانلود گزارش HTML</button>
        </div>
      </div>

      <div className="card">
        <h2>جدول راهنمای نمره‌دهی FMEA</h2>
        <table>
          <thead><tr><th>رتبه</th><th>Severity</th><th>Occurrence</th><th>Detection</th></tr></thead>
          <tbody>
            {[1,2,3,4,5,6,7,8,9,10].map(n=>(
              <tr key={n}><td>{n}</td><td>{n===10?'مرگ/فاجعه': n>=7?'شدید': n>=4?'متوسط': 'خفیف'}</td><td>{n>=8?'خیلی پرتکرار': n>=5?'متوسط': 'کم'}</td><td>{n>=8?'تقریباً غیرقابل کشف': n>=5?'سخت': 'قابل کشف'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
