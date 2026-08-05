# MASTER IMPLEMENTATION GUIDE
**A CONSTITUIÇÃO DO PROJETO - NEON PULSE 3000**

Este documento é a Lei Máxima do projeto Neon Pulse 3000. Nenhuma implementação, seja arquitetada por um desenvolvedor humano ou por um Agente de IA, deverá, em hipótese alguma, contrariar ou ignorar os princípios, processos e regras definidos aqui. 

Todo o desenvolvimento futuro se curvará a este guia.

---

## 1. MISSÃO DO PROJETO
- **Problema que Resolve:** O mercado carece de jogos de corrida anti-gravidade *high-speed* independentes que rodem diretamente em tecnologias Web-Nativas (WebGL/R3F) com qualidade gráfica e responsividade de jogos de console.
- **Experiência Proporcionada:** Foco, fluxo incessante e tensão (Flow State). O jogador deve sentir que a perda de reflexo por 0.1s resultará em destruição imediata.
- **Emoção Transmitida:** Adrenalina opressiva. O perigo constante contrastando com o deslumbramento estético.
- **Identidade Visual:** Cyberpunk Brutalista Corrosivo. Neon sujo, hologramas ruidosos, metal escovado, asfalto deteriorado.
- **Identidade Sonora:** Densa e física. Synthwave industrial, graves que distorcem as estruturas visuais, sons de motores que se assemelham a turbinas nucleares instáveis.
- **Sensação de Velocidade:** Extrema. O FOV rasga perifericamente, o desfoque de movimento mascara o cenário distorcido e efeitos aerodinâmicos cortam a fuselagem.
- **Nível de Qualidade:** Competidor direto Indie Premium AAA (Padrão Redout 2, Wipeout). 60 FPS inegociáveis. 

---

## 2. VISÃO DE LONGO PRAZO
No estágio Gold, Neon Pulse 3000 será:
- **Gameplay:** Físico e punitivo. *Risk-reward* entre uso de Boost (consumindo vida) e ultrapassagens. Inércia palpável onde bater dói na tela.
- **Combate:** Tático baseado em deslocamento e EMPs, sem armamento tradicional excessivo (balístico). O corpo da nave é a arma.
- **Cidade:** Instanciada, massiva, procedural em layout mas composta de assets PBR de altíssima fidelidade projetando sombras em tempo real.
- **Atmosfera/Iluminação:** Densa volumetria. Fog pesado, luzes cortando nuvens baixas, HDR e *Global Illumination Screen-Space*.
- **Shaders/HUD:** Hologramas em GLSL com distorção diegética e aberração cromática severa. HUD fundida à nave, não na tela.
- **IA:** Adota heurísticas *Boids* complexas, bloqueando o jogador, sofrendo inércia, cometendo erros humanos.
- **Performance:** Draw calls limitadas a <500, *Garbage Collection* otimizado (0 *stutters* na thread).

---

## 3. PRINCÍPIOS ARQUITETURAIS OBRIGATÓRIOS
1. **Performance Primeiro:** Se uma funcionalidade nova não consegue rodar a 60FPS no target de hardware, ela não sobe para a main, independente da beleza.
2. **Responsabilidade Única (SRP):** Um componente React não deve ler input, calcular matriz de física e renderizar malhas simultaneamente.
3. **Baixo Acoplamento e Alta Coesão:** Sistemas devem se comunicar preferencialmente via estado global (Zustand) mutado por fora da árvore React, ou por Event Emitters.
4. **Legibilidade e Código Autodocumentado:** Variáveis devem ser explícitas. Se um bloco complexo de álgebra linear não tiver comentário, o *Pull Request* é recusado.
5. **Reutilização Total:** Não repetir código (DRY). Texturas idênticas partilham a mesma referência de memória.
6. **Arquitetura Limpa:** Isolar a Regra de Negócio (Física, Vida, Tempo) da Camada de Apresentação (Mesh, React).

---

