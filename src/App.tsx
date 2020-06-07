import React from 'react';
import './App.css';
import { initializeIcons } from '@uifabric/icons';
import GeneralInformation from './components/GeneralInformation/GeneralInformation';
import Maintenance from './components/Maintenance/Maintenance';
import Improvements from './components/Improvements/Improvements';
import { Provider } from "react-redux";
import { createStore } from 'redux';
import { IGeneralInformation, IImprovements, IMaintenanceAreas } from './utilities/Interfaces';
import { BrowserRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { populateGeneralArray } from './utilities/HelperFunctions';
import { act } from 'react-dom/test-utils';

initializeIcons();

export interface IReport {
  id: string;
  generalInformation: IGeneralInformation;
  improvements: IImprovements;
  maintenanceAreas: IMaintenanceAreas;
}

export const fallBackGeneralInformationObj: IGeneralInformation = {
  housingUnion: "",
  addressId: "",
  owner: "",
  isBuyer: true,
  caseNumber: "",
  reviewDate: new Date(),
  lastReportDate: new Date(),
  takeOverDate: new Date(),
  persons: [
    { name: '', mail: '', wantsReport: false, present: true },
    { name: '', mail: '', wantsReport: false, present: false }
  ],
  movedOut: false,
  reconstruction: false,
  reconstructionByCurrentOwner: false,
  reconstructionByFormerOwner: false,
  approvals: [
    { name: 'communeNotification', label: 'BYGGESAG / ANMELDELSE TIL KOMMUNEN', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
    { name: 'vvs', label: 'VVS INSTALLATIONS-GODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
    { name: 'drain', label: 'AFLØBSINSTALLATIONS-GODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
    { name: 'gas', label: 'GASINSTALLATIONS-GODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
    { name: 'el', label: 'EL-INSTALLATIONS-GODKENDELSE', necessary: false, noRemark: false, recommended: false, shown: false, remark: '' },
  ],
  isUpdate: false,
  remarks: ['']
}

const initialState: IReport = {
  id : '',
  generalInformation: fallBackGeneralInformationObj,
  improvements : {
    general: [],
    kitchen: [],
    bathroom: [],
    hall: [],
    livingroom: []
  },
  maintenanceAreas: {
    general: populateGeneralArray('general'),
    kitchen: populateGeneralArray('kitchen'),
    bathroom: populateGeneralArray('bathroom'),
    hall: populateGeneralArray('hall'),
    livingroom: populateGeneralArray('livingroom')
  }
}

function reducer(state: IReport = initialState, action: any): IReport {
  switch (action.type) {
    case "UPDATE GENERALINFORMATION":
      return {
        ...state,
        generalInformation: {
          ...state.generalInformation,
          [action.property]: action.payload
        }
      };
    case "ADD IMPROVEMENT":
      return {
        ...state,
        improvements : {
          ...state.improvements,
          [action.property]: action.payload
        }
      }
    case "UPDATE MAINTENANCE":
      return {
        ...state,
        maintenanceAreas : {
          ...state.maintenanceAreas,
          [action.property] : action.payload
        }
      }
    case "UPDATE ID":
      return {
        ...state,
        id: action.payload
      }
    default:
      return state;
  }
}

interface IAppProps extends RouteComponentProps {

}

export const store = createStore(reducer);

// store.dispatch( {type: "UPDATE", amount: 3 })
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h1>ANDELSVURDERING</h1>
          <img alt="" src={require('./assets/logo.png')} />
        </div>
        <BrowserRouter>
          <Switch>
            <Route path={'/general-information'} exact component={GeneralInformation} />
            <Route path={'/maintenance'} exact component={Maintenance} />
            <Route path={'/improvements'} exact component={Improvements} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }

}
