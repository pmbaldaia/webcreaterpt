import { useThemeColor } from "@/hooks/useThemeColor";
import { demoProjects, type DemoProject } from "@/src/data/demoContent";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

type Project = DemoProject;

const projects = demoProjects;

export default function ProjectsScreen() {
  const { t } = useTranslation();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const cardBackground = background || "#fff";

  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [webviewUrl, setWebviewUrl] = useState<string | null>(null);

  const gutter = 15;
  const minCardWidth = 280;

  const numColumns = Math.max(
    1,
    Math.floor((containerWidth + gutter) / (minCardWidth + gutter)),
  );
  const cardWidth = Math.max(
    minCardWidth,
    (containerWidth - (numColumns - 1) * gutter) / numColumns,
  );

  const renderProject = useCallback(
    ({ item, index }: { item: Project; index: number }) => {
      const isFirstInRow = index % numColumns === 0;

      return (
        <View
          style={[
            styles.card,
            {
              width: cardWidth,
              backgroundColor: cardBackground,
              marginLeft: isFirstInRow ? 0 : gutter,
            },
          ]}
        >
          <Image
            source={item.imageUrl}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={[styles.title, { color: text }]} numberOfLines={1}>
            {t(item.titleKey)}
          </Text>
          <Text style={[styles.description, { color: text }]} numberOfLines={2}>
            {t(item.descriptionKey)}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: text }]}
              onPress={() => setSelectedProject(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.ctaButtonText, { color: cardBackground }]}>
                Detalhes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: "#2563eb" }]}
              onPress={() => setWebviewUrl(item.url)}
              activeOpacity={0.8}
            >
              <Text style={[styles.ctaButtonText, { color: "#fff" }]}>
                Abrir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [cardWidth, cardBackground, numColumns, t, text],
  );

  return (
    <View
      style={[styles.container, { backgroundColor: background }]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Text style={[styles.header, { color: text }]}>Projetos e campanhas</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        numColumns={numColumns}
        key={numColumns}
        columnWrapperStyle={
          numColumns > 1
            ? { justifyContent: "flex-start", marginBottom: gutter }
            : undefined
        }
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent
        visible={Boolean(selectedProject)}
        onRequestClose={() => setSelectedProject(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedProject(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => undefined}
            style={[styles.modalCard, { backgroundColor: cardBackground }]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProject(null)}
            >
              <Ionicons name="close" size={20} color={text} />
            </TouchableOpacity>
            {selectedProject && (
              <>
                <Text style={[styles.modalTitle, { color: text }]}>
                  {t(selectedProject.titleKey)}
                </Text>
                <Text style={[styles.modalText, { color: text }]}>
                  {t(selectedProject.descriptionKey)}
                </Text>
                <TouchableOpacity
                  style={[styles.ctaButton, { backgroundColor: "#2563eb" }]}
                  onPress={() => setWebviewUrl(selectedProject.url)}
                >
                  <Text style={[styles.ctaButtonText, { color: "#fff" }]}>
                    Abrir site de demonstração
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        visible={Boolean(webviewUrl)}
        onRequestClose={() => setWebviewUrl(null)}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.webviewHeader}>
            <TouchableOpacity
              onPress={() => setWebviewUrl(null)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={16} color="#fff" />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
          {webviewUrl ? (
            <WebView source={{ uri: webviewUrl }} style={{ flex: 1 }} />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 15,
  },
  image: { width: "100%", height: 160, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  description: { fontSize: 14, lineHeight: 20 },
  metaText: { fontSize: 12, marginTop: 4, opacity: 0.8 },
  buttonRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  ctaButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButtonText: { fontSize: 14, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalCard: { borderRadius: 16, padding: 18, paddingTop: 24 },
  closeButton: { position: "absolute", top: 10, right: 10, padding: 6 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  modalText: { fontSize: 14, lineHeight: 20, marginBottom: 6 },
  webviewHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#111827",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#2563eb",
  },
  backButtonText: { color: "#fff", marginLeft: 4, fontWeight: "600" },
});
