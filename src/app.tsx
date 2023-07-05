/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { usePrinter } from '@ombori/ga-thermal-printer-react';
import { useHeartbeat } from '@ombori/ga-messaging';

const testData = {
  title: 'UPSIDEDOWN',
  dateTime: '02.12.2021 12:00',
  store: "Jovanni's Store",
  instruction: 'Take this receipt to the nearest cash register to complete the purchase.',
  thankYouMessage: 'Thank you for shopping with us!',
  items: [
    {
      title: 'LAVATOIO 60CM ROVERE CHIARO MONDO 2.0',
      sku: '527030',
      price: '$00.00',
      barcode: '978020137962'
    },
    {
      title: 'DISPENSER SAPONE BIANCO LINEA POP',
      sku: '006001',
      price: '$00.00',
      barcode: '978020137444'
    },
    {
      title: 'P/SAPONE BIANCO LINEA POP',
      sku: '006001',
      price: '$00.00',
      barcode: '978020137666'
    }
  ],
};

function App() {
  useHeartbeat();
  const [error, setError] = React.useState('');
  const [toastMsg, setToastMsg] = React.useState('');
  const { printerInfo, printerInstance } = usePrinter();

  const onPrint = React.useCallback(async () => {
    try {
      if (printerInstance) {
        printerInstance.alignLeft();
        printerInstance.bold(true);
        printerInstance.setTextSize(1, 1);
        printerInstance.println(testData.title);
  
        printerInstance.newLine();
  
        printerInstance.bold(false);
        printerInstance.setTextSize(.5, .5);
        printerInstance.println(testData.dateTime);
        printerInstance.println(testData.store);
  
        printerInstance.partialCut();
        printerInstance.upsideDown(true);
        printerInstance.execute();
        console.log('printing job started');
      } else {
        setToastMsg('Printer not detected');
      }
    } catch (err) {
      setToastMsg((err as any).message);
      console.log(err);

      console.error(`Failed to print ticket: ${err}`);
    }
  }, [error, printerInstance]);

  useEffect(() => {
    console.log('printerInfo:', printerInfo);
    if (!printerInfo) {
      setError('Printer not detected');
    } else {
      setError('');
    }
  }, [printerInfo]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (toastMsg) {
      timeout = setTimeout(() => {
        setToastMsg('');
      }, 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, [toastMsg]);

  return (
    <Container>
      {printerInfo && <p>{JSON.stringify(printerInfo)}</p>}
      {!error && !toastMsg && (
        <button style={{ color: 'black', fontSize: '72px', padding: '32px', paddingLeft: '72px', paddingRight: '72px', borderRadius: '16px' }} onClick={onPrint}>
          PRINT
        </button>
      )}
      {(error || toastMsg) && <p style={{ color: 'red', fontSize: '72px' }}>{toastMsg ? toastMsg : error}</p>}
    </Container>
  );
}

const Container = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  text-align: center;
`;

export default App;
