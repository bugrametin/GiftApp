import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>GiftFinder</Text>

      <Pressable
        onPress={() => router.push("/form")}
        style={{ marginTop: 16, padding: 12, borderWidth: 1, borderRadius: 10 }}
      >
        <Text>Start</Text>
      </Pressable>
    </View>
  );
}

