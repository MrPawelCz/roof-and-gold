# Roof & Gold

A browser-only UK and Turkey housing comparison. Serve `docs/` using any static HTTP server. There is no build step, account database or API key.

## Data and interpretation

- A frozen research snapshot assembled 24 September 2026, covering complete calendar years 2006–2025.
- UK: HM Land Registry national all-property monthly average prices, averaged by year (December 2025 release).
- Turkey: BIS/CBRT nominal residential property index, FRED QTRN628BIS, averaged across four quarters. Data begins in 2010; 2006–2009 remain null.
- Turkey's default home is a modeled 100 m² benchmark. Q4 2025 price TRY 45,447/m² (CBRT, as reported by Global Property Guide) × 100 × annual-average 2025 index / Q4 2025 index. Other years are scaled by index ratios. It is not a directly observed national average home price or a property identical to the UK average.
- Gold: World Bank annual nominal gold price in US dollars per troy ounce.
- FX: World Bank PA.NUS.FCRF annual local currency per USD.
- Wages: gross statutory adult minimum wages, calendar-month weighted. UK annual pay uses the chosen weekly hours (37.5 default) × 52. Turkish monthly wage is multiplied by 12. Wage multiples do not represent years needed to save.
- Each exact source, series and transformation is documented in the app and `docs/data.js`.
- No live updates. Replace source records and metadata deliberately to refresh the snapshot.

## Forecasts

The recent-trend scenario extrapolates the 2020–2025 compound annual rate of each component, rounded to 0.1 percentage point. Rates compound annually from the 2025 baseline. Scenarios begin in 2026, including the incomplete current year. Housing cools/accelerates adjusts UK housing growth by −/+3 percentage points and Turkey by −/+10 points; other rates remain at trend. Users can edit every assumption. There are no fitted probabilities, confidence bands or investment recommendations.

Gold ounces = local price / (USD gold price × local currency per USD).
Wage years = local price / annual gross pay.
The local-currency chart rebases both series to 2010 = 100 instead of mixing pounds and lira on a single value axis.

## Files

`docs/model.js` contains pure calculation functions, `docs/app.js` the interface, and `docs/data.js` sourced annual inputs. Native browser controls, semantic HTML and SVG charts support keyboard and touch interaction. WebMCP is feature-detected and offers `configure_housing_comparison` for the same visible state changes.

Verified: source coverage, missing-data preservation, conversions, FX direction, compounding, rebasing, custom prices, horizons, invalid inputs, JavaScript syntax, local assets, UI interactions, and WebMCP valid/invalid inputs.

## GitHub Pages

In repository Settings → Pages, publish from the `main` branch and `/docs` folder. The site uses relative asset paths and works under a repository URL. Run `npm test` for calculation checks (no dependencies required).
