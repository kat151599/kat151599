(() => {
  'use strict';
  const page = document.querySelector('.skill-page');
  const buttons = [...document.querySelectorAll('.skill-choice[data-show]')];
  const title = document.getElementById('skill-choice-title');
  const description = document.getElementById('skill-choice-description');
  const links = document.getElementById('skill-choice-links');
  if (!page || buttons.length !== 3 || !title || !description || !links) return;

  const uk = document.documentElement.lang === 'uk';
  const copy = uk ? {
    business: {
      title: 'Автоматизувати роботу',
      description: 'Системи обмінюються даними самостійно, а співробітники менше часу витрачають на повторювані операції.',
      skills: [['api', 'API-інтеграції'], ['automation', 'Автоматизація бізнес-процесів'],
        ['crm', 'CRM-інтеграції'], ['data', 'Збір та обробка даних']]
    },
    ai: {
      title: 'AI та Telegram',
      description: 'Моделі та Telegram підключаються до наявних продуктів для конкретних сценаріїв, а не заради модного слова «AI».',
      skills: [['llm', 'AI / LLM Integration'], ['telegram', 'Telegram-боти та сповіщення']]
    },
    reliability: {
      title: 'Відновити й стабілізувати роботу',
      description: 'Знайдемо джерело збоїв, зробимо поведінку видимою та перевіримо, що виправлення не зламало інші частини.',
      skills: [['monitoring', 'Моніторинг та повідомлення'], ['debugging', 'Тестування та виправлення інтеграцій']]
    }
  } : {
    business: {
      title: 'Automate business work',
      description: 'Move data between systems automatically and reduce time spent on repeated manual tasks.',
      skills: [['api', 'API integration'], ['automation', 'Business process automation'],
        ['crm', 'CRM integration'], ['data', 'Data collection & processing']]
    },
    ai: {
      title: 'Connect AI or Telegram',
      description: 'Connect models and messaging to existing software for specific outcomes, not just to add an AI label.',
      skills: [['llm', 'AI / LLM integration'], ['telegram', 'Telegram bots & notifications']]
    },
    reliability: {
      title: 'Fix and stabilize a system',
      description: 'Identify the failure, add visibility, and check that the fix does not break unrelated functionality.',
      skills: [['monitoring', 'Monitoring & alerting'], ['debugging', 'Integration testing & troubleshooting']]
    }
  };

  function show(key) {
    const item = copy[key];
    if (!item) return;
    buttons.forEach(button => {
      const active = button.dataset.show === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    title.textContent = item.title;
    description.textContent = item.description;
    const list = document.createDocumentFragment();
    for (const [id, label] of item.skills) {
      const target = document.getElementById('skill-' + id);
      if (!target) continue;
      const a = document.createElement('a');
      a.href = '#skill-' + id;
      a.className = 'skill-quick-link';
      const name = document.createElement('span');
      name.textContent = label;
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↘';
      a.append(name, arrow);
      list.append(a);
    }
    links.replaceChildren(list);
  }
  for (const button of buttons) {
    button.addEventListener('click', () => show(button.dataset.show));
  }
  show('business');
  window.__skillsChooserStatus = () => ({
    selected: buttons.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.show ?? null,
    shown: links.querySelectorAll('a').length,
    fullCatalog: document.querySelectorAll('.skill-block').length,
    skills: document.querySelectorAll('.skill-card[data-skill]').length
  });
})();
