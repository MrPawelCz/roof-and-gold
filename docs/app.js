(function(){
  'use strict';
  const $=id=>document.getElementById(id),M=window.RoofModel,D=window.ROOF_DATA;
  if(!M||!D){$('metrics').innerHTML='<p>The data could not be loaded. Please reload the page.</p>';return;}
  const nf=new Intl.NumberFormat('en-GB',{maximumFractionDigits:1});
  const money=(v,c)=>v===null?'Unavailable':new Intl.NumberFormat('en-GB',{style:'currency',currency:c==='uk'?'GBP':'TRY',maximumFractionDigits:0}).format(v);
  const num=(v,d=1)=>v===null?'—':v.toLocaleString('en-GB',{maximumFractionDigits:d,minimumFractionDigits:d});
  const trend=M.trend(D.records);
  const defaults={measure:'gold',display:'absolute',year:2025,forecast:true,horizon:5,scenario:'trend',ukAnchor:D.defaultUkAnchor,trAnchor:D.defaultTrAnchor,hours:37.5,rates:{...trend}};
  let state=structuredClone(defaults),rows=[],geometry=null,toastTimer;
  const labels={gold:{title:'A home, priced in gold',subtitle:'Troy ounces per home · lower means less gold needed',unit:'oz',key:'Gold'},wages:{title:'A home, measured in working years',subtitle:'Years of gross minimum pay · lower means more affordable',unit:'years',key:'Years'},currency:{title:'How local home prices have changed',subtitle:'Local-currency house prices · indexed to 2010 = 100',unit:'',key:'Price'}};
  function notify(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',4200);}
  function bindValues(){
    for(const k of ['ukAnchor','trAnchor','hours','horizon','scenario','display'])$(k).value=state[k];
    $('forecast').checked=state.forecast;
    for(const k of M.fields)$(k).value=state.rates[k];
    for(const b of document.querySelectorAll('[data-measure]'))b.setAttribute('aria-pressed',String(b.dataset.measure===state.measure));
    $('display').disabled=state.measure==='currency';
    if(state.measure==='currency')$('display').value='indexed';
  }
  function commit(next){try{M.validate(next);state=next;state.year=Math.max(2006,Math.min(state.year,state.forecast?2025+state.horizon:2025));bindValues();render();return true;}catch(e){notify(e.message);bindValues();return false;}}
  function render(){
    rows=M.records(D.records,state);
    document.querySelector('.comparison-basis').textContent=(state.ukAnchor===defaults.ukAnchor?'UK national-average home':'UK custom reference home')+' · '+(state.trAnchor===defaults.trAnchor?'Turkey modeled 100 m² home':'Turkey custom reference home')+' · Gross minimum wages';
    const meta=labels[state.measure],indexed=state.display==='indexed'||state.measure==='currency';
    $('chart-title').textContent=meta.title;
    $('chart-subtitle').textContent=indexed?(state.measure==='currency'?meta.subtitle:meta.subtitle.split(' · ')[0]+' · indexed to 2010 = 100'):meta.subtitle;
    $('year').max=rows.at(-1).year;$('year-end').textContent=rows.at(-1).year;
    $('chart-note').textContent='Turkey has no official housing index before 2010. '+(state.measure==='currency'?'The chart indexes each currency separately; raw pounds and lira appear in the cards. ':'')+(state.forecast?'Dotted lines after 2025 are scenarios, including the incomplete year 2026.':'Historical annual averages through 2025.');
    $('basis-note').textContent='UK default: '+money(D.defaultUkAnchor,'uk')+', the 2025 annual-average UK HPI price. Turkey default: '+money(D.defaultTrAnchor,'tr')+' — a modeled 100 m² home, based on CBRT’s Q4 2025 unit price and converted to a 2025 annual price basis. Historical values follow the official housing index; this is not a directly observed average home price. Editing either price creates a custom reference home. Wages use gross minimum pay, not average earnings.';
    renderMetrics();renderChart();renderForecast();renderTable();
  }
  function renderMetrics(){
    const r=rows.find(r=>r.year===state.year),base=rows.find(r=>r.year===2010),meta=labels[state.measure];
    $('year').value=state.year;$('selected-year').textContent=state.year+(r.projected?' · scenario':'');
    $('metrics').innerHTML=['uk','tr'].map(c=>{
      const v=M.value(r,c,state.measure),b=M.value(base,c,state.measure),change=v===null?null:(v/b-1)*100;
      const value=state.measure==='currency'?(v===null?'—':(c==='uk'?'£':'₺')+new Intl.NumberFormat('en-GB',{notation:v>=1000000?'compact':'standard',maximumFractionDigits:v>=1000000?2:0}).format(v)):v===null?'—':v>9999?new Intl.NumberFormat('en-GB',{notation:'compact',maximumFractionDigits:1}).format(v):num(v);
      const direction=change===null?'':change<0?'lower':'higher';
      const unit=state.measure==='currency'?'':meta.unit;
      const caption=v===null?'No official housing series for this year':state.measure==='currency'?'Reference home · '+(r.projected?'projected':'annual basis'):money(r[c+'Price'],c)+(c==='tr'?' modeled home':' reference home');
      return '<article class="metric-card '+c+'"><div class="country-label"><span class="country-code">'+(c==='uk'?'UK':'TR')+'</span>'+(c==='uk'?'United Kingdom':'Turkey')+'</div><span class="metric-year">'+r.year+' · '+(r.projected?'Scenario':c==='tr'?'Modeled home':state.ukAnchor!==defaults.ukAnchor?'Custom home':'Historical basis')+'</span><div class="metric-value">'+value+(v!==null&&unit?'<small>'+unit+'</small>':'')+'</div><div class="metric-change">'+(change===null?'Data starts in 2010':'<strong style="color:'+(change<=0?'#148583':'#956920')+'">'+num(Math.abs(change))+'% '+direction+'</strong>than 2010')+'</div><div class="metric-caption">'+caption+'</div></article>';
    }).join('');
  }
  function renderChart(){
    const W=$('chart').clientWidth,H=$('chart').clientHeight,pad={l:W<420?39:46,r:18,t:31,b:34};
    const start=2006,end=rows.at(-1).year,max=Math.max(...rows.flatMap(r=>['uk','tr'].map(c=>M.chartValue(r,c,state,rows)||0)))*1.12;
    const magnitude=10**Math.floor(Math.log10(max/4));const raw=max/4/magnitude;const step=(raw<=1?1:raw<=2?2:raw<=2.5?2.5:raw<=5?5:10)*magnitude;const yMax=Math.ceil(max/step)*step;
    const x=y=>pad.l+(y-start)/(end-start)*(W-pad.l-pad.r), y=v=>H-pad.b-v/yMax*(H-pad.t-pad.b);
    geometry={W,H,pad,start,end,x,y};
    let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" aria-hidden="true">';
    if(state.forecast)svg+='<rect x="'+x(2025)+'" y="'+pad.t+'" width="'+(x(end)-x(2025))+'" height="'+(H-pad.b-pad.t)+'" fill="#f1f4f7"/><text x="'+(x(2025)+8)+'" y="19" fill="#8798a5" font-size="11">SCENARIO</text>';
    for(let tick=0;tick<=yMax+step*.01;tick+=step){const yy=y(tick),txt=tick>=1000?nf.format(tick/1000)+'k':nf.format(tick);svg+='<line x1="'+pad.l+'" y1="'+yy+'" x2="'+(W-pad.r)+'" y2="'+yy+'" stroke="#e7ecf0" stroke-dasharray="3 4"/><text x="'+(pad.l-9)+'" y="'+(yy+4)+'" fill="#8293a0" text-anchor="end" font-size="12">'+txt+'</text>';}
    const ticks=W<430?[2006,2010,2015,2020,2025,end]:[2006,2010,2015,2020,2025,...(end>=2030?[2030]:[]),end];
    for(const yr of [...new Set(ticks)].filter(t=>t<=end)){if(W<430&&yr===2025&&end-2025<4&&state.forecast)continue;svg+='<text x="'+x(yr)+'" y="'+(H-8)+'" fill="#8293a0" text-anchor="middle" font-size="12">'+yr+'</text>';}
    for(const c of ['uk','tr']){
      const colour=c==='uk'?'#b5832c':'#148583';
      for(const projected of [false,true]){
        if(projected&&!state.forecast)continue;
        const pathRows=rows.filter(r=>projected?r.year>=2025:r.year<=2025);let active=false;
        const d=pathRows.map(r=>{const v=M.chartValue(r,c,state,rows);if(v===null){active=false;return '';}const cmd=active?'L':'M';active=true;return cmd+x(r.year).toFixed(2)+','+y(v).toFixed(2);}).join(' ');
        svg+='<path d="'+d+'" fill="none" stroke="'+colour+'" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"'+(projected?' stroke-dasharray="5 6"':'')+'/>';
      }
    }
    if(state.forecast)svg+='<line x1="'+x(2025)+'" x2="'+x(2025)+'" y1="'+pad.t+'" y2="'+(H-pad.b)+'" stroke="#bdcbd5" stroke-dasharray="3 4"/>';
    svg+='<g id="chart-cursor"><line id="cursor-line" y1="'+pad.t+'" y2="'+(H-pad.b)+'" stroke="#a9bac6" stroke-dasharray="2 4"/><circle id="uk-dot" r="4" fill="#b5832c" stroke="white" stroke-width="2"/><circle id="tr-dot" r="4" fill="#148583" stroke="white" stroke-width="2"/></g></svg><div id="chart-tooltip" class="chart-tooltip" style="display:none"></div>';
    $('chart').innerHTML=svg;updateCursor(false);
  }
  function updateCursor(tooltip){
    if(!geometry)return;
    const r=rows.find(r=>r.year===state.year),{x,y,W}=geometry,xx=x(state.year);
    $('cursor-line').setAttribute('x1',xx);$('cursor-line').setAttribute('x2',xx);
    for(const c of ['uk','tr']){const val=M.chartValue(r,c,state,rows),dot=$(c+'-dot');dot.style.display=val===null?'none':'';dot.setAttribute('cx',xx);if(val!==null)dot.setAttribute('cy',y(val));}
    const tip=$('chart-tooltip');tip.style.display=tooltip?'block':'none';
    if(tooltip){tip.innerHTML='<strong>'+r.year+(r.projected?' · Scenario':'')+'</strong><span class="tip-unit">'+((state.display==='indexed'||state.measure==='currency')?'2010 = 100':labels[state.measure].unit+' per home')+'</span>'+['uk','tr'].map(c=>'<div><span>'+(c==='uk'?'UK':'Turkey')+'</span><span>'+num(M.chartValue(r,c,state,rows))+'</span></div>').join('');tip.style.left=Math.min(Math.max(xx-80,0),Math.max(0,W-178))+'px';}
    $('chart').setAttribute('aria-label',state.year+'. '+labels[state.measure].title+'. UK '+num(M.chartValue(r,'uk',state,rows))+', Turkey '+num(M.chartValue(r,'tr',state,rows))+'. '+((state.display==='indexed'||state.measure==='currency')?'2010 equals 100. ':labels[state.measure].unit+'. ')+'Use left and right arrow keys to select a year.');
  }
  function inspect(year,tip=false){state.year=Math.max(2006,Math.min(rows.at(-1).year,Math.round(year)));renderMetrics();updateCursor(tip);}
  function renderForecast(){
    const last=rows.at(-1),base=rows.find(r=>r.year===2025),unit=state.measure==='currency'?'price':labels[state.measure].unit;
    if(!state.forecast){$('forecast-result').textContent='Historical view. Turn on the forecast to explore future scenarios.';}
    else{$('forecast-result').innerHTML='By <strong>'+last.year+'</strong>, the '+(state.measure==='wages'?'wage years needed':state.measure==='gold'?'gold needed':'local home price')+' would be '+['uk','tr'].map(c=>{const v=M.value(last,c,state.measure),b=M.value(base,c,state.measure),ch=(v/b-1)*100;return '<strong>'+num(Math.abs(ch))+'% '+(ch<0?'lower':'higher')+'</strong> in '+(c==='uk'?'the UK':'Turkey');}).join(' and ')+', relative to 2025.';}
    $('forecast-explanation').textContent=state.scenario==='trend'?'Recent trend: 2020–2025 compound growth, rounded to 0.1%. A mechanical extrapolation, not a probability-weighted prediction.':state.scenario==='easing'?'Housing cools: UK price growth 3 points below trend; Turkey 10 points below. Other inputs stay at trend.':state.scenario==='pressure'?'Housing accelerates: UK price growth 3 points above trend; Turkey 10 points above. Other inputs stay at trend.':'Your assumptions compound annually from the 2025 baseline. These are scenarios, not guaranteed outcomes.';
    for(const k of [...M.fields,'scenario','horizon'])$(k).disabled=!state.forecast;
  }
  function renderTable(){
    $('table-caption').textContent='Annual reference-home prices, gold equivalents and gross minimum-wage multiples. Turkey’s prices are index-based estimates. Forecasts use '+(state.scenario==='trend'?'recent trend':state.scenario==='custom'?'custom assumptions':state.scenario==='easing'?'housing cools':'housing accelerates')+'.';
    $('data-table').innerHTML=rows.map(r=>'<tr'+(r.projected?' class="projected"':'')+'><td>'+r.year+'</td><td>'+(r.projected?'Scenario':'Historical inputs')+'</td><td>'+num(r.ukPrice,0)+'</td><td>'+num(r.trPrice,0)+'</td><td>'+num(r.ukGold)+'</td><td>'+num(r.trGold)+'</td><td>'+num(r.ukYears)+'</td><td>'+num(r.trYears)+'</td></tr>').join('');
  }
  function sources(){
    $('coverage-text').textContent='UK annual prices come from HM Land Registry. Turkey’s official housing index starts in 2010 and is scaled to a modeled 100 m² benchmark worth '+money(D.defaultTrAnchor,'tr')+'. Earlier Turkish housing values are unavailable, not reconstructed. Change the reference price above to suit a property you have in mind.';
    $('sources').innerHTML=D.sources.map(s=>'<div class="source-item"><a href="'+s.url+'" target="_blank" rel="noopener noreferrer">'+s.title+' ↗</a><p>'+s.note+'</p></div>').join('')+'<p class="source-meta">Snapshot assembled 24 September 2026; covers 2006–2025 only. This is a bundled research snapshot, not a live feed. Historical figures may be revised by their publishers. Ratios use annual-average inputs, not the average of daily ratios. UK and Turkish wage entitlements and working-week conventions differ. UK hourly pay follows the highest adult statutory band; its qualifying age changes over the period. Values are shown before income tax. Gold is measured in troy ounces (31.1034768 grams); retail premiums and trading costs are excluded. No investment recommendation is made.</p>';
  }
  for(const btn of document.querySelectorAll('[data-measure]'))btn.addEventListener('click',()=>commit({...state,measure:btn.dataset.measure}));
  $('display').addEventListener('change',e=>commit({...state,display:e.target.value}));
  $('forecast').addEventListener('change',e=>commit({...state,forecast:e.target.checked}));
  $('horizon').addEventListener('change',e=>commit({...state,horizon:Number(e.target.value)}));
  $('scenario').addEventListener('change',e=>{const scenario=e.target.value;if(scenario==='custom'){commit({...state,scenario});return;}const rates={...trend};const shift=scenario==='easing'?-1:scenario==='pressure'?1:0;rates.ukHouse=Math.max(-30,Math.min(100,rates.ukHouse+3*shift));rates.trHouse=Math.max(-30,Math.min(100,rates.trHouse+10*shift));commit({...state,scenario,rates});});
  for(const k of M.fields){
    $(k).addEventListener('input',e=>{if(e.target.value.trim()!==''&&e.target.checkValidity()){state={...state,scenario:'custom',rates:{...state.rates,[k]:Number(e.target.value)}};$('scenario').value='custom';render();}});
    $(k).addEventListener('change',e=>{if(e.target.value.trim()===''||!e.target.checkValidity()){notify('Enter an annual change between −30% and 100%.');bindValues();return;}commit({...state,scenario:'custom',rates:{...state.rates,[k]:Number(e.target.value)}});});
  }
  for(const k of ['ukAnchor','trAnchor','hours']){
    $(k).addEventListener('input',e=>{if(e.target.value.trim()!==''&&e.target.checkValidity()){state={...state,[k]:Number(e.target.value)};render();}});
    $(k).addEventListener('change',e=>{if(e.target.value.trim()===''||!e.target.checkValidity()){e.target.reportValidity();bindValues();return;}commit({...state,[k]:Number(e.target.value)});});
  }
  $('year').addEventListener('input',e=>inspect(Number(e.target.value)));
  $('chart').addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=$('chart').getBoundingClientRect();const {start,end,pad,W}=geometry;inspect(start+(e.clientX-rect.left-pad.l)/(W-pad.l-pad.r)*(end-start),true);});
  $('chart').addEventListener('pointerleave',()=>updateCursor(false));
  $('chart').addEventListener('click',e=>{const rect=$('chart').getBoundingClientRect();const {start,end,pad,W}=geometry;inspect(start+(e.clientX-rect.left-pad.l)/(W-pad.l-pad.r)*(end-start),true);});
  $('chart').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();inspect(e.key==='Home'?2006:e.key==='End'?rows.at(-1).year:state.year+(e.key==='ArrowRight'?1:-1),true);}});
  $('reset').addEventListener('click',()=>{commit(structuredClone(defaults));notify('Default homes, wages and scenario restored.');});
  $('download').addEventListener('click',()=>{
    const columns=['year','status','uk_reference_price_gbp','turkey_reference_price_try','uk_gold_troy_oz','turkey_gold_troy_oz','uk_gross_minimum_wage_years','turkey_gross_minimum_wage_years','uk_annual_gross_pay','turkey_annual_gross_pay','gold_usd_oz','gbp_per_usd','try_per_usd','uk_home_2025_anchor','turkey_home_2025_modeled_anchor','uk_weekly_hours','scenario','uk_house_growth_pct','turkey_house_growth_pct','uk_wage_growth_pct','turkey_wage_growth_pct','gbp_per_usd_growth_pct','try_per_usd_growth_pct','gold_growth_pct'];
    const csv=[columns.join(','),...rows.map(r=>[r.year,r.projected?'scenario':'historical_inputs_with_Turkey_index_based_estimate',r.ukPrice,r.trPrice,r.ukGold,r.trGold,r.ukYears,r.trYears,r.ukPay,r.trPay,r.goldUsd,r.ukFx,r.trFx,state.ukAnchor,state.trAnchor,state.hours,state.scenario,...M.fields.map(k=>state.rates[k])].map(v=>v===null?'':typeof v==='number'?Math.round(v*1e6)/1e6:v).join(','))].join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=url;a.download='roof-and-gold-comparison.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Comparison downloaded with the current assumptions.');
  });
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderChart,120);});
  sources();bindValues();render();
  const context=document.modelContext;
  if(context?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(context.registerTool({name:'configure_housing_comparison',title:'Configure housing comparison',description:'Change the visible UK and Turkey comparison measure, selected year, forecast horizon or annual scenario assumptions. Does not modify source data.',inputSchema:{type:'object',properties:{measure:{type:'string',enum:['gold','wages','currency']},year:{type:'integer',minimum:2006,maximum:2035},horizon:{type:'integer',enum:[3,5,10]},forecast:{type:'boolean'},rates:{type:'object',properties:Object.fromEntries(M.fields.map(k=>[k,{type:'number',minimum:-30,maximum:100}])),additionalProperties:false}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Array.isArray(input))throw Error('An object is required.');const allowed=['measure','year','horizon','forecast','rates'];if(Object.keys(input).some(k=>!allowed.includes(k)))throw Error('Unknown field.');if(input.rates&&(!Object.keys(input.rates).length||Object.keys(input.rates).some(k=>!M.fields.includes(k))))throw Error('Unknown or empty growth assumptions.');if(input.year!==undefined&&(!Number.isInteger(input.year)||input.year<2006||input.year>2035))throw Error('Year must be 2006–2035.');const next={...state,...input,rates:{...state.rates,...input.rates},scenario:input.rates?'custom':state.scenario};M.validate(next);if(next.year>(next.forecast?2025+next.horizon:2025))throw Error('Selected year is beyond the visible range.');commit(next);const r=rows.find(r=>r.year===state.year);return{year:state.year,measure:state.measure,forecast:state.forecast,uk:M.value(r,'uk',state.measure),turkey:M.value(r,'tr',state.measure),turkeyBasis:'100 square metre benchmark scaled by official index'};}},{signal:lifecycle.signal})).catch(()=>{});window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}catch{}}
})();
