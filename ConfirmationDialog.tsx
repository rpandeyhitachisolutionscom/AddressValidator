/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogFooter, DialogType, PrimaryButton } from "@fluentui/react";
import * as React from "react";

const dialogContentProps = {
    type: DialogType.normal,
    title: 'Selection Done',
    closeButtonAriaLabel: 'Close',
    subText: 'Do you want to Close This Dialog ?',
};

export const ConfirmationDialog: React.FC<any> = ({ isopen, onClose }) => {

    const closeAndResponse = () => {
        onClose();
    }

    return (
        <>
            <Dialog
                hidden={!isopen}
                onDismiss={onClose}
                dialogContentProps={dialogContentProps}
            >
                <DialogFooter>
                    <PrimaryButton onClick={closeAndResponse} className='correct'>OK</PrimaryButton>
                </DialogFooter>
            </Dialog>
        </>
    )
}
