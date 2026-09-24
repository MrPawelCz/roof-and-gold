(function(root){
  'use strict';
  const fields=['ukHouse','trHouse','ukWage','trWage','ukFx','trFx','goldGrowth'];
  const grow=(v,r,t)=>v*Math.pow(1+r/100,t);
  const cagr=(a,b,n)=>100*(Math.pow(b/a,1/n)-1);
  function trend(data){
    const start=data.find(r=>r.year===2020),end=data.find(r=>r.year===2025);
    const map={ukHouse:'ukPrice',trHouse:'trIndex',ukWage:'ukHourly',trWage:'trMonthly',ukFx:'ukFx',trFx:'trFx',goldGrowth:'goldUsd'};
    return Object.fromEntries(Object.entries(map).map(([k,v])=>[k,Math.round(cagr(start[v],end[v],5)*10)/10]));
  }
  function validate(s){
    if(!['gold','wages','currency'].includes(s.measure)||!['absolute','indexed'].includes(s.display))throw Error('Invalid chart choice.');
    if(![3,5,10].includes(s.horizon)||typeof s.forecast!=='boolean')throw Error('Invalid forecast setting.');
    for(const [k,min,max] of [['ukAnchor',10000,1e7],['trAnchor',10000,1e8],['hours',1,80]])if(!Number.isFinite(s[k])||s[k]<min||s[k]>max)throw Error('Check the value for '+k+'.');
    for(const k of fields)if(!Number.isFinite(s.rates[k])||s.rates[k]<-30||s.rates[k]>100)throw Error('Annual changes must be between −30% and 100%.');
    return s;
  }
  function records(data,s){
    validate(s);
    const anchor=data.find(r=>r.year===2025);
    const history=data.map(r=>({...r,projected:false,ukPrice:r.ukPrice*s.ukAnchor/anchor.ukPrice,trPrice:r.trIndex===null?null:r.trIndex/anchor.trIndex*s.trAnchor,ukPay:r.ukHourly*s.hours*52,trPay:r.trMonthly*12}));
    const last=history.at(-1),all=[...history];
    if(s.forecast)for(let t=1;t<=s.horizon;t++)all.push({year:2025+t,projected:true,ukPrice:grow(last.ukPrice,s.rates.ukHouse,t),trPrice:grow(last.trPrice,s.rates.trHouse,t),ukPay:grow(last.ukPay,s.rates.ukWage,t),trPay:grow(last.trPay,s.rates.trWage,t),ukFx:grow(last.ukFx,s.rates.ukFx,t),trFx:grow(last.trFx,s.rates.trFx,t),goldUsd:grow(last.goldUsd,s.rates.goldGrowth,t)});
    return all.map(r=>({...r,ukGold:r.ukPrice/(r.goldUsd*r.ukFx),trGold:r.trPrice===null?null:r.trPrice/(r.goldUsd*r.trFx),ukYears:r.ukPrice/r.ukPay,trYears:r.trPrice===null?null:r.trPrice/r.trPay}));
  }
  function value(r,c,measure){return r[c+({gold:'Gold',wages:'Years',currency:'Price'}[measure])];}
  function chartValue(r,c,s,all){const v=value(r,c,s.measure);if(v===null)return null;if(s.display==='indexed'||s.measure==='currency'){const base=value(all.find(x=>x.year===2010),c,s.measure);return v/base*100;}return v;}
  root.RoofModel={fields,grow,cagr,trend,validate,records,value,chartValue};
})(typeof window==='undefined'?globalThis:window);
