# GAME EVOLUTION ROADMAP - NEON PULSE 3000

**Data de Início do Ciclo:** Agosto 2026  
**Duração do Ciclo:** 12 Meses  
**Objetivo:** Transição de Protótipo Técnico R3F para Lançamento Comercial Steam (Premium Indie AAA Quality).

---

## 1. VISÃO GERAL

### Estado Atual do Projeto
O projeto "Neon Pulse 3000" encontra-se atualmente na fase de **Protótipo (Pre-Alpha)**. Ele serve como uma prova de conceito funcional para testar a escalabilidade do React Three Fiber (R3F) na web.
- **Maturidade Técnica:** Baixa. Ausência de instanciamento, acoplamento de lógica de física com lógica de input no `Ship.tsx`, ausência de arquitetura ECS estrita ou Object Pooling.
- **Maturidade Artística:** Baixa. Placeholder-heavy. Geometrias primitivas, geração procedural básica, materiais dependentes exclusivamente de sliders do Three.js (sem texturas físicas bakes).
- **Maturidade do Gameplay:** Mínima. Movimentação cinemática presente (Drift, Boost, Forward/Backward), IA limitadíssima, sem sistemas de penalidades severas, combate ou *Game Feel* responsivo.
- **Maturidade da Arquitetura:** Média-Baixa. Uso competente do `Zustand` para desacoplar a UI do loop WebGL, porém carece de separação de domínios (Physics, Render, AI, Network).

**Estágios de Desenvolvimento:**
- [x] Protótipo (Momento Atual)
- [ ] Vertical Slice (Mês 3)
- [ ] Alpha (Mês 6)
- [ ] Beta (Mês 9)
- [ ] Release Candidate (Mês 11)
- [ ] Release Comercial (Mês 12)

---

## 2. VISÃO DO PRODUTO

**Visão Final:** Um jogo de corrida anti-gravidade brutal, hiperveloz e visualmente esmagador que define o ápice do limite gráfico atingível em motores baseados em Web/JS, mas empacotado e otimizado via Electron/Tauri para distribuição nativa na Steam.

- **Identidade:** Cyberpunk Brutalista Corrosivo. A antítese do synthwave limpo. Pistas esburacadas em megacidades decrépitas iluminadas por letreiros neon que falham constantemente.
- **Diferenciais:** Integração total de HUD Diegética (na nave), física de fluidos para poças de neon interativas e deformação geométrica procedural das pistas baseada no som dinâmico da trilha (Audio-Reactive Racing).
- **Público-Alvo:** Fãs de Wipeout, F-Zero, Redout 2 e jogadores hardcore de speedrunning.
- **Pilares do Gameplay:** Domínio da Inércia (Risk/Reward), Agressividade Tática, Fluxo Visual Ininterrupto.
- **Direção Artística:** "Hiper-Realismo Sujo". Uso denso de Volumetria, PBR Texturing e aberrações ópticas anomálicas de lente.
- **Direção Técnica:** Foco absoluto na estabilidade de Frame Time (< 16ms, 60fps mínimo) via InstancedRendering agressivo e GPU Compute Shaders para partículas e física de massa.

---

## 3. PILARES DE DESENVOLVIMENTO

Toda *feature*, *shader* ou linha de código aprovada neste estúdio deverá fortalecer imperativamente pelo menos um destes cinco pilares:

1. **VELOCIDADE BRUTAL:** A sensação de deslocamento tem que causar vertigem visual.
2. **ATMOSFERA OPRESSIVA:** O jogador precisa se sentir uma formiga diante da megalópole através do uso de escalas arquitetônicas maciças.
3. **IMPACTO TÁTIL (GAME FEEL):** Cada colisão ou boost deve transmitir peso ao jogador via *Screen Shake*, *Hit Stop* e design de áudio denso.
4. **PERFORMANCE INTRANSIGENTE:** 60 FPS travados. Nenhum *garbage collection stutter* do JS é aceitável durante o loop de jogo.
5. **LEITURA VISUAL IMEDIATA:** Mesmo a 400km/h com partículas cegantes, o traçado da pista precisa ser perfeitamente distinguível instantaneamente.

