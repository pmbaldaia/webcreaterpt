import type { ImageSourcePropType } from "react-native";

export type DemoTask = {
  name: string;
  start: string;
  end: string;
  category?: string;
  owner?: string;
};

export type DemoProject = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  imageUrl: ImageSourcePropType;
  url: string;
};

export const CALENDAR_STORAGE_KEY = "@calendar_tasks";

export const demoProfile = {
  name: "Marta Silva",
  role: "Gestora de operações",
  plan: "Plano Growth",
  email: "marta@demostudio.pt",
  location: "Lisboa, Portugal",
};

export const demoProjects: DemoProject[] = [
  {
    id: "1",
    titleKey: "projects.marysWorld.title",
    descriptionKey: "projects.marysWorld.description",
    imageUrl: require("@/assets/images/projects/marysworld.png"),
    url: "https://marysworld.pt",
  },
  {
    id: "2",
    titleKey: "projects.maulihandmade.title",
    descriptionKey: "projects.maulihandmade.description",
    imageUrl: require("@/assets/images/projects/maulihandmade.png"),
    url: "https://maulihandmade.com",
  },
  {
    id: "3",
    titleKey: "projects.qChef.title",
    descriptionKey: "projects.qChef.description",
    imageUrl: require("@/assets/images/projects/qchef.png"),
    url: "https://qchef.pt",
  },
  {
    id: "4",
    titleKey: "projects.vanessaKloset.title",
    descriptionKey: "projects.vanessaKloset.description",
    imageUrl: require("@/assets/images/projects/vanessakloset.png"),
    url: "https://vanessakloset.pt",
  },
  {
    id: "5",
    titleKey: "projects.mimuKidsStore.title",
    descriptionKey: "projects.mimuKidsStore.description",
    imageUrl: require("@/assets/images/projects/mimukidsstore.png"),
    url: "https://mimukidsstore.pt",
  },
  {
    id: "6",
    titleKey: "projects.jafversatil.title",
    descriptionKey: "projects.jafversatil.description",
    imageUrl: require("@/assets/images/projects/jafversatil.png"),
    url: "https://jafversatil.pt",
  },
];

export const initialCalendarTasks: Record<string, DemoTask[]> = {
  "2026-07-18": [
    {
      name: "Revisão da landing page",
      start: "09:00",
      end: "10:00",
      category: "Design",
      owner: "admin",
    },
  ],
  "2026-07-19": [
    {
      name: "Reunião com cliente",
      start: "15:00",
      end: "16:00",
      category: "Cliente",
      owner: "rita",
    },
  ],
  "2026-07-20": [
    {
      name: "Envio da campanha de verão",
      start: "11:30",
      end: "12:15",
      category: "Marketing",
      owner: "admin",
    },
  ],
};

export const demoNotifications = [
  {
    id: "1",
    title: "Nova mensagem de João",
    subtitle: "Enviou os detalhes da campanha de lançamento.",
    time: "Há 5 min",
  },
  {
    id: "2",
    title: "Atualização disponível",
    subtitle: "A versão 2.1 traz novas métricas e automações.",
    time: "Há 35 min",
  },
  {
    id: "3",
    title: "Evento amanhã às 15h",
    subtitle: "Reunião de revisão com o cliente final.",
    time: "Amanhã",
  },
  {
    id: "4",
    title: "Pagamento confirmado",
    subtitle: "O pedido de suporte premium foi processado.",
    time: "Hoje",
  },
];
