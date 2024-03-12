import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './auth.guard';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { TokenStorageService } from './_services/token-storage.service';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

//const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
import { MinimapComponent } from './components/minimap/minimap.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    EditUserComponent,
    MinimapComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  
  providers: [authInterceptorProviders, TokenStorageService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }