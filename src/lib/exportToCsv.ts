export interface CsvColumn<T> {
  key: keyof T;
  label: string;
}

const CSV_BOM = String.fromCharCode(0xfeff);

const escapeCsvCell = (value: unknown): string => {
  const text = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export const exportToCsv = <T,>(
  filename: string,
  columns: CsvColumn<T>[],
  rows: T[],
): void => {
  const header = columns.map((column) => escapeCsvCell(column.label)).join(",");
  const body = rows
    .map((row) => columns.map((column) => escapeCsvCell(row[column.key])).join(","))
    .join("\n");

  const csvContent = `${CSV_BOM}${header}\n${body}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
