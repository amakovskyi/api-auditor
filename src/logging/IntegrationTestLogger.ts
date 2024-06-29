export abstract class IntegrationTestLogger {

  /**
   * Print test file name.
   */
  abstract fileName(value: string): void

  /**
   * Print test name.
   */
  abstract testName(value: string): void

  /**
   * Print test description.
   */
  abstract testDescription(value: string): void

  /**
   * Print test section header.
   */
  abstract section(value: string): void

  /**
   * Print a generic text.
   */
  abstract text(value: string): void

  /**
   * Print bold text.
   */
  abstract textBold(value: string): void

  /**
   * Format and print object.
   */
  abstract object(value: any): void

  /**
   * Add spacing.
   */
  abstract space(): void

}