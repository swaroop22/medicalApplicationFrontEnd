import {EditsubcancertypesComponent} from './modals/editsubcancertypes/editsubcancertypes.component';
import {EditpatienttypesComponent} from './modals/editpatienttypes/editpatienttypes.component';
import {LoginComponent} from './components/login/login.component';
import {NgModule} from '@angular/core';
import {PatientsComponent} from './components/patients/patients.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {DeleteregimenComponent} from './modals/deleteregimendetail/deleteregimen.component';
import {AppRoutingModule} from './app.routing';
import {CancerTreeService} from './services/cancer-tree.service';
import {DeletecancertypesComponent} from './modals/deletecancertypes/deletecancertypes.component';
import {ModalModule, TooltipModule} from 'ngx-bootstrap';
import {AddregimenComponent} from './modals/addregimendetail/addregimen.component';
import {DeletepatienttypesComponent} from './modals/deletepatienttypes/deletepatienttypes.component';
import {UserLoggedInGuard} from './guards/user-loggedIn-guard';
import {LinkCancerRegimenModal} from './modals/link-cancer-regimen-modal/link-cancer-regimen-modal';
import {KeysPipe} from './pipes/keys.pipe';
import {ServicesModule} from './services.module';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {AddsubcancertypesComponent} from './modals/addsubcancertypes/addsubcancertypes.component';
import {DeletesubcancertypesComponent} from './modals/deletesubcancertypes/deletesubcancertypes.component';
import {UserService} from './services/UserService';
import {HttpModule} from '@angular/http';
import {RegimendetailsComponent} from './components/regimendetails/regimendetails.component';
import {EditregimenComponent} from './modals/editregimendetail/editregimen.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AddpatienttypesComponent} from './modals/addpatienttypes/addpatienttypes.component';
import {BrowserModule} from '@angular/platform-browser';
import {EditcancertypesComponent} from './modals/editcancertypes/editcancertypes.component';
import {AppComponent} from './app.component';
import {CancertypeComponent} from './components/cancertypes/cancertype.component';
import {LevelTypesComponent} from './modals/level-type/level-types.component';
import {AddcancertypesComponent} from './modals/addcancertypes/addcancertypes.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';


@NgModule({
  declarations: [
    AppComponent,
    AddregimenComponent,
    EditregimenComponent,
    DeleteregimenComponent,
    PatientsComponent,
    RegimendetailsComponent,
    CancertypeComponent,
    AddpatienttypesComponent,
    DeletepatienttypesComponent,
    EditpatienttypesComponent,
    AddcancertypesComponent,
    EditcancertypesComponent,
    DeletecancertypesComponent,
    AddsubcancertypesComponent,
    DeletesubcancertypesComponent,
    EditsubcancertypesComponent,
    LinkCancerRegimenModal,
    LevelTypesComponent,
    LoginComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ServicesModule,
    CKEditorModule,
    BrowserAnimationsModule,
    HttpModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
  entryComponents: [
    PatientsComponent,
    CancertypeComponent
  ],
  providers: [CancerTreeService, UserService, UserLoggedInGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
