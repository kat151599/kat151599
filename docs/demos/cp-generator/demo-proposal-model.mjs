/**
 * MAS23A / Solar Proposal DEMO — isolated, deterministic public data model.
 * Every person, company, object, equipment model and price is FICTIONAL.
 *
 * No private GTT files, business records, API, secrets or dependencies.
 * No fetch / storage / dynamic imports. Calculations are TRAINING estimates,
 * not engineering certification or a quotation.
 *
 * Model contract deliberately follows the *shape*, not implementation, of
 * the private GTT generator: 00–08 form sections -> one calculated document
 * object -> future A4 renderer. Values and methods are independently authored.
 */
export const DEMO_SCHEMA_VERSION = 'mas23a-1';
export const DEMO_DISCLAIMER = 'Навчальна симуляція. Усі дані, компанії, обладнання, ціни та проєкти вигадані. Не є інженерним розрахунком або комерційною офертою.';

function nonNegative(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError('DEMO_INVALID_NONNEGATIVE_' + name);
  }
  return value;
}
function positive(value, name) {
  const v = nonNegative(value, name);
  if (v === 0) throw new RangeError('DEMO_INVALID_POSITIVE_' + name);
  return v;
}
function count(value, name) {
  if (!Number.isSafeInteger(value) || value < 1 || value > 100000) {
    throw new RangeError('DEMO_INVALID_QUANTITY_' + name);
  }
  return value;
}
function requiredText(value, name) {
  if (typeof value !== 'string' || !value.trim() || value.length > 240) {
    throw new TypeError('DEMO_INVALID_TEXT_' + name);
  }
  return value.trim();
}
function amount(v) {
  // Stable cents across calculation, not a claim of engineering precision.
  return Math.round((v + Number.EPSILON) * 100) / 100;
}
function quantity(v, fractionDigits = 2) {
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(v);
}
function money(v, currency) {
  return quantity(v, 2) + ' ' + currency;
}
function sourceCatalog(catalog, list, key) {
  if (!Array.isArray(catalog?.[list]) || !catalog[list].length) {
    throw new Error('DEMO_CATALOG_MISSING_' + list);
  }
  const item = catalog[list].find(x => x.id === key);
  if (!item) throw new Error('DEMO_CATALOG_UNKNOWN_' + list + '_' + key);
  return item;
}
function selectedItems(selections, catalog, list, keyName) {
  if (!Array.isArray(selections) || selections.length > 40) {
    throw new Error('DEMO_INVALID_SELECTIONS_' + list);
  }
  return selections.map((selection, index) => ({
    item: sourceCatalog(catalog, list, selection?.[keyName]),
    quantity: count(selection.quantity, list + '_' + index),
  }));
}

