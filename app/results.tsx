import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Linking, Pressable, StyleSheet, Text, View } from "react-native";

type Rec = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  provider: string;
  reason: string;
};

const MOCK: Rec[] = [
  {
    id: "hb-001",
    title: "French Press Coffee Maker 600ml",
    price: 499,
    currency: "TRY",
    imageUrl: "",
    productUrl: "https://example.com/product/frenchpress",
    provider: "Hepsiburada",
    reason: "Good for coffee lovers and fits the budget.",
  },
  {
    id: "hb-002",
    title: "Wireless Earbuds (Bluetooth)",
    price: 1299,
    currency: "TRY",
    imageUrl: "",
    productUrl: "https://example.com/product/earbuds",
    provider: "Hepsiburada",
    reason: "Great for music and daily use.",
  },
  {
    id: "hb-003",
    title: "Scented Candle Set (3 pcs)",
    price: 349,
    currency: "TRY",
    imageUrl: "",
    productUrl: "https://example.com/product/candles",
    provider: "Hepsiburada",
    reason: "A safe cozy gift for most people.",
  },
];

export default function Results() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const form = JSON.parse((params.form as string) || "{}"); // Reads form payload

  const [loading, setLoading] = useState(true); // Loading state
  const [items, setItems] = useState<Rec[]>([]); // Recommendations

  useEffect(() => {
    // Simulate "AI thinking"
    const t = setTimeout(() => {
      setItems(MOCK); // Sets mock recommendations
      setLoading(false); // Stops loading
    }, 700);

    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.helper}>Finding gift ideas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendations</Text>
      <Text style={styles.sub}>
        For: {form.name ? form.name : "Recipient"} • Budget: {form.budget} TRY
      </Text>

      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.meta}>{item.provider} • {item.price} {item.currency}</Text>
            <Text style={styles.reason}>{item.reason}</Text>

            <Pressable onPress={() => Linking.openURL(item.productUrl)} style={styles.linkBtn}>
              <Text style={styles.linkText}>Open Link</Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable onPress={() => router.back()} style={styles.btnSecondary}>
        <Text style={styles.btnSecondaryText}>Refine</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill screen height
    backgroundColor: "#0B0F14", // Background color
    padding: 18, // Page padding
  },
  title: {
    fontSize: 22, // Title size
    fontWeight: "800", // Title weight
    color: "#E8EEF7", // Title color
    marginBottom: 6, // Space under title
  },
  sub: {
    color: "#9AA4B2", // Subtitle color
    marginBottom: 14, // Space under subtitle
  },
  list: {
    paddingBottom: 24, // Bottom spacing
    gap: 14, // Space between cards
  },
  card: {
    backgroundColor: "#121826", // Card background
    borderRadius: 16, // Card corner radius
    borderWidth: 1, // Border thickness
    borderColor: "#233044", // Border color
    padding: 14, // Card inner padding
  },
  cardTitle: {
    color: "#E8EEF7", // Card title color
    fontWeight: "800", // Card title weight
    fontSize: 15, // Card title size
    marginBottom: 6, // Space under title
  },
  meta: {
    color: "#9AA4B2", // Meta text color
    fontSize: 12, // Meta text size
    marginBottom: 8, // Space under meta
  },
  reason: {
    color: "#E8EEF7", // Reason text color
    opacity: 0.9, // Softer text
    lineHeight: 18, // Line height
  },
  linkBtn: {
    marginTop: 12, // Space above link button
    alignSelf: "flex-start", // Button align
    paddingVertical: 8, // Vertical padding
    paddingHorizontal: 12, // Horizontal padding
    borderRadius: 10, // Corner radius
    borderWidth: 1, // Border thickness
    borderColor: "#233044", // Border color
  },
  linkText: {
    color: "#E8EEF7", // Link text color
    fontWeight: "700", // Link text weight
  },
  btnSecondary: {
    marginTop: 10, // Space above button
    paddingVertical: 12, // Button vertical padding
    borderRadius: 14, // Button corner radius
    borderWidth: 1, // Button border
    borderColor: "#233044", // Button border color
    alignItems: "center", // Center align text
  },
  btnSecondaryText: {
    color: "#E8EEF7", // Button text color
    fontWeight: "800", // Button text weight
  },
  center: {
    flex: 1, // Fill screen
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "#0B0F14", // Background
  },
  helper: {
    marginTop: 12, // Space above helper text
    color: "#9AA4B2", // Helper text color
  },
});
