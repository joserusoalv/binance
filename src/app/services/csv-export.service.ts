import { Injectable } from '@angular/core';

/**
 * Utility service for exporting data to CSV format
 */
@Injectable({
  providedIn: 'root',
})
export class CsvExportService {
  /**
   * Converts an array of objects to CSV format and triggers download
   */
  exportToCsv<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    headers?: Record<keyof T, string>,
  ): void {
    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Get column names
    const columns = Object.keys(data[0]) as (keyof T)[];

    // Create header row
    const headerRow = headers
      ? columns.map((col) => headers[col] || String(col)).join(',')
      : columns.map((col) => String(col)).join(',');

    // Create data rows
    const dataRows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col];
          // Handle strings with commas or quotes
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(','),
    );

    // Combine header and data
    const csv = [headerRow, ...dataRows].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${this.getTimestamp()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get formatted timestamp for filename
   */
  private getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}`;
  }
}
