import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentData {
  id: string;
  createdAt: string;
  updatedAt: string;
  nome: string;
  comentario: string;
  clubinho: string;
  bairro: string;
  curtidas: number;
}

interface CommentsState {
  comments: CommentData[] | null;
}

// Lista ampliada de comentários fictícios
const initialComments: CommentData[] = [
  {
    id: "1",
    createdAt: "2023-10-05T10:00:00Z",
    updatedAt: "2023-10-05T10:00:00Z",
    nome: "Ana Paula",
    comentario: "As dicas rápidas me ajudaram muito a engajar as crianças na aula de domingo!",
    clubinho: "Clubinho Esperança",
    bairro: "Centro",
    curtidas: 5,
  },
  {
    id: "2",
    createdAt: "2023-10-06T14:30:00Z",
    updatedAt: "2023-10-06T14:30:00Z",
    nome: "Carlos Mendes",
    comentario: "Seria ótimo ter mais ideias para atividades manuais na galeria. Alguma sugestão?",
    clubinho: "Clubinho Alegria",
    bairro: "Jardim das Flores",
    curtidas: 2,
  },
  {
    id: "3",
    createdAt: "2023-10-07T09:15:00Z",
    updatedAt: "2023-10-07T09:15:00Z",
    nome: "Juliana Costa",
    comentario: "Amei o banner da semana! O tema está super alinhado com o que minha turma precisava.",
    clubinho: "Clubinho Luz",
    bairro: "Vila Nova",
    curtidas: 8,
  },
  {
    id: "4",
    createdAt: "2023-10-08T16:20:00Z",
    updatedAt: "2023-10-08T16:20:00Z",
    nome: "Mariana Silva",
    comentario: "As dinâmicas sugeridas para a faixa etária de 6 a 8 anos foram um sucesso!",
    clubinho: "Clubinho Arco-Íris",
    bairro: "Bela Vista",
    curtidas: 4,
  },
  {
    id: "5",
    createdAt: "2023-10-09T11:45:00Z",
    updatedAt: "2023-10-09T11:45:00Z",
    nome: "Rafael Oliveira",
    comentario: "Adorei a meditação da semana. Trouxe muita paz para nossa aula!",
    clubinho: "Clubinho Fé",
    bairro: "São José",
    curtidas: 7,
  },
  {
    id: "6",
    createdAt: "2023-10-10T13:00:00Z",
    updatedAt: "2023-10-10T13:00:00Z",
    nome: "Beatriz Lima",
    comentario: "Poderia ter um espaço para compartilhar vídeos das nossas aulas. O que acham?",
    clubinho: "Clubinho Amizade",
    bairro: "Jardim América",
    curtidas: 3,
  },
  {
    id: "7",
    createdAt: "2023-10-11T08:30:00Z",
    updatedAt: "2023-10-11T08:30:00Z",
    nome: "Lucas Ferreira",
    comentario: "O material desta semana foi incrível! As crianças adoraram a história.",
    clubinho: "Clubinho Sonho",
    bairro: "Liberdade",
    curtidas: 6,
  },
  {
    id: "8",
    createdAt: "2023-10-12T15:10:00Z",
    updatedAt: "2023-10-12T15:10:00Z",
    nome: "Fernanda Almeida",
    comentario: "A motivação evangelística me inspirou a visitar uma família da comunidade!",
    clubinho: "Clubinho Harmonia",
    bairro: "Santa Cruz",
    curtidas: 9,
  },
];

const initialState: CommentsState = {
  comments: initialComments,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<CommentData[]>) => {
      state.comments = action.payload;
    },
    addComment: (state, action: PayloadAction<CommentData>) => {
      if (state.comments) {
        state.comments.unshift(action.payload); // Adiciona no início
      } else {
        state.comments = [action.payload];
      }
    },
    likeComment: (state, action: PayloadAction<string>) => {
      if (state.comments) {
        const comment = state.comments.find((c) => c.id === action.payload);
        if (comment) {
          comment.curtidas += 1;
        }
      }
    },
    clearComments: (state) => {
      state.comments = null;
    },
  },
});

export const { setComments, addComment, likeComment, clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;