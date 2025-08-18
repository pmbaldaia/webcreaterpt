import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SectionList,
  TouchableOpacity,
  useColorScheme,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/ThemeContext";

const STORAGE_KEY = "@calendar_tasks";

type TaskItem = {
  name: string;
  start: string;
  end: string;
};

export default function CalendarScreen() {
  const { t } = useTranslation();
  const { theme: colorScheme } = useTheme();

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const secondaryText = useThemeColor({}, "tabIconDefault");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [tasks, setTasks] = useState<Record<string, TaskItem[]>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState<string>(today);

  const [taskName, setTaskName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [errorTaskName, setErrorTaskName] = useState<string | null>(null);
  const [errorStartTime, setErrorStartTime] = useState<string | null>(null);
  const [errorEndTime, setErrorEndTime] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setTasks(JSON.parse(stored));
      } catch {}
    };
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks]);

  const isValidTime = (time: string) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  };

  const handleAddTask = () => {
    let valid = true;

    if (!taskName.trim()) {
      setErrorTaskName(t("taskNameRequired") || "Nome da tarefa é obrigatório");
      valid = false;
    } else {
      setErrorTaskName(null);
    }

    if (!startTime.trim()) {
      setErrorStartTime(
        t("startTimeRequired") || "Hora de início é obrigatória"
      );
      valid = false;
    } else if (!isValidTime(startTime.trim())) {
      setErrorStartTime(t("startTimeInvalid") || "Hora de início inválida");
      valid = false;
    } else {
      setErrorStartTime(null);
    }

    if (!endTime.trim()) {
      setErrorEndTime(t("endTimeRequired") || "Hora de fim é obrigatória");
      valid = false;
    } else if (!isValidTime(endTime.trim())) {
      setErrorEndTime(t("endTimeInvalid") || "Hora de fim inválida");
      valid = false;
    } else {
      setErrorEndTime(null);
    }

    if (!valid) return;

    const newTask: TaskItem = {
      name: taskName.trim(),
      start: startTime,
      end: endTime,
    };

    setTasks((prev) => {
      const updated = { ...prev };
      if (!updated[modalDate]) updated[modalDate] = [];
      updated[modalDate] = [...updated[modalDate], newTask];
      return updated;
    });

    setTaskName("");
    setStartTime("");
    setEndTime("");
    setModalDate(today);
    setModalVisible(false);
  };

  const handleDeleteTask = (date: string, index: number) => {
    setTasks((prev) => {
      const updated = { ...prev };
      if (!updated[date]) return prev;
      updated[date] = updated[date].filter((_, i) => i !== index);
      if (updated[date].length === 0) delete updated[date];
      return updated;
    });
  };

  const formatTimeInput = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 4);
    if (cleaned.length <= 2) return cleaned;
    return cleaned.slice(0, 2) + ":" + cleaned.slice(2);
  };

  const handleStartTimeChange = (text: string) => {
    setStartTime(formatTimeInput(text));
  };

  const handleEndTimeChange = (text: string) => {
    setEndTime(formatTimeInput(text));
  };

  const calendarTheme = {
    backgroundColor: background,
    calendarBackground: background,
    textSectionTitleColor: icon,
    dayTextColor: text,
    monthTextColor: text,
    todayTextColor: tint,
    selectedDayBackgroundColor: tint,
    selectedDayTextColor: "#fff",
    arrowColor: text,
    textDisabledColor: icon,
  };

  const taskSections = Object.entries(tasks)
    .sort(([a], [b]) => (a > b ? -1 : 1))
    .map(([date, data]) => ({
      title: date,
      data,
    }));

  const EmptyListComponent = () => (
    <View style={{ marginTop: 16, alignItems: "center" }}>
      <Text style={[styles.emptyTitle, { color: tint }]}>
        {t("tasksTitle") || "Tarefas"}
      </Text>
      <Text style={[styles.emptyText, { color: secondaryText }]}>
        {t("noTasks") || "Nenhuma tarefa guardada"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={[styles.dateText, { color: text }]}>
          {`📅 ${t("today")}: ${today}`}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: tint,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 6,
            paddingHorizontal: 12,
            marginTop: 10,
            minWidth: 110,
            borderRadius: 8,
          }}
          onPress={() => {
            setModalDate(today);
            setTaskName("");
            setStartTime("");
            setEndTime("");
            setErrorTaskName(null);
            setErrorStartTime(null);
            setErrorEndTime(null);
            setModalVisible(true);
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              marginRight: 6,
              fontSize: 14,
            }}
          >
            {t("newTask") || "Nova Tarefa"}
          </Text>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            ＋
          </Text>
        </TouchableOpacity>
      </View>

      <Calendar
        key={colorScheme}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: tint,
          },
        }}
        style={styles.calendar}
        theme={calendarTheme}
      />

      <SectionList
        sections={taskSections}
        keyExtractor={(item, index) => item.name + index.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: tint }]}>{title}</Text>
        )}
        renderItem={({ item, index, section }) => (
          <View
            style={[
              styles.taskCard,
              {
                backgroundColor: colorScheme === "dark" ? "#2C2C2E" : "#fff",
              },
            ]}
          >
            <View>
              <Text style={[styles.taskText, { color: text }]}>
                • {item.name}
              </Text>
              <Text style={[styles.timeText, { color: secondaryText }]}>
                ⏰ {item.start} - {item.end}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteTask(section.title, index)}
            >
              <Text style={[styles.deleteText, { color: "#ff5555" }]}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={EmptyListComponent}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: background }]}>
            <Text style={[styles.modalTitle, { color: text }]}>
              {t("newTask") || "Nova Tarefa"}
            </Text>

            <Calendar
              onDayPress={(day) => setModalDate(day.dateString)}
              markedDates={{
                [modalDate]: {
                  selected: true,
                  selectedColor: tint,
                },
              }}
              style={styles.calendar}
              theme={calendarTheme}
            />

            <View
              style={[
                styles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                  borderColor: errorTaskName ? "red" : secondaryText,
                },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={text}
                style={{ marginHorizontal: 8 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  color: text,
                  paddingVertical: 12,
                }}
                placeholder={t("taskName") || "Nome da tarefa"}
                placeholderTextColor={secondaryText}
                value={taskName}
                onChangeText={setTaskName}
                autoFocus
              />
            </View>

            {errorTaskName && (
              <Text style={{ color: "red", marginBottom: 8 }}>
                {errorTaskName}
              </Text>
            )}

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.pickerLabel, { color: text }]}>
                  {t("startTime") || "Hora de início"}
                </Text>
                <View
                  style={[
                    styles.input,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      borderColor: errorStartTime ? "red" : secondaryText,
                      paddingVertical: 8,
                    },
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={text}
                    style={{ marginHorizontal: 8 }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      color: text,
                      paddingLeft: 4,
                      paddingVertical: 4,
                    }}
                    placeholder="HH:mm"
                    placeholderTextColor={secondaryText}
                    value={startTime}
                    onChangeText={handleStartTimeChange}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                {errorStartTime && (
                  <Text style={{ color: "red", marginBottom: 8 }}>
                    {errorStartTime}
                  </Text>
                )}
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.pickerLabel, { color: text }]}>
                  {t("endTime") || "Hora de fim"}
                </Text>
                <View
                  style={[
                    styles.input,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      borderColor: errorEndTime ? "red" : secondaryText,
                      paddingVertical: 8,
                    },
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={text}
                    style={{ marginHorizontal: 8 }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      color: text,
                      paddingLeft: 4,
                      paddingVertical: 4,
                    }}
                    placeholder="HH:mm"
                    placeholderTextColor={secondaryText}
                    value={endTime}
                    onChangeText={handleEndTimeChange}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                {errorEndTime && (
                  <Text style={{ color: "red", marginBottom: 8 }}>
                    {errorEndTime}
                  </Text>
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 24,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: "#666",
                    marginRight: 8,
                    paddingHorizontal: 20,
                  },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {t("cancel") || "Cancelar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: tint,
                    paddingHorizontal: 20,
                  },
                ]}
                onPress={handleAddTask}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {t("save") || "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dateText: {
    fontWeight: "600",
    fontSize: 16,
  },
  calendar: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    overflow: "hidden",
  },
  sectionHeader: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 12,
    marginBottom: 6,
  },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskText: {
    fontWeight: "600",
    fontSize: 16,
  },
  timeText: {
    fontWeight: "400",
    fontSize: 14,
    marginTop: 2,
  },
  deleteText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyTitle: {
    fontWeight: "700",
    fontSize: 22,
  },
  emptyText: {
    fontWeight: "500",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 24,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  pickerLabel: {
    fontWeight: "600",
    marginBottom: 4,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
  },
});
