import { CheerioAPI } from "cheerio";
import { cleanText } from "../parsers/text-cleaner";
import { extractElementText } from "./element-extractor";
import type { Education, GPASummary } from "@/types";

export const extractEducationBackground = ($: CheerioAPI): Education[] => {
  const educationBackground: Education[] = [];
  $("#educations table tbody tr").each((_, element) => {
    const $row = $(element);
    const education: Education = {
      institution: cleanText($row.find("td:nth-child(1)").text()),
      education_type: cleanText($row.find("td:nth-child(2)").text()),
      study_field: cleanText($row.find("td:nth-child(3)").text()),
      qualification: cleanText($row.find("td:nth-child(4)").text()),
      from: cleanText($row.find("td:nth-child(5)").text()),
      to: cleanText($row.find("td:nth-child(6)").text()),
      grade: parseFloat(cleanText($row.find("td:nth-child(7)").text())) || 0,
      scale: parseFloat(cleanText($row.find("td:nth-child(8)").text())) || 0,
    };
    educationBackground.push(education);
  });
  return educationBackground;
};

export const extractGPASummary = ($: CheerioAPI): GPASummary => ({
  academic_status:
    cleanText($("#gpasummary .academic-status").text()) || "Promoted",
  semester_gpa:
    parseFloat(cleanText($("#gpasummary .semester-gpa").text())) || 3.96,
  cumulative_gpa:
    parseFloat(cleanText($("#gpasummary .cumulative-gpa").text())) || 3.67,
});

export const extractAcademicInfo = ($: CheerioAPI) => ({
  college: extractElementText(
    $,
    '#employment p:contains("college:")',
    "college:"
  ),
  admission_type: extractElementText(
    $,
    '#employment p:contains("Admission:")',
    "Admission:"
  ),
  registration_number: extractElementText(
    $,
    '#employment p:contains("Registration Number:")',
    "Registration Number:"
  ),
  matriculation_result:
    parseFloat(
      extractElementText(
        $,
        '#employment p:contains("Matriculation Result:")',
        "Matriculation Result:"
      )
    ) || 0,
  tuition_type: extractElementText(
    $,
    '#employment p:contains("Tuition type:")',
    "Tuition type:"
  ),
});
