import { useThemeColor } from "@/hooks/useThemeColor";
import { demoNotifications } from "@/src/data/demoContent";
import i18n from "@/src/i18n/i18n";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAuth } from "../../hooks/AuthContext";

export const TAB_CONFIG = {
  home: { icon: "home", labelKey: "home" },
  calendar: { icon: "calendar", labelKey: "calendar" },
  projects: { icon: "person", labelKey: "projects.title" },
  settings: { icon: "settings", labelKey: "settings" },
} as const;

type TabName = keyof typeof TAB_CONFIG;

function TopBar() {
  const { authState, logout } = useAuth();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const notificationScale = useRef(new Animated.Value(1)).current;
  const logoutScale = useRef(new Animated.Value(1)).current;

  const animateNotification = (toValue: number) => {
    Animated.spring(notificationScale, {
      toValue,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  };

  const animateLogout = (toValue: number) => {
    Animated.spring(logoutScale, {
      toValue,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  };

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  const background = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "tabIconDefault");
  const textColor = useThemeColor({}, "text");
  const cardBackground = useThemeColor({}, "background");

  const notifications = demoNotifications;
  const translate = (key: string, fallback = "") =>
    (i18n.t(key, { defaultValue: fallback }) as string) || fallback;

  const welcomeText = authState?.signedIn
    ? `${translate("welcome", "Bem-vindo")} ${authState.name}`
    : translate("welcome", "Bem-vindo");

  return (
    <View
      style={[
        styles.topBar,
        { backgroundColor: background, borderBottomColor: borderColor },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name="happy-outline"
          size={24}
          color={textColor}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.welcomeText, { color: textColor }]}>
          {welcomeText}
        </Text>
      </View>

      <View style={styles.iconGroup}>
        <Animated.View
          style={{ transform: [{ scale: notificationScale }], marginRight: 14 }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            onPressIn={() => animateNotification(0.92)}
            onPressOut={() => animateNotification(1)}
            onHoverIn={() => animateNotification(1.04) as any}
            onHoverOut={() => animateNotification(1) as any}
            accessibilityLabel={translate("notifications", "Notificações")}
          >
            <View>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={textColor}
              />
              <View style={[styles.badge, { backgroundColor: "#007AFF" }]}>
                <Text style={styles.badgeText}>{notifications.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: logoutScale }] }}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            onPressIn={() => animateLogout(0.92)}
            onPressOut={() => animateLogout(1)}
            onHoverIn={() => animateLogout(1.04) as any}
            onHoverOut={() => animateLogout(1) as any}
            activeOpacity={0.7}
            accessibilityLabel={translate("logout", "Sair")}
          >
            <Ionicons name="log-out-outline" size={26} color={textColor} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: cardBackground }]}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeIconButton}
              accessibilityLabel={translate("closeModal", "Fechar")}
            >
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: textColor }]}>
              {translate("notifications", "Notificações")}
            </Text>

            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color="#999"
                  style={{ marginBottom: 12 }}
                />
                <Text style={styles.emptyText}>
                  {translate("noNotifications", "Sem notificações")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.notificationItem,
                      { backgroundColor: background },
                    ]}
                  >
                    <Ionicons
                      name="notifications"
                      size={20}
                      color="#007AFF"
                      style={{ marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.notificationText, { color: textColor }]}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.notificationSubtext,
                          { color: borderColor },
                        ]}
                      >
                        {item.subtitle}
                      </Text>
                      <Text
                        style={[styles.notificationTime, { color: "#64748b" }]}
                      >
                        {item.time}
                      </Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function Layout() {
  const insets = useSafeAreaInsets();
  const translate = (key: string, fallback = "") =>
    (i18n.t(key, { defaultValue: fallback }) as string) || fallback;

  const activeTint = useThemeColor({}, "tabIconSelected");
  const inactiveTint = useThemeColor({}, "tabIconDefault");
  const background = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "tabIconDefault");

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <SafeAreaView edges={["top"]}>
        <TopBar />
      </SafeAreaView>
      <Tabs
        screenOptions={({ route }) => {
          const { icon, labelKey } = TAB_CONFIG[route.name as TabName] || {
            icon: "help-circle",
            labelKey: route.name,
          };

          return {
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={icon} size={size} color={color} />
            ),
            tabBarLabel: translate(labelKey, labelKey),
            tabBarActiveTintColor: activeTint,
            tabBarInactiveTintColor: inactiveTint,
            tabBarStyle: {
              backgroundColor: background,
              borderTopColor: borderColor,
              paddingBottom: insets.bottom,
              height: 50 + insets.bottom,
            },
            headerShown: false,
          };
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: "relative",
  },
  closeIconButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#E8F0FE",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },
  notificationSubtext: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
