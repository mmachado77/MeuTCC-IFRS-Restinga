import { PrimeReactProvider } from 'primereact/api';
import '../assets/css/globals.css';
import "tailwindcss/utilities.css";
import "primereact/resources/themes/lara-light-green/theme.css";
import 'primeicons/primeicons.css';
import { AppLayout } from 'meutcc/components/layouts/AppLayout';

export default function MyApp({ Component, pageProps }) {

    const getLayout = page => <AppLayout logged={Component.logged || false} showMenu={Component.showMenu || false}>{page}</AppLayout>;

    return (
        <PrimeReactProvider>
            {getLayout(<Component {...pageProps} />)}
        </PrimeReactProvider>
    );
}
