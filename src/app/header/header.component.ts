import { DataStorageService } from './../shared/data-storage.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  collapsed = true;

  isAuthenticated = false;

  constructor(private storageDataService: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userSubject.subscribe((user) => {
      this.isAuthenticated = user ? true : false;
    })
  }

  onSaveData() {
    this.storageDataService.storeRecipe();
  }

  onFetchData() {
    this.storageDataService.getStoredRecipe().subscribe();
  }

  onLogOut() {
    this.authService.logOut();
  }

}
