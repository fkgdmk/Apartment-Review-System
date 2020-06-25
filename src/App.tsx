import React from 'react';
import './App.css';
import { initializeIcons } from '@uifabric/icons';
import GeneralInformation from './components/GeneralInformation/GeneralInformation';
import Maintenance from './components/Maintenance/Maintenance';
import Improvements from './components/Improvements/Improvements';
import { Provider } from "react-redux";
import { createStore } from 'redux';
import { IGeneralInformation, IImprovements, IMaintenanceAreas } from './utilities/Interfaces';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { populateMaintenanceAreaArray, fallBackGeneralInformationObj } from './utilities/HelperFunctions';

initializeIcons();

export interface IReport {
  id: string;
  generalInformation: IGeneralInformation;
  improvements: IImprovements;
  maintenanceAreas: IMaintenanceAreas;
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
    general: populateMaintenanceAreaArray('general'),
    kitchen: populateMaintenanceAreaArray('kitchen'),
    bathroom: populateMaintenanceAreaArray('bathroom'),
    hall: populateMaintenanceAreaArray('hall'),
    livingroom: populateMaintenanceAreaArray('livingroom')
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

export const store = createStore(reducer);

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
