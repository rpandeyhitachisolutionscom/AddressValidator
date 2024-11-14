/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useEffect, useState } from "react";
import '../css/common.css';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { useRef } from "react";
import { isPromise } from "util/types";
import { PrimaryButton, Spinner } from "@fluentui/react";
import { ConfirmationDialog } from "./ConfirmationDialog";
export const AutoCompleteAddressControlComponent: React.FC<any> = ({  choosedData }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBywmT3PVtzT7qGlX4Kz2i0yG3ukvZOMEA',
        libraries: ["places"]
    });
    const inputRef = useRef<google.maps.places.SearchBox | null>(null); // Properly typing the ref
    const [address, setAddress] = useState<string>('');
    const [addressDetails, setAddressDetails] = useState<any>({});
    const [isField, setIsField] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
    const openConfirmUpdate = (): any => setIsConfirmUpdateOpen(true);
    const closeConfirmUpdate = (): any => setIsConfirmUpdateOpen(false);
    useEffect(() => {
        let interval: any;
        if (isLoaded) {
            console.log('Dialog opened, setting address details and interval.');
            setAddressDetails({});

            interval = setInterval(() => {
                const pacContainer = document.querySelector('.pac-container');
                if (pacContainer) {
                    console.log('.pac-container found, setting z-index.');
                    pacContainer.setAttribute('style', 'z-index: 1000003 !important;');
                    clearInterval(interval);
                } else {
                    console.log('.pac-container not found yet.');
                }
            }, 100);
        }

        // Clean up the interval on component unmount or when isOpen changes
        return () => {
            if (interval) {
                console.log('Clearing interval.');
                clearInterval(interval);
            }
        };
    }, [isLoaded, setAddressDetails]);

    const handleFieldmapping = () => {
        setIsSelecting(true);
        const finalString = addressDetails.line1 + '|' + addressDetails.city + '|' + addressDetails.state + '|' + addressDetails.county + '|' + addressDetails.country + '|' + addressDetails.zip + '|';
        openConfirmUpdate();
        choosedData(finalString);
        setIsSelecting(false);
       
    }

    const handlePlacesChanged = () => {
        const places = inputRef.current?.getPlaces(); // Get places from the input field
        if (places && places.length > 0) {
            // Assuming the first place is the one the user selected
            const place = places[0];

            // Log the place details (you can also extract the address and coordinates here)
            console.log(place);

            // Set the formatted address in the state
            setAddress(place.formatted_address || '');
            const addressComponents: any = place.address_components;
            const details = {
                line1: '',
                city: '',
                state: '',
                county: '',
                country: '',
                zip: ''
            };

            addressComponents.forEach((component: any) => {
                const types = component.types;
                if (types.includes("street_number")) {
                    details.line1 = `${component.long_name} ${details.line1}`;
                }
                if (types.includes("route")) {
                    details.line1 += component.long_name;
                }
                if (types.includes("locality")) {
                    details.city = component.long_name;
                }
                if (types.includes("administrative_area_level_1")) {
                    details.state = component.short_name;
                }
                if (types.includes("administrative_area_level_2")) {
                    details.county = component.long_name;
                }
                if (types.includes("country")) {
                    details.country = component.short_name;
                }
                if (types.includes("postal_code")) {
                    details.zip = component.long_name;
                }
            });

            setAddressDetails(details);
            console.log(addressDetails);
            setIsField(true);
        }
    };
    return (
        <>
            <div className="main-container-flex-column">
                <div style={{ position: 'relative' }} className="first">
                    {isLoaded && (
                        <StandaloneSearchBox
                            onLoad={(ref) => {
                                inputRef.current = ref; // Set the inputRef to the StandaloneSearchBox
                            }}
                            onPlacesChanged={handlePlacesChanged} // Handle places change event
                        >
                            <input
                                type="text"
                                placeholder="Type an address"
                                className="google-search-input"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)} // Optional: to allow manual typing
                            />
                        </StandaloneSearchBox>
                    )}
                </div>

                <ConfirmationDialog isopen={isConfirmUpdateOpen} onClose={closeConfirmUpdate}/>
                <div className="first">
                    <div>
                        {isField ?
                            <div>
                                    <div>
                                        <h2 className="mt-8"> Address</h2>
                                        <p className="mt-8"><span>Line1 :</span> {addressDetails.line1}</p>
                                        <p className="mt-8"><span>City :</span> {addressDetails.city}</p>
                                        <p className="mt-8"><span>State :</span> {addressDetails.state}</p>
                                        <p className="mt-8"><span>County :</span> {addressDetails.county}</p>
                                        <p className="mt-8"><span>Country :</span> {addressDetails.country}</p>
                                        <p className="mt-8"><span>ZipCode :</span> {addressDetails.zip}</p>
                                        <PrimaryButton onClick={handleFieldmapping} className="mt-8">Select</PrimaryButton>
                                    </div>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}