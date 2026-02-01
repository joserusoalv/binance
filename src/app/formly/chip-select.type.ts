import { Component, ChangeDetectionStrategy, OnInit, viewChild, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map, combineLatest, of } from 'rxjs';
import { SelectOption } from '../models/binance.models';
import { MARKET_CONFIG } from '../constants/app.constants';
import { StripQuotePipe } from '../pipes/strip-quote.pipe';

@Component({
  selector: 'formly-field-chip-select',
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    StripQuotePipe,
    AsyncPipe
  ],
  template: `
    <div class="chip-select-wrapper">
      <div class="filter-actions">
        <div class="presets">
          <span class="preset-label">Presets:</span>
          @for (preset of availablePresets; track preset) {
            <button 
              type="button" 
              class="preset-btn" 
              [class.active]="isPresetActive(preset)"
              (click)="applyPreset(preset)">
              {{ preset }}
            </button>
          }
        </div>
        <button type="button" class="action-link" (click)="restoreDefaults()">Restore Defaults</button>
      </div>

      <mat-form-field class="chip-select-field" appearance="fill">
        @if (props.label) {
          <mat-label>{{ props.label }}</mat-label>
        }
        <mat-chip-grid #chipGrid>
          @for (val of formControl.value; track val) {
            <mat-chip-row (removed)="remove(val)">
              {{ val | stripQuote }}
              <button matChipRemove class="custom-remove-btn">
                <span class="close-icon">&times;</span>
              </button>
            </mat-chip-row>
          }
        </mat-chip-grid>
        <input
          #itemInput
          [placeholder]="formControl.value?.length ? '' : (props.placeholder || 'Search...')"
          [formControl]="filterControl"
          [matChipInputFor]="chipGrid"
          [matAutocomplete]="auto"
        />
        <mat-autocomplete 
          #auto="matAutocomplete" 
          (optionSelected)="selected($event)"
          autoActiveFirstOption>
          @for (option of filteredOptions$ | async; track option.value) {
            <mat-option [value]="option.value">
              {{ option.label }}
            </mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
  styleUrl: './chip-select.type.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipSelectType extends FieldType<FieldTypeConfig> implements OnInit {
  itemInput = viewChild<ElementRef<HTMLInputElement>>('itemInput');
  filterControl = new FormControl('');
  filteredOptions$: Observable<SelectOption[]> = of([]);
  readonly availablePresets = MARKET_CONFIG.AVAILABLE_PRESET_KEYS;

  ngOnInit() {
    const options$ = (this.props.options instanceof Observable 
      ? this.props.options 
      : of(this.props.options || [])) as Observable<SelectOption[]>;

    this.filteredOptions$ = combineLatest([
      this.filterControl.valueChanges.pipe(startWith('')),
      options$,
      this.formControl.valueChanges.pipe(startWith(this.formControl.value))
    ]).pipe(
      map(([filterValue, options, currentSelected]) => {
        const filterText = (filterValue || '').toUpperCase();
        const selected = (currentSelected || []) as string[];
        
        return options.filter(opt => 
          !selected.includes(opt.value) && 
          (opt.label.toUpperCase().includes(filterText) || opt.value.toUpperCase().includes(filterText))
        ).slice(0, 30);
      })
    );
  }

  remove(item: string) {
    const current = this.formControl.value || [];
    this.formControl.setValue(current.filter((v: string) => v !== item));
    this.formControl.markAsDirty();
  }

  selected(event: MatAutocompleteSelectedEvent) {
    const val = event.option.value;
    const current = this.formControl.value || [];
    if (val && !current.includes(val)) {
      this.formControl.setValue([...current, val]);
      this.formControl.markAsDirty();
    }
    
    if (this.itemInput()) {
      this.itemInput()!.nativeElement.value = '';
    }
    this.filterControl.setValue('');
  }

  restoreDefaults() {
    this.formControl.setValue([...MARKET_CONFIG.DEFAULT_SYMBOLS]);
    this.formControl.markAsDirty();
  }

  applyPreset(category: string) {
    const presetSymbols = MARKET_CONFIG.PRESETS[category] || [];
    this.formControl.setValue([...presetSymbols]);
    this.formControl.markAsDirty();
  }

  isPresetActive(category: string): boolean {
    const presetSymbols = MARKET_CONFIG.PRESETS[category] || [];
    const currentSymbols = this.formControl.value || [];
    if (presetSymbols.length !== currentSymbols.length) return false;
    return presetSymbols.every(s => currentSymbols.includes(s));
  }
}
