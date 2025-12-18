import colors from "@src/theme/colors";
import spacing from "@src/theme/spacing";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";


export type Recommendation = {
  id: string;
  title: string;
  price: number;
  currency: string;
  productUrl: string;
  provider: string;
  reason: string;
};

export default function ProductCard({ item }: { item: Recommendation }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.meta}>
        {item.provider} • {item.price} {item.currency}
      </Text>

      <Text style={styles.reason} numberOfLines={3}>
        {item.reason}
      </Text>

      <Pressable onPress={() => Linking.openURL(item.productUrl)} style={styles.linkBtn}>
        <Text style={styles.linkText}>Open Link</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card, // Card background
    borderRadius: 16, // Card corner radius
    borderWidth: 1, // Card border thickness
    borderColor: colors.border, // Card border color
    padding: spacing.md, // Card inner padding
  },
  title: {
    color: colors.text, // Title color
    fontWeight: "800", // Title weight
    fontSize: 15, // Title size
    marginBottom: spacing.xs, // Space under title
  },
  meta: {
    color: colors.muted, // Meta text color
    fontSize: 12, // Meta text size
    marginBottom: spacing.sm, // Space under meta
  },
  reason: {
    color: colors.text, // Reason text color
    opacity: 0.9, // Slightly softer text
    lineHeight: 18, // Reason line height
    marginBottom: spacing.sm, // Space under reason
  },
  linkBtn: {
    alignSelf: "flex-start", // Keeps button left-aligned
    paddingVertical: spacing.xs, // Button vertical padding
    paddingHorizontal: spacing.sm, // Button horizontal padding
    borderRadius: 10, // Button corner radius
    borderWidth: 1, // Button border thickness
    borderColor: colors.border, // Button border color
  },
  linkText: {
    color: colors.text, // Link text color
    fontWeight: "700", // Link text weight
  },
});
