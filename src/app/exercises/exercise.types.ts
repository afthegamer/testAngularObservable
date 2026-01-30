import { Observable } from 'rxjs';

export type OrderStatus = 'processing' | 'shipped' | 'cancelled';

export interface Customer {
  id: number;
  name: string;
  city: string;
  active: boolean;
  tags: string[];
}

export interface Order {
  id: number;
  customerId: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderEvent {
  delayMs: number;
  amount: number;
  status: OrderStatus;
}

export interface PackingEvent {
  delayMs: number;
  type: 'queued' | 'packed';
}

export interface FlakyStep {
  delayMs: number;
  kind: 'ok' | 'timeout' | 'server-error';
  payload?: string;
}

export interface PackingDashboard {
  ready: number;
  backlog: number;
  capacity: number;
}

export interface CityBreakdown {
  city: string;
  activeCount: number;
  shippedTotal: number;
  processingCount: number;
}

export interface ControlTowerSnapshot {
  revenue: number;
  backlog: number;
  ready: number;
  capacity: number;
  service: string;
}

export interface ObservableExercise<T = unknown> {
  id: string;
  title: string;
  target: string;
  goal: string;
  steps: string[];
  operators: string[];
  previewNote: string;
  expected?: string;
  previewTimeoutMs?: number;
  preview: () => Observable<T>;
}
