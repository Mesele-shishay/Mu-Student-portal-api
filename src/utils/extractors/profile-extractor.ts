import { CheerioAPI } from "cheerio";
import {
  StudentProfile,
  PersonalDetails,
  ContactAddress,
  EmergencyContact,
} from "@/types";
import { extractElementText } from "./element-extractor";

export const extractStudentProfile = ($: CheerioAPI): StudentProfile => ({
  full_name: extractElementText($, 'li:contains("Full Name")', "Full Name :"),
  id_number: extractElementText($, 'li:contains("ID Number")', "ID Number :"),
  admission_year: extractElementText(
    $,
    'li:contains("Admission Year")',
    "Admission Year :"
  ),
  department: extractElementText($, 'li:contains("Department")', "Department:"),
  program: extractElementText($, 'li:contains("Program")', "Program:"),
  class_year: extractElementText($, 'li:contains("Class Year")', "Class Year:"),
  section: extractElementText($, 'li:contains("Section")', "Section:"),
  role: "student",
  profile_image: $("img.user-image").attr("src") || "",
});

export const extractPersonalDetails = ($: CheerioAPI): PersonalDetails => ({
  first_name: extractElementText(
    $,
    'li:contains("First Name")',
    "First Name :"
  ),
  father_name: extractElementText(
    $,
    'li:contains("Father Name")',
    "Father Name :"
  ),
  grand_father_name: extractElementText(
    $,
    'li:contains("Grand father Name")',
    "Grand father Name :"
  ),
  full_name_amharic: extractElementText($, 'li:contains("ሙሉ ስም")', "ሙሉ ስም :"),
  gender: extractElementText($, 'li:contains("Gender")', "Gender :"),
  marital_status: extractElementText(
    $,
    'li:contains("Marital Status")',
    "Marital Status :"
  ),
  nationality: extractElementText(
    $,
    'li:contains("Nationality")',
    "Nationality:"
  ),
  ethnicity: extractElementText($, 'li:contains("Ethnicity")', "Ethnicity:"),
  disability: extractElementText($, 'li:contains("Disability")', "Disability:"),
  date_of_birth: extractElementText(
    $,
    'li:contains("Date of birth")',
    "Date of birth:"
  ),
  place_of_birth: extractElementText(
    $,
    'li:contains("Place of birth")',
    "Place of birth:"
  ),
});

export const extractContactAddress = ($: CheerioAPI): ContactAddress => ({
  country: extractElementText(
    $,
    '#contect_address p:contains("Country")',
    "Country:"
  ),
  region: extractElementText(
    $,
    '#contect_address p:contains("Region")',
    "Region:"
  ),
  zone: extractElementText($, '#contect_address p:contains("Zone")', "Zone:"),
  woreda: extractElementText(
    $,
    '#contect_address p:contains("Woreda")',
    "Woreda:"
  ),
  kebele: extractElementText(
    $,
    '#contect_address p:contains("Kebele")',
    "Kebele:"
  ),
  street_address: extractElementText(
    $,
    '#contect_address p:contains("Street address")',
    "Street address:"
  ),
  home_telephone: extractElementText(
    $,
    '#contect_address p:contains("Home telephone")',
    "Home telephone:"
  ),
  mobile: extractElementText(
    $,
    '#contect_address p:contains("Mobile")',
    "Mobile:"
  ),
  work_telephone: extractElementText(
    $,
    '#contect_address p:contains("Work telephone")',
    "Work telephone:"
  ),
  email: extractElementText(
    $,
    '#contect_address p:contains("Email")',
    "Email:"
  ),
});

export const extractEmergencyContact = ($: CheerioAPI): EmergencyContact => ({
  full_name: extractElementText(
    $,
    '#emergency_contact p:contains("Full name")',
    "Full name:"
  ),
  relationship: extractElementText(
    $,
    '#emergency_contact p:contains("Relationship")',
    "Relationship:"
  ),
  home_telephone: extractElementText(
    $,
    '#emergency_contact p:contains("Home telephone")',
    "Home telephone:"
  ),
  mobile: extractElementText(
    $,
    '#emergency_contact p:contains("Mobile")',
    "Mobile:"
  ),
  work_telephone: extractElementText(
    $,
    '#emergency_contact p:contains("Work telephone")',
    "Work telephone:"
  ),
});
