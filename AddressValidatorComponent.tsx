/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { useState } from "react";
import { ValidationControl } from "./ValidationControl";
import { AutoCompleteAddressControlComponent } from './AutoCompleteAddressControlComponent';
import '../css/common.css';
import { Pivot, PivotItem } from '@fluentui/react';


export interface AddressValidatorComponentProps {
    label: string;
    onChanges: (newValue: string | undefined) => void;
    context: ComponentFramework.Context<IInputs>;
    clientUrl: string;
    validationApi: string;
}


export const AddressValidatorComponent = React.memo((props: AddressValidatorComponentProps) => {
    const [value, setValue] = useState('');
    React.useEffect(() => {
        setValue(props.label);
    }, []);

    const choosedData = (data: any) => {
        props.onChanges(data);
        setValue(data);
    }
    return (

        <>
            {/* <PrimaryButton onClick={openDialog}>Address Validation</PrimaryButton>
            {props.label} */}
            <div className="main">
                <div className="top-header display_center">
                    <h2> Address Validation Control </h2>
                    {/* <Icon iconName="Cancel" onClick={closeDialog} style={{ cursor: 'pointer', fontSize: '24px', color: 'red', fontWeight: '600' }} /> */}
                </div>
                {/* <div className="tab_button">
                        <PrimaryButton onClick={handleTabChangesValid}>Address Validation</PrimaryButton>
                        <PrimaryButton onClick={handleTabChangesAuto}>Address AutoComplete</PrimaryButton>
                    </div>
                    <div className="component">
                        {isvalidation ?
                            <ValidationControl authToken={props.authToken} choosedData = {choosedData} label={value}/> :
                            <AutoCompleteAddressControlComponent choosedData = {choosedData} isOpen = {isDialogOpen}/>
                        }
                    </div> */}

                <Pivot>
                    <PivotItem headerText="Address Validation">
                        <ValidationControl validationUrl={props.validationApi} choosedData={choosedData} label={value} />
                    </PivotItem>
                    <PivotItem headerText="Address AutoComplete">
                        <AutoCompleteAddressControlComponent choosedData={choosedData} />
                    </PivotItem>
                </Pivot>

            </div>

        </>
    );


})