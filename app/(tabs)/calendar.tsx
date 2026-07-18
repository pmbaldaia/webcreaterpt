import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
    CALENDAR_STORAGE_KEY,
    initialCalendarTasks,
    type DemoTask,
} from "@/src/data/demoContent";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";

type TaskItem = DemoTask;

const initialTasks = initialCalendarTasks;

export default function CalendarScreen() {
  const { t } = useTranslation();
  const { theme: colorScheme } = useTheme();
  const { authState } = useAuth();

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const secondaryText = useThemeColor({}, "tabIconDefault");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [tasks, setTasks] = useState<Record<string, TaskItem[]>>(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState<string>(today);

  const [taskName, setTaskName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [errorTaskName, setErrorTaskName] = useState<string | null>(null);
  const [errorStartTime, setErrorStartTime] = useState<string | null>(null);
  const [errorEndTime, setErrorEndTime] = useState<string | null>(null);

  const isAdmin = authState?.username?.toLowerCase() === "admin";
  const currentUser = authState?.username || "demo";

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
        if (stored) {
          setTasks(JSON.parse(stored));
        } else {
          setTasks(initialTasks);
        }
      } catch {
        setTasks(initialTasks);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(tasks)).catch(
      () => {},
    );
  }, [tasks]);

  const isValidTime = (time: string) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

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
        t("startTimeRequired") || "Hora de início é obrigatória",
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
      owner: isAdmin ? "admin" : currentUser,
    };

    setTasks((prev) => {
      const updated = { ...prev };
      if (!updated[modalDate]) updated[modalDate] = [];
      updated[modalDate] = [...updated[modalDate], newTask];
      return updated;
    });

    setSelectedDate(modalDate);
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
    return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
  };

  const handleStartTimeChange = (text: string) =>
    setStartTime(formatTimeInput(text));
  const handleEndTimeChange = (text: string) =>
    setEndTime(formatTimeInput(text));

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

  const visibleTasks = Object.entries(tasks).reduce<Record<string, TaskItem[]>>(
    (acc, [date, list]) => {
      const filtered = isAdmin
        ? list
        : list.filter((task) => task.owner === currentUser);

      if (filtered.length > 0) {
        acc[date] = filtered;
      }

      return acc;
    },
    {},
  );

  const selectedTasks = visibleTasks[selectedDate] || [];

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
      <View style={styles.headerRow}>
        <Text
          style={[styles.dateText, { color: text }]}
        >{`📅 ${t("today")}: ${today}`}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setModalDate(selectedDate);
            setTaskName("");
            setStartTime("");
            setEndTime("");
            setErrorTaskName(null);
            setErrorStartTime(null);
            setErrorEndTime(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>
            {t("newTask") || "Nova Tarefa"}
          </Text>
          <Text style={styles.addButtonIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: icon }]}>
        <Text style={styles.summaryText}>
          {selectedTasks.length} tarefa(s) para {selectedDate}
        </Text>
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
        sections={[{ title: selectedDate, data: selectedTasks }]}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderSectionHeader={() => (
          <Text style={[styles.sectionHeader, { color: tint }]}>
            {selectedDate}
          </Text>
        )}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.taskItem,
              { backgroundColor: background, borderColor: icon },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskName, { color: text }]}>
                {item.name}
              </Text>
              <Text style={[styles.taskTime, { color: secondaryText }]}>
                {item.start} - {item.end}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteTask(selectedDate, index)}
            >
              <Ionicons name="trash-outline" size={18} color={tint} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={EmptyListComponent}
        style={styles.list}
      />

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: background }]}>
            <Text style={[styles.modalTitle, { color: text }]}>
              {t("newTask") || "Nova Tarefa"}
            </Text>

            <TextInput
              style={[styles.input, { color: text, borderColor: icon }]}
              placeholder={t("taskName") || "Nome da tarefa"}
              placeholderTextColor={secondaryText}
              value={taskName}
              onChangeText={setTaskName}
            />
            {errorTaskName ? (
              <Text style={styles.errorText}>{errorTaskName}</Text>
            ) : null}

            <TextInput
              style={[styles.input, { color: text, borderColor: icon }]}
              placeholder={t("startTime") || "Hora de início"}
              placeholderTextColor={secondaryText}
              value={startTime}
              onChangeText={handleStartTimeChange}
              keyboardType="numeric"
            />
            {errorStartTime ? (
              <Text style={styles.errorText}>{errorStartTime}</Text>
            ) : null}

            <TextInput
              style={[styles.input, { color: text, borderColor: icon }]}
              placeholder={t("endTime") || "Hora de fim"}
              placeholderTextColor={secondaryText}
              value={endTime}
              onChangeText={handleEndTimeChange}
              keyboardType="numeric"
            />
            {errorEndTime ? (
              <Text style={styles.errorText}>{errorEndTime}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {t("cancel") || "Cancelar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.saveButtonText}>
                  {t("save") || "Guardar"}
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
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 110,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 6,
    fontSize: 14,
  },
  addButtonIcon: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  summaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 12,
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 6,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  taskName: {
    fontSize: 15,
    fontWeight: "600",
  },
  taskTime: {
    fontSize: 13,
    marginTop: 3,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalCard: {
    width: "90%",
    maxWidth: 420,
    padding: 18,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
  },
  cancelButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#2563eb",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
