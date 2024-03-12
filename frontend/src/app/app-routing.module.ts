import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

// import { RegisterComponent } from './components/register/register.component'

const routes: Routes = []

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }