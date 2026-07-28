// src/TrackBuilder.js
import * as THREE from 'three';
import { PitZoneShader } from './Shaders.js';

export class TrackBuilder {
    constructor(scene) {
        this.scene = scene;
        this.colliders = [];
        this.boostPads = [];
        this.pitZones = [];
        this.pitMaterial = null;
    }

    buildTrack() {
        // 1. Definição do Traçado 3D (Waypoints da Pista)
        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -400),
            new THREE.Vector3(200, 20, -700),
            new THREE.Vector3(500, 50, -600),
            new THREE.Vector3(400, 0, -200),
            new THREE.Vector3(200, -10, -100)
        ];

        const curve = new THREE.CatmullRomCurve3(points, true);
        const trackWidth = 24;
        const trackSegments = 400;

        // 2. Geometria da Pista via Extrusão
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const uvs = [];
        const indices = [];

        const curvePoints = curve.getSpacedPoints(trackSegments);
        const frames = curve.computeFrenetFrames(trackSegments, true);

        for (let i = 0; i <= trackSegments; i++) {
            const p = curvePoints[i];
            const normal = frames.normals[i];
            const binormal = frames.binormals[i];

            // Ponto Esquerdo e Direito
            const left = new THREE.Vector3().copy(p).addScaledVector(binormal, trackWidth / 2);
            const right = new THREE.Vector3().copy(p).addScaledVector(binormal, -trackWidth / 2);

            positions.push(left.x, left.y, left.z);
            positions.push(right.x, right.y, right.z);

            const progress = i / trackSegments;
            uvs.push(0, progress * 50);
            uvs.push(1, progress * 50);
        }

        for (let i = 0; i < trackSegments; i++) {
            const row1 = i * 2;
            const row2 = (i + 1) * 2;
            indices.push(row1, row1 + 1, row2);
            indices.push(row1 + 1, row2 + 1, row2);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        // Material Retrofuturista Escuro com Asfalto Metálico
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a12,
            roughness: 0.2,
            metalness: 0.8,
            side: THREE.DoubleSide
        });

        const trackMesh = new THREE.Mesh(geometry, trackMaterial);
        trackMesh.name = "TrackSurface";
        this.scene.add(trackMesh);
        this.colliders.push(trackMesh);

        // 3. Adiciona Guard-Rails com Neon Luminoso
        this._buildGuardRails(curvePoints, frames, trackWidth);

        // 4. Adiciona Boost Pads e Pit Areas no traçado
        this._buildInteractiveZones(curvePoints, frames, trackWidth);

        return { trackMesh, curve };
    }

    _buildGuardRails(points, frames, trackWidth) {
        const railMaterial = new THREE.MeshBasicMaterial({ color: 0xff007f });

        for (let i = 0; i < points.length; i += 2) {
            const p = points[i];
            const binormal = frames.binormals[i];

            const leftPos = new THREE.Vector3().copy(p).addScaledVector(binormal, trackWidth / 2);
            const rightPos = new THREE.Vector3().copy(p).addScaledVector(binormal, -trackWidth / 2);

            const railGeo = new THREE.BoxGeometry(0.5, 2, 4);

            const leftRail = new THREE.Mesh(railGeo, railMaterial);
            leftRail.position.copy(leftPos);
            leftRail.quaternion.setFromRotationMatrix(
                new THREE.Matrix4().lookAt(p, leftPos, frames.normals[i])
            );

            const rightRail = new THREE.Mesh(railGeo, railMaterial);
            rightRail.position.copy(rightPos);

            this.scene.add(leftRail);
            this.scene.add(rightRail);
        }
    }

    _buildInteractiveZones(points, frames, trackWidth) {
        // Boost Pad Magenta
        const boostGeo = new THREE.PlaneGeometry(8, 12);
        const boostMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide });

        const boostMesh = new THREE.Mesh(boostGeo, boostMat);
        const boostIndex = 50;
        boostMesh.position.copy(points[boostIndex]).add(new THREE.Vector3(0, 0.2, 0));
        boostMesh.rotation.x = Math.PI / 2;
        this.scene.add(boostMesh);
        this.boostPads.push(boostMesh);

        // Pit Zone (Shader Animado de Recarga de Energia)
        this.pitMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(PitZoneShader.uniforms),
            vertexShader: PitZoneShader.vertexShader,
            fragmentShader: PitZoneShader.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });

        const pitGeo = new THREE.PlaneGeometry(trackWidth / 3, 60);
        const pitMesh = new THREE.Mesh(pitGeo, this.pitMaterial);
        const pitIndex = 120;

        // Posição na lateral direita da pista
        const pitPos = new THREE.Vector3()
            .copy(points[pitIndex])
            .addScaledVector(frames.binormals[pitIndex], trackWidth / 4);

        pitMesh.position.copy(pitPos).add(new THREE.Vector3(0, 0.1, 0));
        pitMesh.rotation.x = Math.PI / 2;
        this.scene.add(pitMesh);
        this.pitZones.push(pitMesh);
    }

    update(deltaTime) {
        if (this.pitMaterial) {
            this.pitMaterial.uniforms.uTime.value += deltaTime;
        }
    }
}