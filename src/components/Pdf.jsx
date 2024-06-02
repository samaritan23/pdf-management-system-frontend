import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

const Pdf = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const zoomPluginInstance = zoomPlugin();
    const pdfjsVersion = '3.4.120'
    const location = useLocation()
    const { doc } = location.state


    return (
        <div style={{ height: '750px', width: '100%' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
                <Viewer
                    fileUrl={`${process.env.REACT_APP_S3_DOMAIN}${doc.file}`}
                    plugins={[
                        defaultLayoutPluginInstance,
                        zoomPluginInstance
                    ]}
                    defaultScale={SpecialZoomLevel.PageFit}
                />
            </Worker>
        </div>
    );
};

export default Pdf;