---

## 4. ROADMAP DE FASES (12 Meses)

### FASE 1: Consolidação Técnica (Mês 1)
- **Objetivos:** Refatorar a base R3F para ECS (Entity Component System) puro. Implementar `InstancedMesh`.
- **Resultados esperados:** Renderizar 10.000 prédios a 60 FPS (crescimento de 2500%).
- **Riscos:** Sobrecarga de memória via JS/WASM interop (se utilizar bibliotecas pesadas).

### FASE 2: Motor Visual e Render Pipeline (Mês 2)
- **Objetivos:** Migrar para Pós-processamento customizado e *Screen Space Reflections* (SSR).
- **Resultados esperados:** Reflexos otimizados globais substituindo o `MeshReflectorMaterial`. Tone mapping cinematográfico (LUTs).

### FASE 3: Direção de Arte e Cidade Modular (Mês 3 - VERTICAL SLICE)
- **Objetivos:** Substituir primitivas por kits modulares modelados no Blender (.gltf).
- **Resultados esperados:** A cidade parece uma metrópole real cyberpunk; os veículos ganham designs PBR esculpidos de qualidade comercial.

### FASE 4: Game Feel e Câmera (Mês 4)
- **Objetivos:** Programar inércia de curva, *camera shakes* atrelados à física, e FoV distortion avançado.
- **Resultados esperados:** A nave ganha peso; a aceleração ganha sensação de perigo.

### FASE 5: Combate e Destruição (Mês 5)
- **Objetivos:** Inserir sistemas de escudo, ramming (batida lateral) e explosões fraturadas.
- **Resultados esperados:** Oponentes podem ser destruídos; colisões geram faíscas massivas via Compute Shaders.

### FASE 6: Inteligência Artificial (Mês 6 - ALPHA)
- **Objetivos:** Programar NavMeshes, *Steering Behaviors* avançados (Boids/Avoidance) e Rubber-Banding adaptativo.
- **Resultados esperados:** Oponentes disputam posições agresivamente e reagem dinamicamente à pista e a ataques.

### FASE 7: Level Design de Pistas (Mês 7)
- **Objetivos:** Construir ferramentas baseadas em Splines/Curvas de Bézier interativas.
- **Resultados esperados:** 10 mapas únicos (com túneis, saltos, espirais invertidas, forks na pista).

### FASE 8: Som e Música Dinâmica (Mês 8)
- **Objetivos:** Integrar motor FMOD ou WebAudio avançado. Trilha adaptativa.
- **Resultados esperados:** O som do motor responde à inércia. O cenário pulsa junto com os graves da música Synthwave.

### FASE 9: Metagame, UI/UX e Progressão (Mês 9 - BETA)
- **Objetivos:** Criar menus, garagens de customização de naves, campeonatos, save system.
- **Resultados esperados:** Jogo adquire loop de retenção contínua e estrutura e-sport/campanha.

### FASE 10: Polimento, Debug e Otimização (Mês 10 - 12)
- **Objetivos:** Caça aos bugs. Ajuste de balanceamento. Implementação de Frustum Culling refinado.
- **Resultados esperados:** Jogo atinge estado "Gold", pronto para certificação Steam e consoles.

---

## 5. ESTRUTURA DE SPRINTS (Exemplo Prático)

**Sprint 04: "Performance Foundation"**
- **Objetivo:** Erradicar o gargalo da Geração de Cidade no render loop.
- **Tempo Estimado:** 2 semanas.
- **Arquivos Afetados:** `CyberCity.tsx`, `App.tsx`.
- **Sistemas Afetados:** Render Pipeline, Memory Management.
- **Dependências:** Ferramenta interna de conversão de coordenadas para matrizes instanciadas.
- **Complexidade:** Alta.
- **Impacto Visual:** Baixo (Visual mantém-se).
- **Impacto Técnico:** Crítico. Reduzirá Draw Calls de ~800 para ~10.
- **Risco:** Alto (quebra completa do componente de cidade durante a refatoração).
- **Critérios de Aceitação:** Cena roda a sólidos 60FPS no hardware mínimo alvo (GTX 1060) com 5.000 instâncias visíveis de prédios.

