+79
-4

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
  const badges = deriveBadges(item.reason, item.price).slice(0, 2);

  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.meta}>
        {item.provider} • {item.price} {item.currency}
      </Text>

      {badges.length > 0 && (
        <View style={styles.badgesRow}>
          {badges.map((badge) => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.reasonBlock}>
        <Text style={styles.sectionLabel}>Why this?</Text>
        <Text style={styles.reason} numberOfLines={3}>
          {item.reason}
        </Text>
      </View>

      <Pressable onPress={() => Linking.openURL(item.productUrl)} style={styles.linkBtn}>
        <Text style={styles.linkText}>Open Link</Text>
      </Pressable>
    </View>
  );
}

function deriveBadges(reason: string, price: number) {
  const badges: string[] = [];
  const lowerReason = reason.toLowerCase();

  if (reason.includes("⚠️") || lowerReason.includes("avoid")) {
    badges.push("Avoid");
  }

  const interestHints = ["matches interests", "interests", "hobby", "favorite", "loves", "enjoys", "fan of"];
  if (interestHints.some((hint) => lowerReason.includes(hint))) {
    badges.push("Top match");
  }

  const budgetHints = ["within budget", "under budget", "budget-friendly", "affordable", "great value", "good value"];
  if (budgetHints.some((hint) => lowerReason.includes(hint))) {
    badges.push("Budget-friendly");
  }

  const overBudgetHints = ["over budget", "above budget", "stretch", "pricier", "splurge"];
  if (overBudgetHints.some((hint) => lowerReason.includes(hint))) {
    badges.push("Over budget");
  }

  if (badges.length === 0 && price > 0 && lowerReason.includes("budget")) {
    badges.push("Budget-friendly");
  }

  return badges;
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
  badgesRow: {
    flexDirection: "row", // Arrange badges horizontally
    gap: spacing.xs, // Space between badges
    marginBottom: spacing.sm, // Space under badges
  },
  badge: {
    backgroundColor: colors.border, // Badge background
    borderRadius: 999, // Fully rounded pill
    paddingHorizontal: spacing.sm, // Badge horizontal padding
    paddingVertical: spacing.xs / 2, // Badge vertical padding
  },
  badgeText: {
    color: colors.text, // Badge text color
    fontSize: 11, // Badge text size
    fontWeight: "700", // Badge text weight
  },
  reasonBlock: {
    backgroundColor: "rgba(255,255,255,0.02)", // Subtle highlight for reason
    borderRadius: 12, // Rounded reason container
    padding: spacing.sm, // Inner spacing for reason block
    marginBottom: spacing.sm, // Space under reason block
    borderWidth: 1, // Thin outline for reason block
    borderColor: colors.border, // Outline color
  },
  sectionLabel: {
    color: colors.muted, // Section label color
    fontSize: 12, // Section label size
    fontWeight: "700", // Section label weight
    marginBottom: spacing.xs, // Space under label
  },
  reason: {
    color: colors.text, // Reason text color
    opacity: 0.9, // Slightly softer text
    lineHeight: 18, // Reason line height
    marginBottom: 0, // Remove extra space inside block
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
