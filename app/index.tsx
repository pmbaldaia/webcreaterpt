import { Redirect } from "expo-router";
import { useAuth } from "../hooks/AuthContext";

export default function Index() {
  const { authState } = useAuth();

  return <Redirect href={authState.signedIn ? "/home" : "/auth/login"} />;
}
