// src/ShipController.js
import * as THREE from 'three';

export class ShipController {
    constructor(scene, raycastColliders) {
        this.scene = scene;
        this.colliders = raycastColliders;

        // --- Configurações Físicas ---
        this.targetHoverHeight = 2.5; // Distância mantida do chão
        this.springStiffness = 120.0; // Constante de mola (ks)
        this.springDamping = 10.0;    // Amortecimento (kd)

        this.maxSpeed = 180.0;        // Velocidade Normal Max (unidades/s)
        this.boostSpeed = 320.0;      // Velocidade sob Boost
        this.acceleration = 120.0;
        this.braking = 160.0;
        this.turnSpeed = 2.2;
        this.driftFriction = 0.94;    // Coeficiente de atrito lateral (deslize)

        // --- Estado do Jogador ---
        this.velocity = new THREE.Vector3();
        this.verticalVelocity = 0;
        this.currentSpeed = 0;
        this.energy = 100.0;           // Vida & Recurso de Boost
        this.maxEnergy = 100.0;
        this.isBoosting = false;
        this.isGrounded = false;

        // --- Entradas do Usuário ---
        this.inputs = { forward: false, backward: false, left: false, right: false, boost: false };

        // --- Elementos Visuais da Nave ---
        this.mesh = this._createShipMesh();
        this.scene.add(this.mesh);

        this.raycaster = new THREE.Raycaster();
        this._setupInputs();
    }

    _createShipMesh() {
        const group = new THREE.Group();

        // Corpo Futurista Aerodinâmico
        const bodyGeo = new THREE.ConeGeometry(1.2, 4, 5);
        bodyGeo.rotateX(Math.PI / 2);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x0044aa
        });

        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(bodyMesh);

        // Turbinas Neon
        const engineGeo = new THREE.CylinderGeometry(0.4, 0.4, 1);
        const engineMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
        const engineMesh = new THREE.Mesh(engineGeo, engineMat);
        engineMesh.rotation.x = Math.PI / 2;
        engineMesh.position.set(0, 0, 1.8);
        group.add(engineMesh);

        return group;
    }

    _setupInputs() {
        window.addEventListener('keydown', (e) => this._handleKey(e.code, true));
        window.addEventListener('keyup', (e) => this._handleKey(e.code, false));
    }

    _handleKey(code, isPressed) {
        switch (code) {
            case 'KeyW': case 'ArrowUp': this.inputs.forward = isPressed; break;
            case 'KeyS': case 'ArrowDown': this.inputs.backward = isPressed; break;
            case 'KeyA': case 'ArrowLeft': this.inputs.left = isPressed; break;
            case 'KeyD': case 'ArrowRight': this.inputs.right = isPressed; break;
            case 'Space': case 'ShiftLeft': this.inputs.boost = isPressed; break;
        }
    }

    update(deltaTime, audioManager) {
        if (deltaTime > 0.1) deltaTime = 0.1; // Trava de estabilidade de FPS baixo

        // 1. Raycast para o Chão (Flutuação Antimassa)
        const downVector = new THREE.Vector3(0, -1, 0).applyQuaternion(this.mesh.quaternion);
        this.raycaster.set(this.mesh.position, downVector);
        const intersects = this.raycaster.intersectObjects(this.colliders, true);

        this.isGrounded = false;
        if (intersects.length > 0 && intersects[0].distance < this.targetHoverHeight * 2.5) {
            const hit = intersects[0];
            const distance = hit.distance;
            this.isGrounded = true;

            // Equação da Mola-Amortecedor: F = -k * x - d * v
            const deltaHeight = this.targetHoverHeight - distance;
            const springForce = deltaHeight * this.springStiffness - this.verticalVelocity * this.springDamping;

            this.verticalVelocity += springForce * deltaTime;

            // Alinhamento suave da orientação da Nave à Normal da Pista (Slerp)
            const targetRotation = new THREE.Quaternion();
            const upVector = new THREE.Vector3(0, 1, 0);
            targetRotation.setFromUnitVectors(upVector, hit.face.normal);
            this.mesh.quaternion.slerp(targetRotation, 10.0 * deltaTime);
        } else {
            // Gravidade Normal em caso de queda fora da pista
            this.verticalVelocity -= 25.0 * deltaTime;
        }

        this.mesh.position.y += this.verticalVelocity * deltaTime;

        // 2. Lógica de Boost e Consumo de Energia
        let topSpeed = this.maxSpeed;
        if (this.inputs.boost && this.energy > 5) {
            this.isBoosting = true;
            topSpeed = this.boostSpeed;
            this.energy -= 20.0 * deltaTime; // Consome energia ativamente
            if (audioManager) audioManager.playBoostSound();
        } else {
            this.isBoosting = false;
        }

        // 3. Aceleração, Freio e Inércia
        if (this.inputs.forward) {
            this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, topSpeed, this.acceleration * deltaTime * 0.01);
        } else if (this.inputs.backward) {
            this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, 0, this.braking * deltaTime * 0.01);
        } else {
            // Resistência do Ar / Drag
            this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, 0, 0.5 * deltaTime);
        }

        // 4. Esterçamento (Steering & Strafing Dynamic)
        if (this.inputs.left) {
            this.mesh.rotateY(this.turnSpeed * deltaTime);
            this.mesh.rotation.z = THREE.MathUtils.lerp(this.mesh.rotation.z, 0.35, 8.0 * deltaTime); // Inclinação visual
        } else if (this.inputs.right) {
            this.mesh.rotateY(-this.turnSpeed * deltaTime);
            this.mesh.rotation.z = THREE.MathUtils.lerp(this.mesh.rotation.z, -0.35, 8.0 * deltaTime);
        } else {
            this.mesh.rotation.z = THREE.MathUtils.lerp(this.mesh.rotation.z, 0, 8.0 * deltaTime);
        }

        // 5. Cálculo do Vetor de Movimento com Deslize (Drift Decay)
        const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion);

        // Decompõe velocidade em Vetor Frontal
        const forwardVelocity = forwardDir.clone().multiplyScalar(this.currentSpeed);
        this.velocity.lerp(forwardVelocity, this.driftFriction);

        this.mesh.position.addScaledVector(this.velocity, deltaTime);

        // Atualização de Áudio
        if (audioManager) {
            audioManager.updateEngineSound(this.currentSpeed / this.maxSpeed);
        }
    }

    applyDamage(amount) {
        this.energy = Math.max(0, this.energy - amount);
    }

    rechargeEnergy(amount) {
        this.energy = Math.min(this.maxEnergy, this.energy + amount);
    }
}