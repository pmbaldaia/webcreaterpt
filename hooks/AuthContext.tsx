import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

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
  id: "",
  name: "",
  username: "",
  signedIn: false,
};

export const AuthContext = createContext<AuthContextType>({
  authState: defaultState,
  setAuthState: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultState);
  const router = useRouter();

  useEffect(() => {
    const loadAuthState = async () => {
      const userData = await AsyncStorage.getItem("auth");
      if (userData) {
        setAuthState(JSON.parse(userData));
      }
    };
    loadAuthState();
  }, []);

  const updateAuthState = (newState: AuthState) => {
    setAuthState(newState);
    AsyncStorage.setItem("auth", JSON.stringify(newState));
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth");
    setAuthState(defaultState);
    router.replace("/auth/login");
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
