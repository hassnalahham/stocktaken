import React, { Component } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';

class BarcodeScanner extends Component {
 constructor(props) {
    super(props);
    this.state = {
      barcode: ''
    };
 }

 componentDidMount() {
    this.startScanning();
 }

 componentWillUnmount() {
    this.stopScanning();
 }

 startScanning = () => {
    this.codeReader = new BrowserBarcodeReader();
    this.codeReader.getVideoInputDevices()
      .then(videoInputDevices => {
        if (videoInputDevices.length === 0) {
          throw new Error('No video input devices found');
        }
        const selectedDeviceId = videoInputDevices[0].deviceId;
        return this.codeReader.decodeFromInputVideoDevice(selectedDeviceId, this.previewElem)
      })
      .then(result => {
        this.setState({ barcode: result.text }, () => {
          // Restart the scanner after updating the state, but only if the barcode is not empty
          if (this.state.barcode !== '') {
            this.stopScanning();
            setTimeout(this.startScanning, 0);
          }
        });
        this.codeReader.reset();
        this.codeReader.stopAsyncDecode();
    })
      .catch(err => console.error(err));
 }

 stopScanning = () => {
    if (this.codeReader) {
      this.codeReader.reset();
      this.codeReader.stopAsyncDecode();
    }
 }

 render() {
    return (
      <div>
        <video id="preview" ref={elem => this.previewElem = elem} style={{ width: '100%' }}></video>
        <p>Scanned Barcode: {this.state.barcode}</p>
       
      </div>
    );
 }
}

export default BarcodeScanner;