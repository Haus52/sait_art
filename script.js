'use strict';

const projectDetails = [
  {
    title: 'База отдыха на Аршане «A10»',
    category: 'Загородный дом',
    text: 'Современная архитектура в природном окружении. На фотографии хорошо видны сочетание дерева и тёмной облицовки, большие оконные проёмы и компактный объём здания. Фотография предоставлена заказчиком сайта.',
    image: 'assets/modern-winter-house.webp',
    alt: 'Современный деревянный дом среди заснеженных сосен'
  },
  {
    title: 'Баня «Тихий плес»',
    category: 'Настилы и благоустройство',
    text: 'Просторная многоуровневая деревянная терраса: удобные переходы, широкие ступени, ограждения и пространство для отдыха у воды. Фотография предоставлена заказчиком сайта.',
    image: 'assets/waterside-terrace.webp',
    alt: 'Просторная деревянная терраса у воды'
  },
  {
    title: 'Кафе «Надежда» по дороге на Малое море',
    category: 'Коммерческий объект',
    text: 'Объект с узнаваемой вывеской, ярким фасадом, оформленными входными группами и парковочной зоной. Фотография предоставлена заказчиком сайта.',
    image: 'assets/nadezhda-commercial.webp',
    alt: 'Здание «Надежда» с зелёной крышей и жёлтым фасадом'
  },
  {
    title: 'Входная группа на базе отдыха «Ветер странствий»',
    category: 'Загородный комплекс',
    text: 'Деревянный дом с несколькими уровнями, открытой террасой, балконом и выразительной реечной отделкой. Фотография предоставлена заказчиком сайта.',
    image: 'assets/country-house-terrace.webp',
    alt: 'Загородный дом с просторной деревянной террасой'
  }
];

const header = document.querySelector('.site-header');
const menuTrigger = document.querySelector('#menuTrigger');
const mobileNav = document.querySelector('#mobileNav');
const projectDialog = document.querySelector('#projectDialog');
const leadDialog = document.querySelector('#leadDialog');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
let activeProject = 0;

function closeMenu() {
  menuTrigger.setAttribute('aria-expanded', 'false');
  menuTrigger.setAttribute('aria-label', 'Открыть меню');
  mobileNav.hidden = true;
}
menuTrigger.addEventListener('click', () => {
  const open = menuTrigger.getAttribute('aria-expanded') === 'true';
  menuTrigger.setAttribute('aria-expanded', String(!open));
  menuTrigger.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
  mobileNav.hidden = open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 1000) closeMenu(); });
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 28), { passive: true });

function setFilter(value) {
  filterButtons.forEach(button => {
    const selected = button.dataset.filter === value;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const cards = document.querySelectorAll('.project-card, .previous-card');
  cards.forEach(card => {
    const categories = (card.dataset.category || '').split(' ');
    const isExtra = card.classList.contains('extra-previous');
    const isExpanded = document.querySelector('#expandProjects').getAttribute('aria-expanded') === 'true';
    card.hidden = !(value === 'all' || categories.includes(value)) || (isExtra && !isExpanded);
  });
  const someVisible = [...document.querySelectorAll('.previous-card')].some(el => !el.hidden);
  document.querySelector('#previousProjects').hidden = !someVisible;
}
filterButtons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
document.querySelectorAll('[data-project-filter]').forEach(link => link.addEventListener('click', () => setFilter(link.dataset.projectFilter)));
const expandProjects = document.querySelector('#expandProjects');
expandProjects.addEventListener('click', () => {
  const expand = expandProjects.getAttribute('aria-expanded') !== 'true';
  expandProjects.setAttribute('aria-expanded', String(expand));
  expandProjects.innerHTML = expand ? 'Скрыть дополнительные проекты <span aria-hidden="true">↑</span>' : 'Показать ещё проекты <span aria-hidden="true">↓</span>';
  const selected = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
  setFilter(selected);
});

function updateProject(index) {
  activeProject = (index + projectDetails.length) % projectDetails.length;
  const item = projectDetails[activeProject];
  document.querySelector('#modalImage').src = item.image;
  document.querySelector('#modalImage').alt = item.alt;
  document.querySelector('#modalTitle').textContent = item.title;
  document.querySelector('#modalCategory').textContent = item.category;
  document.querySelector('#modalText').textContent = item.text;
  document.querySelector('#projectCount').textContent = `${activeProject + 1} / ${projectDetails.length}`;
}
function showDialog(dialog) {
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  document.body.classList.add('modal-open');
}
function hideDialog(dialog) {
  dialog.close();
  document.body.classList.remove('modal-open');
}
document.querySelectorAll('[data-project]').forEach(trigger => trigger.addEventListener('click', () => {
  updateProject(Number(trigger.dataset.project));
  showDialog(projectDialog);
}));
document.querySelector('#previousProject').addEventListener('click', () => updateProject(activeProject - 1));
document.querySelector('#nextProject').addEventListener('click', () => updateProject(activeProject + 1));
document.querySelector('#openLeadDialog').addEventListener('click', () => showDialog(leadDialog));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => hideDialog(document.querySelector('#' + button.dataset.close))));
[projectDialog, leadDialog].forEach(dialog => {
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) hideDialog(dialog); });
});
document.addEventListener('keydown', event => {
  if (!projectDialog.open) return;
  if (event.key === 'ArrowRight') updateProject(activeProject + 1);
  if (event.key === 'ArrowLeft') updateProject(activeProject - 1);
});

const leadForm = document.querySelector('#leadForm');
leadForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;
  const data = new FormData(leadForm);
  if (String(data.get('website')).trim()) return;
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const type = String(data.get('type') || '').trim();
  const message = String(data.get('message') || '').trim();
  const lines = [
    'Здравствуйте, Сергей! Хочу обсудить строительный проект.',
    `Имя: ${name}`,
    ...(phone ? [`Телефон: ${phone}`] : []),
    `Тип объекта: ${type}`,
    ...(message ? [`Задача: ${message}`] : []),
    'Сообщение подготовлено на сайте perevoznikov.pro.'
  ];
  const url = 'https://wa.me/79950453142?text=' + encodeURIComponent(lines.join('\n'));
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) window.location.href = url;
});

setFilter('all');