---

## 6. PRODUCT BACKLOG (Amostragem)

### Categoria: Rendering & Performance
- **[Alta]** Substituir Arrays de Meshes em `CyberCity.tsx` por `THREE.InstancedMesh`.
- **[Alta]** Remover `MeshReflectorMaterial` e implementar `SSRPass` no Composer.
- **[Média]** Oclusão espacial (Frustum Culling manual baseada em Octree) para a cidade.

### Categoria: Gameplay
- **[Alta]** Mover a física do `useFrame` central para um loop fixo (`fixed step`) em WebWorker.
- **[Alta]** Adicionar função de Colisão Tangencial: O carro desliza pela parede criando faíscas ao invés de perder toda a inércia em `x *= 0.9`.
- **[Média]** Implementar Draft (Vácuo) aerodinâmico quando se corre atrás de oponentes.

### Categoria: VFX & Shaders
- **[Alta]** Shader de *Heat Haze* na distorção do fundo gerada pelos escapes de plasma.
- **[Média]** Radial Motion Blur Post-Process material vinculado ao `Speed` no Zustand.
- **[Baixa]** Shader procedural chuvoso na tela da câmera.

---

## 7. DÍVIDAS TÉCNICAS ATUAIS

| Dívida Técnica | Impacto | Risco | Esforço | Prioridade | Resolução |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Ausência de Instancing** (Prédios como Groups) | Gargalo CPU Severo | Alto | Médio | Crítica | Imediatamente (Fase 1) |
| **Acoplamento em `Ship.tsx`** (Input, Rendering, AI, Fisica juntos) | Manutenção Lenta | Alto | Baixo | Alta | Sprint de Refactoring 01 |
| **Geração Procedural Fixa em Load** | Loading Time Gigante e Imobilidade | Baixo | Alto | Média | Fase 7 (Streaming Maps) |
| **Renderização Dupla do Asfalto** (`MeshReflectorMaterial`) | Gargalo GPU Overdraw | Alto | Médio | Crítica | Mês 2 (SSR Migration) |

---

## 8. PLANO DE REFATORAÇÕES ARQUITETURAIS

**1. Desmembramento do `Ship.tsx`**
O componente atual é um **Deus**. Ele deve ser desmembrado em uma arquitetura de composição baseada em Custom Hooks puros:
- `usePlayerInput()`: Apenas escuta Drei e converte para intenção vetorial.
- `useHoverPhysics(intentVector)`: Processa matriz matemática num delta frame.
- `useShipVFX()`: Conecta a física às turbinas emissivas e `Trail`.
- `ShipModel.tsx`: Componente burro puramente focando na renderização GLTF da fuselagem.

**2. Padrão Arquitetural Alvo:**
Migraremos para um sistema **Feature-Based híbrido com Data-Oriented Design (DOD)**:
- Store (Zustand) guardará APENAS o state estrito não mutável a 60fps, ou matrizes lineares para leitura da HUD. Matrizes densas 3D ficarão guardadas em *Refs* puras de contexto para não disparar render-cycles do React.
- `Object Pooling` de Singleton Managers cuidará da emissão contínua de detritos, power pads instantâneos e projéteis.

---

## 9. ROADMAP VISUAL (Ordem Lógica)

A evolução artística segue a premissa de *Foundation to Polish*:
1. **Modelagem Modular & GLTFs (Substitui Primitivas):** Sem geometria correta (Bakes Normals/PBR), luz não interage bem. 
2. **Iluminação Global & HDRI (Skybox Noturno):** Para os PBRs reagirem realisticamente.
3. **Materials (PBR Avançado + Shaders de Holograma):** Substituição de plásticos de slider por texturas concretas/metal enferrujado.
4. **Pós-processamento Base (Bloom sujo, Color Grading/LUT, Tone mapping):** Para assentar a cor da cena e criar a atmosfera ciberpunk corrosiva.
5. **Partículas e VFX (Sparks, Chuva, Rastro turbina):** Dão vida e reatividade física.
6. **Efeitos de Lente (Lens Dirt, Motion Blur Radial, CA):** Para vender escala de velocidade e sensação cinematográfica.

