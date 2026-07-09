//==================================================
// أكاديمية مستر السمان
// نظام حجز الدروس
//==================================================

const BOOKING_SHEET = "الحجوزات";
const GROUPS_SHEET = "المجموعات";

//==================================================

function doGet() {

  return HtmlService
    .createTemplateFromFile("index")
    .evaluate()
    .setTitle("حجز الدروس")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}

//==================================================

function include(file){

  return HtmlService
    .createHtmlOutputFromFile(file)
    .getContent();

}

//==================================================
// تحميل بيانات المراحل والصفوف والمواعيد
//==================================================

function getBookingData(){

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sh = ss.getSheetByName(GROUPS_SHEET);

  const values = sh.getDataRange().getValues();

  let stages = [];

  let grades = {};

  let groups = {};

  for(let i=1;i<values.length;i++){

    const stage = String(values[i][0]).trim();

    const grade = String(values[i][1]).trim();

    const group = String(values[i][2]).trim();

    if(stage=="" || grade=="" || group=="") continue;

    //==========================
    // المراحل
    //==========================

    if(!stages.includes(stage)){

      stages.push(stage);

    }

    //==========================
    // الصفوف
    //==========================

    if(!grades[stage]){

      grades[stage]=[];

    }

    if(!grades[stage].includes(grade)){

      grades[stage].push(grade);

    }

    //==========================
    // المجموعات
    //==========================

    if(!groups[grade]){

      groups[grade]=[];

    }

    groups[grade].push(group);

  }

  return{

    stages:stages,

    grades:grades,

    groups:groups

  };

}
//==================================================
// حفظ الحجز
//==================================================

function saveBooking(data){

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sh = ss.getSheetByName(BOOKING_SHEET);

  const rows = sh.getDataRange().getValues();

  //=========================
  // التحقق من البيانات
  //=========================

  if(data.name=="")
    return result(false,"اكتب اسم الطالب");

  if(data.stage=="")
    return result(false,"اختر المرحلة");

  if(data.grade=="")
    return result(false,"اختر الصف");

  if(data.education=="")
    return result(false,"اختر نوعية التعليم");

  if(data.gender=="")
    return result(false,"اختر النوع");

  if(data.group=="")
    return result(false,"اختر الموعد");

  //=========================
  // التحقق من الأرقام
  //=========================

  if(!/^01\d{9}$/.test(data.studentPhone))
    return result(false,"رقم واتساب الطالب غير صحيح");

  if(!/^01\d{9}$/.test(data.parentPhone))
    return result(false,"رقم واتساب ولي الأمر غير صحيح");

  //=========================
  // منع التكرار
  //=========================

  for(let i=1;i<rows.length;i++){

    if(String(rows[i][7]).trim()==String(data.studentPhone).trim()){

      return result(false,"تم الحجز بهذا الرقم من قبل");

    }

  }

  //=========================
  // الحفظ
  //=========================

  sh.appendRow([

    new Date(),

    data.name,

    data.stage,

    data.grade,

    data.education,

    data.gender,

    data.group,

    data.studentPhone,

    data.parentPhone,

    "جديد"

  ]);

  return result(true,"تم الحجز بنجاح");

}

//==================================================

function result(status,message){

  return{

    success:status,

    message:message

  };

}