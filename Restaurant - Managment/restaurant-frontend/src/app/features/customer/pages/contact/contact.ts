
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  submitted = false;

  onSubmit(): void {
    if (
      !this.contactForm.name.trim() ||
      !this.contactForm.email.trim() ||
      !this.contactForm.subject.trim() ||
      !this.contactForm.message.trim()
    ) {
      return;
    }

    this.submitted = true;

    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  }
}
