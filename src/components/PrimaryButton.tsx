import colors from "@src/theme/colors";
import spacing from "@src/theme/spacing";
import { Pressable, StyleSheet, Text } from "react-native";


export default function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary, // Button background color
    paddingVertical: spacing.md, // Button vertical padding
    paddingHorizontal: spacing.lg, // Button horizontal padding
    borderRadius: 14, // Button corner radius
    alignItems: "center", // Centers button text horizontally
  },
  pressed: {
    opacity: 0.85, // Button opacity when pressed
  },
  text: {
    color: "white", // Button text color
    fontWeight: "800", // Button text weight
    fontSize: 16, // Button text size
  },
});
