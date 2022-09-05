import dynamic from 'next/dynamic';


type Props = {
  longitude: number;
  latitude: number;
};

const Map = dynamic<Props>(() => import('./VerificationMap') as any, {
  ssr: false
});

export default Map;