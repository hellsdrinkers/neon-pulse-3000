// src/Shaders.js
import * as THREE from 'three';

/**
 * Shader customizado para a Pit Zone (Área de Recarga).
 * Utiliza animação temporal de ondas para dar a estética Cyberpunk.
 */
export const PitZoneShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00ffff) }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
            // Efeito de linhas diagonais rolando rapidamente
            float stripe = sin((vUv.y * 50.0) - (uTime * 15.0));
            stripe = smoothstep(0.1, 0.9, stripe);

            // Borda brilhante nas laterais
            float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);

            vec3 finalColor = uColor * (stripe + 0.4);
            float alpha = (stripe * 0.6 + 0.2) * edge;

            gl_FragColor = vec4(finalColor, alpha);
        }
    `
};