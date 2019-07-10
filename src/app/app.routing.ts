import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PatientsComponent} from './components/patients/patients.component';
import {CancertypeComponent} from './components/cancertypes/cancertype.component';
import {SubcancertypesComponent} from './components/subcancertypes/subcancertypes.component';
import {EditregimenComponent} from './modals/editregimendetail/editregimen.component';
import {RegimendetailsComponent} from './components/regimendetails/regimendetails.component';
import {Subcancertypes2Component} from './components/subcancertype2/subcancertypes2.component';
import {Subcancertypes3Component} from './components/subcancertype3/subcancertypes3.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'patientTypes',
    pathMatch: 'full',
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'patientTypes',
    component: PatientsComponent,
    data: {
      title: 'patientTypes',
      breadcrumb: 'PatientsTypes'
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'cancerTypes/:patientId',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'cancerTypes/:patientId/:cancerId',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'cancerTypes/:patientId/:cancerId/:subCancerType1id',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'cancerTypes/:patientId/:cancerId/:subCancerType1id/:subCancerType2Id',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'cancerTypes/:patientId/:cancerId/:subCancerType1id/:subCancerType2Id/:linkedId',
    component: CancertypeComponent,
    data: {
      title: 'cancerTypes',
      breadcrumb: 'cancerTypes'

    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'subCancerTypes/:id',
    component: SubcancertypesComponent,
    data: {
      title: 'subCancerTypes'
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'editRegimenDetails',
    component: EditregimenComponent,
    data: {
      title: 'editRegimenDetails'
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'regimenDetails/:id',
    component: RegimendetailsComponent,
    data: {
      title: 'regimenDetails'
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'subCancerTypes2/:id',
    component: Subcancertypes2Component,
    data: {
      title: 'subcancertypes2'
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'subCancerTypes3/:id',
    component: Subcancertypes3Component,
    data: {
      title: 'subcancertypes3'
    },
    runGuardsAndResolvers: 'always'
  }, {
    path: 'regimenDetails',
    component: RegimendetailsComponent,
    data: {
      title: 'regimenDetails'
    },
    runGuardsAndResolvers: 'always'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
