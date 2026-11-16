# Compra Fácil

Aplicativo mobile para criar e organizar listas de compras, acompanhar produtos comprados e consultar o valor estimado da lista. Desenvolvido com React Native, Expo, React Navigation e Firebase Firestore.

## Funcionalidades implementadas

- Cadastro, edição e exclusão de produtos.
- Quantidade e preço unitário, com cálculo do total estimado.
- Marcação de produtos como comprados.
- Resumo de produtos pendentes e comprados.
- Seleção de foto pela galeria do dispositivo.
- Navegação com Native Stack e Bottom Tabs.
- Estado compartilhado com Context API.
- Autenticação anônima e sincronização em tempo real com Cloud Firestore.

## Tecnologias

- Expo SDK 58 / React Native.
- React Navigation 7 (Native Stack + Bottom Tabs).
- Firebase JS SDK: Authentication e Cloud Firestore.
- Expo Image Picker e Expo Vector Icons.
- AsyncStorage para persistência da sessão de autenticação.

## Requisitos para executar

- Node.js 24.12.0 ou superior (a versão Firebase 13 resolvida pelo lockfile declara esse requisito).
- npm.
- Aplicativo Expo Go compatível com o SDK do projeto, ou emulador/dispositivo configurado.
- Projeto Firebase com Authentication anônimo habilitado e Cloud Firestore criado.

## Instalação e execução

1. Baixe ou clone este repositório.
2. Abra um terminal na pasta `app` (é nela que está o `package.json`).
3. Instale as dependências:

   ```bash
   npm ci
   ```

   Se o terminal informar versão incompatível do Node.js, atualize para Node 24.12.0 ou superior e repita o comando.

4. Confira se as versões e configurações do Expo estão corretas:

   ```bash
   npx expo-doctor
   ```

5. Inicie o aplicativo:

   ```bash
   npx expo start
   ```

6. Leia o QR Code com o Expo Go compatível ou pressione `a` para abrir no emulador Android configurado.

## Configuração do Firebase (obrigatória)

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e abra o projeto usado pela equipe (ou crie um projeto de teste).
2. Em **Authentication > Sign-in method**, habilite **Anonymous**. O aplicativo usa `signInAnonymously`; sem essa opção, a autenticação falhará.
3. Em **Firestore Database**, crie o banco de dados.
4. Abra **Firestore Database > Rules** e publique o conteúdo do arquivo `firestore.rules` que acompanha este repositório. Não deixe o banco em modo de teste aberto.
5. Em **Configurações do projeto > Seus apps**, registre/consulte um app Web e copie as configurações do Firebase.
6. Confira os valores de configuração no arquivo `app/src/firebase.js` e substitua-os pelos dados do projeto de teste da equipe, se necessário.
7. Execute novamente o aplicativo e teste cadastro, leitura, edição e exclusão.

> A configuração web do Firebase contém identificadores e uma API key de projeto; ela não substitui regras de segurança. A proteção dos dados é feita principalmente pelas regras do Firestore. Nunca coloque credenciais privadas de servidor ou service-account no aplicativo.

## Observação sobre as fotos

Nesta versão, o app grava a URI local retornada pela galeria. Isso funciona para visualizar a imagem no mesmo dispositivo enquanto o arquivo local continuar disponível, mas não faz upload para a nuvem. Para que outros dispositivos vejam a mesma foto, será necessário integrar o Firebase Storage e salvar no Firestore a URL de download.

## Estrutura do repositório

```text
compra-facil-feature-telas-iniciais/
├── README.md
├── firestore.rules
└── app/
    ├── App.js
    ├── app.json
    ├── index.js
    ├── package.json
    ├── package-lock.json
    ├── src/
    │   ├── context/ProductsContext.js
    │   ├── navigation/AppNavigator.js
    │   ├── screens/
    │   ├── styles/index.js
    │   └── firebase.js
    └── assets/
```

## Git Flow sugerido para a equipe

O arquivo ZIP recebido não inclui a pasta `.git`; portanto, ele não traz histórico de commits, branches ou Pull Requests. Para cumprir a atividade, mantenham no GitHub:

- `main`: versão estável para entrega.
- `develop`: integração do trabalho da equipe.
- `feature/nome-da-funcionalidade`: uma branch por funcionalidade.

Fluxo recomendado para cada tarefa:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-funcionalidade
# faça uma alteração pequena e teste
git add .
git commit -m "feat: descreve a funcionalidade"
git push -u origin feature/nome-da-funcionalidade
```

Depois, abra um Pull Request da branch `feature/...` para `develop`, peça revisão de outro integrante e só então faça o merge. Ao finalizar e testar a versão de entrega, abra PR de `develop` para `main`. Cada integrante deve realizar commits identificáveis de suas próprias tarefas.

## Divisão de tarefas e integrantes

Preencher com os nomes reais e as atividades realizadas por cada integrante antes da entrega:

| Integrante | Responsabilidades |
|---|---|
| Nome completo 1 | A definir pela equipe |
| Nome completo 2 | A definir pela equipe |
| Nome completo 3 | A definir pela equipe |

## Capturas de tela

Adicionar nesta seção imagens reais do aplicativo em execução (tela inicial, cadastro/edição e resumo), por exemplo em `docs/screenshots/`, e referenciá-las aqui.

## Demonstração final

Gravar um vídeo de 3 a 5 minutos mostrando o aplicativo em execução, incluindo cadastro, edição, marcação como comprado, exclusão, resumo e sincronização com o Firestore.