---

## 10. ROADMAP GAMEPLAY

- **Mês 1-2 (Piloto):** Ajuste fino do *SmoothDamping* e inércia das naves. Implementação rigorosa do Game Feel de peso da direção.
- **Mês 3-4 (Colisão e Risco):** Implementação de dano vetorial (Bater de frente machuca mais que ralar de lado). Risco/Recompensa do Boost sacrificando vida (Core). 
- **Mês 5-6 (Circuito AI):** Navegação Spline-based. Naves sabem onde é a frente, laterais, e quando frear em curvas fechadas. Táticas básicas (Aggressive, Defensive).
- **Mês 7-8 (Competitivo e Poderes):** Adição de "Slipstream" (vácuo) para ultrapassagens de precisão. Pickups (Shields, EMPs, Sabotage fields). Modos Eliminator.

---

## 11. ROADMAP TÉCNICO E ENGENHARIA

- **Arquitetura (ECS e Instancing):** Migração das `BoxGeometry` da cidade para 3 `THREE.InstancedMesh` massivos mantidos em um pool fora da árvore React, se necessário.
- **Streaming & LOD (Level of Detail):** A cidade desaparecer no nevoeiro não impede a GPU de calcular vértices na geometria. Precisamos de *Frustum Culling* habilitado na cidade e modelos com menos polígonos no Z-Far.
- **Ferramentas Internas:** Construção de um "Editor" de pista web rodando sobre o R3F, onde Level Designers arrastam pontos spline para gerar o asfalto.
- **Performance Tooling:** Instalação de stats.js e react-three-perf monitorando a CI pipeline ativamente.

---

## 12. ROADMAP ARTÍSTICO

**Prioridade Altíssima:**
- **Atmosfera/Clima/Neblina:** Trocar `FogExp2` plano por Volumetria *Height-Based*. (Crucial para atmosfera urbana chuvosa e sombria).
- **Assets PBR:** Naves com carenagens cheias de placas e arranhões, asfalto com poças em normal maps, edifícios modulares brutalistas.
**Prioridade Média:**
- **Neons/Hologramas Diégeticos:** Propagandas gigantes em 3D, *Scanlines* correndo nos outdoors procedurais da cidade.
- **Skyline:** Skybox gerando ilusão de milhões de luzes piscantes e planetas/estruturas da megacidade bloqueando as estrelas.

---

## 13. PLANO ESPECÍFICO DE PERFORMANCE

- **GPU (Draw Calls):** Otimizar a Cidade. Colapsar os *Materials* para usar uma única textura atlas global para toda a metrópole (Texture Atlasing). 
- **CPU (Física e IA):** Tirar a Matemática densa da thread de UI do JS; delegar raycasting e *steering behaviors* da IA para um *WebWorker* paralelo via `comlink`.
- **Memória (Object Pooling):** Instanciar 5.000 partículas para faíscas no carregamento, reposicionando-as invisivelmente durante batidas, eliminando a criação de objetos lixo (`new Vector3()`) a cada quadro do *useFrame*.

---

## 14. MARCOS DE LANÇAMENTO (MILESTONES)

1. **Protótipo Interativo (DONE):** Corrida 3D fluída em WebGL base R3F.
2. **Vertical Slice (Mês 3):** Uma única pista e 1 nave, mas na Qualidade Final AAA visual e de gameplay da Steam. Otimizado a 60fps.
3. **Primeiro Trailer & Steam Page (Mês 4):** Lançamento do Marketing com o *Slice* para coleta de Wishlists.
4. **Alpha (Mês 6):** Sistemas de Física, AI, e Tools completos. Assets *in progress*.
5. **Beta (Demo Steam - Mês 8):** Jogo fechado (feature-lock). Apenas pistas e conteúdo. Participação no Steam Next Fest com a Demo.
6. **Closed/Open Test (Mês 9-10):** Polimento e coleta do feedback de dificuldade (Rubber-Banding AI).
7. **Release (Mês 12):** Lançamento Comercial V1.0.

