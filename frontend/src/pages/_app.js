import { PrimeReactProvider } from 'primereact/api';
import './assets/css/globals.css';
import "tailwindcss/utilities.css";
import "primereact/resources/themes/lara-light-green/theme.css";
import 'primeicons/primeicons.css';

export default function MyApp({ Component }) {
    const value = {
        appendTo: 'self',
    };

    return (
        <PrimeReactProvider value={value}>
            <Component />
        </PrimeReactProvider>
    );
}
