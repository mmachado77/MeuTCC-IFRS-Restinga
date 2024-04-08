import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingSpinner = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="green-500" animationDuration=".5s" />
        </div>
    );
}

export default LoadingSpinner;