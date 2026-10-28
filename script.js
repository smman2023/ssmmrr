//=========================================
// Google Sheets APIs
//=========================================

const API_URL = "https://script.google.com/macros/s/AKfycbwDZEsbQIQqUz-YJ8CcXW4YVfPD95l4z8Ou6kuAIojDlQBUsHVwWhUtSmc1jZR2CY-fyQ/exec";
const ATTENDANCE_API = "https://script.google.com/macros/s/AKfycbzd0as48EDKd4k9y2IMggJzTc9QGhMuUysa0X4R1Q6plhtGtFlnfMBbXnyZamZfFPN1/exec";
const HOMEWORK_API = "https://script.google.com/macros/s/AKfycbyGgMFmNMPR6OAWNBemEoTF_jFs1u2AXaWJXFOeA6iVuOlgeJau1DuAutH89h9oP_hC-g/exec";
const EXAM_API = "https://script.google.com/macros/s/AKfycbyrSNWCMtLaFZepp3OlxuLip2Pe02X2bndnkbqJE_2DszwwPPKsSnP1wsSlv7pqjvi8fA/exec";
const PAYMENT_API = "https://script.google.com/macros/s/AKfycbwBxrvavrzIp_9tKKIk63OUYLhk30WkT_zU3JWFk7Km11Dmh8gB_ycqgoND_4Z-JwdX/exec";
const NOTICE_API = "https://script.google.com/macros/s/AKfycbwl6OSRp_KCjrIuEjGDtg3FsXarWwZ6xvVFto_tzzUFl6lX7sWVXdK0OLhg7oKenWw-/exec";
const VIDEO_API = "https://script.google.com/macros/s/AKfycbwMiDzkcJDVuEHGBRxco2-Mvecf3BvJNVRYhH8WM7uuekDReL9VcPOD4rsdEBy3DU9s/exec";

let currentStudent = null;

let cacheData = {
    attendance: null,
    homework: null,
    exam: null,
    payment: null,
    notice: null,
    video: null
};