## 4. FILOSOFIA DE IMPLEMENTAÇÃO
Toda implementação futura deve obedecer:
1. **Analisar Impacto Antes de Codificar:** Toda alteração será inspecionada mentalmente para prever efeitos colaterais na GPU e no Render Loop.
2. **Nunca Criar Soluções Temporárias (Gambiarra):** Tech Debt será tratado como erro sintático. Código de "placeholder" funcional não entra no repositório.
3. **Nunca Adicionar Código Duplicado:** Lógica recorrente vira *Hook*, *Util* ou *Manager*.
4. **Sempre Preferir Evolução da Arquitetura:** Se o sistema atual força o código a ser feio, refatore o sistema, não force o código.
5. **Feature Nova, Extensível:** A IA deve ser capaz de dirigir outras naves; não acople hardcode ao Jogador.
6. **Feature Isolada:** Modificar a UI não pode quebrar a Física.
7. **Performance Nativa:** Cada loop (como `useFrame`) ou criação de objeto (`new Vector3()`) será julgado por peso alocado.
8. **Facilmente Removível:** Tudo precisa atuar como um *Plugin/Component*. Retirar um módulo de câmera não pode derrubar a simulação do jogo.

---

## 5. REGRAS DE ARQUITETURA
Organização de pastas deve ser estrita:
- `/components`: Exclusivamente Views (Renderização 3D / R3F). 
- `/systems`: Entidades sem GUI (Managers de IA, Loop Físico, Audio Manager).
- `/store`: Zustand e Global State.
- `/hooks`: Lógicas de React customizadas (`usePlayerInput`, `usePhysics`).
- `/assets`: Recursos externos brutos (GLTF, PNG).
- `/shaders`: Fragment e Vertex em arquivos separados ou exportados limpos.
- `/utils`: Funções matemáticas puras, sem React.
- `/types`: Definições TypeScript (Interfaces).

**Quando criar novas pastas:** Somente quando um Domínio de Feature se provar complexo o suficiente para possuir seus próprios *hooks*, *components* e *types* fechados (Feature-Based Design).

---

## 6. PADRÕES DE CÓDIGO
- **TypeScript:** Strict Mode obrigatório. Qualquer `any` explícito ou implícito gerará falha no Lint. 
- **React Three Fiber / React:** Hooks apenas onde reatividade UI for necessária. Não usar `useState` em loops de `useFrame`. 
- **Stores (Zustand):** Leitura de valores transitórios frequentes a 60hz (velocidade, posição) usarão imperativamente `useGameStore.getState().valor`, nunca assinaturas reativas no render do componente 3D.
- **Funções/Eventos:** Funções matemáticas complexas pre-calculam *Vectors* e *Quaternions* fora da função (usando escopo de arquivo) para evitar criação massiva de lixo no heap.
- **Nomenclatura:** PascalCase para Componentes e Interfaces. camelCase para arquivos lógicos, variáveis e hooks. SNAKE_CASE para Constantes globais puras.
- **Documentação:** Comentários JSDoc acima de métodos expostos.

---

## 7. PADRÕES PARA GAMEPLAY
- **Player:** É tratado apenas como uma Entidade genérica "Nave" atrelada a um "Controller de Teclado".
- **IA:** Atrelada ao mesmo tipo de "Nave", governada por "Controller Baseado em NavMesh/Steering".
- **Física e Colisão:** Devem rodar preferencialmente em Fixed Time Step. Repulsão deve ser elástica e transferir inércia de impacto à câmera.
- **Armas/Destruição:** Modelos instanciados devem suportar troca limpa de *Mesh* por pedaços físicos quando o Core chegar a 0 (Shatter).

---

## 8. PADRÕES PARA RENDERIZAÇÃO
- **Bloom & Pós-processamento:** Centralizados no `EffectComposer`. Obrigatório usar Thresholding preciso no emissive material; nunca fazer toda a tela brilhar em branco opaco.
- **Luzes e Sombras:** Limite estrito a 1 DirectionalLight com ShadowMap Cascaded. Limite de 4 PointLights móveis sem castShadow (Apenas iluminação base).
- **LOD & Instancing:** Obrigatório usar `InstancedMesh` para qualquer malha duplicada mais de 10 vezes na cena (Cidade, Trilhos, Asteroides). Frustum Culling nativo do Three.js nunca deve ser desativado inconsequentemente.

