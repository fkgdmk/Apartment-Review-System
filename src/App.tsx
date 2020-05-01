import React from 'react';
import './App.css';
import { initializeIcons } from '@uifabric/icons';
import GeneralInformation from './components/GeneralInformation';
import Maintenance from './components/Maintenance';
import Improvements from './components/Improvements';
import { Provider } from "react-redux";
import { createStore } from 'redux';
import { IGeneralInformation, IImprovements } from './utilities/Interfaces';
import { BrowserRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';

initializeIcons();

export interface IState {
  generalInformation: IGeneralInformation;
  improvements: IImprovements;
}

export const fallBackGeneralInformationObj: IGeneralInformation = {
  housingUnion: "",
  address: "",
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

const initialState: IState = {
  generalInformation: fallBackGeneralInformationObj,
  improvements : {
    general: [],
    kitchen: [],
    bathroom: [],
    hall: [],
    livingroom: []
  }
}

function reducer(state: IState = initialState, action: any): IState {
  switch (action.type) {
    case "UPDATE":
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
            <Route path={'/subjects'} exact component={Improvements} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }

}
