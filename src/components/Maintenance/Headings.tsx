import React from 'react';

export const Headings = function (props: any) {
    return (
        <div className="container headings-container">
            <div className="title headings">Pos.</div>
            <div className="condition headings">
                <div>Godkendt</div>
                <div>Mangelfuld</div>
                <div>Dårlig</div>
            </div>
            <div className="payedBy headings">
                <div>A/B</div>
                <div>Sælger</div>
            </div>
            <div style={{ textAlign: 'center' }} className="sellersAmount headings">
                <div>Tilbagehold</div>
                <div>Fradrag</div>
            </div>
            <div style={{ display: 'flex' }} className="headings">
                <div>Bemærkninger</div>
            </div>
        </div>
    );
}


export const TopHeader = function (props: any) {
    return (
        <div className="container top-headers">
            <div></div>
            <div>
                Vedligeholdelsesstand
        </div>
            <div>
                Betales af
        </div>
            <div style={{ textAlign: 'center' }}>
                Sælgers beløb
        </div>
        </div>
    );
}