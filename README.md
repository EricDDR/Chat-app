# 📱 Chat App em React Native com Expo
Protótipo funcional de um aplicativo de chat multiplataforma (iOS/Android) desenvolvido com React Native e Expo. O projeto demonstra a criação de uma interface de chat moderna, navegação entre telas, gerenciamento de estado global e comunicação com uma API backend.

## ✨ Visão Geral

O aplicativo permite que o usuário se identifique com um nome, entre em uma sala de chat, envie e receba mensagens em tempo real (simulado via polling), e customize a aparência do app com um tema claro e escuro.

## ✅ Funcionalidades Implementadas

-   **Navegação Multi-telas:** Navegação em pilha (Stack) entre as telas de Início, Chat e Configurações, utilizando **Expo Router**.
-   **Identificação de Usuário:** Tela inicial para o usuário inserir seu nome antes de entrar no chat.
-   **Chat Funcional:**
    -   Exibição de mensagens em uma `FlatList` otimizada.
    -   Diferenciação visual para mensagens enviadas e recebidas.
    -   Atualização automática de mensagens a cada 3 segundos (polling).
-   **UI Otimista:** Mensagens enviadas aparecem instantaneamente na tela para uma melhor experiência do usuário.
-   **Gerenciamento de Estado Global:** Controle de tema (Claro/Escuro) implementado com a **Context API** do React, garantindo consistência em todo o app.
-   **Ações de Mensagem:** Suporte para deletar mensagens (com diálogo de confirmação).
-   **Layout Responsivo:** A interface se adapta à aparição do teclado com `KeyboardAvoidingView`.

## 🛠️ Tecnologias Utilizadas

-   **[React Native](https://reactnative.dev/)**: Framework para desenvolvimento de apps nativos.
-   **[Expo](https://expo.dev/)**: Plataforma e conjunto de ferramentas para facilitar o desenvolvimento React Native.
-   **[Expo Router](https://docs.expo.dev/router/introduction/)**: Sistema de navegação baseado em arquivos para criar rotas nativas.
-   **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
-   **React Hooks**: Utilização de `useState`, `useEffect`, `useCallback`, `useRef` e `useContext`.
-   **Flexbox**: Para criação de layouts flexíveis.

## 🚀 Como Rodar o Projeto

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd seu-repositorio
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```
    *ou*
    ```bash
    yarn
    ```

4.  **Backend (Importante):**
    Este projeto precisa de uma API backend simples para funcionar. Certifique-se de que o servidor local esteja rodando e atualize o endereço `API_URL_BASE` no arquivo `app/chat.tsx` para o IP da sua máquina na rede local.
    ```javascript
    const API_URL_BASE = '[http://192.168.0.105:8080/messages](http://192.168.0.105:8080/messages)'; 
    ```

5.  **Inicie o projeto:**
    ```bash
    npx expo start
    ```

6.  **Conecte com seu celular:**
    Após o comando acima, um QR Code aparecerá no terminal. Abra o app Expo Go no seu celular e escaneie o QR Code para carregar o aplicativo.

## 📁 Estrutura de Pastas

O projeto utiliza a estrutura de rotas do Expo Router, onde a organização dos arquivos no diretório `app` define a navegação.

```
/
|-- app/
|   |-- context/
|   |   |-- ThemeContext.tsx   # Contexto global para o tema
|   |-- _layout.tsx            # Layout principal (Stack Navigator)
|   |-- index.tsx              # Tela de início (rota "/")
|   |-- chat.tsx               # Tela de chat (rota "/chat")
|   |-- settings.tsx           # Tela de configurações (rota "/settings")
|-- assets/                    # Imagens, fontes, etc.
|-- components/                # Componentes reutilizáveis (se necessário)
`-- ...
```

