import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

type Project = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  imageUrl: ImageSourcePropType;
  url: string;
};

const projects: Project[] = [
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

export default function ProjectsScreen() {
  const { t } = useTranslation();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const cardBackground = background || "#fff";

  const [containerWidth, setContainerWidth] = useState(0);
  const gutter = 15;
  const minCardWidth = 280;
  const [webviewUrl, setWebviewUrl] = useState<string | null>(null);

  const numColumns = Math.max(
    1,
    Math.floor((containerWidth + gutter) / (minCardWidth + gutter))
  );
  const cardWidth = Math.max(
    minCardWidth,
    (containerWidth - (numColumns - 1) * gutter) / numColumns
  );

  const renderProject = useCallback(
    ({ item, index }: { item: Project; index: number }) => {
      const isFirstInRow = index % numColumns === 0;

      const handlePress = () => {
        setWebviewUrl(item.url);
      };

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
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: text }]}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={[styles.ctaButtonText, { color: cardBackground }]}>
              {t("projects.visitSite")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [cardWidth, cardBackground, numColumns, text, t]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: background }]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Text style={[styles.header, { color: text }]}>
        {t("projects.title")}
      </Text>
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
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {webviewUrl && (
        <Modal
          animationType="slide"
          visible={true}
          onRequestClose={() => setWebviewUrl(null)}
        >
          <View style={{ flex: 1 }}>
            {/* Header do modal */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 6,
                margin: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setWebviewUrl(null)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#000",
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {t("projects.back")}
                </Text>
              </TouchableOpacity>

              <Text style={{ color: "#000", fontSize: 16, fontWeight: "600" }}>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <WebView source={{ uri: webviewUrl }} style={{ flex: 1 }} />
          </View>
        </Modal>
      )}
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
  ctaButton: {
    marginTop: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ctaButtonText: { fontSize: 16, fontWeight: "600" },
});
