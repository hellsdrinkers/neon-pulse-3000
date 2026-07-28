// src/AudioManager.js
export class AudioManager {
    constructor() {
        this.ctx = null;
        this.engineOsc = null;
        this.engineGain = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();

        // Sintetizador do som do Motor (Onda dente de serra + Filtro Passa-Baixas)
        this.engineOsc = this.ctx.createOscillator();
        this.engineGain = this.ctx.createGain();
        this.engineFilter = this.ctx.createBiquadFilter();

        this.engineOsc.type = 'sawtooth';
        this.engineOsc.frequency.setValueAtTime(60, this.ctx.currentTime); // Hz base

        this.engineFilter.type = 'lowpass';
        this.engineFilter.frequency.setValueAtTime(400, this.ctx.currentTime);

        this.engineGain.gain.setValueAtTime(0.1, this.ctx.currentTime);

        this.engineOsc.connect(this.engineFilter);
        this.engineFilter.connect(this.engineGain);
        this.engineGain.connect(this.ctx.destination);

        this.engineOsc.start();
        this.isInitialized = true;
    }

    updateEngineSound(speedRatio) {
        if (!this.isInitialized) return;
        // Modula a frequência da nota base e o corte do filtro de acordo com a velocidade
        const freq = 60 + (speedRatio * 220);
        const filterCutoff = 300 + (speedRatio * 2000);

        this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
        this.engineFilter.frequency.setTargetAtTime(filterCutoff, this.ctx.currentTime, 0.05);
    }

    playBoostSound() {
        if (!this.isInitialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playCollisionSound() {
        if (!this.isInitialized) return;
        // Barulho de colisão com Ruído Branco (White Noise)
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        whiteNoise.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start();
    }
}