---

## 15. RISCOS DO PROJETO

| Risco | Nível | Mitigação |
| :--- | :---: | :--- |
| **Gargalo CPU Javascript (GC Stutters)** | Crítico | Pre-alocar todas as instâncias de Vectors, Quaternions na inicialização. Evitar métodos funcionais `.map/.filter` em Loops 60fps. |
| **Limitações do WebGL2 (Shaders)** | Alto | Não competir 1:1 com Unreal 5 Nanite. Apostar na forte *Direção de Arte* hiperestilizada para mascarar a falta de geometria bruta complexa. |
| **Design de IA monótono** | Médio | Criar perfis comportamentais para IA. Erros injetados de forma randômica (IA bate na parede) para passar sentimento de organicidade humana. |
| **Arquitetura React-State (Zustand)** | Médio | Usar a store transitoriamente (não reativa nos frames vitais, acessada via `.getState()`) garantindo que React Hooks de UI não reajam a 60Hz derretendo o DOM. |

---

## 16. MÉTRICAS DE SUCESSO

1. **Métrica Técnica Absoluta:** O frame-time jamais pode oscilar acima de `16.6ms` no hardware Target Base (GTX 1060), assegurando 60fps líquidos ininterruptos.
2. **Tempo de Carregamento:** Do play ao circuito: inferior a 8 segundos. `Suspense` bem estruturado com preload da malha global.
3. **Qualidade Visual (Visual Readability):** Em blind tests, 9 de 10 jogadores devem conseguir traçar com os olhos o caminho na pista em 0.5 segundos sob altas velocidades noturnas com o motion blur ligado.
4. **Game Feel (Retenção Demo):** Tempo médio de jogo na Steam Demo superior a 30 minutos (sinalizando loop viciante e peso mecânico agradável).

---

## 17. CHECKLIST DE LANÇAMENTO (GO LIVE)

- [ ] Memória validada sem *Leaks* após 4h ininterruptas no Canvas.
- [ ] Otimização *Draw-calls* < 500. Polycount visível no viewport < 1.500.000 tris.
- [ ] Shader de MotionBlur Radial integrado nos limites das extremidades.
- [ ] UX/HUD polida com sons diegéticos UI e total usabilidade no Gamepad.
- [ ] Integração com Steamworks (Leaderboards e Cloud Save) resolvida.

---

## 18. RESUMO EXECUTIVO (Para o Board / Estúdio)

O projeto "Neon Pulse 3000" superou com sucesso o estágio de prova conceitual e provou a maturidade surpreendente da stack React Three Fiber para hospedar a lógica de uma corrida espacial anti-gravidade 3D na web. Contudo, **hoje o jogo detém o valor bruto de uma demonstração de programação matemática (Tech Demo)**.

**Onde Devemos Chegar:** Precisamos transformar uma grade de primitivos de geometria procedural num espetáculo visceral, cinético e brutal para atrair consumidores que pagam pela qualidade de títulos indie hiper polidos na Steam. O jogo precisa alcançar a densidade ambiental de um *Cyberpunk* orgânico e o peso na aceleração insana referenciada em *Redout 2* e *Wipeout*.

**Ordem Correta e Impacto:** A prioridade absoluta é o **Coração da Engenharia (Mês 1-2)**: Refatorar o componente *Deus* da Nave em submódulos puristas e implementar `InstancedMesh` global. Esta manobra de back-end irá destrancar performance para a inclusão massiva de ativos gráficos reais no Mês 3 (Modelos High-End Bakeados), permitindo, subsequentemente, a aplicação de Shaders complexos e Pós-Processamentos que trarão a magia de direção de arte almejada no horizonte do projeto sem pulverizar as CPUs dos jogadores.

Existe um oceano colossal de trabalho, especificamente transpondo lógicas de `React` puro para conceitos hardcore de *Game Engine Engineering* em WebGL. Contudo, adotando este Roadmap rigorosamente, no prazo estrito de 12 meses, este estúdio entregará no mercado a referência mundial definitiva de títulos de corrida independentes construídos em cima de ecossistemas web-nativos. Mãos à obra.
