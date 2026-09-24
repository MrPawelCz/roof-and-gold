window.ROOF_DATA = {
  "asOf": "2026-09-24",
  "historyEnd": 2025,
  "defaultUkAnchor": 268191.25,
  "defaultTrAnchor": 4187497.2,
  "turkeyQ4Benchmark": 4544700,
  "sources": [
    {
      "title": "UK house prices · HM Land Registry",
      "url": "https://www.gov.uk/government/statistical-data-sets/uk-house-price-index-data-downloads-december-2025",
      "note": "December 2025 data release, published 18 February 2026. United Kingdom, all property types; arithmetic mean of all 12 monthly average prices for each calendar year. This frozen vintage is retained for reproducibility."
    },
    {
      "title": "Turkey housing trend · BIS / CBRT via FRED",
      "url": "https://fred.stlouisfed.org/series/QTRN628BIS",
      "note": "QTRN628BIS: nominal residential property index, 2010 = 100, not seasonally adjusted. Mean of four quarterly observations per year, 2010–2025. Retrieved 24 September 2026. No housing values are filled before 2010."
    },
    {
      "title": "Turkey home benchmark · Global Property Guide / CBRT",
      "url": "https://www.globalpropertyguide.com/middle-east/turkey/price-history",
      "note": "Reports the CBRT nationwide Q4 2025 housing unit price of TRY 45,447/m². A 100 m² home is TRY 4,544,700 at that quarter’s prices. The app multiplies this by (2025 annual-average housing index ÷ Q4 2025 index) to obtain the annual-basis reference, then uses index ratios for other years. This is a modeled benchmark, not a directly observed national average home price."
    },
    {
      "title": "Gold · World Bank Pink Sheet",
      "url": "https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Annual.xlsx",
      "note": "Annual Prices (Nominal), Gold column, US dollars per troy ounce; 2006–2025. Workbook dated 2 September 2026. Annual gold price × annual exchange rate approximates gold’s local-currency annual price."
    },
    {
      "title": "Exchange rates · World Bank / IMF",
      "url": "https://data.worldbank.org/indicator/PA.NUS.FCRF",
      "note": "PA.NUS.FCRF, official exchange rate, local currency per US dollar, annual period average. United Kingdom (GBR) and Türkiye (TUR), 2006–2025. Retrieved 24 September 2026."
    },
    {
      "title": "UK minimum wages · House of Commons / LPC",
      "url": "https://researchbriefings.files.parliament.uk/documents/CBP-7735/CBP-7735.pdf",
      "note": "National Minimum Wage statistics, 10 February 2026, page 9. Highest adult rate: calendar-month weighted (9 months previous rate / 3 new through 2015; 3 previous / 9 new from 2016). Multiply by 37.5 hours × 52 weeks by default. Hours are editable; this is a standardised gross annual wage."
    },
    {
      "title": "Turkey minimum wages · Labour Ministry, 2006–2024",
      "url": "https://www.csgb.gov.tr/Media/14angt4p/netbrutasgari.pdf",
      "note": "Official historical gross monthly minimum wage for adults. Where rates change in July, the app averages the two half-year rates before multiplying by 12."
    },
    {
      "title": "Turkey minimum wage · Labour Ministry, 2025",
      "url": "https://www.csgb.gov.tr/Media/0yfgnsqm/%C3%A7al%C4%B1%C5%9Fma-hayat%C4%B1-istatistikleri-2025-aral%C4%B1k-e-b%C3%BClteni.pdf",
      "note": "December 2025 labour statistics bulletin: 2025 gross monthly minimum wage TRY 26,005.50, giving gross annual pay of TRY 312,066."
    }
  ],
  "records": [
    {
      "year": 2006,
      "ukPrice": 155229.83333333334,
      "trIndex": null,
      "ukHourly": 5.125,
      "trMonthly": 531,
      "goldUsd": 604.0,
      "ukFx": 0.543486666666667,
      "trFx": 1.42845341333845
    },
    {
      "year": 2007,
      "ukPrice": 170598.0,
      "trIndex": null,
      "ukHourly": 5.392499999999999,
      "trMonthly": 573.75,
      "goldUsd": 697.0,
      "ukFx": 0.499771666666667,
      "trFx": 1.30293090533794
    },
    {
      "year": 2008,
      "ukPrice": 162912.08333333334,
      "trIndex": null,
      "ukHourly": 5.5725,
      "trMonthly": 623.55,
      "goldUsd": 872.0,
      "ukFx": 0.54396625,
      "trFx": 1.30152170281795
    },
    {
      "year": 2009,
      "ukPrice": 148445.41666666666,
      "trIndex": null,
      "ukHourly": 5.7475000000000005,
      "trMonthly": 679.5,
      "goldUsd": 973.0,
      "ukFx": 0.641919263495996,
      "trFx": 1.54995977566564
    },
    {
      "year": 2010,
      "ukPrice": 156935.5,
      "trIndex": 100.0,
      "ukHourly": 5.8325,
      "trMonthly": 744.75,
      "goldUsd": 1225.0,
      "ukFx": 0.647179345560165,
      "trFx": 1.5028486296723
    },
    {
      "year": 2011,
      "ukPrice": 154654.33333333334,
      "trIndex": 108.802125,
      "ukHourly": 5.967499999999999,
      "trMonthly": 816.75,
      "goldUsd": 1569.0,
      "ukFx": 0.624140835740495,
      "trFx": 1.67495455197133
    },
    {
      "year": 2012,
      "ukPrice": 155269.33333333334,
      "trIndex": 120.674375,
      "ukHourly": 6.107500000000001,
      "trMonthly": 913.5,
      "goldUsd": 1670.0,
      "ukFx": 0.633046988857327,
      "trFx": 1.79600094441355
    },
    {
      "year": 2013,
      "ukPrice": 159261.5,
      "trIndex": 134.463175,
      "ukHourly": 6.22,
      "trMonthly": 1000.05,
      "goldUsd": 1411.0,
      "ukFx": 0.639660577613477,
      "trFx": 1.90376824244752
    },
    {
      "year": 2014,
      "ukPrice": 172047.66666666666,
      "trIndex": 151.2511,
      "ukHourly": 6.3575,
      "trMonthly": 1102.5,
      "goldUsd": 1266.0,
      "ukFx": 0.607729626878255,
      "trFx": 2.18854241775473
    },
    {
      "year": 2015,
      "ukPrice": 182291.16666666666,
      "trIndex": 175.0843,
      "ukHourly": 6.55,
      "trMonthly": 1237.5,
      "goldUsd": 1161.0,
      "ukFx": 0.654545478931426,
      "trFx": 2.72000852790578
    },
    {
      "year": 2016,
      "ukPrice": 195035.41666666666,
      "trIndex": 197.4623,
      "ukHourly": 7.075,
      "trMonthly": 1647,
      "goldUsd": 1249.0,
      "ukFx": 0.740634463697084,
      "trFx": 3.02013474808043
    },
    {
      "year": 2017,
      "ukPrice": 203950.33333333334,
      "trIndex": 218.811025,
      "ukHourly": 7.425,
      "trMonthly": 1777.5,
      "goldUsd": 1258.0,
      "ukFx": 0.776976682344123,
      "trFx": 3.64813263536867
    },
    {
      "year": 2018,
      "ukPrice": 210354.0,
      "trIndex": 235.95385,
      "ukHourly": 7.7475000000000005,
      "trMonthly": 2029.5,
      "goldUsd": 1269.0,
      "ukFx": 0.749531540259847,
      "trFx": 4.82837014720942
    },
    {
      "year": 2019,
      "ukPrice": 212433.75,
      "trIndex": 247.2937,
      "ukHourly": 8.115,
      "trMonthly": 2558.4,
      "goldUsd": 1392.0,
      "ukFx": 0.783445110011929,
      "trFx": 5.67381930843574
    },
    {
      "year": 2020,
      "ukPrice": 218521.5,
      "trIndex": 306.12245,
      "ukHourly": 8.592500000000001,
      "trMonthly": 2943,
      "goldUsd": 1770.0,
      "ukFx": 0.779999576697153,
      "trFx": 7.00860541558522
    },
    {
      "year": 2021,
      "ukPrice": 236312.5,
      "trIndex": 421.04702499999996,
      "ukHourly": 8.8625,
      "trMonthly": 3577.5,
      "goldUsd": 1800.0,
      "ukFx": 0.727064944688323,
      "trFx": 8.85040754928315
    },
    {
      "year": 2022,
      "ukPrice": 258236.16666666666,
      "trIndex": 1052.5111,
      "ukHourly": 9.3525,
      "trMonthly": 5737.5,
      "goldUsd": 1801.0,
      "ukFx": 0.811301715827773,
      "trFx": 16.5488604173067
    },
    {
      "year": 2023,
      "ukPrice": 258956.16666666666,
      "trIndex": 2129.529725,
      "ukHourly": 10.19,
      "trMonthly": 11711.25,
      "goldUsd": 1943.0,
      "ukFx": 0.804538906734353,
      "trFx": 23.7385661219918
    },
    {
      "year": 2024,
      "ukPrice": 260532.25,
      "trIndex": 3014.126,
      "ukHourly": 11.185,
      "trMonthly": 20002.5,
      "goldUsd": 2388.0,
      "ukFx": 0.782414580986262,
      "trFx": 32.8058614432703
    },
    {
      "year": 2025,
      "ukPrice": 268191.25,
      "trIndex": 3971.889975,
      "ukHourly": 12.0175,
      "trMonthly": 26005.5,
      "goldUsd": 3442.0,
      "ukFx": 0.759473957338608,
      "trFx": 39.4548130977983
    }
  ]
};
