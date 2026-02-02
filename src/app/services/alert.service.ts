import { effect, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PriceAlert } from '../models/binance.models';
import { BinanceService } from './binance.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private binanceService = inject(BinanceService);
  private snackBar = inject(MatSnackBar);

  private readonly STORAGE_KEY = 'binance_price_alerts';

  // State
  private alertsSignal = signal<PriceAlert[]>([]);
  readonly alerts = this.alertsSignal.asReadonly();

  constructor() {
    this.loadAlerts();

    // Setup monitoring effect
    effect(() => {
      const tickers = this.binanceService.tickers();
      const currentAlerts = this.alertsSignal();

      currentAlerts.forEach((alert) => {
        if (!alert.active) return;

        const ticker = tickers.find((t) => t.symbol === alert.symbol);
        if (!ticker) return;

        const price = ticker.price;
        let triggered = false;

        if (alert.condition === 'above' && price >= alert.targetPrice) {
          triggered = true;
        } else if (alert.condition === 'below' && price <= alert.targetPrice) {
          triggered = true;
        }

        if (triggered) {
          this.triggerAlert(alert, price);
        }
      });
    });
  }

  addAlert(symbol: string, targetPrice: number, condition: 'above' | 'below') {
    const newAlert: PriceAlert = {
      id: Math.random().toString(36).substring(2, 9),
      symbol,
      targetPrice,
      condition,
      createdAt: Date.now(),
      active: true,
    };

    this.alertsSignal.update((current) => [...current, newAlert]);
    this.saveAlerts();

    this.snackBar.open(`Alerta creada para ${symbol} a $${targetPrice}`, 'OK', {
      duration: 3000,
      panelClass: 'alert-snackbar-info',
    });
  }

  removeAlert(id: string) {
    this.alertsSignal.update((current) => current.filter((a) => a.id !== id));
    this.saveAlerts();
  }

  toggleAlert(id: string) {
    this.alertsSignal.update((current) =>
      current.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    );
    this.saveAlerts();
  }

  private triggerAlert(alert: PriceAlert, currentPrice: number) {
    // 1. Mark as inactive to avoid duplicate triggers
    this.toggleAlert(alert.id);

    // 2. Show notification
    const direction = alert.condition === 'above' ? 'subido' : 'bajado';
    this.snackBar.open(`🔔 ¡ALERTA! ${alert.symbol} ha ${direction} a $${currentPrice}`, 'CERRAR', {
      duration: 10000,
      verticalPosition: 'top',
      panelClass: ['alert-snackbar-trigger', alert.condition],
    });

    // 3. Play sound (optional, but requested implicitly by "alerts")
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (e) {
      console.warn('Could not play alert sound', e);
    }
  }

  private loadAlerts() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.alertsSignal.set(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load alerts', e);
      }
    }
  }

  private saveAlerts() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alertsSignal()));
  }
}
