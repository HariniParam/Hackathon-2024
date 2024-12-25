import { Component } from '@angular/core';
import { MessageBoxComponent } from "../shared/message-box/message-box.component";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [MessageBoxComponent, CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  messages: { role: string; content: string }[] = []; // Array to hold messages with roles
  newMessage: string = '';
  role: string = 'user';

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (this.newMessage.trim()) {
      // Push the user's message to the messages array
      this.messages.push({ role: 'user', content: this.newMessage.trim() });

      // Prepare the message payload
      const messagePayload = {
        role: this.role, // 'user'
        message: this.newMessage.trim()
      };

      // Send the message to the backend via POST request
      this.http.post('http://127.0.0.1:5000/chat', messagePayload)
        .subscribe(
          (response: any) => {
            console.log('Message sent successfully', response);
            // Push the bot's reply to the messages array
            this.messages.push({ role: 'bot', content: response["message"] });
            this.newMessage = ''; // Clear the input field
          },
          (error) => {
            console.error('Error sending message', error);
          }
        );
    }
  }

  exportChat() {
    const doc = new jsPDF();
    const formattedChat = this.messages.map(message => `${message.role}: ${message.content}`).join('\n');
    doc.text(formattedChat, 10, 10);
    doc.save('chat_export.pdf');
  }
}
