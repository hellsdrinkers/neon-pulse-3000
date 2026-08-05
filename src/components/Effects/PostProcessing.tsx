import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';

export function PostProcessingEffects() {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.5} 
        mipmapBlur 
        intensity={1.5} 
        radius={0.8}
      />
      <DepthOfField 
        focusDistance={0.01} 
        focalLength={0.2} 
        bokehScale={2} 
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
