import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'xml';
  date = new Date();

  async ngOnInit() {
    setInterval(() => {
      this.changeDate();
    }, 1000);
  }

  changeDate() {
    this.date = new Date();
  }
}