---

## 9. PADRÕES PARA MATERIAIS E TEXTURAS
- **MeshPhysicalMaterial:** Para lataria de nave, vidro do cockpit e metais complexos onde verniz (Clearcoat) ou refração (Transmission) for vital.
- **MeshStandardMaterial:** Para 95% do ambiente (Cidade, Asfalto opaco).
- **ShaderMaterial:** Obrigatório para partículas customizadas, Hologramas e distorções visuais (Heat Haze).
- **Otimização:** Texturas compactadas em formato `.webp` ou KTX2. Resolução máxima PBR de 2048x2048 para Naves, 1024 para ambiente. Atlases unificadas para a cidade inteira (1 só draw call de textura).

---

## 10. PADRÕES PARA SHADERS
- **Criação:** Apenas para efeitos que o Standard Pipeline do Three.js não suporta eficientemente (Deformação de Mesh no FoV, Scanlines interativos, Escudos energéticos).
- **Reutilização:** Extrair blocos modulares matemáticos (Noise, Simplex) em `#include` ou variáveis constantes no TSX.
- **Otimização:** Nunca usar condicionais (`if/else`) dentro do Fragment Shader se puder usar lógica de `step()` ou `mix()`. Pre-calcular uniforms pesados na CPU.

---

## 11. PADRÕES PARA VFX
- **Partículas (Explosões, Faíscas):** Proibido usar múltiplos Meshes isolados. Devem ser gerenciados por sistemas GPU-based (Points ou GPGPU / Compute Shaders com InstancedBufferGeometry).
- **Trails / Fumaça:** Polígonos achatados gerados dinamicamente (Ribbons) ou sprite-sheets instanciados para não sobrecarregar fill-rate de opacidade.

---

## 12. PADRÕES PARA HUD
- **Integração:** Sempre tentar Diegese (incorporar na Nave) usando React no Canvas via Drei `<Html>` atado a 3D, ou `<Text3D>`.
- **Styling:** Se for DOM tradicional, uso exclusivo de posições absolutas, flexbox, e mix-blend-modes aditivos (screen/add). Feedback de dano via animação CSS no Wrapper (Shake/Red tint) ignorando o loop React pesado.

---

## 13. PADRÕES PARA ÁUDIO
- **Arquitetura:** Módulo Audio-Manager desacoplado rodando sobre a API WebAudio. 
- **Design Dinâmico:** Motores alteram seu *Pitch* não pela tecla pressionada, mas pelo Delta da Inércia Física atual.
- **Mixagem:** Canal de Master compressado, sub-bus separado de GUI, Effects e Music. Baixa frequência deve dominar nas colisões e passar por Low-pass filter quando em menus pause.

---

## 14. PADRÕES PARA PERFORMANCE (Metas de Aço)
- **FPS Alvo:** Constantes 60FPS a 1080p nativo em hardware GTX 1060 (Baseline).
- **Memória:** < 500 MB no Heap de JS. Sem spikes periódicos no Memory Profiler do Chrome.
- **Draw Calls:** Máximo absoluto de 500 (Ideal < 100 via Instancing).
- **Luzes Dinâmicas:** 1 Directional (Shadow), Máximo 5 PointLights sem Shadow.
- **Shaders Ativos:** < 10 passes de pós processamento ativos.
- **Monitoramento Contínuo:** Todos os Devs e IAs devem ativar e ler o overlay visual do `stats.js` e *Three-Perf* a cada build de teste.

---

## 15. CHECKLIST DE ENGENHARIA (Obrigatório Antes do Código)
A IA/Humano responde mentalmente:
1. Esta feature respeita a arquitetura ECS/Hook/Zustand adotada?
2. Quebra o princípio SRP ou acopla o que era solto?
3. Reduz a performance global ou instiga vazamento de memória (Objects no loop de 60hz)?
4. Há alguma maneira matemática ou funcional de escrever de modo mais simples?
5. A feature tem responsabilidade separada do componente renderizador?

