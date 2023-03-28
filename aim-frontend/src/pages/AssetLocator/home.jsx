
import { useLoadScript } from "@react-google-maps/api";
import Map from "./map";

export default function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCVwULpC0w_rQX7-iTNfPHrsT_rsETDSbs",
        libraries: ['places'],

    });

    if (!isLoaded) return <div>Loading...</div>;
    return <Map />;
}