// العناصر الأساسية
const codeInput = document.getElementById("codeInput");
const passwordInput = document.getElementById("passwordInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const notFound = document.getElementById("notFound");
const rememberMeInput = document.getElementById("rememberMe");
const logoutBtn = document.getElementById("logoutBtn");

// أزرار الكروت
const attendanceBtn = document.getElementById("attendanceBtn");
const homeworkBtn = document.getElementById("homeworkBtn");
const examBtn = document.getElementById("examBtn");
const paymentBtn = document.getElementById("paymentBtn");
const noticeBtn = document.getElementById("noticeBtn");
const videoBtn = document.getElementById("videoBtn");

// الكروت (مع تحديث بطاقة Videoss)
const attendanceCard = document.getElementById("attendanceCard");
const homeworkCard = document.getElementById("homeworkCard");
const examCard = document.getElementById("examCard");
const paymentCard = document.getElementById("paymentCard");
const noticeCard = document.getElementById("noticeCard");
const VideossCard = document.getElementById("VideossCard");

// محتوى الكروت (مع تحديث محتوى VideossContent)
const attendanceContent = document.getElementById("attendanceContent");
const homeworkContent = document.getElementById("homeworkContent");
const examContent = document.getElementById("examContent");
const paymentContent = document.getElementById("paymentContent");
const noticeContent = document.getElementById("noticeContent");
const VideossContent = document.getElementById("VideossContent");

// أزرار العودة (مع تحديث زر العودة لـ Videoss)
const backBtn = document.getElementById("backBtn");
const backHomeworkBtn = document.getElementById("backHomeworkBtn");
const backExamBtn = document.getElementById("backExamBtn");
const backPaymentBtn = document.getElementById("backPaymentBtn");
const backNoticeBtn = document.getElementById("backNoticeBtn");
const backVideossBtn = document.getElementById("backVideossBtn");

// التحقق من وجود تسجيل دخول مخزن مسبقاً
window.addEventListener("DOMContentLoaded", () => {
    const savedCode = localStorage.getItem("studentCode");
    const savedPhone = localStorage.getItem("studentPhone");

    if (savedCode && savedPhone && codeInput && passwordInput) {
        codeInput.value = savedCode;
        passwordInput.value = savedPhone;
        searchStudent();
    }
});

// الأحداث (Event Listeners)
if (searchBtn) searchBtn.addEventListener("click", searchStudent);
if (codeInput) codeInput.addEventListener("keypress", function(e){ if(e.key === "Enter"){ searchStudent(); } });
if (passwordInput) passwordInput.addEventListener("keypress", function(e){ if(e.key === "Enter"){ searchStudent(); } });

if (attendanceBtn) attendanceBtn.addEventListener("click", showAttendance);
if (homeworkBtn) homeworkBtn.addEventListener("click", showHomework);
if (examBtn) examBtn.addEventListener("click", showExam);
if (paymentBtn) paymentBtn.addEventListener("click", showPayments);
if (noticeBtn) noticeBtn.addEventListener("click", showNotices);
if (videoBtn) videoBtn.addEventListener("click", showVideoss);

function goBackToResult() {
    if(attendanceCard) attendanceCard.classList.add("hidden");
    if(homeworkCard) homeworkCard.classList.add("hidden");
    if(examCard) examCard.classList.add("hidden");
    if(paymentCard) paymentCard.classList.add("hidden");
    if(noticeCard) noticeCard.classList.add("hidden");
    if(VideossCard) VideossCard.classList.add("hidden");
    if(result) result.classList.remove("hidden");
}

if(backBtn) backBtn.addEventListener("click", goBackToResult);
if(backHomeworkBtn) backHomeworkBtn.addEventListener("click", goBackToResult);
if(backExamBtn) backExamBtn.addEventListener("click", goBackToResult);
if(backPaymentBtn) backPaymentBtn.addEventListener("click", goBackToResult);
if(backNoticeBtn) backNoticeBtn.addEventListener("click", goBackToResult);
if(backVideossBtn) backVideossBtn.addEventListener("click", goBackToResult);

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("studentCode");
        localStorage.removeItem("studentPhone");
        cacheData = { attendance: null, homework: null, exam: null, payment: null, notice: null, video: null };
        if(codeInput) codeInput.value = "";
        if(passwordInput) passwordInput.value = "";
        if(result) result.classList.add("hidden");
        currentStudent = null;
        alert("تم تسجيل الخروج بنجاح");
    });
}

function displayStudent(student){
    currentStudent = student;

    if(result) result.classList.remove("hidden");
    if(notFound) notFound.classList.add("hidden");

    if(attendanceCard) attendanceCard.classList.add("hidden");
    if(homeworkCard) homeworkCard.classList.add("hidden");
    if(examCard) examCard.classList.add("hidden");
    if(paymentCard) paymentCard.classList.add("hidden");
    if(noticeCard) noticeCard.classList.add("hidden");
    if(VideossCard) VideossCard.classList.add("hidden");

    if(attendanceBtn) attendanceBtn.classList.remove("hidden");
    if(homeworkBtn) homeworkBtn.classList.remove("hidden");
    if(examBtn) examBtn.classList.remove("hidden");
    if(paymentBtn) paymentBtn.classList.remove("hidden");
    if(noticeBtn) noticeBtn.classList.remove("hidden");
    if(videoBtn) videoBtn.classList.remove("hidden");

    if(document.getElementById("studentCode")) document.getElementById("studentCode").textContent = student.code || "0";
    if(document.getElementById("studentName")) document.getElementById("studentName").textContent = student.name || "0";
    if(document.getElementById("studentGrade")) document.getElementById("studentGrade").textContent = student.grade || "0";
    if(document.getElementById("studentGroup")) document.getElementById("studentGroup").textContent = student.group || "0";
    if(document.getElementById("studentWhatsapp")) document.getElementById("studentWhatsapp").textContent = student.studentWhatsapp || "0";
    if(document.getElementById("parentWhatsapp")) document.getElementById("parentWhatsapp").textContent = student.parentWhatsapp || "0";

    preloadAllData(student.code);
}

