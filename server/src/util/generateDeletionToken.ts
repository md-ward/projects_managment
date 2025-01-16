import bcrypt from "bcrypt";
export function generateConfirmationToken() {
  const deletionToken = bcrypt.hashSync(Date.now().toString(), 10);
  return deletionToken;
}
