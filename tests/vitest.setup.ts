// Default all vitest runs to dry-run SMS. Individual tests that need
// real delivery can delete this env var inside their own module scope.
if (process.env.SMS_DRY_RUN === undefined) {
  process.env.SMS_DRY_RUN = "1";
}
