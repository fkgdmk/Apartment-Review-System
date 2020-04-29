import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BottomNavigation } from './FunctionalComponents'
import { Pivot, PivotItem, PivotLinkSize  } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { colors } from '../utilities/colors';

interface ISubjectseProps extends RouteComponentProps {

}

export default class Subjects extends React.Component<ISubjectseProps, {}> {

    render() {
        return (
            <div>
                <Pivot aria-label="Basic Pivot Example" linkSize={PivotLinkSize.large} styles={{ 
                    linkIsSelected: { selectors : { '::before': { background: colors.orange} }} }}  style={{color: 'red'}}>
                    <PivotItem
                        headerText="Generelt"
                        headerButtonProps={{
                            'data-order': 1,
                            'data-title': 'My Files Title',
                        }}
                    >
                        <Label>Generelt</Label>
                    </PivotItem>
                    <PivotItem headerText="Køkken" style={{color: 'red'}}>
                        <Label>Køkken</Label>
                    </PivotItem>
                    <PivotItem headerText="Badeværelse">
                        <Label>Pivot #3</Label>
                    </PivotItem>
                    <PivotItem headerText="Entré / Gang">
                        <Label>Pivot #3</Label>
                    </PivotItem>
                    <PivotItem headerText="Stue og værelser">
                        <Label>Pivot #3</Label>
                    </PivotItem>
                </Pivot>
                <div style={{marginBottom: '200px'}}></div>
                <BottomNavigation
                    component={'Subjects'}
                    backArrowOnClick={() => this.props.history.push('/general-information')}
                    forwardArrowOnClick={() => this.props.history.push('/maintenance')}
                />
            </div>
        );
    }
}