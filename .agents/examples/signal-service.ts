import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Gold Standard: Angular 21 Reactive Service
 * - Provided in root
 * - Private signals for internal state
 * - Readonly public signals for consumers
 * - Use of inject() function
 * - Atomic update methods
 */
@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private http = inject(HttpClient);

  // Internal State
  private _state = signal<{ data: any[]; loading: boolean }>({
    data: [],
    loading: false
  });

  // Public Exposure (Readonly)
  state = this._state.asReadonly();
  data = computed(() => this._state().data);
  isLoading = computed(() => this._state().loading);

  /**
   * Method to update state atomically
   */
  updateData(newData: any[]) {
    this._state.update(s => ({
      ...s,
      data: newData
    }));
  }

  /**
   * Interaction with Observables (converting to signals)
   */
  private users$ = this.http.get<any[]>('api/users');
  users = toSignal(this.users$, { initialValue: [] });
}
