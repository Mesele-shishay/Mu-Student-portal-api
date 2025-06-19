import { CheerioAPI } from "cheerio";
import { cleanText } from "../parsers/text-cleaner";
import type { FamilyMember, CostSharing, Transcript } from "@/types";

export const extractFamilyBackground = ($: CheerioAPI): FamilyMember[] => {
  const familyBackground: FamilyMember[] = [];
  $("#family_background table tbody tr").each((_, element) => {
    const $row = $(element);
    const familyMember: FamilyMember = {
      full_name: cleanText($row.find("td:nth-child(1)").text()),
      relation: cleanText($row.find("td:nth-child(2)").text()),
      date_of_birth: cleanText($row.find("td:nth-child(3)").text()),
      education_level: cleanText($row.find("td:nth-child(4)").text()),
      occupation: cleanText($row.find("td:nth-child(5)").text()),
    };
    familyBackground.push(familyMember);
  });
  return familyBackground;
};

export const extractProgramPreferences = ($: CheerioAPI): string[] => {
  const programPreferences: string[] = [];
  $("#program_preference table tbody tr").each((_, element) => {
    const program = cleanText($(element).find("td:nth-child(2)").text())
      .replace("(Undergraduate Regular)", "")
      .trim();
    programPreferences.push(program);
  });
  return programPreferences;
};

export const extractRegistrationHistory = ($: CheerioAPI): string[] => {
  const registrationHistory: string[] = [];
  $('select[name="a[_v_]"] option').each((_, element) => {
    const text = $(element).text().trim();
    if (text && text !== "") {
      registrationHistory.push(cleanText(text));
    }
  });
  return registrationHistory;
};

export const extractCostSharing = ($: CheerioAPI): CostSharing => {
  const costSharing: CostSharing = {
    total: 0,
    breakdown: [],
  };

  $("#costsharing table.data-table tr:not(:first-child)").each((_, element) => {
    const $row = $(element);
    const semester = cleanText($row.find("td:nth-child(1)").text());
    const education =
      parseFloat(cleanText($row.find("td:nth-child(2)").text())) || 0;
    const cafe =
      parseFloat(cleanText($row.find("td:nth-child(3)").text())) || 0;
    const accommodation =
      parseFloat(cleanText($row.find("td:nth-child(4)").text())) || 0;
    const total =
      parseFloat(cleanText($row.find("td:nth-child(5)").text())) || 0;

    if (semester) {
      costSharing.breakdown.push({
        semester,
        education,
        cafe,
        accommodation,
        total,
      });
      costSharing.total += total;
    }
  });

  return costSharing;
};

export const extractCourses = (
  $: CheerioAPI
): Array<{
  code?: string;
  title?: string;
  credits?: string;
  grade?: string;
  semester?: string;
}> => {
  const courses: Array<{
    code?: string;
    title?: string;
    credits?: string;
    grade?: string;
    semester?: string;
  }> = [];

  $(".course, .course-item, tr").each((_, element) => {
    const $element = $(element);
    const courseCode = $element.find(".course-code, .code").text().trim();
    const courseTitle = $element.find(".course-title, .title").text().trim();
    const credits = $element.find(".credits, .credit-hours").text().trim();
    const grade = $element.find(".grade, .letter-grade").text().trim();
    const semester = $element.find(".semester, .term").text().trim();

    if (courseCode || courseTitle) {
      const course: {
        code?: string;
        title?: string;
        credits?: string;
        grade?: string;
        semester?: string;
      } = {};
      if (courseCode) course.code = courseCode;
      if (courseTitle) course.title = courseTitle;
      if (credits) course.credits = credits;
      if (grade) course.grade = grade;
      if (semester) course.semester = semester;
      courses.push(course);
    }
  });

  return courses;
};

export const extractGrades = (
  $: CheerioAPI
): Array<{
  courseCode?: string;
  courseTitle?: string;
  grade?: string;
  points?: string;
  semester?: string;
}> => {
  const grades: Array<{
    courseCode?: string;
    courseTitle?: string;
    grade?: string;
    points?: string;
    semester?: string;
  }> = [];

  $(".grade-item, .grade-row, tr").each((_, element) => {
    const $element = $(element);
    const courseCode = $element.find(".course-code, .code").text().trim();
    const courseTitle = $element.find(".course-title, .title").text().trim();
    const grade = $element.find(".grade, .letter-grade").text().trim();
    const points = $element.find(".points, .grade-points").text().trim();
    const semester = $element.find(".semester, .term").text().trim();

    if (courseCode || courseTitle) {
      const gradeItem: {
        courseCode?: string;
        courseTitle?: string;
        grade?: string;
        points?: string;
        semester?: string;
      } = {};
      if (courseCode) gradeItem.courseCode = courseCode;
      if (courseTitle) gradeItem.courseTitle = courseTitle;
      if (grade) gradeItem.grade = grade;
      if (points) gradeItem.points = points;
      if (semester) gradeItem.semester = semester;
      grades.push(gradeItem);
    }
  });

  return grades;
};

