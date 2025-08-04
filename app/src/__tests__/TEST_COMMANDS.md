# Comandos de Teste - Scripts de Conveniência

Este arquivo contém scripts úteis para executar diferentes categorias de testes.

## 🧪 Scripts de Teste

### Todos os testes
```bash
npm run test:unit
```

### Testes por categoria
```bash
# Componentes
npm run test:unit -- components/

# Testes de breeds especificamente
npm run test:unit -- components/breeds/

# Stores
npm run test:unit -- stores/

# Services/API
npm run test:unit -- services/

# Views
npm run test:unit -- views/
```

### Testes específicos
```bash
# Componente específico
npm run test:unit -- BreedCard.spec.ts
npm run test:unit -- BreedModal.spec.ts

# Store específico
npm run test:unit -- breeds.spec.ts

# View específica
npm run test:unit -- HomeView.spec.ts
```

### Testes em modo watch
```bash
# Watch em todos os testes
npm run test:unit -- --watch

# Watch em categoria específica
npm run test:unit -- components/ --watch
```

### Testes com coverage
```bash
# Gerar relatório de coverage
npm run test:unit -- --coverage

# Coverage de categoria específica
npm run test:unit -- components/ --coverage
```

### Debug de testes
```bash
# Executar com output detalhado
npm run test:unit -- --reporter=verbose

# Executar teste específico com debug
npm run test:unit -- BreedCard.spec.ts --reporter=verbose
```

## 📊 Status Atual dos Testes

### ✅ Implementados
- **components/breeds/BreedCard.spec.ts** - 13 testes
- **components/breeds/BreedModal.spec.ts** - 22 testes

### 📝 Exemplos Criados (para referência)
- **stores/breeds.spec.ts** - Exemplo de teste de store
- **services/api.spec.ts** - Exemplo de teste de API
- **views/HomeView.spec.ts** - Exemplo de teste de view

### 🚧 Próximos a Implementar
- [ ] stores/favorites.spec.ts
- [ ] stores/breedImages.spec.ts
- [ ] components/common/ImageCarousel.spec.ts
- [ ] components/breeds/BreedsList.spec.ts
- [ ] views/FavoritesView.spec.ts
- [ ] views/AboutView.spec.ts
- [ ] router/index.spec.ts

## 🔧 Configuração de IDE

### VS Code
Para melhor experiência no VS Code, instale as extensões:
- **Vitest** - Para executar testes no editor
- **Vue Language Features (Volar)** - Para suporte a Vue 3
- **TypeScript Vue Plugin (Volar)** - Para melhor integração TypeScript

### Debug Configuration
Adicione ao `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["--inspect-brk", "--no-coverage"],
      "autoAttachChildProcesses": true,
      "skipFiles": ["<node_internals>/**", "**/node_modules/**"]
    }
  ]
}
```
