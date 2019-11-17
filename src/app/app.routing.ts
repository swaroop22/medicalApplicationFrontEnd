import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PatientsComponent} from './components/patients/patients.component';
import {CancertypeComponent} from './components/cancertypes/cancertype.component';
import {EditregimenComponent} from './modals/editregimendetail/editregimen.component';
import {RegimendetailsComponent} from './components/regimendetails/regimendetails.component';
import {LoginComponent} from './components/login/login.component';
import {UserLoggedInGuard} from './guards/user-loggedIn-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'login',
    component: LoginComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'patientTypes',
    component: PatientsComponent,
    data: {
      title: 'patientTypes',
      breadcrumb: 'PatientsTypes'
    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'cancerTypes/:patientId',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'subCancers/:cancerId',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'cancerTypes/:patientId/:cancerId/:subCancerType1id',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'cancerTypes/:patientId/:cancerId/:subCancerType1id/:subCancerType2Id',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'cancerTypes/:patientId/:cancerId/:subCancerType1id/:subCancerType2Id/:linkedId',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'editRegimenDetails',
    component: EditregimenComponent,
    data: {
      title: 'editRegimenDetails'
    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'regimenDetails/:id',
    component: RegimendetailsComponent,
    data: {
      title: 'regimenDetails'
    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'regimenDetails/:id/:regimenType',
    component: RegimendetailsComponent,
    data: {
      title: 'regimenDetails'
    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'regimenDetails',
    component: RegimendetailsComponent,
    data: {
      title: 'regimenDetails'
    },
    runGuardsAndResolvers: 'always',
    canActivate: [UserLoggedInGuard]
  },
  { path: '**',  redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
