import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { FaBeer } from "react-icons/fi";
import SearchLocator from "../../components/Search/SearchLocator";
import assetService from "../../services/assetService";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  Autocomplete,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components";
import locationService from "../../services/locationService";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Map() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [locations, setLocatiions] = useState([]);
  const [filtervalue, setFilterValue] = useState("");
  const [labels, setLabels] = useState({});
  const [assettotal, setAssettotal] = useState();
  const [positions, setPositions] = useState({
    lat: 25.5010432,
    lng: 54.3070535,
  });
  const [zoom, setZoom] = useState(false);
  const [gps, setGps] = useState();
  const center = useMemo(
    () => ({
      lat: 25.5010432,
      lng: 54.3070535,
    }),
    []
  );
  const marker = [
    {
      lat: 25.197777860646802,
      lng: 55.28199131138041,
    },
    {
      lat: 25.187777860646802,
      lng: 55.26199131138041,
    },
    {
      lat: 25.186777860646802,
      lng: 55.26299131138041,
    },
  ];

  const options = useMemo(
    () => ({
      mapId: "26037525175ebee3",
      disableDefaultUI: true,
      ClickebleIcons: false,
    }),
    []
  );

  const getAssets = async () => {
    if (filtervalue) {
      let data = {
        search: filtervalue.replace("+", /\s/g),
      };

      let datas = await assetService.getAllAssets(data);
      if (datas?.assets?.length === 1) {
        setLocatiions(datas?.assets);
        setPositions({
          lat: parseFloat(datas?.assets[0]?.locationLatitude),
          lng: parseFloat(datas?.assets[0]?.locationLongitude),
        });
      }
      if (
        datas?.assets?.length === 0 ||
        datas?.assets?.length === undefined ||
        datas?.assets?.length > 1
      ) {
        let filter = {};
        filter = {
          search: filtervalue,
        };
        let datas = await locationService.getLocation(filter);

        setAssets(datas?.data);
        setLocatiions([]);
        setPositions({
          lat: parseFloat(datas?.data[0]?.gpsCord?.split(",")[0]),
          lng: parseFloat(datas?.data[0]?.gpsCord?.split(",")[1]),
        });
        if (datas?.data[0]?.gpsCord === undefined) {
          toast.error("No location found");
        }
      }
      if (filtervalue != "" && filtervalue != undefined) {
        setZoom(true);
      } else {
        setZoom(false);
      }
    } else {
      let search = "";
      let filter = {};
      filter = {
        search: filtervalue,
      };
      let datas = await locationService.getLocation(filter);

      setAssets(datas?.data);
      setPositions({
        lat: parseFloat(datas?.data[0]?.gpsCord?.split(",")[0]),
        lng: parseFloat(datas?.data[0]?.gpsCord?.split(",")[1]),
      });

      if (filtervalue != "" && filtervalue != undefined) {
        setZoom(true);
      } else {
        setZoom(false);
      }
    }
  };

  const getEnter = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      getAssets();
    }
  };

  useEffect(() => {
    getAssets();
  }, []);

  const cancelAll = async () => {
   
    setFilterValue("");
    let datas = await locationService.getLocation();
    setLocatiions([]);
    setAssets(datas?.data);
    setPositions({
      lat: parseFloat(datas?.data[0]?.gpsCord?.split(",")[0]),
      lng: parseFloat(datas?.data[0]?.gpsCord?.split(",")[1]),
    });
    setZoom(false);
  };

  let total = 0;
  const getTotal = (item) => {
    return (total = total + item);
  };

  return (
    <>
      <div className="app__header">
        <h2 className="app__header--title">Asset Locator</h2>
      </div>
      <Card variant="remove-header" className="locator-card">
        <SearchLocator
          placeholder="Enter GPS/Equipment Tag/RFID"
          className="map-search"
          onChange={(e) => setFilterValue(e.target.value)}
          getAssets={getAssets}
          cancelAll={cancelAll}
          value={filtervalue ? filtervalue : ""}
          getEnter={getEnter}
        />

        <div className="asset-locator">
          {/*for future updation*/}
          {/* <HStack spacing={2} justifyContent='space-between'>
                        <Box flexGrow={1}>
                            <Autocomplete>
                                <Input type='text' placeholder='Origin' />
                            </Autocomplete>
                        </Box>
                        <Box flexGrow={1}>
                            <Autocomplete>
                                <Input
                                    type='text'
                                    placeholder='Destination'

                                />
                            </Autocomplete>
                        </Box>

                        <ButtonGroup>
                            <Button colorScheme='pink' type='submit' >
                                Calculate Route
                            </Button>
                            <IconButton
                                aria-label='center back'
                                icon={<FaTimes />}

                            />
                        </ButtonGroup>
                    </HStack> */}
          {locations.length === 1 ? (
            <GoogleMap
              zoom={zoom === true ? 7 : 4}
              center={positions && positions}
              mapContainerClassName="asset-locator"
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              {locations?.map((item, index) => {
                let locatorFilter = [];
                locatorFilter = filtervalue;
                if (item.locationLatitude) {
                  let lat = parseInt(item.locationLatitude);
                  let lng = parseInt(item.locationLongitude);
                  let position = {
                    lat: lat,
                    lng: lng,
                  };
                  let text = "";
                  let label = {
                    text: "1",
                    color: "	black",
                    fontWeight: "bold",
                    fontSize: "12px",
                  };

                  return (
                    <Marker
                      key={index}
                      position={position ? position : ""}
                      options={middleOptions}
                      label={label}
                      title={item.area.toString()}
                      icon="http://i.imgur.com/3YJ8z.png"
                      onClick={() => {
                        navigate("/asset-register", {
                          state: {
                            previousPage: "Location",
                            locatorFilter: { locatorFilter },
                          },
                        });
                      }}
                    />
                  );
                }
              })}
            </GoogleMap>
          ) : (
            <GoogleMap
              zoom={zoom === true ? 9 : 4}
              center={positions && positions}
              mapContainerClassName="asset-locator"
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              {assets.map((item, index) => {
                let locationId = [];
                locationId = item.locationId;
                if (item.gpsCord) {
                  let latlng = item?.gpsCord.split(",");
                  let lat = parseFloat(latlng[0]);
                  let lng = parseFloat(latlng[1]);
                  let position = {
                    lat: lat,
                    lng: lng,
                  };
                  let text = "";
                  let label = {
                    text: item.assets.toString(),
                    color: "	black",
                    fontWeight: "bold",
                    fontSize: "12px",
                  };

                  return (
                    <Marker
                      key={index}
                      position={position ? position : ""}
                      label={label}
                      options={middleOptions}
                      title={item.area.toString()}
                      icon="http://i.imgur.com/3YJ8z.png"
                      onClick={() => {
                        navigate("/asset-register", {
                          state: {
                            previousPage: "Location",
                            locationId: { locationId },
                          },
                        });
                      }}
                    />
                  );
                }
              })}
            </GoogleMap>
          )}
        </div>
        {locations.length === 1 ? (
          <span className="total-assets">1 Asset Found</span>
        ) : (
          assets.map((item, i) => {
            let total = 0;

            return (
              <span className="total-assets">
                {getTotal(item.assets)} Assets Found
              </span>
            );
          })
        )}
      </Card>
    </>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};
