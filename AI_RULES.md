# Regras de IA e Diretrizes do Projeto

Este documento descreve a pilha de tecnologia e as regras específicas para desenvolver e modificar o aplicativo "Equipe Treino".

## 1. Visão Geral da Pilha de Tecnologia (Tech Stack)

1.  **Framework:** React (com Vite para tooling).
2.  **Linguagem:** TypeScript (uso obrigatório em todos os arquivos).
3.  **Estilização:** Tailwind CSS, utilizando uma paleta de cores vibrante e gamificada (com classes customizadas como `gradient-primary` e `glow-success`).
4.  **Componentes UI:** shadcn/ui (construído sobre primitivos Radix UI).
5.  **Roteamento:** React Router DOM (rotas centralizadas em `src/App.tsx`).
6.  **Gerenciamento de Dados:** TanStack Query (`@tanstack/react-query`) para gerenciamento de estado de servidor.
7.  **Animações:** Framer Motion para transições suaves e efeitos visuais envolventes.
8.  **Ícones:** Lucide React.
9.  **Notificações:** Sonner (para toasts modernos) e Web Notifications API (via `useNotifications`).
10. **Geolocalização/Mapas:** Leaflet e React-Leaflet (para rastreamento de atividades como Caminhada e Bike).

## 2. Regras de Uso de Bibliotecas

| Funcionalidade | Biblioteca/Ferramenta Recomendada | Notas |
| :--- | :--- | :--- |
| **Componentes UI** | shadcn/ui | Use os componentes existentes. Se precisar de customização, crie um novo componente em `src/components/` que envolva o primitivo shadcn. |
| **Estilização** | Tailwind CSS | Use classes de utilidade exclusivamente. Priorize o design responsivo e utilize as classes de gradiente/brilho customizadas. |
| **Roteamento** | `react-router-dom` | Use `Link` para navegação e `useLocation` para detecção de estado ativo. |
| **Animações** | `framer-motion` | Obrigatório para transições de página, efeitos de hover e animações de celebração (ex: `ConfettiEffect`). |
| **Toasts/Feedback** | `sonner` | Use `toast` do `sonner` para feedback rápido ao usuário (sucesso/erro). |
| **Estado Persistente Local** | `useLocalStorage` hook | Use o hook customizado em `src/hooks/useLocalStorage.ts` para dados do usuário (treinos, progresso). |
| **Estado de Servidor** | `@tanstack/react-query` | Use para gerenciar dados assíncronos e cache. |
| **Ícones** | `lucide-react` | Use para todos os ícones. |
| **Geolocalização** | Leaflet / React-Leaflet | Use para recursos de mapa e rastreamento de localização. |

## 3. Estrutura e Convenções de Código

*   **Estrutura de Arquivos:** Componentes e Páginas devem usar PascalCase (ex: `WorkoutCard.tsx`, `Home.tsx`). Diretórios são em minúsculas (ex: `src/pages`, `src/components`).
*   **Tamanho do Componente:** Mantenha os componentes pequenos e focados (idealmente abaixo de 100 linhas). Crie novos arquivos para novos componentes ou hooks.
*   **Dados:** Dados mockados estão armazenados em `src/data/`.
*   **Não Overengineer:** Mantenha o código simples e elegante. Implemente apenas o que foi solicitado.