import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const path=fileURLToPath(new URL('../docs/',import.meta.url));
const ctx=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path+'data.js','utf8'),ctx);vm.runInContext(fs.readFileSync(path+'model.js','utf8'),ctx);
const D=ctx.window.ROOF_DATA,M=ctx.window.RoofModel;
const s={measure:'gold',display:'absolute',forecast:true,horizon:5,ukAnchor:D.defaultUkAnchor,trAnchor:D.defaultTrAnchor,hours:37.5,rates:M.trend(D.records)};
const rows=M.records(D.records,s),near=(a,b)=>assert.ok(Math.abs(a-b)<Math.max(1,Math.abs(b))*1e-10,`${a} != ${b}`);
assert.equal(D.records.length,20);assert.equal(rows.length,25);assert.equal(rows.at(-1).year,2030);
for(let year=2006;year<2010;year++){const r=rows.find(r=>r.year===year);assert.equal(r.trPrice,null);assert.equal(r.trGold,null);assert.equal(r.trYears,null);}
const base=rows.find(r=>r.year===2025),historic=rows.find(r=>r.year===2010);
near(base.ukPrice,268191.25);near(base.trPrice,4187497.2);near(base.ukPay,12.0175*37.5*52);near(base.trPay,312066);near(base.ukGold,268191.25/(3442*0.759473957338608));
near(base.trGold,4187497.2/(3442*39.4548130977983));
for(const measure of ['gold','wages','currency'])for(const c of ['uk','tr'])near(M.chartValue(historic,c,{...s,measure,display:'indexed'},rows),100);
const rates=Object.fromEntries(M.fields.map(k=>[k,0]));rates.ukHouse=10;rates.trHouse=10;rates.ukWage=10;rates.trWage=10;
const stable=M.records(D.records,{...s,rates});near(stable.at(-1).ukYears,base.ukYears);near(stable.at(-1).trYears,base.trYears);near(stable.at(-1).ukGold,base.ukGold*1.1**5);
rates.ukHouse=0;rates.ukFx=10;const fx=M.records(D.records,{...s,rates});near(fx.at(-1).ukGold,base.ukGold/1.1**5);
const doubled=M.records(D.records,{...s,ukAnchor:s.ukAnchor*2,trAnchor:s.trAnchor*2});near(doubled[4].ukGold,rows[4].ukGold*2);near(doubled[4].trYears,rows[4].trYears*2);
assert.equal(M.records(D.records,{...s,forecast:false}).length,20);assert.equal(M.records(D.records,{...s,horizon:10}).at(-1).year,2035);
assert.throws(()=>M.records(D.records,{...s,hours:0}));assert.throws(()=>M.records(D.records,{...s,rates:{...s.rates,goldGrowth:-100}}));
assert.throws(()=>M.records(D.records,{...s,rates:{...s.rates,trHouse:NaN}}));
for(const r of rows)for(const [k,v] of Object.entries(r))if(typeof v==='number')assert.ok(Number.isFinite(v),k);
for(const file of ['model.js','app.js','data.js'])new vm.Script(fs.readFileSync(path+file,'utf8'),{filename:file});
const html=fs.readFileSync(path+'index.html','utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!m[1].includes(':'))assert.ok(fs.existsSync(path+m[1]),m[1]);}
console.log('PASS: complete annual data; explicit gaps; gold and wage conversions; currency direction; compounding; index rebasing; custom prices; horizons; invalid inputs; script syntax; local assets.');
console.log('2025:',JSON.stringify({ukGold:base.ukGold,trGold:base.trGold,ukWageYears:base.ukYears,trWageYears:base.trYears}));
