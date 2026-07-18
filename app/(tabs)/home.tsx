import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  demoNotifications,
  demoProfile,
  demoProjects,
} from "@/src/data/demoContent";
import i18n from "@/src/i18n/i18n";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { authState } = useAuth();
  const [activeInsight, setActiveInsight] = useState<null | {
    title: string;
    meta: string;
    detail: string;
  }>(null);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const accent = useThemeColor({}, "tint");
  const muted = useThemeColor({}, "tabIconDefault");
  const cardBg =
    theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

  const userName = authState?.name || demoProfile.name;
  const activeProjects = demoProjects.filter(
    (project) => project.progress >= 60,
  ).length;
  const translate = (key: string, fallback = "") =>
    (i18n.t(key, { defaultValue: fallback }) as string) || fallback;

  const quickActions = [
    {
      title: "Projetos",
      subtitle: "Ver lojas e campanhas em andamento",
      icon: "rocket-outline" as const,
      onPress: () => router.push("/projects"),
    },
    {
      title: "Calendário",
      subtitle: "Consultar próximos compromissos",
      icon: "calendar-outline" as const,
      onPress: () => router.push("/calendar"),
    },
    {
      title: "Definições",
      subtitle: "Ajustar idioma e preferências",
      icon: "settings-outline" as const,
      onPress: () => router.push("/settings"),
    },
  ];

  const weeklyHighlights = [
    {
      title: "Nova oferta publicada",
      meta: "Hoje",
      detail:
        "A campanha 'Verão Premium' já está online com foco em produtos de edição limitada.",
    },
    {
      title: "Pagamento confirmado",
      meta: "Ontem",
      detail:
        "O pacote de suporte avançado foi aprovado e já está ativo para a próxima semana.",
    },
    {
      title: "Reunião com cliente",
      meta: "Amanhã",
      detail:
        "A revisão de performance e próximos passos será feita com o cliente principal às 15:00.",
    },
  ];

  const actionScales = useRef(
    quickActions.map(() => new Animated.Value(1)),
  ).current;

  const animateAction = (index: number, toValue: number) => {
    Animated.spring(actionScales[index], {
      toValue,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.heroCard, { backgroundColor: cardBg }]}>
        <View style={styles.heroHeader}>
          <Ionicons name="storefront-outline" size={24} color={accent} />
          <Text style={[styles.eyebrow, { color: accent }]}>
            Painel de operação
          </Text>
        </View>
        <Text style={[styles.title, { color: text }]}>Olá, {userName}</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          {translate(
            "homeGreeting",
            "Impulsione o seu negócio com uma loja online personalizada e profissional.",
          )}
        </Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: background }]}>
            <Text style={[styles.statValue, { color: text }]}>
              {activeProjects}
            </Text>
            <Text style={[styles.statLabel, { color: muted }]}>
              Projetos ativos
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: background }]}>
            <Text style={[styles.statValue, { color: text }]}>
              {demoNotifications.length}
            </Text>
            <Text style={[styles.statLabel, { color: muted }]}>
              Notificações
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          Ações rápidas
        </Text>
        {quickActions.map((item, index) => (
          <Animated.View
            key={item.title}
            style={{ transform: [{ scale: actionScales[index] }] }}
          >
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: cardBg }]}
              onPress={item.onPress}
              onPressIn={() => animateAction(index, 0.97)}
              onPressOut={() => animateAction(index, 1)}
              {...({
                onHoverIn: () => animateAction(index, 1.01),
                onHoverOut: () => animateAction(index, 1),
              } as any)}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconBox}>
                <Ionicons name={item.icon} size={20} color={accent} />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={[styles.actionTitle, { color: text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.actionSubtitle, { color: muted }]}>
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          Resumo da semana
        </Text>
        <View style={[styles.listCard, { backgroundColor: cardBg }]}>
          {weeklyHighlights.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.listItem}
              onPress={() => setActiveInsight(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.listTitle, { color: text }]}>
                {item.title}
              </Text>
              <Text style={[styles.listMeta, { color: accent }]}>
                {item.meta}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={Boolean(activeInsight)}
        onRequestClose={() => setActiveInsight(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setActiveInsight(null)}
            >
              <Ionicons name="close" size={20} color={accent} />
            </TouchableOpacity>
            {activeInsight && (
              <>
                <Text style={[styles.modalTitle, { color: text }]}>
                  {activeInsight.title}
                </Text>
                <Text style={[styles.modalMeta, { color: accent }]}>
                  {activeInsight.meta}
                </Text>
                <Text style={[styles.modalBody, { color: text }]}>
                  {activeInsight.detail}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  actionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionSubtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  listCard: {
    borderRadius: 16,
    padding: 12,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  listMeta: {
    fontSize: 13,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  modalMeta: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
