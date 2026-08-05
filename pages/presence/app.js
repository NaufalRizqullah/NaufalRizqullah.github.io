// =================================================================
// KONFIGURASI
// =================================================================
const API_BASE_URL = 'https://backend-portofolio.opalcool8.workers.dev/api/absensi';

// Variabel Global
let calendar;
let currentUserData = { lookupUsername: null, nama: null, level: null };
let monthlyAbsenData = []; // Menyimpan data mentah dari API


// =================================================================
// INITIALIZE CALENDAR & EVENTS
// =================================================================
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    // Deteksi awal ukuran layar
    var initialMobileView = window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth';

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: initialMobileView,
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'today'
        },
        eventDisplay: 'dot',

        // Fetch data saat bulan berubah (tombol prev/next diklik)
        datesSet: function () {
            if (currentUserData.lookupUsername) fetchData();
        },

        // Responsive Logic: Ganti view saat layar di-resize
        windowResize: function (arg) {
            if (window.innerWidth < 768) {
                calendar.changeView('listMonth');
            } else {
                calendar.changeView('dayGridMonth');
            }
        },

        // Logic saat tanggal diklik (Hanya jalan di Desktop/Grid View)
        dateClick: function (info) {
            openModalWithDate(info.dateStr);
        }
    });

    calendar.render();

    // Listener: Jika tanggal di dalam Modal diganti manual oleh user
    document.getElementById('modalDateInput').addEventListener('change', function (e) {
        const selectedDate = e.target.value;
        const absenForDate = monthlyAbsenData.find(item => item.tanggal === selectedDate);
        displayExistingAbsen(absenForDate);
    });
});


// =================================================================
// LOGIC TAMPILAN (UI) & MODAL
// =================================================================

// Fungsi 1: Dipanggil Tombol "Absen / Tambah Data"
function openModalManual() {
    const today = new Date().toISOString().split('T')[0]; // Ambil YYYY-MM-DD hari ini
    openModalWithDate(today);
}

// Fungsi 2: Helper Membuka Modal & Set Data
function openModalWithDate(dateStr) {
    // Set nilai input tanggal
    document.getElementById('modalDateInput').value = dateStr;

    // Cari data absen di memory untuk tanggal tersebut
    const absenForDate = monthlyAbsenData.find(item => item.tanggal === dateStr);

    // Tampilkan data existing (jika ada)
    displayExistingAbsen(absenForDate);

    // Tampilkan Modal
    document.getElementById('absenModal').classList.add('show');
}

function displayExistingAbsen(absenData) {
    const container = document.getElementById('existingAbsenInfo');
    let content = '<h4 class="font-bold text-slate-700 mb-2">Data Tercatat:</h4>';

    if (!absenData) {
        content += '<p class="empty-data">Belum ada data absen masuk.</p>';
    } else {
        content += '<ul>';
        content += `<li><span>Masuk</span> <span class="time">${formatTime(absenData.mulai)}</span></li>`;
        content += `<li><span>Isoma Keluar</span> <span class="time">${formatTime(absenData.istirahat_mulai)}</span></li>`;
        content += `<li><span>Isoma Masuk</span> <span class="time">${formatTime(absenData.istirahat_selesai)}</span></li>`;
        content += `<li><span>Pulang</span> <span class="time">${formatTime(absenData.selesai)}</span></li>`;
        content += '</ul>';
    }
    container.innerHTML = content;
}

function formatTime(timeStr) {
    if (!timeStr || timeStr === '00:00:00') return '-';
    return timeStr;
}

function closeModal() {
    document.getElementById('absenModal').classList.remove('show');
}


// =================================================================
// LOGIC API FETCH DATA
// =================================================================

async function searchUser() {
    const usernameInput = document.getElementById('username').value;
    if (!usernameInput) return;

    currentUserData.lookupUsername = usernameInput;
    await fetchData();
}

async function fetchData() {
    if (!currentUserData.lookupUsername) return;

    // Ambil tahun dan bulan dari view kalender saat ini
    const currentDate = calendar.view.currentStart;
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    const url = `${API_BASE_URL}?tahun=${year}&bulan=${month}&kode=${currentUserData.lookupUsername}`;

    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const absensiList = await response.json();

        // Simpan ke variabel global
        monthlyAbsenData = absensiList;

        // Update Info User
        updateUserInfo(absensiList);

        // Render Events ke Kalender
        calendar.removeAllEvents();
        const events = [];

        absensiList.forEach(item => {
            if (item.mulai && item.mulai !== '00:00:00')
                events.push({ title: 'Masuk: ' + item.mulai, date: item.tanggal, color: '#16a34a' });

            if (item.istirahat_mulai && item.istirahat_mulai !== '00:00:00')
                events.push({ title: 'Isoma Out: ' + item.istirahat_mulai, date: item.tanggal, color: '#ca8a04' });

            if (item.istirahat_selesai && item.istirahat_selesai !== '00:00:00')
                events.push({ title: 'Isoma In: ' + item.istirahat_selesai, date: item.tanggal, color: '#2563eb' });

            if (item.selesai && item.selesai !== '00:00:00')
                events.push({ title: 'Pulang: ' + item.selesai, date: item.tanggal, color: '#dc2626' });
        });

        calendar.addEventSource(events);

    } catch (error) {
        alert(`Gagal mengambil data: ${error.message}`);
        console.error(error);
    }
}

