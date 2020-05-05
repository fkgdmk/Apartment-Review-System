import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { BottomNavigation } from './FunctionalComponents'

interface IMaintenanceProps extends RouteComponentProps {

}

export default class Maintenance extends React.Component<IMaintenanceProps, {}> {

    render() {
        return (
            <div>
                Hellos
                <BottomNavigation
                    component={'Maintenance'}
                    backArrowOnClick={() => this.props.history.push('/improvements')}
                />
            </div>
        );
    }
}