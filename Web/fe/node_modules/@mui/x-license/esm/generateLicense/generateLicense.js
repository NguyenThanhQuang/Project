import { md5 } from "../encoding/md5.js";
import { base64Encode } from "../encoding/base64.js";
import { PLAN_SCOPES } from "../utils/plan.js";
import { LICENSE_MODELS } from "../utils/licenseModel.js";
const licenseVersion = '2';
function getClearLicenseString(details) {
  if (details.planScope && !PLAN_SCOPES.includes(details.planScope)) {
    throw new Error('MUI X: Invalid scope');
  }
  if (details.licenseModel && !LICENSE_MODELS.includes(details.licenseModel)) {
    throw new Error('MUI X: Invalid licensing model');
  }
  const keyParts = [`O=${details.orderNumber}`, `E=${details.expiryDate.getTime()}`, `S=${details.planScope}`, `LM=${details.licenseModel}`, `PV=${details.planVersion}`, `KV=${licenseVersion}`];
  return keyParts.join(',');
}
export function generateLicense(details) {
  const licenseStr = getClearLicenseString(details);
  return `${md5(base64Encode(licenseStr))}${base64Encode(licenseStr)}`;
}