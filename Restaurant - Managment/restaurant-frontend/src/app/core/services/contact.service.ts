import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactInfo {
  id: number;
  userId: number;
  username: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdDate: string;
  updatedDate: string | null;
  createdBy: string;
  updatedBy: string | null;
}

export interface ContactPage {
  content: ContactInfo[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ContactApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${API_CONFIG.baseUrl}/contact-info`;

  sendMessage(
    request: ContactMessageRequest,
  ): Observable<ContactApiResponse<ContactInfo>> {
    return this.http.post<ContactApiResponse<ContactInfo>>(
      this.apiUrl,
      request,
    );
  }

  getMessages(
    page = 1,
    size = 10,
  ): Observable<ContactApiResponse<ContactPage>> {
    return this.http.get<ContactApiResponse<ContactPage>>(
      this.apiUrl,
      {
        params: { page, size },
      },
    );
  }

  getMessageById(
    id: number,
  ): Observable<ContactApiResponse<ContactInfo>> {
    return this.http.get<ContactApiResponse<ContactInfo>>(
      `${this.apiUrl}/${id}`,
    );
  }

  deleteMessage(
    id: number,
  ): Observable<ContactApiResponse<null>> {
    return this.http.delete<ContactApiResponse<null>>(
      this.apiUrl,
      {
        params: { id },
      },
    );
  }
}
