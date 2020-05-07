import React from 'react';
import '../../styles/Maintenance.css'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { IMaintenanceArea } from '../../utilities/Interfaces';


interface ISubjectRowProps extends IMaintenanceArea {
    pos: number;
    onChangeConditionApprovedValue: () => void
    onChangeCondtionDefectiveValue: () => void
    onChangeCondtionBadValue: () => void
    onChangePayedByAb: () => void
    onChangePayedBySeller: () => void
    onChangeSellersAmountDetainedValue: (e : any) => void
    onChangeSellersAmountDeductionValue: (e : any) => void
    onChangeRemark: (e : any) => void
}


export const SubjectRow = function (props: ISubjectRowProps) {

    const {condition, payedBy, sellersAmount, remark, title, pos,onChangeConditionApprovedValue,onChangeCondtionBadValue,
    onChangeCondtionDefectiveValue,onChangePayedByAb,onChangePayedBySeller,onChangeRemark,onChangeSellersAmountDeductionValue,onChangeSellersAmountDetainedValue} = props;

    return (
        <div className="container">
            <div className="title">{ pos < 10 ? 0 : null}{pos}. {title}</div>
            <div className="condition">
                <Checkbox checked={condition.approved} onChange={onChangeConditionApprovedValue}/>
                <Checkbox checked={condition.defective} onChange={onChangeCondtionDefectiveValue}/>
                <Checkbox checked={condition.bad} onChange={onChangeCondtionBadValue}/>
            </div>
            <div className="payedBy">
                <Checkbox checked={payedBy.ab} onChange={onChangePayedByAb}/>
                <Checkbox checked={payedBy.seller} onChange={onChangePayedBySeller}/>
            </div>
            <div className="sellersAmount">
                <TextField value={sellersAmount.detained.toString()} onChange={onChangeSellersAmountDetainedValue}/>
                <TextField value={sellersAmount.deduction.toString()} onChange={onChangeSellersAmountDeductionValue}/>
            </div>
            <div>
                <TextField value={remark} onChange={onChangeRemark}/>
            </div>
        </div>
    );
}