// دالة الاستعلام عن الطالب
async function searchStudent() {
    function normalize(str) {
        if (!str) return "";
        return String(str)
            .replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 1632)
            .replace(/[\u06F0-\u06F9]/g, d => d.charCodeAt(0) - 1776)
            .replace(/\D/g, "");
    }

    const rawCode = codeInput ? codeInput.value.trim() : "";
    const rawPhone = passwordInput ? passwordInput.value.trim() : "";

    const code = normalize(rawCode);
    const phoneInput = normalize(rawPhone);

    if (code === "" || phoneInput === "") {
        alert("برجاء إدخال كود الطالب ورقم الواتساب");
        return;
    }

    if (result) result.classList.add("hidden");
    if (notFound) notFound.classList.add("hidden");

    if (searchBtn) {
        searchBtn.disabled = true;
        searchBtn.innerHTML = "جاري التحقق...";
    }

    try {
        const response = await fetch(`${API_URL}?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phoneInput)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const student = await response.json();

        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.innerHTML = "استعلام";
        }

        if (!student || student.error || !student.code) {
            if (notFound) {
                notFound.innerHTML = `<i class="fa-solid fa-circle-xmark"></i><br><br><strong>كود الطالب أو رقم الواتساب غير صحيح</strong>`;
                notFound.classList.remove("hidden");
            }
            return;
        }

        if (rememberMeInput && rememberMeInput.checked) {
            localStorage.setItem("studentCode", rawCode);
            localStorage.setItem("studentPhone", rawPhone);
        } else {
            localStorage.removeItem("studentCode");
            localStorage.removeItem("studentPhone");
        }

        displayStudent(student);

    } catch (error) {
        console.error("Error searching student:", error);
        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.innerHTML = "استعلام";
        }
        alert("حدث خطأ في الاتصال، برجاء المحاولة مرة أخرى.");
    }
}

// تحميل البيانات بذكاء
async function preloadAllData(code) {
    cacheData = { attendance: null, homework: null, exam: null, payment: null, notice: null, video: null };
    
    try {
        const attResponse = await fetch(`${ATTENDANCE_API}?code=${encodeURIComponent(code)}`);
        cacheData.attendance = await attResponse.json();
    } catch (e) {
        cacheData.attendance = [];
    }

    setTimeout(async () => {
        const fetchSafe = (url) => fetch(`${url}?code=${encodeURIComponent(code)}`).then(res => res.json()).catch(() => []);

        cacheData.homework = await fetchSafe(HOMEWORK_API);
        cacheData.exam = await fetchSafe(EXAM_API);
        cacheData.payment = await fetchSafe(PAYMENT_API);
        cacheData.notice = await fetchSafe(NOTICE_API);
        cacheData.video = await fetchSafe(VIDEO_API);
    }, 600);
}

function getLoadingHTML() {
    return `
        <div style="text-align:center; padding: 30px 20px;">
            <p style="font-size: 20px; font-weight: bold; color: #0d47a1; margin-bottom: 15px;">جاري التحميل...</p>
            <div style="width: 100%; background: #e0e0e0; border-radius: 15px; overflow: hidden; height: 22px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);">
                <div id="progressBar" style="width: 0%; height: 100%; background: linear-gradient(135deg, #0d47a1, #1976d2); border-radius: 15px; transition: width 0.4s ease-in-out;"></div>
            </div>
            <p id="progressText" style="font-size: 16px; font-weight: bold; color: #555; margin-top: 10px;">0%</p>
        </div>
    `;
}

async function renderFast(apiUrl, cardElement, contentElement, mappingFn, cacheKey) {
    if(result) result.classList.add("hidden");
    if(attendanceCard) attendanceCard.classList.add("hidden");
    if(homeworkCard) homeworkCard.classList.add("hidden");
    if(examCard) examCard.classList.add("hidden");
    if(paymentCard) paymentCard.classList.add("hidden");
    if(noticeCard) noticeCard.classList.add("hidden");
    if(VideossCard) VideossCard.classList.add("hidden");

    cardElement.classList.remove("hidden");

    if (cacheData[cacheKey] !== null) {
        processRender(cacheData[cacheKey], contentElement, mappingFn);
        return;
    }

    contentElement.innerHTML = getLoadingHTML();
    
    let progress = 10;
    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");
    
    const interval = setInterval(() => {
        if (progress < 85) {
            progress += Math.floor(Math.random() * 15) + 5;
            if(bar) bar.style.width = progress + "%";
            if(text) text.textContent = progress + "%";
        }
    }, 150);

    try {
        const response = await fetch(`${apiUrl}?code=${encodeURIComponent(currentStudent.code)}`);
        const data = await response.json();
        cacheData[cacheKey] = data;
        
        clearInterval(interval);
        if(bar) bar.style.width = "100%";
        if(text) text.textContent = "100%";
        
        setTimeout(() => {
            processRender(data, contentElement, mappingFn);
        }, 300);

    } catch (e) {
        clearInterval(interval);
        contentElement.innerHTML = "<h3 style='text-align:center;'>حدث خطأ أثناء تحميل البيانات</h3>";
    }
}

function processRender(data, contentElement, mappingFn) {
    if (!data || data.length === 0) {
        contentElement.innerHTML = "<h3 style='text-align:center;'>لا توجد بيانات متاحة</h3>";
        return;
    }
    let html = "";
    if (window.innerWidth <= 768) {
        data.forEach(item => { html += mappingFn(item, true); });
    } else {
        html = mappingFn(data, false);
    }
    contentElement.innerHTML = html;
}

// عرض الحضور
function showAttendance() {
    renderFast(ATTENDANCE_API, attendanceCard, attendanceContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card"><div class="card-item"><span>📘 الحصة</span><strong>${item.lesson || '0'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '0'}</strong></div><div class="card-item"><span>✅ الحالة</span><strong>${item.status || '0'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الحصة</th><th>التاريخ</th><th>الحالة</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.lesson || '0'}</td><td>${row.date || '0'}</td><td>${row.status || '0'}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'attendance');
}

// عرض الواجبات
function showHomework() {
    renderFast(HOMEWORK_API, homeworkCard, homeworkContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card homework-card"><div class="card-item"><span>📚 رقم الواجب</span><strong>${item.homework || '0'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '0'}</strong></div><div class="card-item"><span>🎯 درجة الطالب</span><strong>${item.grade || '0'}</strong></div><div class="card-item"><span>🏆 الدرجة النهائية</span><strong>${item.total || '0'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>رقم الواجب</th><th>التاريخ</th><th>درجة الطالب</th><th>الدرجة النهائية</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.homework || '0'}</td><td>${row.date || '0'}</td><td>${row.grade || '0'}</td><td>${row.total || '0'}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'homework');
}

// عرض الامتحانات
function showExam() {
    renderFast(EXAM_API, examCard, examContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card exam-card"><div class="card-item"><span>📝 رقم الامتحان</span><strong>${item.exam || '0'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '0'}</strong></div><div class="card-item"><span>🎯 درجة الطالب</span><strong>${item.grade || '0'}</strong></div><div class="card-item"><span>🏆 الدرجة النهائية</span><strong>${item.total || '0'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الامتحان</th><th>التاريخ</th><th>درجة الطالب</th><th>الدرجة النهائية</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.exam || '0'}</td><td>${row.date || '0'}</td><td>${row.grade || '0'}</td><td>${row.total || '0'}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'exam');
}

// عرض المدفوعات
function showPayments() {
    renderFast(PAYMENT_API, paymentCard, paymentContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card payment-card"><div class="card-item"><span>📅 الشهر</span><strong>${item.month || '0'}</strong></div><div class="card-item"><span>💵 المدفوع</span><strong>${item.paid || '0'}</strong></div><div class="card-item"><span>❗ المتبقى</span><strong>${item.remaining || '0'}</strong></div><div class="card-item"><span>💰 إجمالى المستحق</span><strong>${item.total || '0'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الشهر</th><th>المدفوع</th><th>المتبقى</th><th>إجمالى المستحق</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.month || '0'}</td><td>${row.paid || '0'}</td><td>${row.remaining || '0'}</td><td>${row.total || '0'}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'payment');
}

// عرض الملاحظات والتنبيهات
function showNotices() {
    renderFast(NOTICE_API, noticeCard, noticeContent, (item, isMobile) => {
        if (isMobile) {
            const imgUrl = item.image || item.imageUrl || item.photo || "";
            const imgHtmlMobile = imgUrl ? `<div class="notice-img-container"><a href="${imgUrl}" target="_blank"><img src="${imgUrl}" alt="صورة التنبيه" class="notice-img" style="max-width:100%; height:auto; border-radius:10px; margin-top:10px;"></a></div>` : "";
            return `<div class="attendance-mobile-card notice-card"><div class="card-item"><span>📘 الحصة</span><strong>${item.lesson || '0'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '0'}</strong></div><div style="margin-top:15px;line-height:2"><span style="color:#d32f2f;font-weight:bold">🔔 التنبيه</span><br>${item.notice || '0'}</div>${imgHtmlMobile}</div>`;
        }

        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الحصة</th><th>التاريخ</th><th>التنبيه أو الملاحظة</th><th>الصورة المرفقةة</th></tr>`;
        item.forEach(row => {
            const rowImgUrl = row.image || row.imageUrl || row.photo || "";
            const imgHtmlDesktop = rowImgUrl ? `<a href="${rowImgUrl}" target="_blank"><img src="${rowImgUrl}" alt="صورة" style="width:150px; max-height:120px; border-radius:8px; object-fit:cover; box-shadow:0 3px 10px rgba(0,0,0,0.15);"></a>` : "0";
            table += `<tr><td>${row.lesson || '0'}</td><td>${row.date || '0'}</td><td>${row.notice || '0'}</td><td>${imgHtmlDesktop}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'notice');
}

// عرض الفيديوهات التعليمية (Videoss)
function showVideoss() {
    if(result) result.classList.add("hidden");
    if(attendanceCard) attendanceCard.classList.add("hidden");
    if(homeworkCard) homeworkCard.classList.add("hidden");
    if(examCard) examCard.classList.add("hidden");
    if(paymentCard) paymentCard.classList.add("hidden");
    if(noticeCard) noticeCard.classList.add("hidden");
    
    if(VideossCard) VideossCard.classList.remove("hidden");

    // جلب الفيديوهات مباشرة من بيانات الطالب المخزنة عند تسجيل الدخول
    const videos = currentStudent && currentStudent.videos ? currentStudent.videos : [];

    if (!videos || videos.length === 0) {
        VideossContent.innerHTML = "<h3 style='text-align:center; padding: 20px; color: #555;'>لا توجد فيديوهات تعليمية متاحـة لهذا الصف حالياً</h3>";
        return;
    }

    let html = "";
    videos.forEach(item => {
        const unitName = item.unit ? `(${item.unit})` : '';
        const lessonName = item.lesson ? ` - ${item.lesson}` : '';
        const videoTitle = item.title || 'فيديو تعليمي';
        const videoLink = item.video || '#';

        html += `
            <div class="video-item-card" style="background:#f7f9fc; padding:20px; border-radius:15px; margin-bottom:15px; box-shadow:0 3px 10px rgba(0,0,0,0.08); text-align:center;">
                <span style="display:block; color:#666; font-size:14px; margin-bottom:5px; font-weight:bold;">${unitName} ${lessonName}</span>
                <h3 style="color:#0d47a1; margin-bottom:12px; font-size:20px;">${videoTitle}</h3>
                <a href="${videoLink}" target="_blank" rel="noopener noreferrer" class="watch-video-btn" style="display:inline-block; background:linear-gradient(135deg,#0d47a1,#1976d2); color:#fff; padding:12px 25px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:18px;">
                    <i class="fa-solid fa-play"></i> مشاهدة الفيديو
                </a>
            </div>
        `;
    });

    VideossContent.innerHTML = html;
}