/** Immutable-by-convention, fresh fully synthetic inputs for test + visitor. */
export function createFictionalScenario() {
  return {
    catalog: {
      regionYieldKwhPerKw: {
        'Кіровоградська': 1150,
        'Київська': 1080,
        'Одеська': 1260,
      },
      panels: [
        { id: 'fiction-panel-620', name: 'Навчальний модуль Aurora 620', powerW: 620, priceUah: 4300 },
        { id: 'fiction-panel-550', name: 'Навчальний модуль Vega 550', powerW: 550, priceUah: 3900 },
      ],
      batteries: [
        { id: 'fiction-battery-10', name: 'Навчальний накопичувач Lyra', powerKw: 10,
          nominalVoltageV: 48, capacityAh: 200, stackCount: 2, priceUah: 105000 },
        { id: 'fiction-battery-5', name: 'Навчальний накопичувач Nova', powerKw: 5,
          nominalVoltageV: 48, capacityAh: 120, stackCount: 1, priceUah: 58000 },
      ],
      additionalEquipment: [
        { id: 'fiction-inverter-kit', name: 'Навчальний комплект інвертора', priceUah: 19500 },
        { id: 'fiction-monitoring', name: 'Навчальний комплект моніторингу', priceUah: 3700 },
      ],
    },
    form: {
      // 00 — Currency; demo catalogue and cost inputs are explicitly in UAH.
      currency: { input: 'UAH', inputRateUah: 1, output: 'UAH', outputRateUah: 1 },
      // 01 — Provider (fictional, with reserved .invalid domain).
      supplier: { company: 'ТОВ «Сонячна Демонстрація»', website: 'https://solar-demo.example.invalid',
        phone: '+380 00 000 00 00', email: 'hello@solar-demo.example.invalid', manager: 'Демо-менеджер' },
      // 02 — Client (fictional).
      client: { name: 'ТОВ «Навчальний Об’єкт»', contact: 'Приклад Контакту',
        address: 'Демонстраційна адреса, Україна', region: 'Кіровоградська' },
      // 03 — Proposal. No live numbering or private original names.
      proposal: { number: 'DEMO-0001', date: '2026-11-02',
        validUntil: '2026-11-16', template: 'seven-page-training' },
      // 04 — Energy. All tariffs are synthetic UAH / kWh.
      energy: { mode: 'annual', annualConsumptionKwh: 30000,
        monthlyConsumptionKwh: Array(12).fill(2500),
        allocatedPowerKw: 60, buyTariff: 6.5, sellTariff: 2.5 },
      // 05 — Solar plant.
      solar: { desiredPowerKw: 40, panelId: 'fiction-panel-620', lossFactor: 0.84 },
      // 06 — Additional hardware; repeatable rows.
      battery: { selections: [{ modelId: 'fiction-battery-10', quantity: 1 }] },
      additionalEquipment: { selections: [{ itemId: 'fiction-inverter-kit', quantity: 1 }] },
      // 07 — Itemized installation/one-time costs in UAH.
      costs: { commutationPerKw: 850, installationPerPanel: 340,
        workingProject: 13500, otherOneTime: 8700, manualAdjustment: 0,
        customItems: [{ name: 'Демонстраційна доставка', amount: 4800 }] },
    },
    projects: [
      { title: 'Навчальна дахова СЕС', description: 'Вигаданий приклад для структури КП.',
        image: '', url: '', fictional: true },
      { title: 'Навчальна промислова СЕС', description: 'Об’єкт не існує.',
        image: '', url: '', fictional: true },
      { title: 'Навчальна гібридна СЕС', description: 'Показовий проєкт без реального замовника.',
        image: '', url: '', fictional: true },
    ],
  };
}

