import { createBrowserRouter } from 'react-router';
import TopScreen from './screens/TopScreen';
import TermsScreen from './screens/TermsScreen';
import QRScanScreen from './screens/QRScanScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import CalendarScreen from './screens/CalendarScreen';
import RecordQRScreen from './screens/RecordQRScreen';
import RecordConfirmScreen from './screens/RecordConfirmScreen';
import GameScreen from './screens/GameScreen';
import MenuScreen from './screens/MenuScreen';
import DeviceInfoScreen from './screens/DeviceInfoScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TopScreen />,
  },
  {
    path: '/terms',
    element: <TermsScreen />,
  },
  {
    path: '/qr-scan',
    element: <QRScanScreen />,
  },
  {
    path: '/registration',
    element: <RegistrationScreen />,
  },
  {
    path: '/calendar',
    element: <CalendarScreen />,
  },
  {
    path: '/record-qr',
    element: <RecordQRScreen />,
  },
  {
    path: '/record-confirm',
    element: <RecordConfirmScreen />,
  },
  {
    path: '/game',
    element: <GameScreen />,
  },
  {
    path: '/menu',
    element: <MenuScreen />,
  },
  {
    path: '/device-info',
    element: <DeviceInfoScreen />,
  },
]);
