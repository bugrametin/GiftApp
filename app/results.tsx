import ProductCard from "@src/components/ProductCard";
import { GiftFormPayload, recommendLocal } from "@src/services/recommender";
import colors from "@src/theme/colors";
import spacing from "@src/theme/spacing";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function Results() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const form: GiftFormPayload = JSON.parse((params.form as string) || "{}"); // Reads payload

  const [loading, setLoading] = useState(true); // Loading state
  const [items, setItems] = useState<Recommendation[]>([]); // Recommendation list

  useEffect(() => {
    const t = setTimeout(() => {
      const res = recommendLocal(form); // Uses local recommender
      setItems(res.recommendations); // Sets list
      setLoading(false); // Stops loading
    }, 500);

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
        keyExtractor={(x) => x.id} // Stable list key
        contentContainerStyle={styles.list} // List padding
        renderItem={({ item }) => <ProductCard item={item} />}
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
    backgroundColor: colors.bg, // Background color
    padding: spacing.lg, // Screen padding
  },
  title: {
    fontSize: 22, // Title size
    fontWeight: "800", // Title weight
    color: colors.text, // Title color
    marginBottom: spacing.xs, // Space under title
  },
  sub: {
    color: colors.muted, // Subtitle color
    marginBottom: spacing.md, // Space under subtitle
  },
  list: {
    paddingBottom: spacing.xl, // Bottom padding for button
    gap: spacing.md, // Space between cards
  },
  btnSecondary: {
    marginTop: spacing.sm, // Space above button
    paddingVertical: spacing.md, // Button vertical padding
    borderRadius: 14, // Button corner radius
    borderWidth: 1, // Button border thickness
    borderColor: colors.border, // Button border color
    alignItems: "center", // Center align text
  },
  btnSecondaryText: {
    color: colors.text, // Button text color
    fontWeight: "800", // Button text weight
  },
  center: {
    flex: 1, // Fill screen
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: colors.bg, // Background color
  },
  helper: {
    marginTop: spacing.md, // Space above helper text
    color: colors.muted, // Helper text color
  },
});
