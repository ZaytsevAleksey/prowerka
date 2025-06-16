document.addEventListener('DOMContentLoaded', () => {
  // ===== ОТЛАДКА СЛАЙДЕРА =====
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  let curSlide = 0;
  const maxSlide = slides.length;

  if (slider && maxSlide > 1) {
    // Запускаем автопрокрутку
    setInterval(() => {
      curSlide = (curSlide + 1) % maxSlide;
      slider.style.transform = `translateX(-${curSlide * 100}%)`;
    }, 4000);
  }


  // AUTH
  const btnLogin = document.getElementById('btnLogin');
  const btnRegister = document.getElementById('btnRegister');
  const btnLogout = document.getElementById('btnLogout');
  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');

  function applyAuth() {
    if (localStorage.getItem('user')) {
      document.body.classList.add('logged-in');
    } else {
      document.body.classList.remove('logged-in');
    }
  }
  applyAuth();

  function openModal(id) {
    document.getElementById(id).classList.add('open');
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove('open');
  }

  // Open modals
  btnLogin?.addEventListener('click', () => openModal('modalLogin'));
  btnRegister?.addEventListener('click', () => openModal('modalRegister'));
  // Close modals
  document.querySelectorAll('[data-close]').forEach(el =>
    el.addEventListener('click', () => closeModal(el.dataset.close))
  );
  window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('open');
    }
  });
  // Logout
  btnLogout?.addEventListener('click', () => {
    localStorage.removeItem('user');
    applyAuth();
  });
  // Handle login
  formLogin?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    localStorage.setItem('user', JSON.stringify({ email }));
    closeModal('modalLogin');
    applyAuth();
  });
  // Handle register
  formRegister?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    localStorage.setItem('user', JSON.stringify({ name, email }));
    closeModal('modalRegister');
    applyAuth();
  });

  // DOCTORS for appointment form
  const doctors = [
    'Иванов А. К. - Терапевт','Петров К.Г. - Кардиолог','Сидоров В.В. - Невролог',
    'Кузнецова А.С. - Хирург','Смирнова Н.А. - Лаборант','Новиков А.М. - Кардиолог',
    'Алексеева М.В. - Педиатр','Морозов П.Д. - Отоларинголог'
  ];
  const selectDoc = document.getElementById('inpDoctor');
  if (selectDoc) {
    doctors.forEach(d => {
      let opt = document.createElement('option');
      opt.value = opt.textContent = d;
      selectDoc.append(opt);
    });
  }

  // APPOINTMENT BOOKING
  const formApp = document.getElementById('formAppointment');
  if (formApp) {
    formApp.addEventListener('submit', e => {
      e.preventDefault();
      let apps = JSON.parse(localStorage.getItem('appointments')||'[]');
      apps.push({
        doctor: selectDoc.value,
        date: document.getElementById('inpDate').value,
        time: document.getElementById('inpTime').value,
        complaint: document.getElementById('inpComplaint').value
      });
      localStorage.setItem('appointments', JSON.stringify(apps));
      alert('Запись сохранена!');
      formApp.reset();
    });
  }

  // MANAGE APPOINTMENTS
  const tbl = document.getElementById('tblAppointments');
  function renderApps() {
    if (!tbl) return;
    let apps = JSON.parse(localStorage.getItem('appointments')||'[]');
    tbl.querySelector('tbody').innerHTML = apps.map((a,i) => `
      <tr>
        <td>${i+1}</td>
        <td>${a.doctor}</td><td>${a.date}</td><td>${a.time}</td><td>${a.complaint}</td>
        <td>
          <button class="btn btn--outline btnEdit" data-i="${i}">✎</button>
          <button class="btn btn--outline btnDel"  data-i="${i}">🗑</button>
        </td>
      </tr>`).join('');
  }
  renderApps();

  tbl?.addEventListener('click', e => {
    let i = e.target.dataset.i;
    let apps = JSON.parse(localStorage.getItem('appointments')||'[]');
    if (e.target.classList.contains('btnDel')) {
      apps.splice(i,1);
      localStorage.setItem('appointments', JSON.stringify(apps));
      renderApps();
    }
    if (e.target.classList.contains('btnEdit')) {
      openModal('modalEdit');
      document.getElementById('editIndex').value = i;
      document.getElementById('editDate').value  = apps[i].date;
      document.getElementById('editTime').value  = apps[i].time;
    }
  });

  const formEdit = document.getElementById('formEdit');
  formEdit?.addEventListener('submit', e => {
    e.preventDefault();
    let apps = JSON.parse(localStorage.getItem('appointments')||'[]');
    let i = +document.getElementById('editIndex').value;
    apps[i].date = document.getElementById('editDate').value;
    apps[i].time = document.getElementById('editTime').value;
    localStorage.setItem('appointments', JSON.stringify(apps));
    closeModal('modalEdit');
    renderApps();
  });
});