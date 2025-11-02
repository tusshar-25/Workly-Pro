import Company from "../models/Company.js";

export const generateCompanyId = async () => {
  let unique = false;
  let companyId;

  while (!unique) {
    companyId = "COMP-" + Math.floor(1000 + Math.random() * 9000);
    const existing = await Company.findOne({ companyId });
    if (!existing) unique = true;
  }

  return companyId;
};
