import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { UserList } from './components/user-list/user-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, UserList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
   title = 'Prueba Técnica Angular';
}
