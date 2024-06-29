export class DiffAlign {

  private static isObject(value: any): boolean {
    return value != null && typeof value === 'object' && !Array.isArray(value);
  }

  private static formatArrays(left: any[], right: any[], indent: number, level: number): string[] {
    const indentStep = ' '.repeat(indent);
    const leftStrings: string[] = [];
    const rightStrings: string[] = [];
    const maxLength = Math.max(left.length, right.length);
    for (let i = 0; i < maxLength; i++) {
      if (left.length > i && right.length > i) {
        const [leftItemString, rightItemString] = DiffAlign.formatPair(left[i], right[i], indent, level + 1);
        leftStrings.push(indentStep.repeat(level + 1) + leftItemString);
        rightStrings.push(indentStep.repeat(level + 1) + rightItemString);
      } else if (left.length > i) {
        const leftItemString = DiffAlign.formatSingle(left[i], indent, level + 1);
        leftStrings.push(indentStep.repeat(level + 1) + leftItemString);
      } else {
        const rightItemString = DiffAlign.formatSingle(right[i], indent, level + 1);
        rightStrings.push(indentStep.repeat(level + 1) + rightItemString);
      }
    }
    const leftResult = indentStep.repeat(level) + '[\n' + leftStrings.join(',\n') + indentStep.repeat(level) + '\n]';
    const rightResult = indentStep.repeat(level) + '[\n' + rightStrings.join(',\n') + indentStep.repeat(level) + '\n]';
    return [leftResult, rightResult];
  }

  private static formatObjects(left: any, right: any, indent: number, level: number): string[] {
    const indentStep = ' '.repeat(indent);
    const leftStrings: string[] = [];
    const rightStrings: string[] = [];

    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    for (const key of leftKeys) {
      const leftValue = left[key];
      const rightValue = right[key] !== undefined ? right[key] : null;

      const [leftItemString, rightItemString] = DiffAlign.formatPair(leftValue, rightValue, indent, level + 1);
      leftStrings.push(`${indentStep.repeat(level + 1)}${JSON.stringify(key)}: ${leftItemString}`);
      if (key in right) {
        rightStrings.push(`${indentStep.repeat(level + 1)}${JSON.stringify(key)}: ${rightItemString}`);
      }
    }

    for (const key of rightKeys) {
      if (!(key in left)) {
        const rightValue = right[key];
        const rightItemString = DiffAlign.formatSingle(rightValue, indent, level + 1);
        rightStrings.push(`${indentStep.repeat(level + 1)}${JSON.stringify(key)}: ${rightItemString}`);
      }
    }

    const leftResult = '{\n' + leftStrings.join(',\n') + '\n' + indentStep.repeat(level) + '}';
    const rightResult = '{\n' + rightStrings.join(',\n') + '\n' + indentStep.repeat(level) + '}';
    return [leftResult, rightResult];
  }

  private static formatSingle(value: any, indent: number, level: number): string {
    if (DiffAlign.isObject(value)) {
      return DiffAlign.formatObjects(value, {}, indent, level)[0];
    } else if (Array.isArray(value)) {
      return DiffAlign.formatArrays(value, [], indent, level)[0];
    } else {
      return JSON.stringify(value);
    }
  }

  private static formatPair(left: any, right: any, indent, level): string[] {
    if (DiffAlign.isObject(left) && DiffAlign.isObject(right)) {
      return DiffAlign.formatObjects(left, right, indent, level);
    } else if (Array.isArray(left) && Array.isArray(right)) {
      return DiffAlign.formatArrays(left, right, indent, level);
    } else {
      return [DiffAlign.formatSingle(left, indent, level), DiffAlign.formatSingle(right, indent, level)];
    }
  }

  static format(left: any, right: any, indent = 2): string[] {
    return DiffAlign.formatPair(left, right, indent, 0);
  }

}