---

## 16. CHECKLIST ANTES DE MODIFICAR ARQUIVOS EXISTENTES
- **Analisar:** Quais sistemas assinam esse valor do Zustand? Qual componente consome esse Hook?
- **Impacto:** A refatoração deste arquivo derruba a AI do Oponente?
- **Restruturação:** Preciso refatorar o arquivo antes de inserir a melhoria, para evitar o crescimento caótico?

---

## 17. CHECKLIST PÓS-IMPLEMENTAÇÃO
- Compila sem *Warnings* no Typescript (Strict `tsc`)?
- Não fere o Linter e formato padrão?
- O Profiler atesta estabilidade de FPS sem oscilações em VSync e Memory Garbage nulo?
- Documentação no Arquivo README (se for feature base) foi inserida?

---

## 18. PROCESSO DE DESENVOLVIMENTO
Todo pipeline deve ocorrer estritamente nesta ordem (Iteração Zero Erros):
`Análise` → `Planejamento de Arquitetura` → `Mapa de Impactos` → `Código da Implementação Limpa` → `Refatoração de Débito Interno` → `Testes Visuais/Performance` → `Validação`. 
*(É proibido escrever funções de "Try and Error" em código em produção, planeja-se mentalmente antes).*

---

## 19. REGRAS PARA AGENTES IA E MODELOS LLM
Sempre que uma Inteligência Artificial receber um prompt de tarefa neste projeto, ela DEVE obedecer ao seguinte fluxo:
1. **LER ESTA CONSTITUIÇÃO (MASTER GUIDE).**
2. **Consultar:** `GAME_EVOLUTION_ROADMAP.md` e `VISUAL_AUDIT.md`.
3. **Planejar** exaustivamente usando o bloco de thought process interno antes de invocar ferramentas de arquivos.
4. **Avaliar** gargalos de renderização na solução provida.
5. **Escrever código cirúrgico.** Nunca propor substituição integral de arquivos imensos apenas para trocar uma variável, utilize métodos de *diff / replace* focados.

---

## 20. REGRAS DE EVOLUÇÃO CONTÍNUA
*Baby steps sempre.*
- Não reescreva o Rendering System inteiro se só precisa trocar a iluminação base.
- Toda micro-implementação injetada deve compilar no servidor e manter a performance exata no mesmo milissegundo de Frame-Time.

---

## 21. DEFINIÇÃO DE PRONTO (D.o.D - Definition of Done)
A tarefa é dada por Encerrada APENAS se:
1. Funciona conforme o especificado mecanicamente e esteticamente.
2. O Profiler não apresenta flutuação e Draw Calls se mantêm constantes.
3. Não insere código duplicado.
4. Funções complexas têm *JSDoc*.
5. Estado é global via Zustand ou localizado de maneira blindada via *refs* de componentes.
6. Tipagem está forte, estrita, sem nenhum `any`.

---

## 22. MANIFESTO DO PROJETO - VOTO DE CONFIANÇA
**"A VELOCIDADE NÃO PODE ENCONTRAR ATRITO NO CÓDIGO."**

Nós, desenvolvedores e agentes artificiais responsáveis por manter o ecossistema "Neon Pulse 3000", juramos manter a pureza arquitetural da engine. 
Nossos recursos computacionais pertencem à simulação cibernética da pista e da atmosfera agressiva de corrida, nunca a algoritmos preguiçosos de JavaScript.
A cada linha de código injetada, a estética melhora; a performance, contudo, permanece inabalável. Tratamos o DOM do React como sagrado, o reconciliador do Fiber como uma ferramenta de organização tática e a GPU como o nosso motor de renderização livre de detritos lógicos. 
Trabalharemos para que este código fonte perdure limpo, escalável e pronto para expansões futuras pelos próximos dez anos de existência. O código limpo não é preferência; é a única via aceitável de existência. 
Fim do Guia.
