const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const User = require('../models/User');
const AcademicYear = require('../models/AcademicYear');
const ClassRoom = require('../models/ClassRoom');
const Subject = require('../models/Subject');
const StudentProfile = require('../models/StudentProfile');
const TeacherProfile = require('../models/TeacherProfile');
const MarkRecord = require('../models/MarkRecord');
const ReportCard = require('../models/ReportCard');
const Announcement = require('../models/Announcement');
const Attendance = require('../models/Attendance');
const LessonPlan = require('../models/LessonPlan');
const TimeTable = require('../models/TimeTable');
const AssetItem = require('../models/AssetItem');
const { calculateClassRankings } = require('./rankingEngine');

dotenv.config();

const seedData = async () => {
  try {
    console.log('[Seeder]: Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seeder]: Connected. Clearing old data...');

    await Promise.all([
      User.deleteMany({}),
      AcademicYear.deleteMany({}),
      ClassRoom.deleteMany({}),
      Subject.deleteMany({}),
      StudentProfile.deleteMany({}),
      TeacherProfile.deleteMany({}),
      MarkRecord.deleteMany({}),
      ReportCard.deleteMany({}),
      Announcement.deleteMany({}),
      Attendance.deleteMany({}),
      LessonPlan.deleteMany({}),
      TimeTable.deleteMany({}),
      AssetItem.deleteMany({}),
    ]);

    console.log('[Seeder]: Creating Academic Year 2018 E.C. (2026)...');
    const academicYear = await AcademicYear.create({
      name: '2026/2018 E.C.',
      ethiopianYear: 2018,
      gregorianYear: 2026,
      isCurrent: true,
      semesters: [
        {
          name: 'Semester 1',
          nameAmharic: 'የመጀመሪያ ወሰነ-ትምህርት',
          isCurrent: true,
          isLocked: false,
        },
        {
          name: 'Semester 2',
          nameAmharic: 'የሁለተኛ ወሰነ-ትምህርት',
          isCurrent: false,
          isLocked: false,
        },
      ],
    });

    console.log('[Seeder]: Creating Ethiopian Primary Subjects (Grades 1-8)...');
    const subjectTemplates = [
      // Grade 7 Subjects
      { name: 'Mathematics', nameAmharic: 'ሒሳብ', code: 'MATH-07', gradeLevel: 7, category: 'Core' },
      { name: 'English Language', nameAmharic: 'እንግሊዝኛ ቋንቋ', code: 'ENG-07', gradeLevel: 7, category: 'Language' },
      { name: 'Amharic Language', nameAmharic: 'አማርኛ ቋንቋ', code: 'AMH-07', gradeLevel: 7, category: 'Language' },
      { name: 'General Science', nameAmharic: 'ጠቅላላ ሳይንስ', code: 'GSCI-07', gradeLevel: 7, category: 'Science' },
      { name: 'Social Studies', nameAmharic: 'ህብረተሰብ ጥናት', code: 'SOC-07', gradeLevel: 7, category: 'Social' },
      { name: 'Citizenship Education', nameAmharic: 'የዜግነት ትምህርት', code: 'CIT-07', gradeLevel: 7, category: 'Social' },
      { name: 'Performing & Visual Arts (PVA)', nameAmharic: 'ስነ-ጥበባት', code: 'PVA-07', gradeLevel: 7, category: 'Arts & Physical' },
      { name: 'Health & Physical Education (HPE)', nameAmharic: 'የሰውነት ማጎልመሻ', code: 'HPE-07', gradeLevel: 7, category: 'Arts & Physical' },
      { name: 'Information Technology (IT)', nameAmharic: 'ኢንፎርሜሽን ቴክኖሎጂ', code: 'IT-07', gradeLevel: 7, category: 'Technical' },
      { name: 'Career & Technical Education (CTE)', nameAmharic: 'ሙያና ቴክኒክ', code: 'CTE-07', gradeLevel: 7, category: 'Technical' },

      // Grade 8 Subjects
      { name: 'Mathematics', nameAmharic: 'ሒሳብ', code: 'MATH-08', gradeLevel: 8, category: 'Core' },
      { name: 'English Language', nameAmharic: 'እንግሊዝኛ ቋንቋ', code: 'ENG-08', gradeLevel: 8, category: 'Language' },
      { name: 'Amharic Language', nameAmharic: 'አማርኛ ቋንቋ', code: 'AMH-08', gradeLevel: 8, category: 'Language' },
      { name: 'General Science', nameAmharic: 'ጠቅላላ ሳይንስ', code: 'GSCI-08', gradeLevel: 8, category: 'Science' },
      { name: 'Social Studies', nameAmharic: 'ህብረተሰብ ጥናት', code: 'SOC-08', gradeLevel: 8, category: 'Social' },
      { name: 'Citizenship Education', nameAmharic: 'የዜግነት ትምህርት', code: 'CIT-08', gradeLevel: 8, category: 'Social' },
      { name: 'Performing & Visual Arts (PVA)', nameAmharic: 'ስነ-ጥበባት', code: 'PVA-08', gradeLevel: 8, category: 'Arts & Physical' },
      { name: 'Health & Physical Education (HPE)', nameAmharic: 'የሰውነት ማጎልመሻ', code: 'HPE-08', gradeLevel: 8, category: 'Arts & Physical' },
      { name: 'Information Technology (IT)', nameAmharic: 'ኢንፎርሜሽን ቴክኖሎጂ', code: 'IT-08', gradeLevel: 8, category: 'Technical' },
    ];

    const subjects = await Subject.insertMany(subjectTemplates);
    const grade7Subjects = subjects.filter((s) => s.gradeLevel === 7);

    console.log('[Seeder]: Creating Staff & Teachers...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'director@karadibayu.edu.et',
      password: 'admin123',
      role: 'admin',
      fullName: 'Alemayehu Tadesse',
    });

    const registrarUser = await User.create({
      username: 'registrar',
      email: 'registrar@karadibayu.edu.et',
      password: 'registrar123',
      role: 'registrar',
      fullName: 'Tigist Bekele',
    });

    const teacherUser1 = await User.create({
      username: 'teacher.abdisa',
      email: 'abdisa.awel@karadibayu.edu.et',
      password: 'teacher123',
      role: 'teacher',
      fullName: 'Abdisa Awel',
    });

    const teacherUser2 = await User.create({
      username: 'teacher.selam',
      email: 'selamawit.kebede@karadibayu.edu.et',
      password: 'teacher123',
      role: 'teacher',
      fullName: 'Selamawit Kebede',
    });

    const teacherUser3 = await User.create({
      username: 'teacher.tariku',
      email: 'tariku.mengistu@karadibayu.edu.et',
      password: 'teacher123',
      role: 'teacher',
      fullName: 'Tariku Mengistu',
    });

    console.log('[Seeder]: Creating Classrooms...');
    const classRoom7A = await ClassRoom.create({
      gradeLevel: 7,
      section: 'A',
      name: 'Grade 7 - Section A',
      academicYear: academicYear._id,
      homeRoomTeacher: teacherUser1._id,
      roomNumber: 'Block B - Room 102',
      capacity: 45,
    });

    const classRoom7B = await ClassRoom.create({
      gradeLevel: 7,
      section: 'B',
      name: 'Grade 7 - Section B',
      academicYear: academicYear._id,
      homeRoomTeacher: teacherUser2._id,
      roomNumber: 'Block B - Room 103',
      capacity: 45,
    });

    const classRoom8A = await ClassRoom.create({
      gradeLevel: 8,
      section: 'A',
      name: 'Grade 8 - Section A',
      academicYear: academicYear._id,
      homeRoomTeacher: teacherUser3._id,
      roomNumber: 'Block C - Room 201',
      capacity: 45,
    });

    const mathSubj = grade7Subjects.find((s) => s.code === 'MATH-07');
    const engSubj = grade7Subjects.find((s) => s.code === 'ENG-07');
    const sciSubj = grade7Subjects.find((s) => s.code === 'GSCI-07');
    const socSubj = grade7Subjects.find((s) => s.code === 'SOC-07');

    await TeacherProfile.create({
      user: teacherUser1._id,
      employeeIdNumber: 'KPS/T/001',
      firstName: 'Abdisa',
      lastName: 'Awel',
      gender: 'Male',
      phone: '+251911223344',
      email: 'abdisa.awel@karadibayu.edu.et',
      qualification: 'B.Ed in Mathematics Education',
      specialization: 'Mathematics & Natural Sciences',
      assignedClasses: [
        { classRoom: classRoom7A._id, subject: mathSubj._id },
        { classRoom: classRoom7B._id, subject: mathSubj._id },
      ],
    });

    await TeacherProfile.create({
      user: teacherUser2._id,
      employeeIdNumber: 'KPS/T/002',
      firstName: 'Selamawit',
      lastName: 'Kebede',
      gender: 'Female',
      phone: '+251922334455',
      email: 'selamawit.kebede@karadibayu.edu.et',
      qualification: 'BA in English Literature',
      specialization: 'English & Literature',
      assignedClasses: [{ classRoom: classRoom7A._id, subject: engSubj._id }],
    });

    console.log('[Seeder]: Creating Student Profiles & Ethiopian Naming Records...');
    const rawStudents = [
      { id: 'KPS/2026/001', fn: 'Dawit', mn: 'Bekele', ln: 'Haile', fnAm: 'ዳዊት', mnAm: 'በቀለ', lnAm: 'ኃይሌ', g: 'Male', roll: 1, pn: 'Bekele Haile', pp: '+251911000001' },
      { id: 'KPS/2026/002', fn: 'Bethelhem', mn: 'Yohannes', ln: 'Girma', fnAm: 'ቤተልሔም', mnAm: 'ዮሐንስ', lnAm: 'ግርማ', g: 'Female', roll: 2, pn: 'Yohannes Girma', pp: '+251911000002' },
      { id: 'KPS/2026/003', fn: 'Robel', mn: 'Tesfaye', ln: 'Abebe', fnAm: 'ሮቤል', mnAm: 'ተስፋዬ', lnAm: 'አበበ', g: 'Male', roll: 3, pn: 'Tesfaye Abebe', pp: '+251911000003' },
      { id: 'KPS/2026/004', fn: 'Mahlet', mn: 'Solomon', ln: 'Worku', fnAm: 'ማህሌት', mnAm: 'ሰለሞን', lnAm: 'ወርቁ', g: 'Female', roll: 4, pn: 'Solomon Worku', pp: '+251911000004' },
      { id: 'KPS/2026/005', fn: 'Biniyam', mn: 'Tilahun', ln: 'Kassahun', fnAm: 'ቢኒያም', mnAm: 'ጥላሁን', lnAm: 'ካሳሁን', g: 'Male', roll: 5, pn: 'Tilahun Kassahun', pp: '+251911000005' },
      { id: 'KPS/2026/006', fn: 'Hawi', mn: 'Gemeda', ln: 'Feyisa', fnAm: 'ሀዊ', mnAm: 'ገመዳ', lnAm: 'ፈይሳ', g: 'Female', roll: 6, pn: 'Gemeda Feyisa', pp: '+251911000006' },
      { id: 'KPS/2026/007', fn: 'Natnael', mn: 'Assefa', ln: 'Mersha', fnAm: 'ናትናኤል', mnAm: 'አሰፋ', lnAm: 'መርሻ', g: 'Male', roll: 7, pn: 'Assefa Mersha', pp: '+251911000007' },
      { id: 'KPS/2026/008', fn: 'Tsion', mn: 'Berhanu', ln: 'Dagne', fnAm: 'ጽዮን', mnAm: 'ብርሃኑ', lnAm: 'ዳኘው', g: 'Female', roll: 8, pn: 'Berhanu Dagne', pp: '+251911000008' },
      { id: 'KPS/2026/009', fn: 'Yared', mn: 'Fikru', ln: 'Tefera', fnAm: 'ያሬድ', mnAm: 'ፍቅሩ', lnAm: 'ተፈራ', g: 'Male', roll: 9, pn: 'Fikru Tefera', pp: '+251911000009' },
      { id: 'KPS/2026/010', fn: 'Fikirte', mn: 'Demissie', ln: 'Zewde', fnAm: 'ፍቅርተ', mnAm: 'ደሚሴ', lnAm: 'ዘውዴ', g: 'Female', roll: 10, pn: 'Demissie Zewde', pp: '+251911000010' },
    ];

    const studentProfiles = [];
    for (const item of rawStudents) {
      const username = item.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const user = await User.create({
        username,
        email: `${username}@student.karadibayu.edu.et`,
        password: 'kps123456',
        role: 'student',
        fullName: `${item.fn} ${item.mn} ${item.ln}`,
      });

      const profile = await StudentProfile.create({
        user: user._id,
        studentIdNumber: item.id,
        firstName: item.fn,
        middleName: item.mn,
        lastName: item.ln,
        firstNameAmharic: item.fnAm,
        middleNameAmharic: item.mnAm,
        lastNameAmharic: item.lnAm,
        gender: item.g,
        currentClass: classRoom7A._id,
        rollNumber: item.roll,
        parentName: item.pn,
        parentPhone: item.pp,
        dateOfBirth: new Date(2013, 3, 12),
        address: { city: 'Karadibayu', kebele: '01' },
      });
      studentProfiles.push(profile);
    }

    console.log('[Seeder]: Recording Numerical Marks (Continuous Assmt 50% + Final 50%)...');
    const performanceMultipliers = [0.96, 0.92, 0.88, 0.85, 0.82, 0.79, 0.76, 0.73, 0.68, 0.62];

    for (let i = 0; i < studentProfiles.length; i++) {
      const student = studentProfiles[i];
      const mult = performanceMultipliers[i];

      for (const subj of grade7Subjects) {
        const quiz1 = Math.round(5 * mult * 10) / 10;
        const quiz2 = Math.round(5 * mult * 10) / 10;
        const test1 = Math.round(10 * mult * 10) / 10;
        const assignment = Math.round(10 * mult * 10) / 10;
        const midExam = Math.round(20 * mult * 10) / 10;
        const totalCA = quiz1 + quiz2 + test1 + assignment + midExam;
        const finalExam = Math.round(50 * mult * 10) / 10;

        await MarkRecord.create({
          student: student._id,
          academicYear: academicYear._id,
          semester: 'Semester 1',
          classRoom: classRoom7A._id,
          subject: subj._id,
          teacher: teacherUser1._id,
          assessments: {
            quiz1,
            quiz2,
            test1,
            assignment,
            midExam,
            project: 0,
            totalCA,
          },
          finalExam,
        });
      }
    }

    console.log('[Seeder]: Running Ranking Engine...');
    await calculateClassRankings(classRoom7A._id, academicYear._id, 'Semester 1');

    console.log('[Seeder]: Seeding Attendance, Lesson Plans, Assets, and Timetable...');
    // Daily Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Attendance.create({
      classRoom: classRoom7A._id,
      date: today,
      academicYear: academicYear._id,
      recordedBy: teacherUser1._id,
      records: studentProfiles.map((s, idx) => ({
        student: s._id,
        status: idx === 3 ? 'Late' : idx === 8 ? 'Absent' : 'Present',
        remark: idx === 3 ? 'Arrived 10 mins late' : idx === 8 ? 'Sick leave reported' : '',
      })),
    });

    // Lesson Plans
    await LessonPlan.create([
      {
        teacher: teacherUser1._id,
        classRoom: classRoom7A._id,
        subject: mathSubj._id,
        weekNumber: 4,
        title: 'Linear Equations in One Variable (አንድ ተለዋዋጭ ያላቸው ቀጥተኛ እኩልታዎች)',
        topic: 'Algebraic Expressions & Solving Basic Equations',
        learningObjectives: 'Students will identify coefficients, isolate variables, and solve multi-step linear equations.',
        status: 'Approved',
        directorFeedback: 'Well structured with adequate classroom activities.',
      },
      {
        teacher: teacherUser2._id,
        classRoom: classRoom7A._id,
        subject: engSubj._id,
        weekNumber: 4,
        title: 'Past Continuous Tense & Reading Comprehension',
        topic: 'Grammar in Context and Short Story Analysis',
        learningObjectives: 'Construct affirmative and interrogative past continuous sentences.',
        status: 'Submitted',
      },
    ]);

    // School Assets
    await AssetItem.create([
      {
        assetName: 'Grade 7 Mathematics Ministry Textbooks',
        category: 'Textbook',
        assetCode: 'TXT-G7-MATH-01',
        quantity: 120,
        assignedLocation: 'Main Textbook Library',
        condition: 'Good',
        unitCost: 150,
      },
      {
        assetName: 'Dual Student Wooden Desks with Benches',
        category: 'Furniture',
        assetCode: 'FURN-DESK-2026-01',
        quantity: 180,
        assignedLocation: 'Academic Blocks A, B, C',
        condition: 'Good',
        unitCost: 2500,
      },
      {
        assetName: 'General Science Optical Microscope Set',
        category: 'Laboratory',
        assetCode: 'LAB-MIC-004',
        quantity: 8,
        assignedLocation: 'Science Laboratory Room 3',
        condition: 'Good',
        unitCost: 8500,
      },
      {
        assetName: 'Standard Footballs & Volleyballs',
        category: 'Sports',
        assetCode: 'SPT-BALL-2026',
        quantity: 25,
        assignedLocation: 'Physical Education Store',
        condition: 'Good',
        unitCost: 800,
      },
    ]);

    // Timetable
    await TimeTable.create({
      classRoom: classRoom7A._id,
      academicYear: academicYear._id,
      schedule: [
        {
          dayOfWeek: 'Monday',
          periods: [
            { periodNumber: 1, startTime: '08:30', endTime: '09:15', subject: mathSubj._id, teacher: teacherUser1._id },
            { periodNumber: 2, startTime: '09:15', endTime: '10:00', subject: engSubj._id, teacher: teacherUser2._id },
            { periodNumber: 3, startTime: '10:15', endTime: '11:00', subject: sciSubj._id, teacher: teacherUser3._id },
            { periodNumber: 4, startTime: '11:00', endTime: '11:45', subject: socSubj._id, teacher: teacherUser1._id },
          ],
        },
      ],
    });

    // Announcements
    await Announcement.create([
      {
        title: 'Welcome to the 2026/2018 E.C. Academic Year Portal',
        titleAmharic: 'እንኳን ወደ 2026/2018 ዓ.ም የትምህርት ዘመን የካራዲባዩ ፖርታል በሰላም መጣችሁ',
        content: 'Karadibayu Primary School is proud to launch its new modern Student Grade & Academic Portal.',
        contentAmharic: 'የካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት አዲሱን ዘመናዊ የተማሪዎች ውጤት መመልከቻ ፖርታል ይፋ አድርጓል።',
        category: 'Academic',
        targetAudience: 'All',
        priority: 'High',
        isPublic: true,
        publishedBy: adminUser._id,
      },
    ]);

    console.log('====================================================');
    console.log(' SEEDING COMPLETED WITH FULL ADDIS SIMS MODULES! ');
    console.log(' Admin: admin / admin123');
    console.log(' Teacher: teacher.abdisa / teacher123');
    console.log(' Student: kps2026001 / kps123456');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
