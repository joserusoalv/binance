import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map, combineLatest, of, take } from 'rxjs';

@Component({
  selector: 'formly-field-chip-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="chip-select-wrapper">
      <div class="filter-actions">
        <div class="presets">
          <span class="preset-label">Presets:</span>
          <button type="button" class="preset-btn" (click)="applyPreset('L1')">L1s</button>
          <button type="button" class="preset-btn" (click)="applyPreset('DeFi')">DeFi</button>
          <button type="button" class="preset-btn" (click)="applyPreset('AI')">AI</button>
        </div>
        <button type="button" class="action-link" (click)="restoreDefaults()">Restore Defaults</button>
      </div>

      <mat-form-field class="chip-select-field" appearance="fill">
        @if (props.label) {
          <mat-label>{{ props.label }}</mat-label>
        }
        <mat-chip-grid #chipGrid aria-label="Selected currencies">
          @for (val of value; track val) {
            <mat-chip-row (removed)="remove(val)">
              {{ val.replace('USDT', '') }}
              <button matChipRemove [attr.aria-label]="'remove ' + val" type="button" class="custom-remove-btn">
                <span class="close-icon">&times;</span>
              </button>
            </mat-chip-row>
          }
          <input
            [placeholder]="(value && value.length > 0) ? '' : (props.placeholder || 'Search...')"
            #itemInput
            [formControl]="filterControl"
            [matChipInputFor]="chipGrid"
            [matAutocomplete]="auto"
          />
        </mat-chip-grid>
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)" [class]="'modern-autocomplete-panel'">
          @for (option of filteredOptions$ | async; track option.value) {
            <mat-option [value]="option.value">
              {{ option.label }}
            </mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .chip-select-wrapper {
      position: relative;
      width: 100%;
    }
    .filter-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      padding: 0 4px;
    }
    .presets {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .preset-label {
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }
    .preset-btn {
      background: var(--border-subtle);
      border: 1px solid var(--border-strong);
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 10px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }
    .preset-btn:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      background: var(--bg-primary);
    }
    .action-link {
      background: none;
      border: none;
      padding: 0;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      opacity: 0.8;
    }
    .action-link:hover {
      opacity: 1;
      color: var(--accent-primary);
      text-decoration: underline;
    }
    .chip-select-field {
      width: 100%;
    }
    ::v-deep .mat-mdc-form-field-flex {
      padding-top: 20px !important;
      padding-bottom: 8px !important;
    }
    ::v-deep .mat-mdc-form-field-label-wrapper {
      top: -12px !important;
      padding-top: 12px !important;
    }
    .custom-remove-btn {
      border: none;
      background: transparent;
      padding: 0;
      margin-left: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      opacity: 0.6;
    }
    .custom-remove-btn:hover {
      opacity: 1;
      color: #f6465d;
    }
    .close-icon {
      font-size: 18px;
      line-height: 1;
      font-weight: bold;
    }
    mat-chip-row {
      margin-top: 4px;
      margin-bottom: 4px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipSelectType extends FieldType<FieldTypeConfig> implements OnInit {
  @ViewChild('itemInput') itemInput!: ElementRef<HTMLInputElement>;
  filterControl = new FormControl('');
  
  filteredOptions$: Observable<any[]> = of([]);

  private readonly DEFAULT_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT'];
  
  private readonly PRESETS: Record<string, string[]> = {
    'L1': ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'AVAXUSDT', 'NEARUSDT', 'DOTUSDT'],
    'DeFi': ['UNIUSDT', 'AAVEUSDT', 'LINKUSDT', 'MKRUSDT', 'SNXUSDT', 'CRVUSDT'],
    'AI': ['FETUSDT', 'RENDERUSDT', 'NEARUSDT', 'TAOUSDT', 'ARUSDT']
  };

  ngOnInit() {
    const options$ = this.props.options instanceof Observable 
      ? this.props.options 
      : of(this.props.options || []);

    this.filteredOptions$ = combineLatest([
      this.filterControl.valueChanges.pipe(startWith('')),
      options$,
      this.formControl.valueChanges.pipe(startWith(this.formControl.value))
    ]).pipe(
      map(([filterValue, options, currentValues]) => {
        const filter = (typeof filterValue === 'string' ? filterValue : '').toUpperCase();
        const selectedValues = currentValues || [];
        
        return options.filter((opt: any) => {
          const matchesFilter = opt.label.toUpperCase().includes(filter) || opt.value.toUpperCase().includes(filter);
          const isNotSelected = !selectedValues.includes(opt.value);
          return matchesFilter && isNotSelected;
        }).slice(0, 30);
      })
    );
  }

  get value(): string[] {
    return this.formControl.value || [];
  }

  remove(item: string): void {
    const newValue = this.value.filter(v => v !== item);
    this.formControl.setValue(newValue);
    this.formControl.markAsDirty();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const val = event.option.value;
    if (val && !this.value.includes(val)) {
      const newValue = [...this.value, val];
      this.formControl.setValue(newValue);
      this.formControl.markAsDirty();
    }
    this.itemInput.nativeElement.value = '';
    this.filterControl.setValue('');
  }

  restoreDefaults() {
    this.formControl.setValue(this.DEFAULT_SYMBOLS);
    this.formControl.markAsDirty();
  }

  applyPreset(category: string) {
    const presetSymbols = this.PRESETS[category] || [];
    // We add to current selection or replace? Let's replace for clarity
    this.formControl.setValue(presetSymbols);
    this.formControl.markAsDirty();
  }
}
