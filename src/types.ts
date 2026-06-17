/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from 'firebase/auth';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: 'cameras' | 'audio' | 'lighting' | 'chroma' | 'accessories' | 'digital';
  categoryAr: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  descriptionAr: string;
  bulletsAr: string[];
  specs?: Record<string, string>;
  isHot?: boolean;
}

export interface Bundle {
  id: string;
  nameAr: string;
  descriptionAr: string;
  itemsAr: string[];
  price: number;
  originalPrice: number;
  imageUrl: string;
  tagAr: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAddons?: string[];
}

export interface SavedSetup {
  id: string;
  userId: string;
  name: string;
  items: string[];
  totalPrice: number;
  createdAt: string;
}

export interface CreativeNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Google Workspace REST API schemas
export interface WorkspaceDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface WorkspaceEmail {
  id: string;
  threadId: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
}

export interface WorkspaceCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
}

export interface WorkspaceDoc {
  id: string;
  title: string;
  updatedTime?: string;
}

export interface WorkspaceFormResponse {
  responseId: string;
  submittedAt: string;
  answers: Record<string, string>;
}

export interface WorkspaceContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}