function updateUserInfo(dataList) {
    const infoDiv = document.getElementById('userInfo');
    if (dataList.length > 0) {
        currentUserData.nama = dataList[0]._nama;
        currentUserData.level = dataList[0].level;

        document.getElementById('namaStaff').innerText = currentUserData.nama;
        document.getElementById('usernameStaff').innerText = currentUserData.lookupUsername;
        document.getElementById('instansiStaff').innerText = currentUserData.level;
    } else {
        document.getElementById('namaStaff').innerText = 'Data Bulan Ini Kosong';
        document.getElementById('usernameStaff').innerText = currentUserData.lookupUsername;
        document.getElementById('instansiStaff').innerText = '-';
    }
    infoDiv.style.display = 'block';
}


// =================================================================
// LOGIC INPUT ABSEN MANUAL (SUBMIT)
// =================================================================

async function submitManualAbsen(event) {
    event.preventDefault();

    // 1. Ambil Tanggal dari Input (Bukan Variabel Global Lagi)
    const dateValue = document.getElementById('modalDateInput').value;
    if (!dateValue) {
        alert("Harap pilih tanggal terlebih dahulu.");
        return;
    }

    const absenType = document.getElementById('absenType').value;
    const randomTime = generateRandomTime(absenType);

    // 2. Mapping Field API
    let apiField = absenType;
    if (absenType === 'mulai_dosen') {
        apiField = 'mulai';
    }

    const formData = new FormData();
    formData.append('kode', currentUserData.lookupUsername);
    formData.append('level', currentUserData.level || 'Staf');
    formData.append('tanggal', dateValue); // Gunakan tanggal dari input
    formData.append('status', '1');
    formData.append(apiField, randomTime);

    try {
        const response = await fetch(`${API_BASE_URL}/insert`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === true || result.status === "true") {
            alert(`SUKSES!\nAbsen tipe "${apiField}" berhasil disimpan pada jam ${randomTime}`);
            closeModal();
            fetchData(); // Refresh data kalender agar update
        } else {
            throw new Error(result.message || 'Gagal menyimpan data absen.');
        }

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function generateRandomTime(type) {
    let hour, startMinute, range;

    switch (type) {
        case 'mulai':
            hour = '07'; startMinute = 1; range = 15; break;
        case 'istirahat_mulai':
            hour = '12'; startMinute = 0; range = 15; break;
        case 'istirahat_selesai':
            hour = '13'; startMinute = 0; range = 15; break;
        case 'selesai':
            hour = '16'; startMinute = 0; range = 30; break;

        case 'mulai_dosen':
            // Logic khusus Dosen: Acak jam antara 08 - 12
            const randomHour = String(Math.floor(Math.random() * 5) + 8).padStart(2, '0');
            const randomMinute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
            const randomSecond = String(Math.floor(Math.random() * 60)).padStart(2, '0');
            return `${randomHour}:${randomMinute}:${randomSecond}`;

        default:
            hour = '08'; startMinute = 0; range = 1;
    }

    const minute = String(Math.floor(Math.random() * range) + startMinute).padStart(2, '0');
    const second = String(Math.floor(Math.random() * 60)).padStart(2, '0');

    return `${hour}:${minute}:${second}`;
}

// =================================================================
// LOGIC INPUT GENERATE PULANG OTOMATIS
// =================================================================

async function submitPulangOtomatis(event) {
    event.preventDefault();

    const dateValue = document.getElementById('modalDateInput').value;
    if (!dateValue) {
        alert("Harap pilih tanggal terlebih dahulu.");
        return;
    }

    // Cari absen untuk tanggal ini
    const absenForDate = monthlyAbsenData.find(item => item.tanggal === dateValue);
    if (!absenForDate || !absenForDate.mulai || absenForDate.mulai === '00:00:00') {
        alert("Jam Masuk belum tercatat pada tanggal ini. Tidak bisa generate waktu pulang otomatis.");
        return;
    }

    const lamaKerjaValue = parseFloat(document.getElementById('lamaKerja').value);

    // Parse waktu mulai
    const [jamMulai, menitMulai, detikMulai] = absenForDate.mulai.split(':').map(Number);

    // Tambah lama kerja (jam ke menit) + 1 jam istirahat (60 menit)
    let baseMenit = (jamMulai * 60) + menitMulai + (lamaKerjaValue * 60) + 60;

    // Pastikan waktu pulang minimal adalah jam 16:00 (16 * 60 = 960 menit)
    if (baseMenit < 960) {
        baseMenit = 960;
    }

    // Tambah random 1-30 menit
    const randomMinimumMenit = 1;
    const randomMaksimalMenit = 30;
    const randomMenitTambahan = Math.floor(Math.random() * (randomMaksimalMenit - randomMinimumMenit + 1)) + randomMinimumMenit;
    const totalMenit = baseMenit + randomMenitTambahan;

    const jamPulang = Math.floor(totalMenit / 60);
    const menitPulang = Math.floor(totalMenit % 60);
    const detikPulang = Math.floor(Math.random() * 60); // detik acak 0-59

    const timePulangFormat = `${String(jamPulang).padStart(2, '0')}:${String(menitPulang).padStart(2, '0')}:${String(detikPulang).padStart(2, '0')}`;

    const formData = new FormData();
    formData.append('kode', currentUserData.lookupUsername);
    formData.append('level', currentUserData.level || 'Staf');
    formData.append('tanggal', dateValue);
    formData.append('status', '1');
    formData.append('selesai', timePulangFormat);

    try {
        const response = await fetch(`${API_BASE_URL}/insert`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === true || result.status === "true") {
            alert(`SUKSES!\nAbsen Pulang otomatis berhasil disimpan pada jam ${timePulangFormat}`);
            closeModal();
            fetchData();
        } else {
            throw new Error(result.message || 'Gagal menyimpan data absen.');
        }

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
