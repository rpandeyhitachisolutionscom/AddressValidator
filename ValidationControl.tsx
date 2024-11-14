/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, MessageBar, MessageBarType, PrimaryButton, Spinner, TextField } from "@fluentui/react";
import * as React from "react";
import { useState } from "react";
import '../css/common.css';
import { ConfirmationDialog } from "./ConfirmationDialog";


const getAccessToken = async (): Promise<string | null> => {
    try {
        const response = await (Xrm.WebApi.online.execute({
            getMetadata: () => {
                return {
                    boundParameter: null,
                    parameterTypes: {},
                    operationType: 0,
                    operationName: "stu_GetAccessToken"
                };
            }
        }) as any);

        if (response.ok) {
            const responseData = await response.json();
            return responseData.AccessToken as string;
        }
        return null;
    } catch (error) {
        console.error('Error fetching access token from server:', error);
        return null;
    }
};

export const ValidationControl: React.FC<any> = ({ validationUrl, choosedData, label }) => {
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [county, setCounty] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [isValid, setIsValid] = useState(0);
    const [isUploading, setisUploadibg] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
    const openConfirmUpdate = (): any => setIsConfirmUpdateOpen(true);
    const closeConfirmUpdate = (): any => setIsConfirmUpdateOpen(false);

    React.useEffect(() => {
        if (label) {
            const fulladdrarr = label.split('|');
            setAddress(fulladdrarr[0]);
            setCity(fulladdrarr[1]);
            setRegion(fulladdrarr[2]);
            setPostalCode(fulladdrarr[5]);
            setCounty(fulladdrarr[3])
            if (fulladdrarr[4].includes(',')) {
                setCountry(fulladdrarr[4].split(',')[1]);
            }
            else {
                setCountry(fulladdrarr[4]);
            }
        }

    }, [label])

    const handleAddressChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setAddress(newValue || e.currentTarget.value);
    }

    const handleCounrtyChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCountry(newValue || e.currentTarget.value);
    }

    const handleCityChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCity(newValue || e.currentTarget.value);
    }

    const handleRegionChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setRegion(newValue || e.currentTarget.value);
    }

    const handlePostalCodeChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPostalCode(newValue || e.currentTarget.value);
    }

    const validateData = async () => {
        setIsValid(0);
        setisUploadibg(true);
        try {
            const accessToken = await getAccessToken();
            const addressData: any = {
                addressLine1: address,
                city: city,
                region: region,
                postalCode: postalCode,
                country: country
            }
            const response = await fetch(validationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Attach the access token
                },
                body: JSON.stringify(addressData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setIsValid(2);
                setErrorMessage(errorData.error.message);
                setisUploadibg(false);
                throw new Error('Request failed');
            }

            const data = await response.json();
            const valid = (data.status == 'Valid' ? 1 : 2);
            setIsValid(valid);
            setErrorMessage(data.validationMessage);
            setisUploadibg(false);
            //setResult(data); // Store the result from API response
        } catch (error) {
            console.error('Error validating address:', error);
        }
    }

    const saveToSystem = () => {
        const finalString = address + '|' + city + '|' + region + '|' + county + '|' + country + '|' + postalCode;
        openConfirmUpdate();
        choosedData(finalString);
    }

    return (
        <>
            <div className="main-container">
                <div className="form">
                    {!isUploading ?
                        <div>
                            <div className="input_field">
                                <div className="input_element">
                                    <Label> Line 1</Label>
                                    <TextField
                                        value={address}
                                        onChange={handleAddressChange}
                                        style={{ width: '250px' }}
                                    />
                                </div>
                                <div className="input_element">
                                    <Label>City</Label>
                                    <TextField
                                        value={city}
                                        onChange={handleCityChange}
                                        style={{ width: '250px' }}
                                    />
                                </div>

                                <div className="input_element">
                                    <Label>State</Label>
                                    <TextField
                                        value={region}
                                        onChange={handleRegionChange}
                                        style={{ width: '250px' }}
                                    />
                                </div>

                                <div className="input_element">
                                    <Label>Zip </Label>
                                    <TextField
                                        value={postalCode}
                                        onChange={handlePostalCodeChange}
                                        style={{ width: '250px' }}
                                    />
                                </div>
                                {/* <div className="input_element">
                                    <Label>County</Label>
                                    <TextField
                                        value={county}
                                        onChange={handleCountyChange}
                                        style={{ width: '350px' }}
                                    />
                                </div> */}

                                <div className="input_element">
                                    <Label>Country</Label>
                                    <TextField
                                        value={country}
                                        onChange={handleCounrtyChange}
                                        style={{ width: '250px' }}
                                    />
                                </div>
                            </div>

                            <div className="submit_button">
                                <PrimaryButton onClick={validateData}>Validate</PrimaryButton>
                            </div>
                        </div> :
                        <Loader />
                    }
                </div>

                <div className="form">
                    <ConfirmationDialog isopen={isConfirmUpdateOpen} onClose={closeConfirmUpdate} />

                    {isValid != 0 ?
                        <div>
                            {
                                isValid == 1 ?
                                    <div className="validate_message">
                                        <div className="msg">
                                            <MessageBar style={{ color: 'black', fontWeight: '600' }} messageBarType={MessageBarType.success}> Address is Valid </MessageBar>
                                            <h2 className="mt-8">Address</h2>
                                            <p className="mt-8"><span>Line1 :</span> {address}</p>
                                            <p className="mt-8"><span>City :</span> {city}</p>
                                            <p className="mt-8"><span>State :</span> {region}</p>
                                            {/* <p className="mt-8"><span>County :</span> {county}</p> */}
                                            <p className="mt-8"><span>Country :</span> {country}</p>
                                            <p className="mt-8"><span>Zip :</span> {postalCode}</p>
                                            <PrimaryButton onClick={saveToSystem}>Select</PrimaryButton>
                                        </div>

                                    </div>
                                    : <div className="validate_message">
                                        {isValid == 2 ?
                                            <div className="msg">
                                                <MessageBar style={{ color: 'red', fontWeight: '600' }} messageBarType={MessageBarType.error}> {errorMessage}</MessageBar>
                                                {/* <MessageBar style={{ color: 'red', fontWeight: '600',marginTop:'10px' }} messageBarType={MessageBarType.error}>Error  :  {combineAddress} </MessageBar> */}
                                            </div>

                                            : null
                                        }

                                    </div>
                            }
                        </div>
                        :
                        <div>

                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export const Loader: React.FC<any> = () => {
    return (
        <>
            <div className="mt-34">
                <Spinner label="Please Wait Validating ..." ariaLive="assertive" labelPosition="right" />
            </div>
        </>
    )
}


