'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getAllVectorLayers } from '../../utils/api';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke, Text } from 'ol/style';

const VectorLayerPage = () => {
  const [allLayers, setAllLayers] = useState([]);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  const createTextStyle = (feature) => {
    return new Text({
      text: feature.get('vname'),
      font: '12px Calibri,sans-serif',
      fill: new Fill({ color: '#000' }),
      stroke: new Stroke({ color: '#fff', width: 3 }),
      overflow: true,
      placement: 'point'
    });
  };

  const createStyle = (feature) => {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.5)',
      }),
      stroke: new Stroke({
        color: '#FFFF00',
        width: 4,
      }),
      text: createTextStyle(feature)
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allLayerData = await getAllVectorLayers();
        setAllLayers(allLayerData);

        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(allLayerData, {
            featureProjection: 'EPSG:3857',
          }),
        });

        if (!mapRef.current) {
          const map = new Map({
            target: 'map',
            layers: [
              new TileLayer({
                source: new XYZ({
                  url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                  attributions: 'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>',
                }),
                zIndex: 0,
              }),
              new VectorLayer({
                source: vectorSource,
                style: (feature) => createStyle(feature),
                zIndex: 1,
              }),
            ],
            view: new View({
              center: [0, 0],
              zoom: 2,
            }),
          });

          mapRef.current = map;
        } else {
          const vectorLayer = mapRef.current.getLayers().getArray().find(layer => layer instanceof VectorLayer);
          if (vectorLayer) {
            vectorLayer.setSource(vectorSource);
            vectorLayer.setStyle((feature) => createStyle(feature));
          }
        }

        const extent = vectorSource.getExtent();
        mapRef.current.getView().fit(extent, { size: mapRef.current.getSize(), maxZoom: 12 });

      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      {error && <p className="text-red-500">{error}</p>}
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default VectorLayerPage;