export const extractSchedule = (
  $: CheerioAPI
): Array<{
  day?: string;
  time?: string;
  course?: string;
  room?: string;
  instructor?: string;
}> => {
  const schedule: Array<{
    day?: string;
    time?: string;
    course?: string;
    room?: string;
    instructor?: string;
  }> = [];

  $(".schedule-item, .class-schedule, tr").each((_, element) => {
    const $element = $(element);
    const day = $element.find(".day, .weekday").text().trim();
    const time = $element.find(".time, .class-time").text().trim();
    const course = $element.find(".course, .course-name").text().trim();
    const room = $element.find(".room, .classroom").text().trim();
    const instructor = $element.find(".instructor, .professor").text().trim();

    if (day || time || course) {
      const scheduleItem: {
        day?: string;
        time?: string;
        course?: string;
        room?: string;
        instructor?: string;
      } = {};
      if (day) scheduleItem.day = day;
      if (time) scheduleItem.time = time;
      if (course) scheduleItem.course = course;
      if (room) scheduleItem.room = room;
      if (instructor) scheduleItem.instructor = instructor;
      schedule.push(scheduleItem);
    }
  });

  return schedule;
};

export const extractFinancialInfo = ($: CheerioAPI) => {
  const paymentHistory: Array<{
    date?: string;
    amount?: string;
    description?: string;
  }> = [];

  $(".payment-item, .payment-history, tr").each((_, element) => {
    const $element = $(element);
    const date = $element.find(".date, .payment-date").text().trim();
    const amount = $element.find(".amount, .payment-amount").text().trim();
    const description = $element
      .find(".description, .payment-desc")
      .text()
      .trim();

    if (date || amount) {
      const payment: {
        date?: string;
        amount?: string;
        description?: string;
      } = {};
      if (date) payment.date = date;
      if (amount) payment.amount = amount;
      if (description) payment.description = description;
      paymentHistory.push(payment);
    }
  });

  const balance = $(".balance, .account-balance").text().trim();
  const paidAmount = $(".paid-amount, .total-paid").text().trim();
  const dueAmount = $(".due-amount, .amount-due").text().trim();

  return {
    ...(balance && { balance }),
    ...(paidAmount && { paidAmount }),
    ...(dueAmount && { dueAmount }),
    ...(paymentHistory.length > 0 && { paymentHistory }),
  };
};

export const extractTranscript = ($: CheerioAPI): Transcript => {
  const transcript: Transcript = {
    entries: [],
  };

  // Check for warning message
  const warning = $(".label-warning").text().trim();
  if (warning) {
    transcript.warning = warning;
  }

  let currentSemester = "";
  let currentAcademicYear = "";
  let currentYear = "";

  $("#transcript table#DataTable tbody tr").each((_, element) => {
    const $row = $(element);

    // Check if this is a semester heading row
    if ($row.hasClass("semester_heading")) {
      const semesterText = cleanText($row.find("th").text());
      const matches = semesterText.match(
        /Academic Year (\d{4}\/\d{4}) (\d+(?:st|nd|rd|th) Semester)\s*\[\s*(\d+(?:st|nd|rd|th) Year)\s*\]/i
      );
      if (matches) {
        currentAcademicYear = matches[1] ?? "";
        currentSemester = matches[2] ?? "";
        currentYear = matches[3] ?? "";
      }
      return;
    }

    // Skip header rows and empty rows
    if ($row.find("th").length > 0 || !$row.find("td").length) {
      return;
    }

    // Extract course data
    const moduleCode = cleanText($row.find("td:nth-child(1)").text());
    const moduleTitle = cleanText($row.find("td:nth-child(2)").text());
    const courseCode = cleanText($row.find("td:nth-child(3)").text());
    const courseTitle = cleanText($row.find("td:nth-child(4)").text());
    const ects =
      parseFloat(cleanText($row.find("td:nth-child(5)").text())) || 0;
    const grade = cleanText($row.find("td:nth-child(6)").text());
    const points =
      parseFloat(cleanText($row.find("td:nth-child(7)").text())) || 0;

    if (courseCode && courseTitle) {
      transcript.entries.push({
        moduleCode: moduleCode || undefined,
        moduleTitle: moduleTitle || undefined,
        courseCode,
        courseTitle,
        ects,
        grade,
        points,
        semester: currentSemester,
        academicYear: currentAcademicYear,
        year: currentYear,
      });
    }
  });

  return transcript;
};