export function calculateFictionalProposal(scenario) {
  if (!scenario || typeof scenario !== 'object') throw new TypeError('DEMO_SCENARIO_REQUIRED');
  const { catalog, form, projects } = scenario;
  if (!catalog || !form || typeof form !== 'object') {
    throw new TypeError('DEMO_FORM_AND_CATALOG_REQUIRED');
  }
  const region = requiredText(form.client?.region, 'client.region');
  const regionYield = positive(catalog.regionYieldKwhPerKw?.[region], 'regionYield');
  requiredText(form.client?.name, 'client.name');
  requiredText(form.supplier?.company, 'supplier.company');
  requiredText(form.proposal?.number, 'proposal.number');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.proposal.date) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(form.proposal.validUntil)) {
    throw new TypeError('DEMO_INVALID_PROPOSAL_DATES');
  }
  if (form.proposal.validUntil < form.proposal.date) {
    throw new RangeError('DEMO_INVALID_VALIDITY_WINDOW');
  }
  if (!['UAH', 'USD', 'EUR'].includes(form.currency?.output)) {
    throw new TypeError('DEMO_UNSUPPORTED_OUTPUT_CURRENCY');
  }
  const outputRate = positive(form.currency.outputRateUah, 'currency.outputRateUah');
  if (form.currency.input !== 'UAH' || form.currency.inputRateUah !== 1) {
    throw new TypeError('DEMO_COST_INPUTS_MUST_BE_UAH');
  }
  const panel = sourceCatalog(catalog, 'panels', form.solar?.panelId);
  const panelPower = positive(panel.powerW, 'solar.panel.powerW');
  const desiredKw = positive(form.solar.desiredPowerKw, 'solar.desiredPowerKw');
  const lossFactor = nonNegative(form.solar.lossFactor, 'solar.lossFactor');
  if (lossFactor > 1) throw new RangeError('DEMO_INVALID_LOSS_FACTOR');
  const panelCount = Math.ceil(desiredKw * 1000 / panelPower);
  count(panelCount, 'solar.panelCount');
  const actualSolarPowerKw = panelCount * panelPower / 1000;
  const annualGenerationKwh = actualSolarPowerKw * regionYield;
  const usefulGenerationKwh = annualGenerationKwh * lossFactor;

  const energy = form.energy ?? {};
  if (!['annual', 'monthly'].includes(energy.mode)) {
    throw new TypeError('DEMO_INVALID_ENERGY_MODE');
  }
  const months = energy.monthlyConsumptionKwh;
  if (!Array.isArray(months) || months.length !== 12) {
    throw new RangeError('DEMO_EXPECTS_TWELVE_MONTHS');
  }
  const monthlySum = months.reduce(
    (sum, value, index) => sum + nonNegative(value, 'month_' + index), 0);
  const annualConsumptionKwh = energy.mode === 'monthly'
    ? monthlySum
    : nonNegative(energy.annualConsumptionKwh, 'energy.annualConsumptionKwh');
  const allocatedPowerKw = nonNegative(energy.allocatedPowerKw, 'energy.allocatedPowerKw');
  const buyTariff = nonNegative(energy.buyTariff, 'energy.buyTariff');
  const sellTariff = nonNegative(energy.sellTariff, 'energy.sellTariff');
  const selfConsumedKwh = Math.min(usefulGenerationKwh, annualConsumptionKwh);
  const surplusKwh = Math.max(0, usefulGenerationKwh - selfConsumedKwh);

  const batteryRows = selectedItems(form.battery?.selections ?? [],
    catalog, 'batteries', 'modelId');
  const extraRows = selectedItems(form.additionalEquipment?.selections ?? [],
    catalog, 'additionalEquipment', 'itemId');
  const batteries = batteryRows.map(({ item, quantity: n }) => ({
    ...item, quantity: n, capacityKwh:
      positive(item.nominalVoltageV, 'battery.voltage') *
      positive(item.capacityAh, 'battery.ampHours') *
      count(item.stackCount, 'battery.stackCount') / 1000,
  }));
  const batteryCount = batteries.reduce((n, item) => n + item.quantity, 0);
  const actualBatteryPowerKw = batteries.reduce((n, item) => n + item.powerKw * item.quantity, 0);
  const actualBatteryCapacityKwh = batteries.reduce((n, item) => n + item.capacityKwh * item.quantity, 0);

  const costs = form.costs ?? {};
  const costItems = [];
  function line(code, label, n, priceUah, unit) {
    if (!Number.isFinite(n) || n < 0) throw new RangeError('DEMO_INVALID_LINE_QUANTITY_' + code);
    const price = nonNegative(priceUah, 'line_' + code);
    costItems.push({ code, label, quantity: n, unit,
      unitPriceUah: amount(price), amountUah: amount(n * price) });
  }
  line('panels', 'Сонячні панелі: ' + panel.name, panelCount,
    panel.priceUah, 'шт.');
  batteryRows.forEach(({ item, quantity: n }, i) =>
    line('battery-' + i, 'Накопичувач: ' + item.name, n, item.priceUah, 'шт.'));
  extraRows.forEach(({ item, quantity: n }, i) =>
    line('equipment-' + i, 'Додаткове обладнання: ' + item.name, n, item.priceUah, 'шт.'));
  line('commutation', 'Комутаційне обладнання', actualSolarPowerKw,
    costs.commutationPerKw, 'кВт');
  line('installation', 'Монтажні роботи', panelCount,
    costs.installationPerPanel, 'панель');
  line('working-project', 'Робочий проєкт', 1, costs.workingProject, 'послуга');
  line('one-time', 'Інші одноразові витрати', 1, costs.otherOneTime, 'послуга');
  line('adjustment', 'Додаткова вартість', 1, costs.manualAdjustment, 'послуга');
  if (!Array.isArray(costs.customItems) || costs.customItems.length > 40) {
    throw new TypeError('DEMO_INVALID_CUSTOM_COSTS');
  }
  costs.customItems.forEach((item, i) => {
    line('custom-' + i, requiredText(item.name, 'costs.custom.' + i),
      1, item.amount, 'послуга');
  });
  const projectCostUah = amount(costItems.reduce((sum, item) => sum + item.amountUah, 0));
  const electricitySavingsUah = amount(selfConsumedKwh * buyTariff);
  const saleIncomeUah = amount(surplusKwh * sellTariff);
  // Simplified training benefit, no taxes, demand curves, maintenance or NPV.
  const netAnnualSavingsUah = amount(electricitySavingsUah + saleIncomeUah);
  const paybackYears = netAnnualSavingsUah > 0
    ? projectCostUah / netAnnualSavingsUah : null;
  const convert = v => amount(v / outputRate);
  const outputCurrency = form.currency.output;
  const calculations = {
    panelCount, actualSolarPowerKw, specificYield: regionYield,
    annualGenerationKwh, usefulGenerationKwh,
    annualConsumptionKwh, selfConsumedKwh, surplusKwh,
    allocatedPowerKw,
    batteryCount, actualBatteryPowerKw, actualBatteryCapacityKwh,
    costItems: costItems.map(item => ({ ...item, value: convert(item.amountUah),
      formatted: money(convert(item.amountUah), outputCurrency) })),
    projectCostUah, projectCost: convert(projectCostUah),
    electricitySavingsUah, electricitySavings: convert(electricitySavingsUah),
    saleIncomeUah, saleIncome: convert(saleIncomeUah),
    netAnnualSavingsUah, netAnnualSavings: convert(netAnnualSavingsUah),
    paybackYears, outputCurrency, outputRate,
    // Not an enforced grid-injection engineering constraint, only a warning.
    exceedsAllocatedPower: desiredKw > allocatedPowerKw,
  };
  if (!Array.isArray(projects) || projects.length > 10 ||
      projects.some(project => project.fictional !== true ||
        project.image !== '' || project.url !== '')) {
    throw new TypeError('DEMO_ONLY_FICTIONAL_PROJECTS_WITH_NO_REMOTE_ASSETS');
  }
  const formatted = {
    actualSolarPower: quantity(actualSolarPowerKw) + ' кВт',
    annualGeneration: quantity(annualGenerationKwh, 0) + ' кВт·год',
    usefulGeneration: quantity(usefulGenerationKwh, 0) + ' кВт·год',
    annualConsumption: quantity(annualConsumptionKwh, 0) + ' кВт·год',
    batteryPower: quantity(actualBatteryPowerKw) + ' кВт',
    batteryCapacity: quantity(actualBatteryCapacityKwh) + ' кВт·год',
    projectCost: money(calculations.projectCost, outputCurrency),
    electricitySavings: money(calculations.electricitySavings, outputCurrency) + '/рік',
    saleIncome: money(calculations.saleIncome, outputCurrency) + '/рік',
    netSavings: money(calculations.netAnnualSavings, outputCurrency) + '/рік',
    payback: paybackYears === null ? 'Не розраховано' : quantity(paybackYears) + ' року',
  };
  return {
    ...form,
    equipment: { panel: { ...panel }, batteries, additionalEquipment:
      extraRows.map(({ item, quantity: n }) => ({ ...item, quantity: n })) },
    calculations, formatted, projects: projects.map(p => ({ ...p })),
    meta: { schemaVersion: DEMO_SCHEMA_VERSION,
      fictional: true, disclaimer: DEMO_DISCLAIMER,
      annualBenefitAssumption: 'Без операційних витрат, податків та дисконтування',
      priceBasis: 'Вигадані суми UAH; лише демонстрація' },
  };
}
