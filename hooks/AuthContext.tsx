import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthState = {
  id: string;
  name: string;
  username: string;
  signedIn: boolean;
};

type AuthContextType = {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  logout: () => void;
};

const defaultState: AuthState = {
  id: "demo",
  name: "Demo",
  username: "demo",
  signedIn: true,
};

export const AuthContext = createContext<AuthContextType>({
  authState: defaultState,
  setAuthState: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultState);
  const router = useRouter();

  const safeReplace = (path: string) => {
    try {
      router.replace(path);
    } catch {
      // ignore during initial render
    }
  };

  useEffect(() => {
    const loadAuthState = async () => {
      const userData = await AsyncStorage.getItem("auth");
      if (userData) {
        const parsed = JSON.parse(userData) as AuthState;
        setAuthState(parsed);
        return;
      }

      await AsyncStorage.setItem("auth", JSON.stringify(defaultState));
      setAuthState(defaultState);
    };
    loadAuthState();
  }, []);

  const updateAuthState = (newState: AuthState) => {
    setAuthState(newState);
    AsyncStorage.setItem("auth", JSON.stringify(newState));
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth");
    setAuthState({ ...defaultState, signedIn: false });
    safeReplace("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{ authState, setAuthState: updateAuthState, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
